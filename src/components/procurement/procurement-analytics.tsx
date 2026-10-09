"use client";

import React from "react";
import {
  CategorySpendPoint,
  PurchaseOrderItem,
  SupplierItem,
} from "@/types/procurement";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Layers,
  Award,
} from "lucide-react";

interface ProcurementAnalyticsProps {
  categories: CategorySpendPoint[];
  orders: PurchaseOrderItem[];
  suppliers: SupplierItem[];
}

export function ProcurementAnalytics({
  categories,
  orders,
  suppliers,
}: ProcurementAnalyticsProps) {
  // 1. POs by Status breakdown
  const statusCounts: Record<string, number> = {
    Received: 0,
    "In Transit / Ordered": 0,
    "Pending Approval": 0,
    Draft: 0,
  };

  orders.forEach((o) => {
    if (o.poStatus === "Received") {
      statusCounts["Received"] += 1;
    } else if (o.poStatus === "Ordered" || o.poStatus === "Partially Received" || o.poStatus === "Approved") {
      statusCounts["In Transit / Ordered"] += 1;
    } else if (o.poStatus === "Pending Approval") {
      statusCounts["Pending Approval"] += 1;
    } else {
      statusCounts["Draft"] += 1;
    }
  });

  const poStatusData = [
    { name: "Received", count: statusCounts["Received"], color: "#10b981" },
    { name: "Ordered / In Transit", count: statusCounts["In Transit / Ordered"], color: "#06b6d4" },
    { name: "Pending Approval", count: statusCounts["Pending Approval"], color: "#f59e0b" },
    { name: "Draft", count: statusCounts["Draft"], color: "#64748b" },
  ];

  // 2. Supplier Delivery & Quality SLA comparison
  const supplierSlaData = suppliers.map((s) => ({
    name: s.supplierName.replace(" Pvt Ltd", "").replace(" Solutions", ""),
    onTimeRate: s.onTimeDeliveryRate,
    qualityScore: s.qualityScore,
  }));

  const totalCategorySpend = categories.reduce((sum, c) => sum + c.spend, 0);

  const formatLakhs = (val: number) => {
    return `₹${(val / 100000).toFixed(1)}L`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Spend Donut */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <PieIcon className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Spend by Category
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              ₹{(totalCategorySpend / 100000).toFixed(1)}L Total
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto py-2">
            <div className="sm:col-span-6 h-52 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#cbd5e1",
                      borderRadius: "10px",
                      fontSize: "12px",
                      color: "#0f172a",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(val: any, name: any) => [
                      `₹${(Number(val) / 100000).toFixed(2)}L`,
                      name,
                    ]}
                  />
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="spend"
                    nameKey="category"
                  >
                    {categories.map((entry, index) => (
                      <Cell
                        key={`cat-cell-${index}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center pointer-events-none text-center">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Top Spend</span>
                <span className="text-sm font-extrabold text-slate-900">Raw Materials</span>
              </div>
            </div>

            <div className="sm:col-span-6 space-y-2">
              {categories.map((c) => (
                <div
                  key={c.category}
                  className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-slate-800 font-semibold truncate">{c.category}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700">
                    ₹{(c.spend / 100000).toFixed(1)}L
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 font-medium flex items-center justify-between">
            <span>Primary Allocation: <strong className="text-slate-900">Raw Materials (58.4%)</strong></span>
            <span>Packaging: <strong className="text-slate-900">21.6%</strong></span>
          </div>
        </div>

        {/* Supplier Delivery & Quality SLA Bar Chart */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Supplier Fulfillment Performance
              </h3>
            </div>
            <span className="text-xs text-slate-700 font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              SLA Benchmark
            </span>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierSlaData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} domain={[70, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#cbd5e1",
                    borderRadius: "10px",
                    fontSize: "12px",
                    color: "#0f172a",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(val: any, name: any) => [
                    `${val}%`,
                    name === "onTimeRate" ? "On-Time Delivery" : "Quality Score",
                  ]}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", paddingBottom: "5px" }}
                  formatter={(value) => (
                    <span className="text-slate-700 font-semibold">
                      {value === "onTimeRate" ? "On-Time Rate %" : "Quality Score %"}
                    </span>
                  )}
                />
                <Bar dataKey="onTimeRate" fill="#0891b2" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="qualityScore" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 font-medium flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Highest Quality: <strong className="text-emerald-700">Odisha Agro Foods (98%)</strong></span>
            </span>
            <span>Target SLA: &gt;90%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
