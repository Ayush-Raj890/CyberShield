import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import AdminNavbar from "../../components/layout/AdminNavbar";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [pendingModalAction, setPendingModalAction] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(currentUser?.role);
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/admin/users");
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const deleteUser = async (id) => {
    setDeletingId(id);
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const promoteUser = async (id) => {
    setProcessingId(id);
    try {
      await API.put(`/admin/promote/${id}`);
      toast.success("User promoted to admin");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to promote user");
    } finally {
      setProcessingId(null);
    }
  };

  const suspendUser = async (id) => {
    setProcessingId(id);
    try {
      await API.put(`/admin/suspend/${id}`);
      toast.success("User suspended");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to suspend user");
    } finally {
      setProcessingId(null);
    }
  };

  const unsuspendUser = async (id) => {
    setProcessingId(id);
    try {
      await API.put(`/admin/users/${id}/unsuspend`);
      toast.success("User unsuspended");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to unsuspend user");
    } finally {
      setProcessingId(null);
    }
  };

  const openSuspensionModal = (user) => {
    const action = user.isSuspended ? "unsuspend" : "suspend";
    setPendingModalAction({
      type: "suspension",
      userId: user._id,
      name: user.name,
      email: user.email,
      action,
      label: action === "unsuspend" ? "Unsuspend" : "Suspend"
    });
  };

  const openRemoveAdminModal = (user) => {
    setPendingModalAction({
      type: "remove-admin",
      userId: user._id,
      name: user.name,
      email: user.email,
      action: "remove-admin",
      label: "Remove Admin"
    });
  };

  const closeSuspensionModal = () => {
    if (processingId) return;
    setPendingModalAction(null);
  };

  const confirmSuspensionAction = async () => {
    if (!pendingModalAction) return;

    const { userId, action, type } = pendingModalAction;
    setPendingModalAction(null);

    if (action === "remove-admin" || type === "remove-admin") {
      await demoteAdmin(userId);
      return;
    }

    if (action === "unsuspend") {
      await unsuspendUser(userId);
      return;
    }

    await suspendUser(userId);
  };

  const demoteAdmin = async (id) => {
    setProcessingId(id);
    try {
      await API.put(`/admin/demote/${id}`);
      toast.success("Admin role removed");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to remove admin role");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-6">
        <h2 className="text-xl mb-4">Users</h2>

        <input
          type="text"
          placeholder="Search users by name or email"
          className="input mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p>Loading...</p>
        ) : filteredUsers.length === 0 ? (
          <div className="card text-gray-500">No users found.</div>
        ) : (
          filteredUsers.map((u) => (
            <div key={u._id} className="card mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Role: {u.role} | Suspended: {u.isSuspended ? "Yes" : "No"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                {isAdmin && u.role === "USER" && !u.isSuspended && (
                  <button
                    onClick={() => promoteUser(u._id)}
                    className="btn btn-primary"
                    disabled={processingId === u._id}
                  >
                    {processingId === u._id ? "Processing..." : "Make Admin"}
                  </button>
                )}

                {isAdmin && u.role !== "SUPER_ADMIN" && (
                  <button
                    onClick={() => openSuspensionModal(u)}
                    className={u.isSuspended ? "btn btn-secondary" : "btn btn-danger"}
                    disabled={processingId === u._id}
                  >
                    {processingId === u._id
                      ? "Processing..."
                      : u.isSuspended
                      ? "Unsuspend"
                      : "Suspend"}
                  </button>
                )}

                {isSuperAdmin && u.role === "ADMIN" && (
                  <button
                    onClick={() => openRemoveAdminModal(u)}
                    className="btn btn-secondary"
                    disabled={processingId === u._id}
                  >
                    {processingId === u._id ? "Processing..." : "Remove Admin"}
                  </button>
                )}

                {isSuperAdmin && (
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="btn btn-danger"
                    disabled={deletingId === u._id || processingId === u._id}
                  >
                    {deletingId === u._id ? "Processing..." : "Delete"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {pendingModalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {pendingModalAction.label} account?
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              {pendingModalAction.action === "remove-admin"
                ? <>Confirm removal of admin access for <span className="font-medium">{pendingModalAction.name}</span>{pendingModalAction.email ? ` (${pendingModalAction.email})` : ""}. This will downgrade the account to a regular user.</>
                : <>Confirm {pendingModalAction.action} for <span className="font-medium">{pendingModalAction.name}</span>{pendingModalAction.email ? ` (${pendingModalAction.email})` : ""}. This changes the account access state.</>}
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                className="btn btn-outline"
                onClick={closeSuspensionModal}
                disabled={Boolean(processingId)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={pendingModalAction.action === "unsuspend" ? "btn btn-secondary" : "btn btn-danger"}
                onClick={confirmSuspensionAction}
                disabled={Boolean(processingId)}
              >
                {pendingModalAction.action === "unsuspend"
                  ? "Confirm Unsuspend"
                  : pendingModalAction.action === "remove-admin"
                  ? "Confirm Remove Admin"
                  : "Confirm Suspend"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
