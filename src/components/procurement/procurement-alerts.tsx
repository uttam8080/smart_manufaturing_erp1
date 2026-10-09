"use client";

import React, { useState } from "react";
import { ProcurementAlert } from "@/types/procurement";
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  Clock,
  ArrowRight,
  ShieldAlert,
  Send,
  CheckCircle2,
  Settings,
  Mail,
  Zap,
  Loader2,
  ExternalLink,
  X,
} from "lucide-react";

const TARGET_EMAIL = "uttamthakur90400@gmail.com";

interface ProcurementAlertsProps {
  alerts: ProcurementAlert[];
  onViewAlertEntity?: (alert: ProcurementAlert) => void;
}

export function ProcurementAlerts({
  alerts,
  onViewAlertEntity,
}: ProcurementAlertsProps) {
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedAlertId, setDispatchedAlertId] = useState<string | null>(null);
  const [lastDispatchedTime, setLastDispatchedTime] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [customWebhookUrl, setCustomWebhookUrl] = useState("");

  const triggerN8nWorkflow = async (targetAlerts?: ProcurementAlert[]) => {
    setIsDispatching(true);
    setStatusMessage(null);

    const payloadAlerts = targetAlerts || alerts;

    try {
      const res = await fetch("/api/procurement/alerts/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: TARGET_EMAIL,
          webhookUrl: customWebhookUrl || undefined,
          alerts: payloadAlerts,
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        const timeStr = new Date().toLocaleTimeString();
        setLastDispatchedTime(timeStr);
        setStatusMessage(
          `n8n Workflow triggered! Alert summary dispatched to ${TARGET_EMAIL} at ${timeStr}`
        );
      } else {
        setStatusMessage(data.message || "Failed to trigger n8n workflow");
      }
    } catch (err: any) {
      setStatusMessage("Error connecting to automation service");
    } finally {
      setIsDispatching(false);
      setTimeout(() => {
        setStatusMessage(null);
      }, 6000);
    }
  };

  const dispatchSingleAlert = async (alert: ProcurementAlert) => {
    setDispatchedAlertId(alert.id);
    await triggerN8nWorkflow([alert]);
    setTimeout(() => {
      setDispatchedAlertId(null);
    }, 3000);
  };

  const getSeverityBadge = (severity: ProcurementAlert["severity"]) => {
    switch (severity) {
      case "Critical":
      case "High":
        return {
          icon: AlertOctagon,
          badgeClass: "bg-rose-100 text-rose-800 border border-rose-300 font-bold",
          cardBorder: "border-rose-200 hover:border-rose-300 bg-rose-50/40",
        };
      case "Medium":
        return {
          icon: AlertTriangle,
          badgeClass: "bg-amber-100 text-amber-800 border border-amber-300 font-bold",
          cardBorder: "border-amber-200 hover:border-amber-300 bg-amber-50/40",
        };
      case "Low":
      default:
        return {
          icon: Info,
          badgeClass: "bg-cyan-100 text-cyan-800 border border-cyan-300 font-bold",
          cardBorder: "border-cyan-200 hover:border-cyan-300 bg-cyan-50/40",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Procurement Alerts
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                {alerts.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Contract milestones, supplier delivery delays, and critical buffer inventory triggers
            </p>
          </div>
        </div>

        {/* n8n Automation Bar & Quick Trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Recipient Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-xs text-cyan-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
            <Mail className="w-3.5 h-3.5 text-cyan-700" />
            <span className="font-mono text-[11px] font-bold text-cyan-900">
              {TARGET_EMAIL}
            </span>
          </div>

          {/* Trigger Workflow Button */}
          <button
            type="button"
            onClick={() => triggerN8nWorkflow()}
            disabled={isDispatching || alerts.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all shadow-md shadow-cyan-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isDispatching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-white fill-current" />
            )}
            <span>{isDispatching ? "Triggering..." : "Trigger n8n Workflow"}</span>
          </button>

          {/* n8n Settings Modal Opener */}
          <button
            type="button"
            onClick={() => setIsConfigOpen(true)}
            title="n8n Automation Settings"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-300 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Status Toast Banner */}
      {statusMessage && (
        <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-medium animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Alerts List */}
      <div className="max-h-[520px] overflow-y-auto pr-1.5 custom-scrollbar space-y-3">
        {alerts.map((alert, idx) => {
          const config = getSeverityBadge(alert.severity);
          const Icon = config.icon;
          const isThisAlertDispatched = dispatchedAlertId === alert.id;

          return (
            <div
              key={alert.id || `alert_${idx}`}
              className={`rounded-xl border p-4 transition-all duration-200 shadow-xs ${config.cardBorder}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs ${config.badgeClass}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {alert.severity}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded border border-cyan-200">
                        {alert.relatedEntity}
                      </span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-slate-900 mb-2 leading-relaxed font-bold">
                      {alert.reason}
                    </p>

                    <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-700 font-bold shrink-0">Action:</span>
                      <span className="text-slate-800 font-medium">{alert.recommendedAction}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0">
                  {/* Dispatch Single Alert to Manager */}
                  <button
                    type="button"
                    onClick={() => dispatchSingleAlert(alert)}
                    disabled={isDispatching || isThisAlertDispatched}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                    title={`Trigger n8n workflow for this alert to ${TARGET_EMAIL}`}
                  >
                    {isThisAlertDispatched ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Send className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    <span>{isThisAlertDispatched ? "Sent to Manager" : "Dispatch (n8n)"}</span>
                  </button>

                  {/* View Entity Button */}
                  {onViewAlertEntity && (
                    <button
                      type="button"
                      onClick={() => onViewAlertEntity(alert)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 transition-all shadow-xs cursor-pointer"
                    >
                      <span>View Entity</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* n8n Configuration Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">
                    n8n Automation Settings
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Procurement SLA & automated email alert workflow
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConfigOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Procurement Manager Email (Recipient)
                </label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-slate-900 font-bold">
                  <Mail className="w-4 h-4 text-cyan-600" />
                  <span>{TARGET_EMAIL}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  External n8n Webhook URL (Optional / Test)
                </label>
                <input
                  type="url"
                  placeholder="https://n8n.your-instance.com/webhook/procurement-alerts"
                  value={customWebhookUrl}
                  onChange={(e) => setCustomWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-cyan-500 font-mono text-xs font-medium"
                />
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  If left blank, dispatches directly via ERP internal automation pipeline and `/api/procurement/alerts/webhook`.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-800 font-bold">
                  <span>n8n Polling / Webhook Endpoint</span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                    Active
                  </span>
                </div>
                <code className="block font-mono text-[11px] text-cyan-800 font-bold bg-white p-2 rounded border border-slate-200 break-all select-all">
                  GET/POST /api/procurement/alerts/webhook
                </code>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsConfigOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerN8nWorkflow();
                  setIsConfigOpen(false);
                }}
                disabled={isDispatching}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Test Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
