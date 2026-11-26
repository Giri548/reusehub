package com.reusehub.backend;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Base64;
import java.util.Locale;
import java.util.UUID;
import com.reusehub.backend.domain.AccountStatus;
import com.reusehub.backend.domain.Role;
import com.reusehub.backend.domain.User;
import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.repository.ListingRepository;
import com.reusehub.backend.repository.UserRepository;
import com.reusehub.backend.service.ApiException;
import com.reusehub.backend.service.ItemRequestService;
import com.reusehub.backend.service.JwtService;
import com.reusehub.backend.service.ListingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class BackendApplicationTests {
	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ListingRepository listingRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private ListingService listingService;

	@Autowired
	private ItemRequestService itemRequestService;

	@Autowired
	private JwtService jwtService;

	@DynamicPropertySource
	static void configureTestProperties(DynamicPropertyRegistry registry) {
		byte[] jwtKey = new byte[32];
		new SecureRandom().nextBytes(jwtKey);
		registry.add("app.jwt.secret", () -> Base64.getEncoder().encodeToString(jwtKey));
		registry.add("spring.datasource.username", () -> "sa");
		registry.add("spring.datasource.password", () -> "");
	}

	@Test
	void contextLoads() {
	}

	@Test
	void registrationStoresHashedPasswordAndAuthenticatesProtectedProfile() throws Exception {
		String email = "receiver-" + UUID.randomUUID() + "@example.test";
		String request = """
				{"name":"Test Receiver","email":"%s","password":"safe-password-123","role":"receiver","organization":"Test Org","location":"Test City"}
				""".formatted(email);

		String responseBody = mockMvc.perform(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(request))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andExpect(jsonPath("$.user.role").value("receiver"))
				.andReturn()
				.getResponse()
				.getContentAsString();

		JsonNode response = objectMapper.readTree(responseBody);
		User savedUser = userRepository.findByEmailIgnoreCase(email).orElseThrow();
		assertNotEquals("safe-password-123", savedUser.getPasswordHash());
		assertTrue(passwordEncoder.matches("safe-password-123", savedUser.getPasswordHash()));

		mockMvc.perform(get("/api/profile")
						.header("Authorization", "Bearer " + response.get("token").asText()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value(email));

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"email":"%s","password":"safe-password-123"}
								""".formatted(email)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").isNotEmpty());

		mockMvc.perform(post("/api/listings")
						.header("Authorization", "Bearer " + response.get("token").asText())
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"title":"Test listing","description":"A valid description for this test listing.","category":"Books","condition":"Good","quantity":1,"location":"Test City"}
								"""))
				.andExpect(status().isForbidden());
	}

	@Test
	void protectedRoutesRejectAnonymousRequests() throws Exception {
		mockMvc.perform(get("/api/profile"))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Authentication is required"));
	}

	@Test
	void adminRoutesEnforceDatabaseRoleAndDashboardQueryWorks() throws Exception {
		User receiver = saveUser(Role.RECEIVER);
		String receiverToken = jwtService.createToken(receiver);
		mockMvc.perform(get("/api/admin/dashboard")
						.header("Authorization", "Bearer " + receiverToken))
				.andExpect(status().isForbidden());

		User admin = saveUser(Role.ADMIN);
		String adminToken = jwtService.createToken(admin);
		mockMvc.perform(get("/api/admin/dashboard")
						.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalUsers").isNumber())
				.andExpect(jsonPath("$.listingsByCategory").isMap());
	}

	@Test
	void requestApprovalsCannotOversellListingQuantity() {
		User donor = saveUser(Role.DONOR);
		User firstReceiver = saveUser(Role.RECEIVER);
		User secondReceiver = saveUser(Role.RECEIVER);
		ApiDtos.ListingResponse listing = listingService.create(donor, new ApiDtos.ListingCreateRequest(
				"Available books",
				"Books in good condition available for the local community.",
				"Books",
				"Good",
				3,
				"Test City",
				"Weekday afternoons",
				null,
				java.util.List.of(),
				java.util.List.of()));
		assertEquals(1, listingService.search("books", "Books", "Good", "Test City", false).size());
		ApiDtos.ItemRequestResponse firstRequest = createRequest(firstReceiver, listing.id(), 2);
		ApiDtos.ItemRequestResponse secondRequest = createRequest(secondReceiver, listing.id(), 2);

		itemRequestService.updateStatus(
				donor, firstRequest.id(), new ApiDtos.RequestStatusRequest("approved", null));
		assertThrows(ApiException.class, () -> itemRequestService.updateStatus(
				donor, secondRequest.id(), new ApiDtos.RequestStatusRequest("approved", null)));

		assertEquals(1, listingRepository.findById(listing.id()).orElseThrow().getAvailableQuantity());
	}

	private ApiDtos.ItemRequestResponse createRequest(User receiver, Long listingId, int quantity) {
		return itemRequestService.create(receiver, new ApiDtos.ItemRequestCreateRequest(
				listingId,
				quantity,
				"Needed for a community learning program",
				LocalDate.now().plusDays(1),
				"Morning"));
	}

	private User saveUser(Role role) {
		User user = new User();
		user.setName("Test " + role.name());
		user.setEmail(role.name().toLowerCase(Locale.ROOT) + "-" + UUID.randomUUID() + "@example.test");
		user.setPasswordHash(passwordEncoder.encode("test-password"));
		user.setRole(role);
		user.setStatus(AccountStatus.ACTIVE);
		user.setVerified(false);
		user.setLocation("Test City");
		return userRepository.saveAndFlush(user);
	}
}
