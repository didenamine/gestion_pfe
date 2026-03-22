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


