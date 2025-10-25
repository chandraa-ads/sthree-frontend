import React, { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  phone: string | null;
  whatsapp_no?: string | null;
  address: string[] | string | null;
  profile_photo?: string | null;
  email_verified: boolean;
}

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/admin/users");
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatAddress = (address: string[] | string | null) => {
    if (!address) return "-";
    if (Array.isArray(address)) return address.join(", ");
    // Remove brackets and quotes if string contains them
    return address.replace(/[\[\]"]/g, "");
  };

  if (loading) return <p className="text-center mt-6">Loading users...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gradient-to-b from-rose-50 to-white min-h-screen flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Users List
        </h2>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-pink-400 to-pink-600 text-white text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Profile</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Email Verified</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const address = formatAddress(user.address);
                const profileName = user.full_name || user.username || "No Name";

                return (
                  <tr key={user.id} className="hover:bg-pink-50 transition-colors">
                    <td className="px-4 py-3">{user.id}</td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      {user.profile_photo ? (
                        <img
                          src={user.profile_photo}
                          alt="Profile"
                          className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 border border-gray-200" />
                      )}
                      <span className="font-medium text-gray-800">{profileName}</span>
                    </td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      {user.email_verified ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{user.phone || "-"}</td>
                    <td className="px-4 py-3">{user.whatsapp_no || "-"}</td>
                    <td className="px-4 py-3">{address}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
