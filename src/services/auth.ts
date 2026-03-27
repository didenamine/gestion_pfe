// src/services/auth.ts
const API_BASE = import.meta.env.VITE_API_BASE;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Login failed");

  return response.json();
}

export async function logoutUser() {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Logout failed");

  // Clear local storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  return response.json();
}

export async function getProfile() {
  const response = await fetch(`${API_BASE}/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch profile");

  return response.json();
}
export async function requestPasswordReset(email: string) {
  const response = await fetch(`${API_BASE}/auth/request-password-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) throw new Error("Failed to request password reset");

  return response.json();
}

export async function resetPassword(token: string, newPassword: string) {
  const response = await fetch(
    `${API_BASE}/auth/reset-password?resetToken=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to reset password");
  }

  return response.json();
}

export async function signupStudent(data: any) {
  const response = await fetch(`${API_BASE}/auth/signup/student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message || "Student signup failed");
  }

  return response.json();
}

export async function signupUniSupervisor(data: any) {
  const response = await fetch(
    `${API_BASE}/auth/signup/supervisor-university`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message || "University supervisor signup failed");
  }

  return response.json();
}

export async function signupCompSupervisor(data: any) {
  const response = await fetch(`${API_BASE}/auth/signup/supervisor-company`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message || "Company supervisor signup failed");
  }

  return response.json();
}

export async function verifyEmail(token: string) {
  const response = await fetch(`${API_BASE}/auth/verify-email?token=${token}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Email verification failed");
  }

  return response.json();
}
