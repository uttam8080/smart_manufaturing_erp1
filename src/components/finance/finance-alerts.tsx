"use client";

import React from "react";
import { FinanceAlert } from "@/types/finance";
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface FinanceAlertsProps {
  alerts: FinanceAlert[];
  onViewAlert?: (alert: FinanceAlert) => void;
}

export function FinanceAlerts({ alerts, onViewAlert }: FinanceAlertsProps) {
  const getSeverityBadge = (severity: FinanceAlert["severity"]) => {
    switch (severity) {
      case "Critical":
      case "High":
        return {
          icon: AlertOctagon,
          badgeClass: "bg-rose-50 text-rose-800 border border-rose-300 font-bold",
          cardBorder: "border-rose-200 hover:border-rose-300 bg-rose-50/30",
        };
      case "Medium":
        return {
          icon: AlertTriangle,
          badgeClass: "bg-amber-50 text-amber-800 border border-amber-300 font-bold",
          cardBorder: "border-amber-200 hover:border-amber-300 bg-amber-50/30",
        };
      case "Low":
      default:
        return {
          icon: Info,
          badgeClass: "bg-cyan-50 text-cyan-800 border border-cyan-300 font-bold",
          cardBorder: "border-cyan-200 hover:border-cyan-300 bg-cyan-50/30",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Finance & Cost Variance Alerts
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
                {alerts.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Operational cost overruns, supplier invoice due dates & departmental budget threshold warnings
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-700 font-bold flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <ShieldAlert className="w-4 h-4 text-cyan-600" />
          <span>Real-Time Fiscal Anomaly Detection</span>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {alerts.map((alert) => {
          const config = getSeverityBadge(alert.severity);
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={`rounded-2xl border p-4 transition-all duration-200 ${config.cardBorder} flex flex-col justify-between space-y-3`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs ${config.badgeClass}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {alert.severity}
                    </span>
                    <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-lg border border-cyan-200">
                      {alert.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.timestamp}
                  </span>
                </div>

                <p className="text-sm text-slate-900 font-semibold leading-relaxed">
                  {alert.reason}
                </p>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                  <span className="text-slate-600 font-bold block mb-0.5">
                    Recommended Operational Action:
                  </span>
                  <span className="text-slate-800 font-medium">{alert.recommendedAction}</span>
                </div>
              </div>

              {onViewAlert && (
                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onViewAlert(alert)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-300 transition-colors"
                  >
                    <span>Inspect Section</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
