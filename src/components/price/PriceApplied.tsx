"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/interface/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/interface/select";
import { toast } from "sonner";
import shippingFees, { ShippingFee } from "@/app/api/shippingfees";
import wilayaApi from "@/app/api/wilaya";
import { LoaderComponent } from "../loader/Loader";
import AddEditShippingFeeModal from "./AddEditShippingFeeModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import OtherFeesComponent from "./OtherFees";

type DeliveryPrice = {
  id: string;
  number: string;
  direction: string;
  homeDelivery: string;
  stopdesk: string;
  returned: string;
  lastUpdate: string;
  selected: boolean;
};

export default function PriceApplied() {
  const [currentActiveTab, setCurrentActiveTab] = useState<
    "delivery" | "other"
  >("delivery");
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const deliveryTabRef = useRef<HTMLButtonElement>(null);
  const otherTabRef = useRef<HTMLButtonElement>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [itemsPerPageCount, setItemsPerPageCount] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [feeBeingEdited, setFeeBeingEdited] = useState<ShippingFee | null>(
    null
  );
  const [selectedWilayaName, setSelectedWilayaName] = useState("Alger");
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<string>("");
  const [wilayaList, setWilayaList] = useState<any[]>([]);
  const [wilayaNameMap, setWilayaNameMap] = useState<Record<string, string>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shippingFeesList, setShippingFeesList] = useState<ShippingFee[]>([]);
  const [deliveryPriceList, setDeliveryPriceList] = useState<DeliveryPrice[]>(
    []
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  useEffect(() => {
    const updateUnderline = () => {
      if (currentActiveTab === "delivery" && deliveryTabRef.current) {
        setUnderlineLeft(deliveryTabRef.current.offsetLeft);
        setUnderlineWidth(deliveryTabRef.current.clientWidth);
      } else if (currentActiveTab === "other" && otherTabRef.current) {
        setUnderlineLeft(otherTabRef.current.offsetLeft);
        setUnderlineWidth(otherTabRef.current.clientWidth);
      }
    };

    updateUnderline();
  }, [currentActiveTab]);

  useEffect(() => {
    const fetchWilayaList = async () => {
      try {
        const data = await wilayaApi.getWilayas();
        setWilayaList(data);
        const nameMap: Record<string, string> = {};
        data.forEach((w: any) => {
          nameMap[w.code] = w.name;
        });
        setWilayaNameMap(nameMap);
        if (data.length > 0 && !selectedWilayaCode) {
          const defaultWilaya = data[0];
          setSelectedWilayaName(defaultWilaya.name);
          setSelectedWilayaCode(defaultWilaya.code);
        }
      } catch (err: any) {
        toast.error("Failed to load wilayas");
        setErrorMessage("Failed to load wilayas");
      }
    };
    fetchWilayaList();
  }, []);

  const fetchShippingFees = async () => {
    if (!selectedWilayaCode) return;
    setIsLoading(true);
    setErrorMessage(null);
    const toastId = toast.loading("Loading shipping fees...");
    try {
      const response = await shippingFees.getAllShippingFees({
        fromWilayaCode: selectedWilayaCode,
        page: currentPageNumber,
        limit: itemsPerPageCount,
      });
      setShippingFeesList(response.data);
      setTotalPageCount(response.meta.totalPages || 1);
      const mappedList = response.data.map((fee: ShippingFee) => ({
        id: fee.id,
        number: fee.fromWilayaCode,
        direction: `${
          wilayaNameMap[fee.fromWilayaCode] || fee.fromWilayaCode
        } → ${wilayaNameMap[fee.toWilayaCode] || fee.toWilayaCode}`,
        stopdesk: `${fee.desktopPrice} da`,
        returned: `${fee.returnPrice} da`,
        homeDelivery: `${fee.homePrice} da`,
        lastUpdate: fee.updatedAt
          ? new Date(fee.updatedAt).toLocaleDateString("en-GB")
          : new Date().toLocaleDateString("en-GB"),
        selected: false,
      }));
      setDeliveryPriceList(mappedList);
      toast.dismiss(toastId);
      toast.success("Shipping fees loaded");
    } catch (err: any) {
      toast.dismiss(toastId);
      const errorMsg = err.body?.message || "Failed to load shipping fees";
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wilayaNameMap && selectedWilayaCode) {
      fetchShippingFees();
    }
  }, [selectedWilayaCode, currentPageNumber, itemsPerPageCount, wilayaNameMap]);

  const toggleDeliverySelection = (feeId: string) => {
    setDeliveryPriceList((prevList) =>
      prevList.map((item) =>
        item.id === feeId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleAllDelivery = () => {
    const allSelected = deliveryPriceList.every((item) => item.selected);
    setDeliveryPriceList((prevList) =>
      prevList.map((item) => ({ ...item, selected: !allSelected }))
    );
  };

  const handleAddNewPrice = () => {
    setIsInEditMode(false);
    setFeeBeingEdited(null);
    setIsModalVisible(true);
  };

  const handleEdit = (fee: ShippingFee) => {
    setFeeBeingEdited(fee);
    setIsInEditMode(true);
    setIsModalVisible(true);
  };

  const openDeleteModal = (ids: string[]) => {
    setDeletingIds(ids);
    setShowDeleteModal(true);
  };

  const handleSingleDelete = (feeId: string) => {
    openDeleteModal([feeId]);
  };

  const handleBulkDelete = () => {
    const selectedItems = deliveryPriceList.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      toast.warning("No items selected");
      return;
    }
    openDeleteModal(selectedItems.map((item) => item.id));
  };

  const handleDeleteConfirm = async () => {
    if (deletingIds.length === 0) return;
    try {
      await Promise.all(
        deletingIds.map((id) => shippingFees.deleteShippingFee(id))
      );
      toast.success(
        `Deleted ${deletingIds.length} item${
          deletingIds.length > 1 ? "s" : ""
        } successfully`
      );
      fetchShippingFees();
    } catch (err: any) {
      toast.error(err.body?.message || "Failed to delete");
    } finally {
      setShowDeleteModal(false);
      setDeletingIds([]);
    }
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setDeletingIds([]);
  };

  const displayPriceList = deliveryPriceList;

  const pageNumberList = [];
  const startPageNumber = Math.max(1, currentPageNumber - 2);
  for (let i = 0; i < 5; i++) {
    const pageNumber = startPageNumber + i;
    if (pageNumber <= totalPageCount) {
      pageNumberList.push(pageNumber);
    }
  }

  const deleteTitle = `Are you sure you want to delete ${
    deletingIds.length
  } item${deletingIds.length > 1 ? "s" : ""}?`;
  const deleteDescription = "This action cannot be undone";

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative flex items-start gap-9 mb-6">
          <button
            ref={deliveryTabRef}
            onClick={() => setCurrentActiveTab("delivery")}
            className={`flex flex-col items-end gap-2 transition-colors duration-300 ${
              currentActiveTab === "delivery"
                ? "text-[#FF5901]"
                : "text-black hover:text-[#FF5901]"
            }`}
          >
            <span className="text-xl py-1 font-medium tracking-[0.505px]">
              Delivery price
            </span>
          </button>
          <button
            ref={otherTabRef}
            onClick={() => setCurrentActiveTab("other")}
            className={`flex flex-col items-end gap-2 transition-colors duration-300 ${
              currentActiveTab === "other"
                ? "text-[#FF5901]"
                : "text-black hover:text-[#FF5901]"
            }`}
          >
            <span className="text-xl py-1 font-medium tracking-[0.505px]">
              Other fees
            </span>
          </button>
          <div
            className="absolute bottom-0 left-0 h-[2.7px] bg-[#FF5A01] rounded-t-[10px] transition-all duration-300 ease-in-out"
            style={{
              left: `${underlineLeft}px`,
              width: `${underlineWidth}px`,
            }}
          />
        </div>
        {currentActiveTab === "delivery" && (
          <div className="flex justify-end items-center gap-4 mb-6">
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-2 rounded-[10px]"
            >
              <img
                src={"/icons/trash-black.svg"}
                alt="Delete"
                className="w-4 h-4"
              />
              <span className="text-[11px] font-medium text-[#292D32] tracking-[0.346px]">
                Delete
              </span>
            </button>
            <button
              onClick={handleAddNewPrice}
              className="flex items-center gap-2 px-3 py-2 rounded-[10px] border border-[#FF5A01] bg-[#FF5A01]"
            >
              <span className="text-xs font-medium text-white tracking-[0.346px]">
                +{" "}
              </span>
              <span className="text-xs font-medium text-white tracking-[0.346px]">
                Add new price
              </span>
            </button>
          </div>
        )}
        {currentActiveTab === "delivery" && (
          <div className="border border-[#D6D6D6] rounded-lg overflow-hidden bg-white">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#D6D6D6]">
              <h2 className="text-xl font-medium text-[#424242] tracking-[0.505px] capitalize">
                Delivery Pricing By Wilaya Select
              </h2>
              <Select
                value={selectedWilayaName}
                onValueChange={(value) => {
                  const code =
                    wilayaList.find((w: any) => w.name === value)?.code || "";
                  setSelectedWilayaCode(code);
                  setSelectedWilayaName(value);
                }}
              >
                <SelectTrigger className="w-[174px] h-[46px] rounded-[10px] border border-[rgba(52,64,84,0.4)] shadow-[0_1px_2px_0_rgba(228,229,231,0.24)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {wilayaList.map((w: any) => (
                    <SelectItem key={w.code} value={w.name}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FDF4FF] border-b border-[#D6D6D6]">
                  <tr>
                    <th className="w-10 p-3 border-r border-[#EAECF0] bg-[#FCFCFD]">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={toggleAllDelivery}
                          className="w-[15px] h-[15px] rounded border border-[#FF5A01] bg-[#F7FAFF] flex items-center justify-center"
                        >
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 11 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.479 5.73047H8.53279"
                              stroke="#FF5A01"
                              strokeWidth="1.48256"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-normal text-black">
                      Number
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-normal text-black">
                      Direction
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-normal text-black">
                      Stopdesk
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-normal text-black">
                      Returned
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-normal text-black">
                      Home Delivery
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-normal text-black">
                      Last Update
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-normal text-black">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8">
                        <div className="flex justify-center w-full items-center p-10">
                          <LoaderComponent isLoading />
                        </div>
                      </td>
                    </tr>
                  ) : errorMessage ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-red-500">
                        Error: {errorMessage}
                      </td>
                    </tr>
                  ) : displayPriceList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        No shipping fees found.
                      </td>
                    </tr>
                  ) : (
                    displayPriceList.map((item) => (
                      <tr key={item.id} className="border-b border-[#D6D6D6]">
                        <td className="p-3 border-r border-[#EAECF0] bg-white">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => toggleDeliverySelection(item.id)}
                              className={`w-[15px] h-[15px] rounded border border-[#FF5A01] flex items-center justify-center ${
                                item.selected ? "bg-[#FF5A01]" : "bg-white"
                              }`}
                            >
                              {item.selected && (
                                <svg
                                  width="10"
                                  height="8"
                                  viewBox="0 0 10 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1 4L3.5 6.5L9 1"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-black">
                          {item.number}
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-black">
                          {item.direction}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <span className="px-3 py-1 rounded-md bg-[#DBEAFE] text-[#1E40AF] text-sm">
                              {item.stopdesk}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <span className="px-3 py-1 rounded-md bg-[#FEE2E2] text-[#991B1B] text-sm">
                              {item.returned}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <span className="px-3 py-1 rounded-md bg-[#DBEAFE] text-[#1E40AF] text-sm">
                              {item.homeDelivery}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-black">
                          {item.lastUpdate}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                const fee = shippingFeesList.find(
                                  (f) => f.id === item.id
                                );
                                if (fee) handleEdit(fee);
                              }}
                              className="w-[26.22px] h-[26.22px] rounded-[7.44px] bg-[#FED7AA] flex items-center justify-center"
                            >
                              <img src="/icons/edit.svg" alt="Edit" />
                            </button>
                            <button
                              onClick={() => handleSingleDelete(item.id)}
                              className="w-[26.22px] h-[26.22px] rounded-[7.44px] bg-[#FECACA] flex items-center justify-center"
                            >
                              <img src="/icons/trash.svg" alt="Delete" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4 px-6 border-t border-[#D6D6D6]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setCurrentPageNumber((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPageNumber <= 1}
                  className="text-[#292D32] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ‹ Précedent
                </button>
                <div className="flex items-center gap-2">
                  {pageNumberList.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPageNumber(pageNumber)}
                      className={`w-8 h-8 rounded flex items-center justify-center text-sm transition-colors ${
                        currentPageNumber === pageNumber
                          ? "bg-[#292D32] text-white"
                          : "text-[#292D32] hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPageNumber((p) => Math.min(totalPageCount, p + 1))
                  }
                  disabled={currentPageNumber >= totalPageCount}
                  className="text-[#292D32] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prochaine ›
                </button>
              </div>
              <select
                className="w-20 h-8 text-sm border border-input rounded-md bg-background px-2"
                value={itemsPerPageCount}
                onChange={(e) => {
                  setItemsPerPageCount(Number(e.target.value));
                  setCurrentPageNumber(1);
                }}
              >
                <option value={5}>05</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        )}
        {currentActiveTab === "other" && <OtherFeesComponent />}
        <AddEditShippingFeeModal
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          isEditing={isInEditMode}
          editingFee={feeBeingEdited}
          fromWilayaCode={selectedWilayaCode}
          wilayas={wilayaList}
          onSave={fetchShippingFees}
        />
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleDeleteClose}
          onConfirm={handleDeleteConfirm}
          title={deleteTitle}
          description={deleteDescription}
        />
      </div>
    </div>
  );
}
