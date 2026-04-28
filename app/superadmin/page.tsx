"use client";

import { useEffect, useState } from "react";

export default function SuperAdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/superadmin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Super Admin Dashboard
      </h1>

      <h2 className="text-xl mb-4">All Users</h2>

      {users.map((user: any) => (
        <div
          key={user._id}
          className="border p-3 mb-2 flex justify-between"
        >
          <span>{user.email}</span>
          <span>{user.role}</span>
        </div>
      ))}
    </div>
  );
}
