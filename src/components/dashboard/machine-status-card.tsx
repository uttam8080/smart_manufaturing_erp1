"use client";

import React from "react";
import { MachineStatusItem, MachineStatusType } from "@/types/dashboard";
import { Wrench, CheckCircle2, AlertTriangle, Clock, Activity } from "lucide-react";

interface MachineStatusCardProps {
  machines: MachineStatusItem[];
}

export function MachineStatusCard({ machines }: MachineStatusCardProps) {
  const getStatusBadge = (status: MachineStatusType) => {
    switch (status) {
      case "Running":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Running
          </span>
        );
      case "Warning":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Warning
          </span>
        );
      case "Idle":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Idle
          </span>
        );
      case "Maintenance":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  const getUtilizationColor = (val: number, status: MachineStatusType) => {
    if (status === "Maintenance") return "bg-rose-500";
    if (status === "Warning") return "bg-amber-500";
    if (val >= 90) return "bg-cyan-600";
    if (val >= 70) return "bg-blue-600";
    return "bg-slate-500";
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-600" />
            Machine Status
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Live telemetry & equipment utilization across plant lines
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
          {machines.length} Assets Monitored
        </span>
      </div>

      {/* Table / List View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px] font-bold">
              <th className="pb-2.5 font-bold">Machine</th>
              <th className="pb-2.5 font-bold">Status</th>
              <th className="pb-2.5 font-bold">Utilization</th>
              <th className="pb-2.5 font-bold text-right">Downtime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {machines.map((machine) => (
              <tr key={machine.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 pr-2">
                  <div className="font-bold text-slate-900">{machine.name}</div>
                  <div className="text-[11px] text-slate-500 font-medium truncate max-w-[140px] sm:max-w-[200px]">
                    {machine.type}
                  </div>
                </td>

                <td className="py-3 px-2 whitespace-nowrap">
                  {getStatusBadge(machine.status)}
                </td>

                <td className="py-3 px-2">
                  <div className="w-28 sm:w-36">
                    <div className="flex justify-between items-center text-[11px] mb-1 font-mono">
                      <span className="text-slate-900 font-bold">
                        {machine.utilization}%
                      </span>
                      {machine.temperature && (
                        <span className="text-slate-500 text-[10px] font-medium">
                          {machine.temperature}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getUtilizationColor(
                          machine.utilization,
                          machine.status
                        )}`}
                        style={{ width: `${machine.utilization}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="py-3 pl-2 text-right whitespace-nowrap font-mono">
                  <span
                    className={
                      machine.downtime.startsWith("0")
                        ? "text-emerald-700 font-bold"
                        : "text-amber-700 font-bold"
                    }
                  >
                    {machine.downtime}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
