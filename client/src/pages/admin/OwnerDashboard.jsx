import React from "react";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";
import { Crown, Loader } from "lucide-react";
import { useGetOwnerAnalyticsQuery } from "@/features/api/analyticsApi";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";

const OwnerDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const dark = root.classList.contains("dark");
    setIsDarkMode(dark);
  }, []);
  const { data, isLoading, refetch } = useGetAllUsersQuery();
  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useGetOwnerAnalyticsQuery();
  console.log(
    "Raw month keys from revenueByMonth:",
    Object.keys(analyticsData?.revenueByMonth || {})
  );

  const parseMonthKeyToDate = (monthKey) => {
    if (/^\d{4}-\d{2}$/.test(monthKey)) {
      // YYYY-MM
      return new Date(`${monthKey}-01`);
    } else if (/^\d{1,2}$/.test(monthKey)) {
      // Just month number (e.g., "06")
      const year = new Date().getFullYear();
      return new Date(`${year}-${monthKey.padStart(2, "0")}-01`);
    } else if (/^[A-Za-z]{3} \d{4}$/.test(monthKey)) {
      // Example: "Jul 2025"
      return new Date(monthKey);
    }

    return new Date("Invalid"); // Fallback
  };

  const revenueData = analyticsData?.revenueByMonth
    ? Object.entries(analyticsData.revenueByMonth)
        .sort(([a], [b]) => parseMonthKeyToDate(a) - parseMonthKeyToDate(b))
        .map(([monthKey, amount]) => {
          const safeDate = parseMonthKeyToDate(monthKey);
          const formattedMonth = safeDate.toLocaleString("default", {
            month: "short",
          });

          return { month: formattedMonth, amount };
        })
    : [];

    console.log("RevenueByMonth keys:", Object.keys(analyticsData?.revenueByMonth || {}));


  const topCourses = analyticsData?.topCourses || [];
  const users = data?.users || [];

  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === "owner") return -1;
    if (b.role === "owner") return 1;
    return 0;
  });

  const [updateUserRole, { isLoading: isUpdating }] =
    useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await updateUserRole({ userId, role: newRole }).unwrap();
      toast.success(res.message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await deleteUser(userId).unwrap();
      toast.success(res.message || "User deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className=" p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Owner Dashboard</h1>

      {/* ================= User Management Table ================= */}
      <div className="overflow-x-auto border dark:border-zinc-700 rounded-xl mb-12">
        <table className="min-w-full bg-white dark:bg-zinc-800 text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-700">
            <tr className="text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Change Role</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr
                key={user._id}
                className="border-t border-zinc-200 dark:border-zinc-700"
              >
                <td className="mt-2 p-4 flex items-center gap-2">
                  {user.name}
                  {user.role === "owner" && (
                    <Crown className="w-4 h-4 text-yellow-500" title="Owner" />
                  )}
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 capitalize">{user.role}</td>
                <td className="p-4">
                  {user.role === "owner" ? (
                    <span className="inline-flex items-center gap-1 text-yellow-500">
                      <Crown className="w-4 h-4" /> Owner
                    </span>
                  ) : (
                    <select
                      value={user.role}
                      disabled={user.role === "owner" || isUpdating}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="p-2 border rounded-md dark:bg-zinc-900"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </select>
                  )}
                </td>
                <td className="p-4">
                  {user.role !== "owner" && (
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-6 text-center text-zinc-500">No users found.</div>
        )}
      </div>

      {/* ================= Analytics Summary Cards ================= */}
      {isAnalyticsLoading ? (
        <div className="text-center text-zinc-500 mb-6">
          Loading analytics...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md">
            <h2 className="text-sm text-zinc-500 mb-1">Total Revenue</h2>
            <p className="text-3xl font-bold text-blue-600">
              ₹{analyticsData?.totalRevenue}
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md">
            <h2 className="text-sm text-zinc-500 mb-1">Total Sales</h2>
            <p className="text-3xl font-bold text-green-600">
              {analyticsData?.totalSales}
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md">
            <h2 className="text-sm text-zinc-500 mb-1">Total Instructors</h2>
            <p className="text-3xl font-bold text-purple-600">
              {analyticsData?.totalInstructors}
            </p>
          </div>
        </div>
      )}

      {/* ================= Monthly Revenue Chart ================= */}

      {revenueData.length > 0 && (
        <div className="mb-10 bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={revenueData}
              margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                interval={0}
                angle={-35}
                textAnchor="end"
                tick={{
                  fontSize: 12,
                  fill: isDarkMode ? "#fff" : "#000",
                }}
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12, fill: isDarkMode ? "#fff" : "#000" }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  color: isDarkMode ? "#fff" : "#000",
                }}
                labelStyle={{
                  color: isDarkMode ? "#fff" : "#000",
                }}
                itemStyle={{
                  color: isDarkMode ? "#a3e635" : "#000",
                }}
                formatter={(value) => `₹${value}`}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ================= Top Selling Courses Chart ================= */}
      {topCourses.length > 0 && (
        <div className="mb-10 bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Top Selling Courses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCourses}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis
                dataKey="title"
                interval={0}
                height={60}
                tick={({ x, y, payload }) => {
                  const words = payload.value.split(" ");
                  const lines = [];

                  let line = "";
                  for (let i = 0; i < words.length; i++) {
                    if ((line + words[i]).length > 12) {
                      lines.push(line);
                      line = words[i] + " ";
                    } else {
                      line += words[i] + " ";
                    }
                  }
                  lines.push(line.trim());

                  return (
                    <g transform={`translate(${x},${y + 10})`}>
                      {lines.map((word, index) => (
                        <text
                          key={index}
                          x={0}
                          y={index * 12}
                          textAnchor="middle"
                          fill={isDarkMode ? "#fff" : "#333"}
                          fontSize="12"
                        >
                          {word}
                        </text>
                      ))}
                    </g>
                  );
                }}
              />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  color: isDarkMode ? "#fff" : "#000",
                }}
                labelStyle={{
                  color: isDarkMode ? "#fff" : "#000",
                }}
                itemStyle={{
                  color: isDarkMode ? "#a3e635" : "#000",
                }}
              />
              <Legend />
              <Bar
                dataKey="sales"
                fill="#10b981"
                isAnimationActive={false}
                activeBar={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ================= Display Instructor Revenue Table ================= */}
      {analyticsData?.instructorRevenue && (
        <div className="mb-10 bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Instructor-wise Revenue</h2>
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-700">
              <tr>
                <th className="p-2 text-left">Instructor</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analyticsData.instructorRevenue).map(
                ([id, { total, name, email }]) => (
                  <tr key={id} className="border-t dark:border-zinc-700">
                    <td className="p-2">{name}</td>
                    <td className="p-2">{email}</td>
                    <td className="p-2 font-semibold text-green-600">
                      ₹{total}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
