// Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  YAxis,
} from "recharts";
import axios from "@/lib/axios";

export default function Dashboard() {
  const [data, setData] = useState({
    totals: { candidates: 0, wards: 0, voters: 0 },
    chartData: [],
    wardsData: [],
    candidatesData: [],
  });
  const [filter, setFilter] = useState("day");
  const [loading, setLoading] = useState(true);

  const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const fetchDashboardData = async (filterType) => {
    try {
      setLoading(true);
      const response = await axios.get(`/adminDashboard?filter=${filterType}`);
      console.log("API Response:", response.data);
      if (response.data.success && response.data.data) {
        setData(response.data.data);
      } else {
        console.error("Unexpected API response structure:", response.data);
        setData({
          totals: { candidates: 0, wards: 0, voters: 0 },
          chartData: [],
          wardsData: [],
          candidatesData: [],
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error.response || error);
      setData({
        totals: { candidates: 0, wards: 0, voters: 0 },
        chartData: [],
        wardsData: [],
        candidatesData: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(filter);
  }, [filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div className="p-6 min-h-screen">
      <div>
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Overview of candidates, wards, and voters
          </p>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border-1 shadow-lg rounded-lg p-5 flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-full">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#CB2800"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                <path d="M4 20v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Candidates</div>
              <div className="text-xl font-bold">
                {loading || !data.totals ? "..." : data.totals.candidates.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-white border-1 shadow-lg rounded-lg p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-full">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#2563EB"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M21 10h-6l-2-3-2 3H3" />
                <path d="M12 12v7" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Wards</div>
              <div className="text-xl font-bold">
                {loading || !data.totals ? "..." : data.totals.wards.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-white border-1 shadow-lg rounded-lg p-5 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-full">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#16A34A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M3 11l2-2 4 4 8-8 4 4v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Voters</div>
              <div className="text-xl font-bold">
                {loading || !data.totals ? "..." : data.totals.voters.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Area Chart */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Voters Over Time</h2>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={handleFilterChange}
                className="border rounded p-1 text-sm"
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
              <div className="text-sm text-gray-500">
                Last {filter === "day" ? "7 days" : filter === "week" ? "4 weeks" : "7 months"}
              </div>
            </div>
          </div>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <AreaChart
                data={data.chartData || []}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVoters" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="voters"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorVoters)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart + Candidate Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wards Pie Chart */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-medium mb-3">Wards Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.wardsData || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {(data.wardsData || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Candidates Bar Chart */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-medium mb-3">Candidates by Party</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.candidatesData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}