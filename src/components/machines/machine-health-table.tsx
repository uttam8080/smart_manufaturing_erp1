"use client";

import React from "react";
import { MachineItem } from "@/types/machines";
import { MachineStatusBadge, RiskIndicator } from "./risk-indicator";
import { MachineStatusDropdown } from "./machine-status-dropdown";
import {
  Eye,
  Wrench,
  Thermometer,
  Activity,
  Clock,
  Cpu,
  Calendar,
} from "lucide-react";

interface MachineHealthTableProps {
  machines: MachineItem[];
  onViewMachine: (machine: MachineItem) => void;
  onScheduleMaintenance?: (machine: MachineItem) => void;
  onUpdateStatus?: (machineId: string, newStatus: "Running" | "Idle" | "Maintenance" | "Warning") => void;
}

export function MachineHealthTable({
  machines,
  onViewMachine,
  onScheduleMaintenance,
  onUpdateStatus,
}: MachineHealthTableProps) {
  if (machines.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-sm">
        <Cpu className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No machines found</h3>
        <p className="text-xs text-slate-600 font-medium">
          Try adjusting your search criteria or resetting your active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-600" />
            Machine Health & Sensor Master
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Real-time thermal metrics, vibration thresholds, maintenance intervals & failure risk
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
          {machines.length} Equipment Registered
        </span>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="hidden md:block max-h-[520px] overflow-y-auto overflow-x-auto custom-scrollbar border border-slate-200 rounded-xl bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs">
            <tr className="border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3 font-bold">Machine</th>
              <th className="py-3 px-3 font-bold">Status</th>
              <th className="py-3 px-3 font-bold text-right">Temperature</th>
              <th className="py-3 px-3 font-bold text-right">Vibration</th>
              <th className="py-3 px-3 font-bold text-right">Operating Hrs</th>
              <th className="py-3 px-3 font-bold text-right">Downtime</th>
              <th className="py-3 px-3 font-bold text-center">Last Maint.</th>
              <th className="py-3 px-3 font-bold text-center">Next Maint.</th>
              <th className="py-3 px-3 font-bold text-center">Risk Level</th>
              <th className="py-3 px-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {machines.map((machine) => {
              const tempLimit = machine.sensorHistory?.[0]?.temperatureThreshold ?? 85;
              const vibLimit = machine.sensorHistory?.[0]?.vibrationThreshold ?? 4.0;
              const isHighTemp = machine.currentTemperature >= tempLimit || machine.status === "Warning";
              const isHighVib = machine.currentVibration >= vibLimit || (machine.status === "Warning" && machine.currentVibration > 3.5);

              return (
                <tr
                  key={machine.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  {/* Machine Code & Name */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="font-mono font-bold text-cyan-800 text-xs">
                      {machine.machineCode}
                    </div>
                    <div className="font-bold text-slate-900 text-xs">
                      {machine.machineName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {machine.machineType}
                    </div>
                  </td>

                  {/* Status Badge with Interactive Dropdown */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {onUpdateStatus ? (
                      <MachineStatusDropdown
                        machineId={machine.id}
                        status={machine.status}
                        onStatusChange={onUpdateStatus}
                      />
                    ) : (
                      <MachineStatusBadge status={machine.status} />
                    )}
                    <div className="text-[10px] text-slate-600 font-mono font-medium mt-0.5">
                      {machine.utilization}% util.
                    </div>
                  </td>

                  {/* Temperature */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <div
                      className={`font-mono font-bold text-xs ${
                        machine.status === "Maintenance"
                          ? "text-slate-400"
                          : isHighTemp
                          ? "text-amber-700 font-black"
                          : "text-slate-900"
                      }`}
                    >
                      {machine.status === "Maintenance"
                        ? "Offline"
                        : `${Number(machine.currentTemperature ?? 0).toFixed(1)}°C`}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {machine.status === "Maintenance" ? "Ambient" : "Thermal sensor"}
                    </div>
                  </td>

                  {/* Vibration */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <div
                      className={`font-mono font-bold text-xs ${
                        machine.status === "Maintenance"
                          ? "text-slate-400"
                          : isHighVib
                          ? "text-rose-700 font-black"
                          : "text-emerald-700"
                      }`}
                    >
                      {machine.status === "Maintenance"
                        ? "0.0 mm/s"
                        : `${Number(machine.currentVibration ?? 0).toFixed(2)} mm/s`}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {machine.status === "Maintenance" ? "Static" : "RMS velocity"}
                    </div>
                  </td>

                  {/* Operating Hours */}
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800 whitespace-nowrap text-xs">
                    {Number(machine.operatingHours ?? 0).toLocaleString()} hrs
                  </td>

                  {/* Downtime */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap font-mono font-bold text-xs">
                    <span
                      className={
                        (Number(machine.downtimeMinutes) || 0) > 30
                          ? "text-rose-700 font-black"
                          : (Number(machine.downtimeMinutes) || 0) > 0
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }
                    >
                      {machine.downtimeMinutes ?? 0} mins
                    </span>
                  </td>

                  {/* Last Maintenance */}
                  <td className="py-3.5 px-3 text-center text-slate-700 whitespace-nowrap font-mono font-medium text-[11px]">
                    {machine.lastMaintenanceDate}
                  </td>

                  {/* Next Maintenance */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap font-mono font-bold text-[11px]">
                    <span
                      className={
                        machine.nextMaintenanceDate === "2026-10-01"
                          ? "text-rose-700"
                          : machine.nextMaintenanceDate === "2026-10-02"
                          ? "text-amber-700"
                          : "text-slate-800"
                      }
                    >
                      {machine.nextMaintenanceDate}
                    </span>
                  </td>

                  {/* Risk Level & Score */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <RiskIndicator
                      riskLevel={machine.riskLevel}
                      riskScore={Number(machine.riskScore ?? 0)}
                    />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end">
                      {/* View details */}
                      <button
                        onClick={() => onViewMachine(machine)}
                        className="p-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-300 transition shadow-xs cursor-pointer"
                        title="View Telemetry & Maintenance History"
                        aria-label="View Machine"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-800">
                  {machine.machineCode}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {machine.machineName}
                </h3>
                <span className="text-[11px] text-slate-600 font-medium">
                  {machine.machineType}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                {onUpdateStatus ? (
                  <MachineStatusDropdown
                    machineId={machine.id}
                    status={machine.status}
                    onStatusChange={onUpdateStatus}
                  />
                ) : (
                  <MachineStatusBadge status={machine.status} />
                )}
                <span className="text-[10px] font-mono font-medium text-slate-600">
                  {machine.utilization}% util.
                </span>
              </div>
            </div>

            {/* Sensor numbers grid */}
            <div className="grid grid-cols-3 gap-2 text-xs py-2 border-y border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Temperature</span>
                <span className="font-mono font-bold text-slate-900">
                  {machine.status === "Maintenance" ? "Offline" : `${Number(machine.currentTemperature ?? 0).toFixed(1)}°C`}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Vibration</span>
                <span
                  className={`font-mono font-bold ${
                    Number(machine.currentVibration ?? 0) > 3.0 ? "text-rose-700" : "text-emerald-700"
                  }`}
                >
                  {machine.status === "Maintenance" ? "0.0 mm/s" : `${Number(machine.currentVibration ?? 0).toFixed(2)} mm/s`}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Risk Score</span>
                <span className="font-mono font-bold text-orange-700">
                  {Number(machine.riskScore ?? 0)}%
                </span>
              </div>
            </div>

            {/* Next maintenance date */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Next Maintenance:</span>
              <span className="font-mono text-cyan-800 font-bold">
                {machine.nextMaintenanceDate}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => onViewMachine(machine)}
                className="w-full px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-xs font-bold text-white border border-cyan-600 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-white" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
