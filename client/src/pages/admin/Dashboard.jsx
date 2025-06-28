import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetInstructorPurchasesQuery } from "@/features/api/purchaseApi";
import {
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const COLORS = ["#6366f1", "#3b82f6", "#22d3ee", "#10b981", "#f59e0b"];

const Dashboard = () => {
  const { data, isError, isLoading } = useGetInstructorPurchasesQuery();
  const [viewMode, setViewMode] = useState("revenue");

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1 className="text-red-500">Failed to fetch data</h1>;

  const { purchasedCourse = [] } = data || {};

  const courseData = purchasedCourse.map((course) => ({
    name: course.courseId.courseTitle.slice(0, 12) + "...",
    price: course.courseId.coursePrice,
    sales: 1, // each course is considered one sale here
  }));

  const totalRevenue = purchasedCourse.reduce(
    (acc, item) => acc + (item.amount || 0),
    0
  );

  const totalSales = purchasedCourse.length;

  const prevRevenue = totalRevenue - 300; // Dummy previous data
  const revenueGrowth = (
    ((totalRevenue - prevRevenue) / prevRevenue) *
    100
  ).toFixed(2);

  return (
    <div className="mt-16 sm:mt-0 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">₹{totalRevenue}</p>
          <p className="text-sm text-green-500 mt-1">
            +{revenueGrowth}% from last month
          </p>
        </CardContent>
      </Card>

      {/* Toggle View Mode */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>View Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value)}
            className="flex space-x-2"
          >
            <ToggleGroupItem value="revenue">Revenue</ToggleGroupItem>
            <ToggleGroupItem value="sales">Sales</ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      {/* Chart Card */}
      <Card className="col-span-full bg-[#111827] text-white rounded-xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-xl font-bold">
            {viewMode === "revenue" ? "Revenue Trend" : "Sales Trend"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={courseData}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00c6ff" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#0072ff" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#4b5563"
                opacity={1}
              />
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                angle={-20}
                tick={{ fontSize: 12, fill: "#cbd5e1" }}
                interval={0}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fontSize: 12, fill: "#cbd5e1" }}
                domain={[0, "dataMax + 500"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: 10,
                }}
                formatter={(value) => [
                  `₹${value}`,
                  viewMode === "revenue" ? "Revenue" : "Sales",
                ]}
              />
              <Line
                type="monotone"
                dataKey={viewMode === "revenue" ? "price" : "sales"}
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ r: 5, stroke: "#fff", fill: "#00c6ff" }}
                activeDot={{ r: 8, stroke: "#fff", fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="col-span-full shadow-lg">
        <CardHeader>
          <CardTitle>Course Revenue Share</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseData}
                dataKey="price"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {courseData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      
    </div>
  );
};

export default Dashboard;
