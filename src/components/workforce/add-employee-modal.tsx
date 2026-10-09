"use client";

import React, { useState } from "react";
import {
  DepartmentName,
  DesignationName,
  ShiftName,
  EmployeeStatus,
  EmployeeItem,
} from "@/types/workforce";
import { X, UserPlus, AlertCircle } from "lucide-react";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: EmployeeItem) => void;
  existingCount: number;
}

const DEPARTMENTS: DepartmentName[] = [
  "Production",
  "Packaging",
  "Quality",
  "Maintenance",
  "Inventory",
  "Procurement",
  "Finance",
  "HR",
  "Operations",
];

const DESIGNATIONS: DesignationName[] = [
  "Production Operator",
  "Machine Operator",
  "Quality Inspector",
  "Maintenance Technician",
  "Warehouse Executive",
  "Procurement Executive",
  "Production Supervisor",
  "Quality Supervisor",
  "Maintenance Manager",
  "HR Executive",
];

const SHIFTS: ShiftName[] = [
  "Morning Shift",
  "General Shift",
  "Evening Shift",
  "Night Shift",
];

const STATUSES: EmployeeStatus[] = ["Active", "On Leave", "Inactive"];

export function AddEmployeeModal({
  isOpen,
  onClose,
  onAddEmployee,
  existingCount,
}: AddEmployeeModalProps) {
  const nextIdNum = 100 + existingCount + 1;
  const [employeeId, setEmployeeId] = useState(`EMP-${nextIdNum}`);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<DepartmentName>("Production");
  const [designation, setDesignation] = useState<DesignationName>("Production Operator");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split("T")[0]);
  const [shift, setShift] = useState<ShiftName>("Morning Shift");
  const [status, setStatus] = useState<EmployeeStatus>("Active");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter employee full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid factory email address.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter contact phone number.");
      return;
    }

    const newEmployee: EmployeeItem = {
      id: `emp_${Date.now()}`,
      employeeId: employeeId.trim() || `EMP-${nextIdNum}`,
      name: name.trim(),
      department,
      designation,
      shift,
      phone: phone.trim(),
      email: email.trim(),
      joiningDate,
      status,
      todayAttendance: status === "Active" ? "Present" : "Leave",
      checkInTime: status === "Active" ? "08:30 AM" : undefined,
      productivityScore: 90.0,
      presentDaysCount: 1,
      absentDaysCount: 0,
      leaveDaysCount: 0,
      lateArrivalsCount: 0,
      attendanceRate: 100.0,
      unitsProducedToday: department === "Production" || department === "Packaging" ? 1200 : 0,
      qualityPassRate: 98.0,
      overtimeHoursMonth: 0,
    };

    onAddEmployee(newEmployee);
    onClose();
    // Reset
    setName("");
    setEmail("");
    setPhone("");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200">
          <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add New Factory Employee</h3>
            <p className="text-xs text-slate-600 font-medium">Register employee profile, department allocation & initial shift assignment</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-800 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Employee ID <span className="text-cyan-700">*</span>
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. EMP-113"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-cyan-700">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="e.g. Aakash Verma"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department <span className="text-cyan-700">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentName)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Designation <span className="text-cyan-700">*</span>
              </label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value as DesignationName)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white"
              >
                {DESIGNATIONS.map((desig) => (
                  <option key={desig} value={desig}>
                    {desig}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Work Email <span className="text-cyan-700">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aakash.v@factory.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number <span className="text-cyan-700">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98450 12345"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Joining Date
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Shift <span className="text-cyan-700">*</span>
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as ShiftName)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white"
              >
                {SHIFTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Employment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
