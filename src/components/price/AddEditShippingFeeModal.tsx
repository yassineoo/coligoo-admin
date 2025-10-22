"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/interface/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cva } from "class-variance-authority";
import shippingFees, {
  ShippingFee,
  ShippingZone,
  UpdateShippingFeePayload,
  ShippingFeePayload,
  BulkCreateZonesPayload,
} from "@/app/api/shippingfees";
import wilayaApi from "@/app/api/wilaya";

interface City {
  id: number;
  name: string;
  ar_name?: string;
}

interface Wilaya {
  code: string;
  name: string;
  ar_name: string;
}

type ZoneGroup = {
  id: string;
  title: string;
  price: number;
  cities: number[];
};

interface PillProps {
  children: React.ReactNode;
  muted?: boolean;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLElement>) => void;
  onRemove?: () => void;
  isSelected?: boolean;
  onToggle?: () => void;
}

function Pill({
  children,
  muted = false,
  draggable = false,
  onDragStart,
  onRemove,
  isSelected = false,
  onToggle,
}: PillProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-sm transition-all duration-200 select-none ${
        isSelected
          ? "bg-blue-500 border-2 border-blue-400 text-white font-medium shadow-md"
          : muted
          ? "bg-gray-100 text-gray-600"
          : "border border-gray-300 text-gray-600"
      } ${draggable ? "cursor-move hover:scale-105" : "cursor-pointer"}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onToggle}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="mr-2 h-4 w-4 rounded border-gray-300 bg-white text-blue-500 focus:ring-blue-500 cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      />
      <span>{children}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-2 text-red-600 text-xs font-bold hover:text-red-500 transition-colors"
          aria-label={`Remove ${children}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

const tabButtonVariants = cva(
  "relative group flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer border-b-2",
  {
    variants: {
      variant: {
        default: "",
        special: "",
      },
      isActive: {
        true: "",
        false:
          "border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        isActive: true,
        className: "text-gray-900 border-[#FF5A01] bg-gray-50",
      },
      {
        variant: "special",
        isActive: true,
        className: "text-cyan-800 border-cyan-600 bg-cyan-50",
      },
    ],
  }
);

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
  onDelete?: () => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  variant?: "default" | "special";
  count: number;
}

function TabButton({
  title,
  isActive,
  onClick,
  onDelete,
  onDrop,
  onDragOver,
  variant = "default",
  count,
}: TabButtonProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={tabButtonVariants({ variant, isActive })}
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <span>{title}</span>
      <span
        className={`px-2 py-0.5 text-xs rounded-full ${
          isActive
            ? variant === "default"
              ? "bg-[#FF5A01] text-white"
              : "bg-cyan-600 text-white"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {count}
      </span>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-1 right-1 text-gray-400 rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 transition-opacity"
          aria-label={`Delete ${title}`}
        >
          ×
        </button>
      )}
    </motion.div>
  );
}

interface RemainingCitiesTabContentProps {
  cities: City[];
  handleDragStart: (
    cityId: number
  ) => (e: React.DragEvent<HTMLElement>) => void;
  selectedCities: ReadonlySet<number>;
  onToggleCity: (cityId: number) => void;
}

function RemainingCitiesTabContent({
  cities,
  handleDragStart,
  selectedCities,
  onToggleCity,
}: RemainingCitiesTabContentProps) {
  return (
    <div className="p-2">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 px-2">
        Unassigned Cities
      </h3>
      <div className="h-80 overflow-y-auto p-2 rounded-lg bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          {cities.map((city) => (
            <Pill
              key={`remaining-${city.id}`}
              draggable
              onDragStart={handleDragStart(city.id)}
              isSelected={selectedCities.has(city.id)}
              onToggle={() => onToggleCity(city.id)}
            >
              {city.name}
            </Pill>
          ))}
          {cities.length === 0 && (
            <span className="text-gray-500 text-sm italic p-4 w-full text-center">
              All cities have been assigned to a zone.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface ZoneGroupTabContentProps {
  zoneGroup: ZoneGroup;
  cities: City[];
  onRemoveCity: (cityId: number) => void;
  handleDragStart: (
    cityId: number
  ) => (e: React.DragEvent<HTMLElement>) => void;
  handleDropToGroup: (e: React.DragEvent<HTMLDivElement>) => void;
  dragOver: boolean;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  editingGroupId: string | null;
  editingTitle: string;
  onEditingTitleChange: (value: string) => void;
  editingPrice: number;
  onEditingPriceChange: (value: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  selectedCities: ReadonlySet<number>;
  onToggleCity: (cityId: number) => void;
}

function ZoneGroupTabContent({
  zoneGroup,
  cities,
  onRemoveCity,
  handleDragStart,
  handleDropToGroup,
  dragOver,
  onDragEnter,
  onDragLeave,
  editingGroupId,
  editingTitle,
  onEditingTitleChange,
  editingPrice,
  onEditingPriceChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  selectedCities,
  onToggleCity,
}: ZoneGroupTabContentProps) {
  const localIsEditing = editingGroupId === zoneGroup.id;
  const cityMap = useMemo(
    () => new Map(cities.map((c) => [c.id, c.name])),
    [cities]
  );

  return (
    <div
      className={`p-4 border rounded-lg transition-all duration-300 ${
        dragOver
          ? "border-blue-500 bg-blue-50 scale-105 shadow-lg"
          : "border-gray-200 bg-white shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          {localIsEditing ? (
            <input
              value={editingTitle}
              onChange={(e) => onEditingTitleChange(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 rounded p-1 text-lg font-semibold text-gray-900"
              placeholder="Zone Name"
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-900">
              {zoneGroup.title}
            </h3>
          )}
        </div>
        <div className="flex items-center gap-2">
          {localIsEditing ? (
            <div className="relative">
              <input
                type="number"
                value={editingPrice}
                onChange={(e) =>
                  onEditingPriceChange(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-24 bg-gray-100 border border-gray-300 rounded p-1 text-sm text-right pr-8 text-gray-900"
                min="0"
                placeholder="Price"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                da
              </span>
            </div>
          ) : (
            <div className="rounded-lg bg-green-100 px-3 py-1 text-center text-sm font-medium text-green-800">
              {zoneGroup.price} da
            </div>
          )}
          {localIsEditing ? (
            <>
              <button
                onClick={onSaveEdit}
                className="flex h-7 w-7 items-center justify-center rounded bg-green-100 hover:bg-green-200 transition-colors"
                aria-label="Save Changes"
              >
                <svg
                  className="h-4 w-4 text-green-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
              <button
                onClick={onCancelEdit}
                className="flex h-7 w-7 items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Cancel Edit"
              >
                <svg
                  className="h-4 w-4 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={onStartEdit}
              className="flex h-7 w-7 items-center justify-center rounded bg-[#FF5A01]/10 hover:bg-[#FF5A01]/20 transition-colors"
              aria-label="Edit Zone"
            >
              <svg
                className="h-4 w-4 text-[#FF5A01]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L13.196 4.196z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div
        className="h-60 overflow-y-auto p-2 border border-dashed border-gray-300 rounded bg-gray-50 transition-colors focus:outline-none focus:border-blue-500"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropToGroup}
        tabIndex={0}
      >
        <div className="flex flex-wrap items-center gap-2">
          {zoneGroup.cities.map((cityId) => {
            const cityName = cityMap.get(cityId) || `ID: ${cityId}`;
            return (
              <Pill
                key={`${zoneGroup.id}-${cityId}`}
                muted
                draggable
                onDragStart={handleDragStart(cityId)}
                onRemove={
                  localIsEditing ? () => onRemoveCity(cityId) : undefined
                }
                isSelected={selectedCities.has(cityId)}
                onToggle={() => onToggleCity(cityId)}
              >
                {cityName}
              </Pill>
            );
          })}
          {zoneGroup.cities.length === 0 && (
            <span className="text-gray-500 text-sm italic p-4 w-full text-center">
              Drag and drop cities here...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface HeaderProps {
  onAdd: () => void;
  fromWilayaName: string;
  toWilayaCode: string;
  onToWilayaChange: (code: string) => void;
  isEditing: boolean;
  wilayas: Wilaya[];
}

function Header({
  onAdd,
  fromWilayaName,
  toWilayaCode,
  onToWilayaChange,
  isEditing,
  wilayas,
}: HeaderProps) {
  return (
    <div className="flex h-16 w-full items-center justify-between px-6 border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
          <span>{fromWilayaName}</span>
          <span className="text-gray-500">→</span>
          {isEditing ? (
            <span>
              {wilayas.find((w) => w.code === toWilayaCode)?.name ||
                toWilayaCode}
            </span>
          ) : (
            <Select value={toWilayaCode} onValueChange={onToWilayaChange}>
              <SelectTrigger className="w-[180px] text-xl font-semibold bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Select Destination" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 text-gray-900">
                {wilayas.map((w) => (
                  <SelectItem
                    key={w.code}
                    value={w.code}
                    className="focus:bg-gray-100"
                  >
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <button
        onClick={onAdd}
        className="inline-flex items-center rounded-md bg-[#FF5A01] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition-all duration-200"
      >
        <svg
          className="mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add Zone
      </button>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

interface FixedPricesSectionProps {
  desktopPrice: number;
  onDesktopPriceChange: (value: number) => void;
  homePrice: number;
  onHomePriceChange: (value: number) => void;
  returnPrice: number;
  onReturnPriceChange: (value: number) => void;
}

function FixedPricesSection({
  desktopPrice,
  onDesktopPriceChange,
  homePrice,
  onHomePriceChange,
  returnPrice,
  onReturnPriceChange,
}: FixedPricesSectionProps) {
  const InputField = ({ label, value, onChange }: InputFieldProps) => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:border-[#FF5A01] focus:ring-1 focus:ring-[#FF5A01] transition-colors pr-10"
          min="0"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          da
        </span>
      </div>
    </div>
  );
  return (
    <div className="w-full px-6 py-4 border-b border-gray-200">
      <div className="grid grid-cols-3 gap-4">
        <InputField
          label="Stopdesk Price"
          value={desktopPrice}
          onChange={onDesktopPriceChange}
        />
        <InputField
          label="Home Delivery Price"
          value={homePrice}
          onChange={onHomePriceChange}
        />
        <InputField
          label="Return Price"
          value={returnPrice}
          onChange={onReturnPriceChange}
        />
      </div>
    </div>
  );
}

interface FooterActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}
function FooterActions({ onSave, onCancel, isSaving }: FooterActionsProps) {
  return (
    <div className="flex w-full items-center justify-end gap-4 p-4 border-t border-gray-200 flex-shrink-0">
      <button
        onClick={onCancel}
        disabled={isSaving}
        className="h-10 px-6 rounded-md bg-gray-200 text-sm font-medium text-gray-900 hover:bg-gray-300 transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="h-10 px-6 rounded-md bg-[#FF5A01] text-sm font-medium text-white hover:bg-opacity-90 transition-colors disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  editingFee: ShippingFee | null;
  fromWilayaCode: string;
  wilayas: Wilaya[];
  onSave: () => void;
}

export default function AddEditShippingFeeModal({
  isOpen,
  onClose,
  isEditing,
  editingFee,
  fromWilayaCode,
  wilayas,
  onSave,
}: Props) {
  const [zoneGroupList, setZoneGroupList] = useState<ZoneGroup[]>([]);
  const [currentActiveTabIndex, setCurrentActiveTabIndex] = useState(0);
  const [toWilayaCode, setToWilayaCode] = useState("");
  const [desktopPrice, setDesktopPrice] = useState(0);
  const [homePrice, setHomePrice] = useState(0);
  const [returnPrice, setReturnPrice] = useState(0);
  const [cityList, setCityList] = useState<City[]>([]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingPrice, setEditingPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedCities, setSelectedCities] = useState<ReadonlySet<number>>(
    new Set()
  );
  const modalRef = useRef<HTMLDivElement>(null);

  const wilayaNameMap = useMemo(
    () => Object.fromEntries(wilayas.map((w) => [w.code, w.name])),
    [wilayas]
  );
  const fromWilayaName = wilayaNameMap[fromWilayaCode] || fromWilayaCode;

  const remainingCities = useMemo(() => {
    const allAssignedCityIds = new Set(
      zoneGroupList.flatMap((group) => group.cities)
    );
    return cityList.filter((city) => !allAssignedCityIds.has(city.id));
  }, [cityList, zoneGroupList]);

  const handleDragStart = useCallback(
    (cityId: number) => (e: React.DragEvent<HTMLElement>) => {
      const draggedCityIds = selectedCities.has(cityId)
        ? Array.from(selectedCities)
        : [cityId];
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify(draggedCityIds)
      );
      e.dataTransfer.effectAllowed = "move";
    },
    [selectedCities]
  );

  const handleDrop = useCallback(
    (targetGroupId: string) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      let draggedCityIds: number[] = [];
      try {
        draggedCityIds = JSON.parse(e.dataTransfer.getData("application/json"));
      } catch {
        return;
      }

      if (draggedCityIds.length === 0) return;

      setZoneGroupList((prevList) =>
        prevList.map((g) => {
          let newCities = g.cities.filter((c) => !draggedCityIds.includes(c));
          if (g.id === targetGroupId) {
            const citiesToAdd = draggedCityIds.filter(
              (id) => !newCities.includes(id)
            );
            newCities = [...newCities, ...citiesToAdd];
          }
          return { ...g, cities: newCities };
        })
      );
      setSelectedCities(new Set());
    },
    []
  );

  const handleSelectedDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify(Array.from(selectedCities))
      );
      e.dataTransfer.effectAllowed = "move";
    },
    [selectedCities]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        if (selectedCities.size > 0) {
          setSelectedCities(new Set());
        } else {
          onClose();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        const currentZone = zoneGroupList[currentActiveTabIndex];
        if (currentZone) {
          setSelectedCities(new Set(currentZone.cities));
        } else if (currentActiveTabIndex === zoneGroupList.length) {
          setSelectedCities(new Set(remainingCities.map((c) => c.id)));
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    selectedCities.size,
    onClose,
    zoneGroupList,
    currentActiveTabIndex,
    remainingCities,
  ]);

  const resetState = useCallback(() => {
    setZoneGroupList([]);
    setCurrentActiveTabIndex(0);
    setToWilayaCode("");
    setDesktopPrice(0);
    setHomePrice(0);
    setReturnPrice(0);
    setCityList([]);
    setSelectedCities(new Set());
    setEditingGroupId(null);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetState();
      return;
    }

    if (isEditing && editingFee) {
      setToWilayaCode(editingFee.toWilayaCode);
      setDesktopPrice(parseFloat(String(editingFee.desktopPrice ?? 0)) || 0);
      setHomePrice(parseFloat(String(editingFee.homePrice ?? 0)) || 0);
      setReturnPrice(parseFloat(String(editingFee.returnPrice ?? 0)) || 0);
    }
  }, [isOpen, isEditing, editingFee, resetState]);

  useEffect(() => {
    if (toWilayaCode && isOpen) {
      const fetchCitiesAndZones = async () => {
        setIsLoading(true);
        try {
          const citiesDataRaw = await wilayaApi.getCitiesByCode(toWilayaCode);
          const citiesData: City[] = citiesDataRaw.map((city: any) => ({
            id: Number(city.id || city.code),
            name: city.name,
            ar_name: city.ar_name,
          }));
          setCityList(citiesData);

          let zones: any[] = [];
          if (isEditing && editingFee) {
            const fullFee: any = await shippingFees.getShippingFeeById(
              editingFee.id
            );
            zones = fullFee.zones || [];
          }
          const zoneGroupData = zones.map((z: any, index: number) => ({
            id: z.id ? z.id.toString() : `zone-${index}`,
            title: z.name || `Zone ${index + 1}`,
            price: parseFloat(String(z.price ?? 0)) || 0,
            cities: z.cities ? z.cities.map((c: any) => c.id) : [],
          }));
          setZoneGroupList(zoneGroupData);
          setCurrentActiveTabIndex(0);
        } catch (err) {
          toast.error("Failed to load cities or zones");
        } finally {
          setIsLoading(false);
        }
      };
      fetchCitiesAndZones();
    } else {
      setCityList([]);
      setZoneGroupList([]);
    }
  }, [toWilayaCode, isOpen, isEditing, editingFee, fromWilayaCode]);

  const handleAdd = () => {
    const newId = crypto.randomUUID();
    const newTitle = `Zone ${zoneGroupList.length + 1}`;
    const newZoneGroup: ZoneGroup = {
      id: newId,
      title: newTitle,
      price: 0,
      cities: [],
    };
    setZoneGroupList((prevList) => [...prevList, newZoneGroup]);
    setCurrentActiveTabIndex(zoneGroupList.length);
  };
  const handleDelete = async (zoneId: string, index: number) => {
    if (editingGroupId === zoneId) {
      setEditingGroupId(null);
    }
    const zoneNumId = Number(zoneId);
    const isPersisted = !isNaN(zoneNumId);
    if (isPersisted) {
      try {
        await shippingFees.deleteZone(zoneNumId);
      } catch (err) {
        toast.error("Failed to delete zone from server.");
        return;
      }
    }
    setZoneGroupList((prevList) => prevList.filter((g) => g.id !== zoneId));
    if (currentActiveTabIndex >= index) {
      setCurrentActiveTabIndex(Math.max(0, currentActiveTabIndex - 1));
    }
  };

  const handleTabChange = (index: number) => {
    setCurrentActiveTabIndex(index);
    setEditingGroupId(null);
  };
  const handleStartEdit = useCallback((zoneGroup: ZoneGroup) => {
    setEditingGroupId(zoneGroup.id);
    setEditingTitle(zoneGroup.title);
    setEditingPrice(zoneGroup.price);
  }, []);
  const handleSaveEdit = () => {
    if (!editingGroupId) return;
    setZoneGroupList((prevList) =>
      prevList.map((g) =>
        g.id === editingGroupId
          ? { ...g, title: editingTitle, price: editingPrice }
          : g
      )
    );
    setEditingGroupId(null);
  };
  const handleCancelEdit = () => setEditingGroupId(null);

  const handleRemoveCity = useCallback(
    (cityId: number) => {
      setZoneGroupList((prevList) =>
        prevList.map((g) => {
          if (g.id === editingGroupId) {
            return { ...g, cities: g.cities.filter((c) => c !== cityId) };
          }
          return g;
        })
      );
    },
    [editingGroupId]
  );

  const toggleCity = useCallback((cityId: number) => {
    setSelectedCities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cityId)) newSet.delete(cityId);
      else newSet.add(cityId);
      return newSet;
    });
  }, []);

  const handleModalSave = async () => {
    if (isSaving) return;
    if (
      isNaN(desktopPrice) ||
      desktopPrice < 0 ||
      isNaN(homePrice) ||
      homePrice < 0 ||
      isNaN(returnPrice) ||
      returnPrice < 0
    ) {
      toast.error(
        "All prices must be valid numbers greater than or equal to 0"
      );
      return;
    }
    setIsSaving(true);
    try {
      if (isEditing && editingFee) {
        const zones: ShippingZone[] = zoneGroupList.map((group) => {
          const zoneId = Number(group.id);
          return {
            id: isNaN(zoneId) ? undefined : zoneId,
            name: group.title,
            price: group.price,
            cityIds: group.cities,
          };
        });
        const payload: UpdateShippingFeePayload = {
          desktopPrice,
          homePrice,
          returnPrice,
          zones,
        };
        await shippingFees.updateShippingFee(editingFee.id, payload);
        toast.success("Updated successfully");
      } else {
        const feePayload: ShippingFeePayload = {
          fromWilayaCode,
          toWilayaCode,
          desktopPrice,
          homePrice,
          returnPrice,
        };
        const newFee = await shippingFees.createShippingFee(feePayload);
        const zonesPayload = zoneGroupList.map((group) => ({
          name: group.title,
          price: group.price,
          cityIds: group.cities,
        }));
        if (zonesPayload.length > 0) {
          const bulkPayload: BulkCreateZonesPayload = {
            shippingFeeId: Number(newFee.id),
            zones: zonesPayload,
          };
          await shippingFees.bulkCreateZones(bulkPayload);
        }
        toast.success("Created successfully");
      }
      onSave();
      onClose();
    } catch (err: any) {
      toast.error(err.body?.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const isRemainingTabActive = currentActiveTabIndex === zoneGroupList.length;
  const currentZoneGroup = isRemainingTabActive
    ? null
    : zoneGroupList[currentActiveTabIndex];

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-[#2D3C52]/34 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl bg-white text-gray-900 rounded-xl shadow-2xl max-h-[90vh] flex flex-col border border-gray-200"
        role="dialog"
        aria-modal="true"
      >
        <Header
          onAdd={handleAdd}
          fromWilayaName={fromWilayaName}
          toWilayaCode={toWilayaCode}
          onToWilayaChange={setToWilayaCode}
          isEditing={!!isEditing}
          wilayas={wilayas}
        />
        <FixedPricesSection
          desktopPrice={desktopPrice}
          onDesktopPriceChange={setDesktopPrice}
          homePrice={homePrice}
          onHomePriceChange={setHomePrice}
          returnPrice={returnPrice}
          onReturnPriceChange={setReturnPrice}
        />
        <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
          <div className="flex overflow-x-auto border-b border-gray-200 flex-shrink-0">
            <AnimatePresence>
              {zoneGroupList.map((zoneGroup, index) => (
                <TabButton
                  key={zoneGroup.id}
                  title={zoneGroup.title}
                  isActive={currentActiveTabIndex === index}
                  onClick={() => handleTabChange(index)}
                  onDelete={() => handleDelete(zoneGroup.id, index)}
                  onDrop={handleDrop(zoneGroup.id)}
                  onDragOver={(e) => e.preventDefault()}
                  count={zoneGroup.cities.length}
                />
              ))}
            </AnimatePresence>
            <div className="ml-auto">
              <TabButton
                title="Remaining"
                isActive={isRemainingTabActive}
                onClick={() => handleTabChange(zoneGroupList.length)}
                variant="special"
                count={remainingCities.length}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto relative min-h-[350px]">
            {selectedCities.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-10 bg-blue-100 border border-blue-300 p-2 shadow-lg mb-4 rounded-lg flex items-center justify-between cursor-move backdrop-blur-sm"
                draggable
                onDragStart={handleSelectedDragStart as any}
              >
                <span className="text-sm font-medium text-blue-800">
                  {selectedCities.size} selected. Drag this bar to move.
                </span>
                <button
                  onClick={() => setSelectedCities(new Set())}
                  className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                >
                  Clear (Esc)
                </button>
              </motion.div>
            )}

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Loading Cities...
              </div>
            ) : currentZoneGroup ? (
              <ZoneGroupTabContent
                zoneGroup={currentZoneGroup}
                cities={cityList}
                onRemoveCity={handleRemoveCity}
                handleDragStart={handleDragStart}
                handleDropToGroup={handleDrop(currentZoneGroup.id)}
                dragOver={isDragOver}
                onDragEnter={(e: React.DragEvent<HTMLDivElement>) =>
                  setIsDragOver(true)
                }
                onDragLeave={(e: React.DragEvent<HTMLDivElement>) =>
                  setIsDragOver(false)
                }
                editingGroupId={editingGroupId}
                editingTitle={editingTitle}
                onEditingTitleChange={setEditingTitle}
                editingPrice={editingPrice}
                onEditingPriceChange={setEditingPrice}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onStartEdit={() => handleStartEdit(currentZoneGroup)}
                selectedCities={selectedCities}
                onToggleCity={toggleCity}
              />
            ) : (
              <RemainingCitiesTabContent
                cities={remainingCities}
                handleDragStart={handleDragStart}
                selectedCities={selectedCities}
                onToggleCity={toggleCity}
              />
            )}
          </div>
        </div>

        <FooterActions
          onSave={handleModalSave}
          onCancel={onClose}
          isSaving={isSaving}
        />
      </motion.div>
    </div>
  );
}
