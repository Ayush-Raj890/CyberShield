import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import ConfirmActionModal from "../../components/ui/ConfirmActionModal";
import API from "../../services/api";

const PREFS_KEY = "userPreferences";

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({ alias: "", bio: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [prefs, setPrefs] = useState({ notificationsEnabled: true });

  useEffect(() => {
    fetchProfile();
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setPrefs((prev) => ({ ...prev, ...parsed }));
    } catch (error) {
      // Ignore malformed local data.
    }
  };

  const savePreferences = (nextPrefs) => {
    setPrefs(nextPrefs);
    localStorage.setItem(PREFS_KEY, JSON.stringify(nextPrefs));
    toast.success("Preferences updated");
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/users/profile");

      setProfileForm({
        alias: data.user.alias || "",
        bio: data.user.bio || ""
      });
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    setSavingProfile(true);
    try {
      await API.put("/users/profile", {
        alias: profileForm.alias,
        bio: profileForm.bio
      });

      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user) {
        user.alias = profileForm.alias.trim();
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Fill both password fields");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setSavingPassword(true);
    try {
      await API.put("/users/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setPasswordForm({ currentPassword: "", newPassword: "" });
      toast.success("Password updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await API.delete("/users/me");
      localStorage.clear();
      toast.success("Account deleted");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
      setConfirmDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-4 sm:p-6">Loading settings...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-6">
        <form className="card" onSubmit={updateProfile}>
          <h3 className="font-semibold mb-2">Profile</h3>
          <input
            className="input mb-3"
            placeholder="Alias"
            value={profileForm.alias}
            onChange={(e) => setProfileForm((prev) => ({ ...prev, alias: e.target.value }))}
          />
          <textarea
            className="input mb-3"
            placeholder="Bio"
            value={profileForm.bio}
            onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))}
          />
          <button className="btn btn-primary" type="submit" disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save"}
          </button>
        </form>

        <form className="card" onSubmit={changePassword}>
          <h3 className="font-semibold mb-2">Change Password</h3>
          <input
            type="password"
            className="input mb-3"
            placeholder="Current"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
          />
          <input
            type="password"
            className="input mb-3"
            placeholder="New"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
          />
          <button className="btn btn-primary" type="submit" disabled={savingPassword}>
            {savingPassword ? "Updating..." : "Update"}
          </button>
        </form>

        <div className="card">
          <h3 className="font-semibold mb-2">Preferences</h3>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={prefs.notificationsEnabled}
              onChange={(e) =>
                savePreferences({
                  ...prefs,
                  notificationsEnabled: e.target.checked
                })
              }
            />
            Enable notifications
          </label>
        </div>

        <div className="card border border-red-400">
          <h3 className="text-red-500 font-semibold mb-2">Danger Zone</h3>
          <button
            className="btn btn-danger"
            type="button"
            disabled={deleting}
            onClick={() => setConfirmDeleteOpen(true)}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>

      <ConfirmActionModal
        open={confirmDeleteOpen}
        title="Delete account?"
        description="This will permanently delete your account and related content. This action cannot be undone."
        confirmLabel={deleting ? "Deleting..." : "Confirm Delete"}
        confirmVariant="danger"
        onConfirm={deleteAccount}
        onCancel={() => setConfirmDeleteOpen(false)}
        confirmDisabled={deleting}
        cancelDisabled={deleting}
      />
    </>
  );
}
