"use client";

import { Edit, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

export interface Vendor {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  storeName: string;
  hub: string;
  status: "Active" | "Inactive";
  checked?: boolean;
}

interface VendorsTableProps {
  vendors: Vendor[];
  onToggleCheck?: (id: string) => void;
  onToggleAll?: () => void;
  allChecked?: boolean;
}

export function VendorsTable({
  vendors,
  onToggleCheck,
  onToggleAll,
  allChecked,
}: VendorsTableProps) {
  const router = useRouter();

  return (
    <div className="w-full rounded-lg border border-[#D6D6D6] bg-white overflow-hidden">
      <div className="flex items-center h-[42px] px-0 border-b border-[#D6D6D6] bg-[#FDF4FF]">
        <div className="flex items-center justify-center w-[40px] h-[42px] border-r border-[#EAECF0] bg-[#FCFCFD]">
          <button
            onClick={onToggleAll}
            className="flex items-center justify-center"
          >
            <div className="w-[14.826px] h-[14.826px] flex items-center justify-center rounded border border-primary bg-[#F7FAFF]">
              <Minus className="w-2.5 h-2.5 text-primary" strokeWidth={2} />
            </div>
          </button>
        </div>

        <div className="flex items-center gap-0.5 flex-1 px-[44px]">
          <div className="flex items-center justify-center w-[70px] px-3">
            <span className="text-[#292D32] text-sm font-normal">ID</span>
          </div>
          <div className="flex items-center justify-center w-[100px] px-3">
            <span className="text-[#292D32] text-sm font-normal">
              First name
            </span>
          </div>
          <div className="flex items-center justify-center w-[100px] px-3">
            <span className="text-[#292D32] text-sm font-normal">
              Last name
            </span>
          </div>
          <div className="flex items-center justify-center w-[150px] px-3">
            <span className="text-[#292D32] text-sm font-normal">
              Phone number
            </span>
          </div>
          <div className="flex items-center justify-center w-[150px] px-3">
            <span className="text-[#292D32] text-sm font-normal">
              Email address
            </span>
          </div>
          <div className="flex items-center justify-center w-[140px] px-3">
            <span className="text-[#292D32] text-sm font-normal">
              Store name
            </span>
          </div>
          <div className="flex items-center justify-center w-[96px] px-3">
            <span className="text-[#292D32] text-sm font-normal">Hub</span>
          </div>
          <div className="flex items-center justify-center w-[100px] px-3">
            <span className="text-[#292D32] text-sm font-normal">Statut</span>
          </div>
        </div>
      </div>

      {vendors.map((vendor) => (
        <div
          key={vendor.id}
          className="flex items-center h-[52px] border-b border-[#D6D6D6] last:border-b-0 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-center w-[40px] h-full border-r border-[#EAECF0] bg-[#FCFCFD]">
            <button
              onClick={() => onToggleCheck?.(vendor.id)}
              className="flex items-center justify-center"
            >
              <div
                className={`w-[14.826px] h-[14.826px] flex items-center justify-center rounded border ${
                  vendor.checked
                    ? "border-primary bg-primary"
                    : "border-gray-300 bg-white"
                }`}
              >
                {vendor.checked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>

          <div className="flex items-center gap-0.5 flex-1 px-[44px]">
            <div className="flex items-center justify-center w-[70px] px-3">
              <span className="text-[#292D32] text-sm font-normal">
                {vendor.id}
              </span>
            </div>
            <div className="flex items-center justify-center w-[100px] px-3">
              <span className="text-[#292D32] text-sm font-normal">
                {vendor.firstName}
              </span>
            </div>
            <div className="flex items-center justify-center w-[100px] px-3">
              <span className="text-[#292D32] text-sm font-normal">
                {vendor.lastName}
              </span>
            </div>
            <div className="flex items-center justify-center w-[150px] px-3">
              <span className="text-[#292D32] text-sm font-normal">
                {vendor.phone}
              </span>
            </div>
            <div className="flex items-center justify-center w-[150px] px-3">
              <span className="text-[#292D32] text-sm font-normal truncate">
                {vendor.email}
              </span>
            </div>
            <div className="flex items-center justify-center w-[140px] px-3">
              <span className="text-[#292D32] text-sm font-normal">
                {vendor.storeName}
              </span>
            </div>
            <div className="flex items-center justify-center w-[96px] px-3">
              <span className="text-[#292D32] text-sm font-normal">
                {vendor.hub}
              </span>
            </div>
            <div className="flex items-center justify-center w-[100px] px-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-normal ${
                  vendor.status === "Active"
                    ? "bg-[#D1FAE5] text-[#065F46]"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {vendor.status}
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push(`/vendors/edit/${vendor.id}`)}
            className="flex items-center justify-center w-[28px] h-[28px] rounded-lg bg-[#FF5A01]/20 hover:bg-[#FF5A01]/40 transition-colors mr-4"
          >
            <img src="/icons/edit.svg" alt="Delete" className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
