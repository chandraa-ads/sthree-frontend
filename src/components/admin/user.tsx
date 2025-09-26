import React from "react";

const UsersTable: React.FC = () => {
  const users = [
    {
      id: "e02589d4-c8aa-4f63-a2bc-dbe16dea459a",
      email: "user@example.com",
      username: "baby123",
      email_verified: false,
      full_name: null,
      phone: null,
      address: null,
      profile_photo: null,
    },
    {
      id: "7c509884-e4e3-4a25-bfb7-40b0040a2371",
      email: "admin@gmail.com",
      username: "baby123",
      email_verified: false,
      full_name: null,
      phone: null,
      address: null,
      profile_photo: null,
    },
    {
      id: "fbef8356-539c-4b75-8396-585bf8b7d0b8",
      email: "user1@gmail.com",
      username: "baby123",
      email_verified: false,
      full_name: "Baby Name",
      phone: "9876543210",
      address: null,
      profile_photo:
        "https://gfliaavebnnpoesejfqb.supabase.co/storage/v1/object/public/products/products/1758538765162-brands_montage_shadow.jpg",
    },
    {
      id: "c1d80459-b0b2-48ee-8da1-6e955bebfa81",
      email: "user2@gmail.com",
      username: "baby123",
      email_verified: false,
      full_name: "Baby Name",
      phone: "9876543210",
      address: null,
      profile_photo:
        "https://gfliaavebnnpoesejfqb.supabase.co/storage/v1/object/public/products/products/1758539572586-Capture.PNG",
    },
    {
      id: "5beddb85-3593-44a8-970b-d099a0d4530d",
      email: "user3@example.com",
      username: "baby123",
      email_verified: false,
      full_name: "User3 Name",
      phone: "9876543210",
      address: ["123 Street", "City", "456 Another St"],
      profile_photo:
        "https://gfliaavebnnpoesejfqb.supabase.co/storage/v1/object/public/products/products/1758541731625-brands_montage_shadow.jpg",
    },
    {
      id: "cfeed55d-c050-4189-91c8-56e9ae6ec9bc",
      email: "akashperumal4@gmail.com",
      username: "baby123",
      email_verified: true,
      full_name: null,
      phone: null,
      address: null,
      profile_photo: null,
    },
    {
      id: "5fe27f09-f8dc-435e-a71a-7be9989a5929",
      email: "drubymadhumitha@gmail.com",
      username: "baby123",
      email_verified: true,
      full_name: null,
      phone: null,
      address: null,
      profile_photo: null,
    },
  ];

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
                <th className="px-4 py-3">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const address = Array.isArray(user.address)
                  ? user.address.join(", ")
                  : user.address || "";
                const profileName = user.full_name || user.username || "No Name";

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-pink-50 transition-colors"
                  >
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
                      <span className="font-medium text-gray-800">
                        {profileName}
                      </span>
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
                    <td className="px-4 py-3">{address || "-"}</td>
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
