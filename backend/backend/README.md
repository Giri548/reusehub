# ReUseHub Backend

Spring Boot REST API for ReUseHub. The API uses MySQL for local development, environment variables for credentials and its signing key, and H2 for automated tests.

## Requirements

- Java 21 or newer
- MySQL with the existing `reusehub_db` database

The project targets Java 21 and Spring Boot 4.2.0. Tests use an isolated in-memory H2 database and do not require local MySQL credentials.

## Configure and run on Windows

Open PowerShell in this directory and set the variables for the current terminal:

```powershell
$env:MYSQL_USERNAME = "your_mysql_username"
$env:MYSQL_PASSWORD = "your_mysql_password"
$env:FRONTEND_ORIGIN = "http://localhost:5173"
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
$rng.Dispose()
.\mvnw.cmd spring-boot:run
```

Keep the generated `JWT_SECRET` private and use the same value while the API is running. It must be a Base64-encoded key of at least 32 bytes. `FRONTEND_ORIGIN` is optional and defaults to `http://localhost:5173`.

The API connects to `jdbc:mysql://localhost:3306/reusehub_db`. Hibernate is configured to update the schema without dropping existing tables or data.

## Test

```powershell
.\mvnw.cmd test
```

The test suite uses H2 and a temporary signing key, so it does not connect to MySQL.

## API overview

All endpoints return JSON. Authenticated requests use `Authorization: Bearer <token>`. Access tokens expire after one hour.

| Area | Methods and paths |
|---|---|
| Authentication | `POST /api/auth/register`, `POST /api/auth/login` |
| Profile | `GET /api/profile`, `PUT /api/profile` |
| Categories | `GET /api/categories` |
| Listings | `GET /api/listings` (supports `search`, `category`, `condition`, `location`), `GET /api/listings/{id}`, `GET /api/listings/mine`, `POST /api/listings`, `PUT /api/listings/{id}`, `PATCH /api/listings/{id}/status`, `DELETE /api/listings/{id}` |
| Requests | `GET /api/requests`, `GET /api/requests/summary`, `POST /api/requests`, `PATCH /api/requests/{id}/status`, `POST /api/requests/{id}/verify-pickup` |
| Notifications | `GET /api/notifications`, `GET /api/notifications/unread-count`, `PATCH /api/notifications/{id}/read`, `PATCH /api/notifications/read-all` |
| Organization verification | `GET /api/organizations/verifications/mine`, `POST /api/organizations/verifications` |
| Listing reports | `POST /api/listings/{id}/reports` |
| Administration | `GET /api/admin/dashboard`, `/users`, `/listings`, `/requests`, `/verifications`, `/reports`, `/settings`; corresponding user-status, listing-status, verification-status, report-status, and settings update routes are restricted to administrators |

Registration creates receiver or donor accounts only. Administrator accounts must be provisioned separately; public registration cannot grant administrator access.

## Notes

- Passwords are stored as BCrypt hashes; they are never returned by the API.
- Listings are removed by changing their status; records are not physically deleted through the API.
- Request approval locks the listing row and checks available quantity before reducing inventory.
- The frontend currently has its own local mock data. It must be connected to these endpoints separately; this backend change does not modify frontend files.
