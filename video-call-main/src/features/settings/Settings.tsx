import React, { useEffect, useRef, useState } from "react";
import {
  getSettings,
  updateProfile,
  updateSection,
  uploadAvatar,
  resetSettings,
  changePassword,
  deleteAccount,
} from "../../api/settings.api";
import "./Settings.css";

/* 🔥 IMPORTANT: BACKEND URL */
const SERVER_URL = "http://localhost:5000";

const Settings: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [profileDraft, setProfileDraft] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<"profile" | "video" | "security">(
    "profile"
  );

  const fileRef = useRef<HTMLInputElement>(null);

  /* =========================
     LOAD SETTINGS
  ========================= */
  useEffect(() => {
    getSettings().then((res) => setData(res));
  }, []);

  /* =========================
     INIT PROFILE DRAFT
  ========================= */
  useEffect(() => {
    if (data) {
      setProfileDraft({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    }
  }, [data]);

  if (!data || !profileDraft) {
    return <div className="loading">Loading settings…</div>;
  }

  /* =========================
     SAVE PROFILE
  ========================= */
  const saveProfile = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const updated = await updateProfile(profileDraft);
      setData(updated);
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     AVATAR UPLOAD
  ========================= */
  const onAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    try {
      const url = await uploadAvatar(e.target.files[0]);
      setData((p: any) => ({ ...p, avatar: url }));
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     PASSWORD CHANGE
  ========================= */
  const onPasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const currentPassword = (form.elements.namedItem(
      "current"
    ) as HTMLInputElement).value;

    const newPassword = (form.elements.namedItem(
      "new"
    ) as HTMLInputElement).value;

    setLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      alert("Password changed successfully");
      form.reset();
    } catch {
      alert("Password change failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RESET SETTINGS
  ========================= */
  const onReset = async () => {
    if (!window.confirm("Reset all settings to default?")) return;
    setLoading(true);
    const res = await resetSettings();
    setData(res.settings);
    setLoading(false);
  };

  /* =========================
     DELETE ACCOUNT
  ========================= */
  const onDeleteAccount = async () => {
    if (!window.confirm("Delete account permanently?")) return;
    await deleteAccount();
    alert("Account deleted");
    window.location.reload();
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="settings-container">
      {/* SIDEBAR */}
      <aside className="settings-sidebar">
        <button
          className={active === "profile" ? "active" : ""}
          onClick={() => setActive("profile")}
        >
          Profile
        </button>
        <button
          className={active === "video" ? "active" : ""}
          onClick={() => setActive("video")}
        >
          Video
        </button>
        <button
          className={active === "security" ? "active" : ""}
          onClick={() => setActive("security")}
        >
          Security
        </button>

        <button className="danger" onClick={onReset}>
          Reset Settings
        </button>
        <button className="danger" onClick={onDeleteAccount}>
          Delete Account
        </button>
      </aside>

      {/* CONTENT */}
      <main className="settings-content">
        {loading && <div className="saving">Saving…</div>}

        {/* PROFILE */}
        {active === "profile" && (
          <>
            <h2>Profile</h2>

            {/* ✅ WhatsApp-style DP */}
            <div
              className="dp-wrapper"
              onClick={() => fileRef.current?.click()}
            >
              <img
                src={
                  data.avatar
                    ? `${SERVER_URL}${data.avatar}`
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="dp-image"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    "/default-avatar.png")
                }
              />

              <div className="dp-overlay">
                <span>📷</span>
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              hidden
              accept="image/*"
              onChange={onAvatarChange}
            />

            <input
              placeholder="Name"
              value={profileDraft.name}
              onChange={(e) =>
                setProfileDraft({
                  ...profileDraft,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Email"
              value={profileDraft.email}
              onChange={(e) =>
                setProfileDraft({
                  ...profileDraft,
                  email: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone"
              value={profileDraft.phone}
              onChange={(e) =>
                setProfileDraft({
                  ...profileDraft,
                  phone: e.target.value,
                })
              }
            />

            <input
              placeholder="Address"
              value={profileDraft.address}
              onChange={(e) =>
                setProfileDraft({
                  ...profileDraft,
                  address: e.target.value,
                })
              }
            />

            <button
              className="btn-primary"
              disabled={loading}
              onClick={saveProfile}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>

            {saved && <span className="success">✔ Saved</span>}
          </>
        )}

        {/* VIDEO */}
        {active === "video" && (
          <>
            <h2>Video Settings</h2>
            {Object.keys(data.settings.video).map((k) => (
              <label className="toggle-row" key={k}>
                <span>{k}</span>
                <input
                  type="checkbox"
                  checked={data.settings.video[k]}
                  onChange={(e) =>
                    updateSection("video", {
                      ...data.settings.video,
                      [k]: e.target.checked,
                    }).then((v) =>
                      setData((p: any) => ({
                        ...p,
                        settings: { ...p.settings, video: v },
                      }))
                    )
                  }
                />
              </label>
            ))}
          </>
        )}

        {/* SECURITY */}
        {active === "security" && (
          <>
            <h2>Change Password</h2>
            <form onSubmit={onPasswordChange} className="password-form">
              <input
                type="password"
                name="current"
                placeholder="Current password"
                required
              />
              <input
                type="password"
                name="new"
                placeholder="New password"
                required
              />
              <button type="submit">Change Password</button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};

export default Settings;
