// src/services/meetings.ts
const API_BASE = import.meta.env.VITE_API_BASE;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function createMeeting(data: any) {
  const response = await fetch(`${API_BASE}/meetings`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create meeting");
  return response.json();
}

export async function updateMeeting(id: string, data: any) {
  const response = await fetch(`${API_BASE}/meetings/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update meeting");
  return response.json();
}

export async function deleteMeeting(id: string) {
  const response = await fetch(`${API_BASE}/meetings/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete meeting");
  return response.json();
}

export async function completeMeeting(id: string, data: any) {
  const response = await fetch(`${API_BASE}/meetings/${id}/complete`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to complete meeting");
  return response.json();
}

export async function validateMeeting(id: string) {
  const response = await fetch(`${API_BASE}/meetings/${id}/validate`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to validate meeting");
  return response.json();
}

export async function getMeetings() {
  const response = await fetch(`${API_BASE}/meetings`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch meetings");
  return response.json();
}

export async function getMeetingsByProject(projectId: string) {
  const response = await fetch(`${API_BASE}/meetings/project/${projectId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch meetings by project");
  return response.json();
}

export async function getMeetingsByReference(type: string, id: string) {
  const response = await fetch(`${API_BASE}/meetings/reference/${type}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch meetings by reference");
  return response.json();
}

export async function getPendingValidationMeetings() {
  const response = await fetch(`${API_BASE}/meetings/pending-validation`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch pending validation meetings");
  return response.json();
}

export async function changeMeetingReference(id: string, refData: any) {
  const response = await fetch(`${API_BASE}/meetings/${id}/reference`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(refData),
  });
  if (!response.ok) throw new Error("Failed to change meeting reference");
  return response.json();
}
