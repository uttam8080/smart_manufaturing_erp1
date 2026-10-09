"use client";

import React, { useState } from "react";
import { LeaveRequestRecord, LeaveStatus } from "@/types/workforce";
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle, Eye, Check, X } from "lucide-react";
import { LeaveRejectionModal } from "./leave-rejection-modal";

interface LeaveRequestsProps {
  requests: LeaveRequestRecord[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
}

export function LeaveRequests({ requests, onApprove, onReject }: LeaveRequestsProps) {
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedRequestForDetails, setSelectedRequestForDetails] = useState<LeaveRequestRecord | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<LeaveRequestRecord | null>(null);

  const filtered = requests.filter((r) => {
    if (filterStatus === "All") return true;
    return r.status === filterStatus;
  });

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
    }
  };

  const getLeaveTypeBadge = (type: LeaveRequestRecord["leaveType"]) => {
    switch (type) {
      case "Sick":
        return <span className="px-2 py-0.5 rounded-lg text-[11px] bg-rose-50 text-rose-800 border border-rose-300 font-bold">Sick</span>;
      case "Casual":
        return <span className="px-2 py-0.5 rounded-lg text-[11px] bg-cyan-50 text-cyan-800 border border-cyan-300 font-bold">Casual</span>;
      case "Earned":
        return <span className="px-2 py-0.5 rounded-lg text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">Earned</span>;
      case "Emergency":
        return <span className="px-2 py-0.5 rounded-lg text-[11px] bg-amber-50 text-amber-800 border border-amber-300 font-bold">Emergency</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Leave Requests</h3>
              <p className="text-xs text-slate-600 font-medium">Employee leave applications, schedule coverage & approval workflows</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {pendingCount > 0 && (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {pendingCount} Awaiting Decision
              </span>
            )}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-600"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Req ID</th>
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Leave Type</th>
                <th className="py-3 px-3">Dates</th>
                <th className="py-3 px-3 text-center">Days</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-medium">
                    No leave requests match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-cyan-800">{item.requestId}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      <div>{item.employeeName}</div>
                      <div className="text-[10px] text-slate-500 font-mono font-medium">{item.employeeId}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {item.department}
                      </span>
                    </td>
                    <td className="py-3 px-3">{getLeaveTypeBadge(item.leaveType)}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-700 font-medium">
                      <div>{item.startDate}</div>
                      <div className="text-[10px] text-slate-500">to {item.endDate}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{item.daysCount} d</td>
                    <td className="py-3 px-3 max-w-xs text-slate-700 font-medium text-[11px] leading-relaxed">
                      <div className="line-clamp-2" title={item.reason}>{item.reason}</div>
                      {item.rejectionReason && (
                        <div className="mt-1 text-[10px] text-rose-700 font-bold italic line-clamp-1" title={item.rejectionReason}>
                          Rejection: {item.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRequestForDetails(item)}
                          title="View Request Details"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-cyan-800 border border-slate-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {item.status === "Pending" && (
                          <>
                            <button
                              onClick={() => onApprove(item.id)}
                              title="Approve Leave"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setRejectingRequest(item)}
                              title="Reject Leave"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details View Modal */}
      {selectedRequestForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Leave Request Details</h3>
              <span className="font-mono text-xs text-cyan-800 font-bold">{selectedRequestForDetails.requestId}</span>
            </div>
            <div className="space-y-2.5 text-xs text-slate-800">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Employee:</span>
                <span className="font-bold text-slate-900">{selectedRequestForDetails.employeeName} ({selectedRequestForDetails.employeeId})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Department:</span>
                <span className="font-bold text-slate-900">{selectedRequestForDetails.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Leave Type:</span>
                <span className="font-bold text-slate-900">{selectedRequestForDetails.leaveType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Duration:</span>
                <span className="font-bold text-slate-900">{selectedRequestForDetails.startDate} to {selectedRequestForDetails.endDate} ({selectedRequestForDetails.daysCount} days)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Applied On:</span>
                <span className="font-bold text-slate-900">{selectedRequestForDetails.appliedDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Status:</span>
                <div>{getStatusBadge(selectedRequestForDetails.status)}</div>
              </div>
              <div className="pt-1">
                <span className="text-slate-600 font-medium block mb-1">Employee Reason:</span>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 italic">
                  &ldquo;{selectedRequestForDetails.reason}&rdquo;
                </div>
              </div>
              {selectedRequestForDetails.rejectionReason && (
                <div className="pt-1">
                  <span className="text-rose-800 font-bold block mb-1">Rejection Reason:</span>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                    &ldquo;{selectedRequestForDetails.rejectionReason}&rdquo;
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedRequestForDetails(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <LeaveRejectionModal
        request={rejectingRequest}
        isOpen={!!rejectingRequest}
        onClose={() => setRejectingRequest(null)}
        onConfirmReject={onReject}
      />
    </div>
  );
}
