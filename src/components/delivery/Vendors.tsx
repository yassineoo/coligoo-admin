"use client";

import React, { useState, useEffect, useRef } from "react";
import { VendorsTable, Vendor } from "./VendorsTable";
import { ActionButton } from "./ActionButton";
import { Trash2, Ban, RotateCcw, SlidersHorizontal, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "sonner";
import adminUsers, { User } from "@/app/api/usersmanagement";
import { LoaderComponent } from "../loader/Loader";

export default function Delivery() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [hasData, setHasData] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  const fetchDeliverymen = async () => {
    setLoading(true);
    setError(null);
    const t = toast.loading("Loading deliverymen...");
    try {
      const params = {
        page: currentPage,
        pageSize,
      };
      const res = await adminUsers.getDeliverymanUsers(params);
      const mapped = res.data.map(
        (user: User): Vendor => ({
          id: `#${user.id.toString().slice(-3).padStart(3, "0")}`,
          firstName: user.prenom || "",
          lastName: user.nom || "",
          phone: user.phoneNumber || "",
          email: user.email,
          storeName: user.fullName || "",
          hub: user.hubId ? `Hub ${user.hubId}` : "N/A",
          status: user.blocked ? "Inactive" : "Active",
          checked: false,
        })
      );
      setVendors(mapped);
      setTotal(res.meta.total || res.data.length);
      setLastPage(
        res.meta.totalPages || Math.ceil((res.meta.total || 0) / pageSize)
      );
      toast.dismiss(t);
      toast.success("Deliverymen loaded successfully");
    } catch (err: any) {
      const msg = err.body?.message || "Failed to load deliverymen";
      toast.dismiss(t);
      toast.error(msg);
      setError(msg);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliverymen();
  }, [currentPage, pageSize]);

  useEffect(() => {
    setHasData(vendors.length > 0);
  }, [vendors.length]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pageSizeRef.current &&
        !pageSizeRef.current.contains(event.target as Node)
      ) {
        setIsPageSizeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCheck = (id: string) => {
    setVendors(
      vendors.map((v) => (v.id === id ? { ...v, checked: !v.checked } : v))
    );
  };

  const toggleAll = () => {
    const allChecked = vendors.every((v) => v.checked);
    setVendors(vendors.map((v) => ({ ...v, checked: !allChecked })));
  };

  const allChecked = vendors.every((v) => v.checked);
  const isSomeChecked = vendors.some((v) => v.checked) && !allChecked;

  const gotoPage = (p: number) => {
    if (p < 1 || p > lastPage) return;
    setCurrentPage(p);
  };

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  const handleBulkDelete = async () => {
    const selected = vendors.filter((v) => v.checked);
    if (selected.length === 0) {
      toast.warning("No deliverymen selected");
      return;
    }
    if (!confirm(`Delete ${selected.length} deliverymen?`)) return;
    const t = toast.loading("Deleting...");
    try {
      const userIds = selected.map((v) =>
        parseInt(v.id.replace("#", ""), 10).toString()
      );
      await adminUsers.bulkDeleteUsers(userIds);
      toast.dismiss(t);
      toast.success(`Deleted ${selected.length} deliverymen`);
      fetchDeliverymen();
    } catch (err: any) {
      toast.dismiss(t);
      toast.error(err.body?.message || "Failed to delete");
    }
  };

  const handleBulkDeactivate = async () => {
    const selected = vendors.filter((v) => v.checked);
    if (selected.length === 0) {
      toast.warning("No deliverymen selected");
      return;
    }
    if (!confirm(`Deactivate ${selected.length} deliverymen?`)) return;
    const t = toast.loading("Deactivating...");
    try {
      const userIds = selected.map((v) =>
        parseInt(v.id.replace("#", ""), 10).toString()
      );
      await adminUsers.bulkUpdateStatus({ ids: userIds, blocked: true });
      toast.dismiss(t);
      toast.success(`Deactivated ${selected.length} deliverymen`);
      fetchDeliverymen();
    } catch (err: any) {
      toast.dismiss(t);
      toast.error(err.body?.message || "Failed to deactivate");
    }
  };

  const handleBulkActivate = async () => {
    const selected = vendors.filter((v) => v.checked);
    if (selected.length === 0) {
      toast.warning("No deliverymen selected");
      return;
    }
    if (!confirm(`Activate ${selected.length} deliverymen?`)) return;
    const t = toast.loading("Activating...");
    try {
      const userIds = selected.map((v) =>
        parseInt(v.id.replace("#", ""), 10).toString()
      );
      await adminUsers.bulkUpdateStatus({ ids: userIds, blocked: false });
      toast.dismiss(t);
      toast.success(`Activated ${selected.length} deliverymen`);
      fetchDeliverymen();
    } catch (err: any) {
      toast.dismiss(t);
      toast.error(err.body?.message || "Failed to activate");
    }
  };

  const paginatedVendors = vendors;

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <LoaderComponent isLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-[1262px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[#292D32] text-2xl font-medium tracking-[0.505px]">
            {hasData ? "Delivery man" : "No Delivery man"}
          </h1>

          <div className="flex items-center gap-4">
            <ActionButton
              icon={
                <img
                  src="/icons/trash-black.svg"
                  alt="Delete"
                  className="w-4 h-4"
                />
              }
              onClick={handleBulkDelete}
              disabled={!isSomeChecked && !allChecked}
            >
              Delete
            </ActionButton>

            <ActionButton
              icon={
                <img
                  src="/icons/forbidden.svg"
                  alt="Deactivate"
                  className="w-4 h-4"
                />
              }
              onClick={handleBulkDeactivate}
              disabled={!isSomeChecked && !allChecked}
            >
              Deactivate
            </ActionButton>

            <ActionButton
              icon={
                <img src="/icons/back.svg" alt="Activate" className="w-4 h-4" />
              }
              onClick={handleBulkActivate}
              disabled={!isSomeChecked && !allChecked}
            >
              Activate
            </ActionButton>

            <ActionButton
              icon={
                <img src="/icons/filter.svg" alt="Filter" className="w-4 h-4" />
              }
            >
              Filters
            </ActionButton>

            <ActionButton
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => router.push("/dashboard/delivery/create")}
            >
              Add Deliveryman
            </ActionButton>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
            <button onClick={fetchDeliverymen} className="ml-2 underline">
              Retry
            </button>
          </div>
        ) : hasData ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#D6D6D6] overflow-hidden">
            <div className="overflow-x-auto">
              <VendorsTable
                vendors={paginatedVendors}
                onToggleCheck={toggleCheck}
                onToggleAll={toggleAll}
                allChecked={allChecked}
              />
            </div>

            <div className="flex w-full justify-between items-center px-3 sm:px-[18px] py-3 border-t border-[#D6D6D6] bg-white">
              <div className="flex flex-1 w-full items-center justify-center gap-2 sm:gap-4">
                <button
                  onClick={() => gotoPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 sm:gap-2 hover:opacity-70 transition-opacity disabled:opacity-50"
                >
                  <svg
                    className="w-2 h-2.5 stroke-black stroke-[1.3px]"
                    width="6"
                    height="10"
                    viewBox="0 0 6 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.16553 8.9375L1.26363 5.0356L5.16553 1.1337"
                      stroke="black"
                      strokeWidth="1.30063"
                    />
                  </svg>
                  <span className="font-roboto text-[10px] font-medium text-black hidden sm:inline">
                    Previous
                  </span>
                </button>

                {pages.map((p) => (
                  <button
                    key={p}
                    onClick={() => gotoPage(p)}
                    className={cn(
                      "font-roboto font-medium transition-all",
                      p === currentPage
                        ? "min-w-[36px] sm:min-w-[48px] h-[26px] px-2 sm:px-3 flex items-center justify-center text-xs rounded-[6.5px] border border-black bg-white"
                        : "text-[10px] text-black hover:opacity-70"
                    )}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => gotoPage(Math.min(lastPage, currentPage + 1))}
                  disabled={currentPage === lastPage}
                  className="flex items-center gap-1 sm:gap-2 hover:opacity-70 transition-opacity disabled:opacity-50"
                >
                  <span className="font-roboto text-[10px] font-medium text-black hidden sm:inline">
                    Next
                  </span>
                  <svg
                    className="w-2 h-2.5 stroke-black stroke-[1.3px]"
                    width="6"
                    height="10"
                    viewBox="0 0 6 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.604492 9.18359L4.50639 5.28169L0.604492 1.37979"
                      stroke="black"
                      strokeWidth="1.30063"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div ref={pageSizeRef} className="relative">
                  <button
                    onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                    className="flex items-center px-2 sm:px-[11px] py-[8.3px] border border-[rgba(52,64,84,0.4)] rounded-[10px] hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-roboto text-[11px] font-medium text-[#344054] tracking-[0.346px] leading-[16.6px] mr-1">
                      {pageSize}
                    </span>
                    <svg
                      className="w-[17px] h-[17px]"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_609_30884)">
                        <path
                          d="M5.10742 6.55859L9.35742 10.8086L13.6074 6.55859"
                          stroke="#344054"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_609_30884">
                          <rect
                            width="17"
                            height="17"
                            fill="white"
                            transform="translate(0.857422 0.183594)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                  {isPageSizeOpen && (
                    <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded-[10px] shadow-lg z-10 min-w-[60px]">
                      <button
                        onClick={() => {
                          setPageSize(10);
                          setCurrentPage(1);
                          setIsPageSizeOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                      >
                        10
                      </button>
                      <button
                        onClick={() => {
                          setPageSize(20);
                          setCurrentPage(1);
                          setIsPageSizeOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                      >
                        20
                      </button>
                      <button
                        onClick={() => {
                          setPageSize(50);
                          setCurrentPage(1);
                          setIsPageSizeOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                      >
                        50
                      </button>
                      <button
                        onClick={() => {
                          setPageSize(100);
                          setCurrentPage(1);
                          setIsPageSizeOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                      >
                        100
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-100 h-[420px] flex items-center justify-center">
            <div className="text-center max-w-md">
              <img
                src="/images/empty.png"
                alt="Empty illustration"
                className="w-56 h-44 mx-auto object-contain mb-6"
              />
              <div className="text-lg text-gray-900">
                No deliverymen for now
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Add your first deliveryman to get started.
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push("/dashboard/delivery/create")}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#FF5A01] rounded-lg hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Delivery man
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
