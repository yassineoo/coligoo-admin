"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import adminUsers, { User } from "@/app/api/usersmanagement";
import { LoaderComponent } from "../loader/Loader";

interface Moderator {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  permissions: string[];
  status: "Active" | "Blocked";
}

export default function Moderators() {
  const router = useRouter();
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [selectedModerators, setSelectedModerators] = useState<string[]>([]);
  const [hasData, setHasData] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  const fetchModerators = async () => {
    setLoading(true);
    setError(null);
    const t = toast.loading("Loading moderators...");
    try {
      const params = {
        page: currentPage,
        pageSize,
      };
      const res = await adminUsers.getModeratorUsers(params);
      const mapped = res.data.map(
        (user: User): Moderator => ({
          id: `#${user.id.toString().slice(-3).padStart(3, "0")}`,
          firstName: user.prenom || "",
          lastName: user.nom || "",
          phone: user.phoneNumber || "",
          email: user.email,
          permissions: user.permissions || [],
          status: user.blocked ? "Blocked" : "Active",
        })
      );
      setModerators(mapped);
      setTotal(res.meta.total || res.data.length);
      setLastPage(
        res.meta.totalPages || Math.ceil((res.meta.total || 0) / pageSize)
      );
      setSelectedModerators([]);
      toast.dismiss(t);
      toast.success("Moderators loaded successfully");
    } catch (err: any) {
      const msg = err.body?.message || "Failed to load moderators";
      toast.dismiss(t);
      toast.error(msg);
      setError(msg);
      setModerators([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerators();
  }, [currentPage, pageSize]);

  useEffect(() => {
    setHasData(moderators.length > 0);
  }, [moderators.length]);

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

  const toggleSelectAll = () => {
    if (selectedModerators.length === moderators.length) {
      setSelectedModerators([]);
    } else {
      setSelectedModerators(moderators.map((m) => m.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedModerators((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const isAllSelected = selectedModerators.length === moderators.length;
  const isSomeSelected =
    selectedModerators.length > 0 &&
    selectedModerators.length < moderators.length;

  const gotoPage = (p: number) => {
    if (p < 1 || p > lastPage) return;
    setCurrentPage(p);
  };

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  const handleBulkDelete = async () => {
    const selected = moderators.filter((m) =>
      selectedModerators.includes(m.id)
    );
    if (selected.length === 0) {
      toast.warning("No moderators selected");
      return;
    }
    if (!confirm(`Delete ${selected.length} moderators?`)) return;
    const t = toast.loading("Deleting...");
    try {
      const userIds = selected.map((m) =>
        parseInt(m.id.replace("#", ""), 10).toString()
      );
      await adminUsers.bulkDeleteUsers(userIds);
      toast.dismiss(t);
      toast.success(`Deleted ${selected.length} moderators`);
      setSelectedModerators([]);
      fetchModerators();
    } catch (err: any) {
      toast.dismiss(t);
      toast.error(err.body?.message || "Failed to delete");
    }
  };

  const handleBulkDeactivate = async () => {
    const selected = moderators.filter((m) =>
      selectedModerators.includes(m.id)
    );
    if (selected.length === 0) {
      toast.warning("No moderators selected");
      return;
    }
    if (!confirm(`Deactivate ${selected.length} moderators?`)) return;
    const t = toast.loading("Deactivating...");
    try {
      const userIds = selected.map((m) =>
        parseInt(m.id.replace("#", ""), 10).toString()
      );
      await adminUsers.bulkUpdateStatus({ ids: userIds, blocked: true });
      toast.dismiss(t);
      toast.success(`Deactivated ${selected.length} moderators`);
      setSelectedModerators([]);
      fetchModerators();
    } catch (err: any) {
      toast.dismiss(t);
      toast.error(err.body?.message || "Failed to deactivate");
    }
  };

  const handleBulkActivate = async () => {
    const selected = moderators.filter((m) =>
      selectedModerators.includes(m.id)
    );
    if (selected.length === 0) {
      toast.warning("No moderators selected");
      return;
    }
    if (!confirm(`Activate ${selected.length} moderators?`)) return;
    const t = toast.loading("Activating...");
    try {
      const userIds = selected.map((m) =>
        parseInt(m.id.replace("#", ""), 10).toString()
      );
      await adminUsers.bulkUpdateStatus({ ids: userIds, blocked: false });
      toast.dismiss(t);
      toast.success(`Activated ${selected.length} moderators`);
      setSelectedModerators([]);
      fetchModerators();
    } catch (err: any) {
      toast.dismiss(t);
      toast.error(err.body?.message || "Failed to activate");
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    setIsPageSizeOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <LoaderComponent isLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-[1028px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-[45px]">
          <h1
            className="text-[#292D32] text-2xl font-normal tracking-[0.505px]"
            style={{
              fontFamily:
                "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            {hasData ? "Moderators" : "No Moderators"}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleBulkDelete}
              disabled={!(isSomeSelected || isAllSelected)}
              className="flex items-center gap-2 px-3 py-2 rounded-[10px] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                width="17"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.3914 4.65498V4.10094C11.3914 3.3252 11.3914 2.93734 11.2404 2.64105C11.1076 2.38042 10.8957 2.16853 10.6351 2.03573C10.3388 1.88477 9.95094 1.88477 9.17521 1.88477H8.06712C7.29139 1.88477 6.90352 1.88477 6.60723 2.03573C6.34661 2.16853 6.13471 2.38042 6.00192 2.64105C5.85095 2.93734 5.85095 3.3252 5.85095 4.10094V4.65498M7.23606 8.46402V11.9268M10.0063 8.46402V11.9268M2.38818 4.65498H14.8541M13.469 4.65498V12.4116C13.469 13.5752 13.469 14.157 13.2426 14.6014C13.0434 14.9923 12.7256 15.3102 12.3346 15.5094C11.8902 15.7358 11.3084 15.7358 10.1448 15.7358H7.09755C5.93395 15.7358 5.35215 15.7358 4.90771 15.5094C4.51678 15.3102 4.19893 14.9923 3.99974 14.6014C3.77329 14.157 3.77329 13.5752 3.77329 12.4116V4.65498"
                  stroke="#292D32"
                  strokeWidth="1.03883"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="text-[#292D32] text-[11px] font-normal"
                style={{
                  fontFamily:
                    "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Delete
              </span>
            </button>

            <button
              onClick={handleBulkDeactivate}
              disabled={!(isSomeSelected || isAllSelected)}
              className="flex items-center gap-2 px-3 py-2 rounded-[10px] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.71476 2.14355C5.03476 2.14355 2.0481 5.13022 2.0481 8.81022C2.0481 12.4902 5.03476 15.4769 8.71476 15.4769C12.3948 15.4769 15.3814 12.4902 15.3814 8.81022C15.3814 5.13022 12.3948 2.14355 8.71476 2.14355ZM3.38143 8.81022C3.38143 5.86355 5.7681 3.47689 8.71476 3.47689C9.9481 3.47689 11.0814 3.89689 11.9814 4.60355L4.5081 12.0769C3.77585 11.1457 3.37892 9.99483 3.38143 8.81022ZM8.71476 14.1436C7.48143 14.1436 6.3481 13.7236 5.4481 13.0169L12.9214 5.54355C13.6537 6.47475 14.0506 7.62561 14.0481 8.81022C14.0481 11.7569 11.6614 14.1436 8.71476 14.1436Z"
                  fill="black"
                />
              </svg>
              <span
                className="text-[#292D32] text-[11px] font-normal"
                style={{
                  fontFamily:
                    "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Deactivate
              </span>
            </button>

            <button
              onClick={handleBulkActivate}
              disabled={!(isSomeSelected || isAllSelected)}
              className="flex items-center gap-2 px-3 py-2 rounded-[10px] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.83107 3.47754L2.4978 5.47754L4.83107 7.81087"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.4978 5.47754H10.1624C12.4567 5.47754 14.4052 7.35101 14.4946 9.64421C14.5891 12.0674 12.5868 14.1442 10.1624 14.1442H4.49727"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="text-[#292D32] text-[11px] font-normal"
                style={{
                  fontFamily:
                    "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Activate
              </span>
            </button>

            <button
              onClick={() => router.push("/dashboard/moderators/create")}
              className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[#FF5A01] border border-[#FF5A01] hover:bg-[#e65001] transition-colors"
            >
              <svg
                width="17"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.56094 8.39556V4.93279C9.56094 4.74911 9.48797 4.57296 9.35809 4.44308C9.22821 4.3132 9.05206 4.24023 8.86838 4.24023C8.68471 4.24023 8.50855 4.3132 8.37867 4.44308C8.24879 4.57296 8.17583 4.74911 8.17583 4.93279V8.39556H4.71306C4.52938 8.39556 4.35323 8.46852 4.22335 8.5984C4.09347 8.72828 4.02051 8.90443 4.02051 9.08811C4.02051 9.27179 4.09347 9.44794 4.22335 9.57782C4.35323 9.7077 4.52938 9.78066 4.71306 9.78066H8.17583V13.2434C8.17583 13.4271 8.24879 13.6033 8.37867 13.7331C8.50855 13.863 8.68471 13.936 8.86838 13.936C9.05206 13.936 9.22821 13.863 9.35809 13.7331C9.48797 13.6033 9.56094 13.4271 9.56094 13.2434V9.78066H13.0237C13.2074 9.78066 13.3835 9.7077 13.5134 9.57782C13.6433 9.44794 13.7163 9.27179 13.7163 9.08811C13.7163 8.90443 13.6433 8.72828 13.5134 8.5984C13.3835 8.46852 13.2074 8.39556 13.0237 8.39556H9.56094Z"
                  fill="white"
                />
              </svg>
              <span
                className="text-white text-[11px] font-normal"
                style={{
                  fontFamily:
                    "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Add moderator
              </span>
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
            <button onClick={fetchModerators} className="ml-2 underline">
              Retry
            </button>
          </div>
        ) : hasData ? (
          <div className="border border-[#D6D6D6] rounded-lg bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-[#FDF4FF] border-b border-[#D6D6D6]">
                    <th className="w-[40px] p-3 border-r border-[#EAECF0] bg-[#FCFCFD]">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={toggleSelectAll}
                          className="w-[15px] h-[15px] rounded border border-[#FF5A01] bg-[#F7FAFF] flex items-center justify-center"
                        >
                          {isSomeSelected && !isAllSelected && (
                            <svg
                              width="12"
                              height="11"
                              viewBox="0 0 12 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2.979 5.73047H9.03279"
                                stroke="#FF5A01"
                                strokeWidth="1.48256"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          {isAllSelected && (
                            <svg
                              width="10"
                              height="8"
                              viewBox="0 0 10 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 4L3.5 6.5L9 1"
                                stroke="#FF5A01"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left">
                      <span
                        className="text-[#292D32] text-sm font-normal"
                        style={{
                          fontFamily:
                            "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                        }}
                      >
                        ID
                      </span>
                    </th>
                    <th className="px-3 py-3 text-left">
                      <span
                        className="text-[#292D32] text-sm font-normal"
                        style={{
                          fontFamily:
                            "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                        }}
                      >
                        First name
                      </span>
                    </th>
                    <th className="px-3 py-3 text-left">
                      <span
                        className="text-[#292D32] text-sm font-normal"
                        style={{
                          fontFamily:
                            "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                        }}
                      >
                        Last name
                      </span>
                    </th>
                    <th className="px-3 py-3 text-left">
                      <span
                        className="text-[#292D32] text-sm font-normal"
                        style={{
                          fontFamily:
                            "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                        }}
                      >
                        Phone number
                      </span>
                    </th>
                    <th className="px-3 py-3 text-left">
                      <span
                        className="text-[#292D32] text-sm font-normal"
                        style={{
                          fontFamily:
                            "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                        }}
                      >
                        Email address
                      </span>
                    </th>
                    <th className="px-3 py-3 text-left">
                      <span
                        className="text-[#292D32] text-sm font-normal"
                        style={{
                          fontFamily:
                            "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                        }}
                      >
                        Permissions
                      </span>
                    </th>
                    <th className="px-3 py-3 text-left">
                      <span
                        className="text-[#292D32] text-sm font-normal"
                        style={{
                          fontFamily:
                            "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                        }}
                      >
                        Status
                      </span>
                    </th>
                    <th className="px-3 py-3 w-[50px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {moderators.map((moderator) => (
                    <tr
                      key={moderator.id}
                      className="border-b border-[#D6D6D6] last:border-b-0"
                    >
                      <td className="p-3 border-r border-[#EAECF0] bg-[#FCFCFD]">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => toggleSelect(moderator.id)}
                            className="w-[15px] h-[15px] rounded border border-[#FF5A01] bg-[#F7FAFF] flex items-center justify-center"
                          >
                            {selectedModerators.includes(moderator.id) && (
                              <svg
                                width="10"
                                height="8"
                                viewBox="0 0 10 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 4L3.5 6.5L9 1"
                                  stroke="#FF5A01"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className="text-[#292D32] text-sm font-normal"

                        >
                          {moderator.id}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className="text-[#292D32] text-sm font-normal"

                        >
                          {moderator.firstName}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className="text-[#292D32] text-sm font-normal"

                        >
                          {moderator.lastName}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className="text-[#292D32] text-sm font-normal"

                        >
                          {moderator.phone}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className="text-[#292D32] text-sm font-normal"

                        >
                          {moderator.email}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-wrap gap-2">
                          {moderator.permissions.map((permission, idx) => (
                            <button
                              key={idx}
                              className="px-3 py-1 rounded-full border border-[#4CAF50] text-[#4CAF50] text-xs font-normal hover:bg-green-50 transition-colors whitespace-nowrap"
                              style={{
                                fontFamily:
                                  "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                              }}
                            >
                              {permission}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-block px-4 py-1 rounded-full text-sm font-normal ${
                            moderator.status === "Active"
                              ? "bg-[#4CAF50] bg-opacity-20 text-[#fff]"
                              : "bg-[#FFE5E5] text-[#FF5A01]"
                          }`}

                        >
                          {moderator.status}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="10" cy="4" r="1.5" fill="#FF5A01" />
                            <circle cx="10" cy="10" r="1.5" fill="#FF5A01" />
                            <circle cx="10" cy="16" r="1.5" fill="#FF5A01" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                        onClick={() => handlePageSizeChange(10)}
                        className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                      >
                        10
                      </button>
                      <button
                        onClick={() => handlePageSizeChange(20)}
                        className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                      >
                        20
                      </button>
                      <button
                        onClick={() => handlePageSizeChange(50)}
                        className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                      >
                        50
                      </button>
                      <button
                        onClick={() => handlePageSizeChange(100)}
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
              <div className="text-lg text-gray-900">No moderators for now</div>
              <div className="text-sm text-gray-500 mt-2">
                Add your first moderator to get started.
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push("/dashboard/moderators/create")}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#FF5A01] rounded-lg hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Moderator
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
