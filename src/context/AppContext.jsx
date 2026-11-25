import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_RESOURCES,
  INITIAL_CLAIMS,
  INITIAL_ORG_VERIFICATIONS,
  INITIAL_REPORTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

const AppContext = createContext(null);

const STORAGE_KEY = 'reusehub_demo_state_v1';

const DEFAULT_SETTINGS = {
  autoApproveListings: true,
  maxActiveClaimsPerUser: 5,
  requirePurposeStatement: true,
  maintenanceBanner: false,
  platformEmail: 'support@reusehub.org',
  pickupGraceMinutes: 30,
};

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        users: parsed.users || INITIAL_USERS,
        resources: parsed.resources || INITIAL_RESOURCES,
        claims: parsed.claims || INITIAL_CLAIMS,
        organizations: parsed.organizations || INITIAL_ORG_VERIFICATIONS,
        reports: parsed.reports || INITIAL_REPORTS,
        notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
        currentUser: parsed.currentUser || null,
        settings: parsed.settings || DEFAULT_SETTINGS,
      };
    }
  } catch {
    // ignore storage errors
  }
  return {
    users: INITIAL_USERS,
    resources: INITIAL_RESOURCES,
    claims: INITIAL_CLAIMS,
    organizations: INITIAL_ORG_VERIFICATIONS,
    reports: INITIAL_REPORTS,
    notifications: INITIAL_NOTIFICATIONS,
    currentUser: null,
    settings: DEFAULT_SETTINGS,
  };
}

export function AppProvider({ children }) {
  const initial = loadInitialState();
  const [users, setUsers] = useState(initial.users);
  const [resources, setResources] = useState(initial.resources);
  const [claims, setClaims] = useState(initial.claims);
  const [organizations, setOrganizations] = useState(initial.organizations);
  const [reports, setReports] = useState(initial.reports);
  const [notifications, setNotifications] = useState(initial.notifications);
  const [currentUser, setCurrentUser] = useState(initial.currentUser);
  const [settings, setSettings] = useState(initial.settings);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          users,
          resources,
          claims,
          organizations,
          reports,
          notifications,
          currentUser,
          settings,
        })
      );
    } catch {
      // ignore storage quota errors
    }
  }, [users, resources, claims, organizations, reports, notifications, currentUser, settings]);

  const showToast = useCallback((message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addNotification = useCallback((userId, title, message, type = 'info', link = '/') => {
    const notif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: 'Just now',
      link,
    };
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  // Auth actions
  const login = (email, password) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!found) {
      showToast('Invalid email or password. Try one of the quick demo accounts below.', 'error');
      return { ok: false, error: 'Invalid credentials' };
    }
    if (found.status === 'Disabled') {
      showToast('This account has been disabled by an administrator.', 'error');
      return { ok: false, error: 'Account disabled' };
    }
    setCurrentUser(found);
    showToast(`Welcome back, ${found.name}!`, 'success');
    return { ok: true, user: found };
  };

  const quickLoginByRole = (role) => {
    const found = users.find((u) => u.role === role && u.status === 'Active');
    if (found) {
      setCurrentUser(found);
      showToast(`Signed in as ${found.name} (${role.toUpperCase()})`, 'success');
      return found;
    }
    return null;
  };

  const register = ({ name, email, password, role, organization, location }) => {
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      showToast('An account with this email already exists.', 'error');
      return { ok: false, error: 'Email already registered' };
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      status: 'Active',
      verified: false,
      organization: organization?.trim() || 'Community Member',
      location: location?.trim() || 'Bengaluru, India',
      phone: '+91 90000 00000',
      bio: `Excited to ${role === 'donor' ? 'give resources a second life' : 'discover and reuse community resources'}.`,
      joinedAt: new Date().toISOString().slice(0, 10),
      avatar: '',
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    addNotification(
      newUser.id,
      'Welcome to ReUseHub!',
      `Your ${role} account is active. Start ${role === 'donor' ? 'listing surplus items' : 'browsing resources'} right away.`,
      'success',
      role === 'donor' ? '/donor' : '/receiver'
    );
    showToast(`Account created! Welcome to ReUseHub, ${newUser.name}.`, 'success');
    return { ok: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('You have been logged out.', 'info');
  };

  const updateProfile = (updates) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    showToast('Profile updated successfully.', 'success');
  };

  // Resource actions (Donor & Admin)
  const createResource = (data) => {
    if (!currentUser) return null;
    const newResource = {
      id: `res-${Date.now()}`,
      title: data.title.trim(),
      category: data.category,
      description: data.description.trim(),
      quantity: Number(data.quantity),
      availableQuantity: Number(data.quantity),
      condition: data.condition,
      location: data.location.trim(),
      pickupWindow: data.pickupWindow?.trim() || 'Mon–Sat, 10:00 AM – 6:00 PM',
      donorId: currentUser.id,
      donorName: currentUser.name,
      donorOrg: currentUser.organization || 'Community Donor',
      donorVerified: currentUser.verified,
      status: settings.autoApproveListings ? 'Active' : 'Pending Review',
      weightKg: Number(data.weightKg) || Number(data.quantity) * 2.5,
      createdAt: new Date().toISOString().slice(0, 10),
      images: data.images?.length ? data.images : [],
      tags: data.tags || [data.category, data.condition],
    };
    setResources((prev) => [newResource, ...prev]);
    showToast(
      settings.autoApproveListings
        ? 'Resource listing published live!'
        : 'Listing submitted for admin review.',
      'success'
    );
    return newResource;
  };

  const updateResource = (resourceId, updates) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id !== resourceId) return r;
        const nextQty = updates.quantity !== undefined ? Number(updates.quantity) : r.quantity;
        const diff = nextQty - r.quantity;
        const nextAvail =
          updates.availableQuantity !== undefined
            ? Number(updates.availableQuantity)
            : Math.max(0, r.availableQuantity + diff);
        return { ...r, ...updates, quantity: nextQty, availableQuantity: nextAvail };
      })
    );
    showToast('Listing updated.', 'success');
  };

  const deleteResource = (resourceId) => {
    setResources((prev) => prev.filter((r) => r.id !== resourceId));
    showToast('Listing removed.', 'info');
  };

  const toggleResourceStatus = (resourceId, nextStatus) => {
    setResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, status: nextStatus } : r))
    );
    showToast(`Listing marked as ${nextStatus}.`, 'success');
  };

  // Claim actions (Receiver & Donor)
  const submitClaim = ({ resourceId, quantity, purpose, preferredDate, preferredSlot }) => {
    if (!currentUser) {
      showToast('Please sign in to request this resource.', 'error');
      return { ok: false };
    }
    const resource = resources.find((r) => r.id === resourceId);
    if (!resource) return { ok: false };
    const reqQty = Number(quantity);
    if (reqQty <= 0 || reqQty > resource.availableQuantity) {
      showToast(`Only ${resource.availableQuantity} unit(s) currently available.`, 'error');
      return { ok: false };
    }

    const activeCount = claims.filter(
      (c) => c.receiverId === currentUser.id && (c.status === 'Pending' || c.status === 'Approved')
    ).length;

    if (activeCount >= settings.maxActiveClaimsPerUser) {
      showToast(
        `You have reached the limit of ${settings.maxActiveClaimsPerUser} active claims.`,
        'error'
      );
      return { ok: false };
    }

    const codeSuffix = resource.category.slice(0, 2).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newClaim = {
      id: `clm-${Date.now()}`,
      resourceId: resource.id,
      resourceTitle: resource.title,
      resourceCategory: resource.category,
      resourceImage: resource.images?.[0] || '',
      receiverId: currentUser.id,
      receiverName: currentUser.name,
      receiverOrg: currentUser.organization || 'Community Member',
      donorId: resource.donorId,
      donorName: resource.donorName,
      pickupLocation: resource.location,
      quantity: reqQty,
      purpose: purpose.trim(),
      preferredDate,
      preferredSlot,
      status: 'Pending',
      pickupCode: `RH-${randomNum}-${codeSuffix}`,
      donorNote: '',
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setClaims((prev) => [newClaim, ...prev]);
    addNotification(
      resource.donorId,
      'New Resource Request',
      `${currentUser.name} requested ${reqQty}x "${resource.title}".`,
      'info',
      '/donor/claims'
    );
    addNotification(
      currentUser.id,
      'Request Submitted',
      `Your claim for "${resource.title}" is pending donor approval.`,
      'success',
      '/receiver/claims'
    );
    showToast('Claim submitted! Waiting for donor approval.', 'success');
    return { ok: true, claim: newClaim };
  };

  const updateClaimStatus = (claimId, nextStatus, donorNote = '') => {
    const targetClaim = claims.find((c) => c.id === claimId);
    if (!targetClaim) return;

    const prevStatus = targetClaim.status;
    // Adjust availableQuantity when transitioning to Approved from Pending, or back if Rejected/Cancelled after approval
    if (prevStatus === 'Pending' && nextStatus === 'Approved') {
      setResources((prev) =>
        prev.map((r) => {
          if (r.id !== targetClaim.resourceId) return r;
          const nextAvail = Math.max(0, r.availableQuantity - targetClaim.quantity);
          return {
            ...r,
            availableQuantity: nextAvail,
            status: nextAvail === 0 ? 'Closed' : r.status,
          };
        })
      );
    }

    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: nextStatus,
              donorNote: donorNote || c.donorNote,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : c
      )
    );

    if (nextStatus === 'Approved') {
      addNotification(
        targetClaim.receiverId,
        'Claim Approved! 🎉',
        `Your request for "${targetClaim.resourceTitle}" was approved. Pickup code: ${targetClaim.pickupCode}`,
        'success',
        '/receiver/schedule'
      );
      showToast('Claim approved & QR pickup pass generated.', 'success');
    } else if (nextStatus === 'Rejected') {
      addNotification(
        targetClaim.receiverId,
        'Claim Update',
        `Your request for "${targetClaim.resourceTitle}" was declined.${donorNote ? ` Note: ${donorNote}` : ''}`,
        'warning',
        '/receiver/claims'
      );
      showToast('Claim declined.', 'info');
    } else if (nextStatus === 'Completed') {
      addNotification(
        targetClaim.receiverId,
        'Exchange Completed 🌱',
        `Thank you for collecting "${targetClaim.resourceTitle}". Resource given a second life!`,
        'success',
        '/receiver/claims'
      );
      addNotification(
        targetClaim.donorId,
        'Donation Handed Over 🌱',
        `Pickup ${targetClaim.pickupCode} marked completed.`,
        'success',
        '/donor/impact'
      );
      showToast('Pickup marked as completed!', 'success');
    }
  };

  const cancelClaim = (claimId) => {
    const target = claims.find((c) => c.id === claimId);
    if (!target) return;
    if (target.status === 'Approved') {
      setResources((prev) =>
        prev.map((r) =>
          r.id === target.resourceId
            ? {
                ...r,
                availableQuantity: Math.min(r.quantity, r.availableQuantity + target.quantity),
                status: r.status === 'Closed' ? 'Active' : r.status,
              }
            : r
        )
      );
    }
    setClaims((prev) => prev.filter((c) => c.id !== claimId));
    showToast('Claim request cancelled.', 'info');
  };

  // Notifications actions
  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = (userId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, read: true } : n))
    );
    showToast('All notifications marked as read.', 'info');
  };

  // Admin actions
  const toggleUserAccountStatus = (userId) => {
    if (currentUser?.id === userId) {
      showToast('You cannot disable your own active admin account.', 'error');
      return;
    }
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const nextStatus = u.status === 'Active' ? 'Disabled' : 'Active';
        showToast(`${u.name}'s account is now ${nextStatus}.`, nextStatus === 'Active' ? 'success' : 'warning');
        return { ...u, status: nextStatus };
      })
    );
  };

  const updateOrganizationVerification = (orgId, status) => {
    setOrganizations((prev) =>
      prev.map((o) => (o.id === orgId ? { ...o, status } : o))
    );
    showToast(`Organization verification ${status.toLowerCase()}.`, status === 'Approved' ? 'success' : 'info');
  };

  const resolveReport = (reportId) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'Resolved' } : r))
    );
    showToast('Report marked as resolved.', 'success');
  };

  const updateSettings = (nextSettings) => {
    setSettings((prev) => ({ ...prev, ...nextSettings }));
    showToast('Platform settings saved.', 'success');
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsers(INITIAL_USERS);
    setResources(INITIAL_RESOURCES);
    setClaims(INITIAL_CLAIMS);
    setOrganizations(INITIAL_ORG_VERIFICATIONS);
    setReports(INITIAL_REPORTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(DEFAULT_SETTINGS);
    showToast('Demo data restored to defaults.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        users,
        resources,
        claims,
        organizations,
        reports,
        notifications,
        currentUser,
        settings,
        toasts,
        showToast,
        dismissToast,
        login,
        quickLoginByRole,
        register,
        logout,
        updateProfile,
        createResource,
        updateResource,
        deleteResource,
        toggleResourceStatus,
        submitClaim,
        updateClaimStatus,
        cancelClaim,
        markNotificationRead,
        markAllNotificationsRead,
        toggleUserAccountStatus,
        updateOrganizationVerification,
        resolveReport,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
