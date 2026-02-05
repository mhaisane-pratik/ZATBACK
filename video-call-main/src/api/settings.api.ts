const API = "/api";

export const getSettings = () =>
  fetch(`${API}/settings`).then(r => r.json());

export const updateProfile = (data: any) =>
  fetch(`${API}/settings/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateSection = (section: string, data: any) =>
  fetch(`${API}/settings/${section}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const uploadAvatar = async (file: File) => {
  const fd = new FormData();
  fd.append("avatar", file);
  const r = await fetch(`${API}/settings/avatar`, {
    method: "POST",
    body: fd,
  });
  return (await r.json()).avatarUrl;
};

export const resetSettings = () =>
  fetch(`${API}/settings/reset`, { method: "POST" }).then(r => r.json());

export const changePassword = (payload: any) =>
  fetch(`${API}/settings/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const deleteAccount = () =>
  fetch(`${API}/settings`, { method: "DELETE" });
