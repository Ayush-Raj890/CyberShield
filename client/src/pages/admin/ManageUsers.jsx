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

                {isAdmin && u.role !== "SUPER_ADMIN" && !u.isSuspended && (
                  <button
                    onClick={() => suspendUser(u._id)}
                    className="btn btn-danger"
                    disabled={processingId === u._id}
                  >
                    {processingId === u._id ? "Processing..." : "Suspend"}
                  </button>
                )}

                {isSuperAdmin && u.role === "ADMIN" && (
                  <button
                    onClick={() => demoteAdmin(u._id)}
                    className="btn"
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
    </>
  );
}
