"use client";

import React from "react";
import { ActivityEventType, RecentActivityItem } from "@/types/dashboard";
import {
  Activity,
  Factory,
  ShieldAlert,
  Boxes,
  Wrench,
  Truck,
  Clock,
} from "lucide-react";

interface RecentActivityProps {
  activities: RecentActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: ActivityEventType) => {
    switch (type) {
      case "production":
        return <Factory className="w-4 h-4 text-blue-600" />;
      case "quality":
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case "inventory":
        return <Boxes className="w-4 h-4 text-emerald-600" />;
      case "maintenance":
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case "procurement":
        return <Truck className="w-4 h-4 text-cyan-600" />;
      default:
        return <Activity className="w-4 h-4 text-cyan-600" />;
    }
  };

  const getActivityBg = (type: ActivityEventType) => {
    switch (type) {
      case "production":
        return "bg-blue-50 border-blue-200";
      case "quality":
        return "bg-rose-50 border-rose-200";
      case "inventory":
        return "bg-emerald-50 border-emerald-200";
      case "maintenance":
        return "bg-amber-50 border-amber-200";
      case "procurement":
        return "bg-cyan-50 border-cyan-200";
      default:
        return "bg-cyan-50 border-cyan-200";
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-600" />
            Recent Activity
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Operational event log across factory lines & warehouse
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
          Live Feed
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3.5">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition shadow-2xs"
          >
            <div
              className={`p-2 rounded-xl border shrink-0 mt-0.5 ${getActivityBg(
                item.type
              )}`}
            >
              {getActivityIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {item.title}
                </span>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-snug">
                {item.description}
              </p>
            </div>

            {item.badgeText && (
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs shrink-0">
                {item.badgeText}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
