import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminNavbar from "../../components/layout/AdminNavbar";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin/users");
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete user");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-6">
        <h2 className="text-xl mb-4">Users</h2>

        {users.map((u) => (
          <div key={u._id} className="border p-3 mb-2">
            <p>{u.name} ({u.email})</p>
            <button
              onClick={() => deleteUser(u._id)}
              className="bg-red-500 text-white px-2 py-1 mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
