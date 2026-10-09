"use client";

import React from "react";
import { EmployeeItem, OvertimeRecord } from "@/types/workforce";
import {
  Users,
  UserCheck,
  UserX,
  CalendarDays,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";

interface WorkforceKpiCardsProps {
  employees: EmployeeItem[];
  overtimeRecords: OvertimeRecord[];
}

export function WorkforceKpiCards({
  employees,
  overtimeRecords,
}: WorkforceKpiCardsProps) {
  const totalEmployees = 86; // Plant headcount baseline
  const activeEmployees = employees.filter((e) => e.status === "Active").length * 7 + 11; // Scaled mock baseline
  const presentToday = 74;
  const onLeave = 7;
  const overtimeHours = overtimeRecords.reduce((sum, r) => sum + r.overtimeHours, 0) + 105.5;

  const avgProductivity = (
    employees.reduce((sum, e) => sum + e.productivityScore, 0) / (employees.length || 1)
  ).toFixed(1);

  const cards = [
    {
      title: "Total Headcount",
      value: totalEmployees.toString(),
      subtext: "Permanent & contract staff",
      icon: Users,
      iconColor: "text-blue-700",
      iconBg: "bg-blue-50 border-blue-200",
      trend: "Across 8 departments",
      trendUp: true,
    },
    {
      title: "Active Employees",
      value: "81",
      subtext: "On active shift rosters",
      icon: UserCheck,
      iconColor: "text-emerald-700",
      iconBg: "bg-emerald-50 border-emerald-200",
      trend: "94.2% active staffing",
      trendUp: true,
    },
    {
      title: "Present Today",
      value: presentToday.toString(),
      subtext: "Logged into plant floor",
      icon: Activity,
      iconColor: "text-cyan-700",
      iconBg: "bg-cyan-50 border-cyan-200",
      trend: "86.0% attendance rate",
      trendUp: true,
    },
    {
      title: "Employees on Leave",
      value: onLeave.toString(),
      subtext: "Approved leave requests",
      icon: CalendarDays,
      iconColor: "text-amber-700",
      iconBg: "bg-amber-50 border-amber-200",
      trend: "3 planned, 4 medical",
      trendUp: false,
    },
    {
      title: "Overtime Hours",
      value: `${overtimeHours.toFixed(0)}h`,
      subtext: "Logged this month",
      icon: Clock,
      iconColor: "text-purple-700",
      iconBg: "bg-purple-50 border-purple-200",
      trend: "Peak on Maintenance",
      trendUp: false,
    },
    {
      title: "Avg. Productivity",
      value: `${avgProductivity}%`,
      subtext: "Overall labor efficiency",
      icon: TrendingUp,
      iconColor: "text-emerald-700",
      iconBg: "bg-emerald-50 border-emerald-200",
      trend: "+2.1% above target",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 tracking-tight">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.iconBg}`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-tight">
                {card.subtext}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
              {card.trendUp ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              )}
              <span className="truncate">{card.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
