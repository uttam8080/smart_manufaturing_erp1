"use client";

import React from "react";
import { MaintenanceAlert } from "@/types/machines";
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  Clock,
  ArrowRight,
  Wrench,
  Sparkles,
} from "lucide-react";

interface MaintenanceAlertsProps {
  alerts: MaintenanceAlert[];
  onViewMachine: (machineId: string) => void;
  onScheduleMaintenance?: (machineId: string) => void;
}

export function MaintenanceAlerts({
  alerts,
  onViewMachine,
  onScheduleMaintenance,
}: MaintenanceAlertsProps) {
  const getSeverityBadge = (severity: MaintenanceAlert["severity"]) => {
    switch (severity) {
      case "Critical":
        return {
          icon: AlertOctagon,
          badgeClass: "bg-rose-50 text-rose-800 border border-rose-200",
          cardBorder: "border-rose-300 bg-rose-50/40 hover:bg-rose-50/70",
        };
      case "High":
        return {
          icon: AlertTriangle,
          badgeClass: "bg-amber-50 text-amber-800 border border-amber-200",
          cardBorder: "border-amber-300 bg-amber-50/40 hover:bg-amber-50/70",
        };
      case "Medium":
        return {
          icon: AlertTriangle,
          badgeClass: "bg-yellow-50 text-yellow-800 border border-yellow-200",
          cardBorder: "border-yellow-300 bg-yellow-50/40 hover:bg-yellow-50/70",
        };
      case "Low":
      default:
        return {
          icon: Info,
          badgeClass: "bg-cyan-50 text-cyan-800 border border-cyan-200",
          cardBorder: "border-cyan-300 bg-cyan-50/40 hover:bg-cyan-50/70",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Maintenance Alerts</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                {alerts.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Automated anomaly detection triggers and impending PM service intervals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>Real-time ML Telemetry Monitor</span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3.5">
        {alerts.map((alert) => {
          const config = getSeverityBadge(alert.severity);
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 transition-all duration-200 ${config.cardBorder}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left side: Severity, Machine info, Reason */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${config.badgeClass}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {alert.severity}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-slate-900 text-sm">
                        {alert.machineName}
                      </span>
                      <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                        {alert.machineCode}
                      </span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-slate-800 font-medium mb-2 leading-relaxed">
                      {alert.reason}
                    </p>

                    <div className="flex items-start gap-2 bg-white/90 p-2.5 rounded-lg border border-slate-200 text-xs shadow-xs">
                      <span className="text-slate-900 font-bold shrink-0">Action:</span>
                      <span className="text-slate-800 font-medium">{alert.recommendedAction}</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0">
                  {onScheduleMaintenance && (
                    <button
                      type="button"
                      onClick={() => onScheduleMaintenance(alert.machineId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition-colors shadow-xs cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      <span>Schedule</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onViewMachine(alert.machineId)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white border border-cyan-600 transition-all shadow-xs cursor-pointer"
                  >
                    <span>View Machine</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
