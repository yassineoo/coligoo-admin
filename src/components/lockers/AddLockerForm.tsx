"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { VendorInput } from "../vendors/VendorInput";
import { VendorSelect } from "../vendors/VendorSelect";

const MOCK_WILAYAS = [
  { code: "ALG", name: "Alger" },
  { code: "ORA", name: "Oran" },
  { code: "CON", name: "Constantine" },
  { code: "ANN", name: "Annaba" },
];

const MOCK_CITIES: Record<string, { id: number; name: string }[]> = {
  ALG: [
    { id: 1, name: "Bordj El Kiffan" },
    { id: 2, name: "Kouba" },
    { id: 3, name: "Ben Aknoun" },
  ],
  ORA: [
    { id: 4, name: "Es Senia" },
    { id: 5, name: "Bir El Djir" },
  ],
  CON: [
    { id: 6, name: "Ben Aknoun" },
    { id: 7, name: "Sidi Mabrouk" },
  ],
  ANN: [
    { id: 8, name: "Sidi Amir" },
    { id: 9, name: "El Hadjar" },
  ],
};

export default function AddLockerForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    lockerName: "",
    reference: "",
    numberOfCompartments: "10",
    wilaya: "",
    commune: "",
    address: "",
  });

  const wilayaCode = MOCK_WILAYAS.find((w) => w.name === formData.wilaya)?.code;
  const cities = useMemo(() => (wilayaCode ? MOCK_CITIES[wilayaCode] || [] : []), [wilayaCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    router.push("/dashboard/lockers");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "wilaya") {
      setFormData((prev) => ({ ...prev, commune: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1247px] mx-auto px-8 py-6">
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => router.push("/dashboard/lockers")}
            className="w-8 h-8 rounded-lg bg-delivery-orange flex items-center justify-center hover:bg-delivery-orange/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-[#292D32] text-2xl font-medium tracking-[0.505px]">
            Add locker
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#F1F1F1] rounded-xl p-12">
          <div className="max-w-[895px]">
            <div className="mb-[60px]">
              <h2 className="text-[#292D32] text-2xl font-medium tracking-[0.505px] mb-[10px]">
                General information
              </h2>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <VendorInput
                    label="Locker name"
                    name="lockerName"
                    value={formData.lockerName}
                    onChange={handleChange}
                    placeholder="Algiers Center 01"
                  />
                  <VendorInput
                    label="Reference"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="LKR-ALG-001"
                  />
                </div>

                <div className="relative">
                  <VendorInput
                    label="Number of compartments"
                    name="numberOfCompartments"
                    type="number"
                    value={formData.numberOfCompartments}
                    onChange={handleChange}
                    placeholder="10"
                  />
                  <div className="absolute right-3.5 top-[29px] flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          numberOfCompartments: String(
                            Number(prev.numberOfCompartments) + 1
                          ),
                        }))
                      }
                      className="w-[15px] h-[15px] rounded-sm bg-[#D8D8D8] flex items-center justify-center hover:bg-gray-400 transition"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.75 9.375L7.5 5.625L11.25 9.375"
                          stroke="#656060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          numberOfCompartments: String(
                            Math.max(1, Number(prev.numberOfCompartments) - 1)
                          ),
                        }))
                      }
                      className="w-[15px] h-[15px] rounded-sm bg-[#D8D8D8] flex items-center justify-center hover:bg-gray-400 transition"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.75 5.625L7.5 9.375L11.25 5.625"
                          stroke="#656060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-[60px]">
              <h2 className="text-[#292D32] text-2xl font-medium tracking-[0.505px] mb-[10px]">
                Address
              </h2>

              <div className="space-y-[15px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <VendorSelect
                    label="Wilaya"
                    name="wilaya"
                    value={formData.wilaya}
                    onChange={handleChange}
                  >
                    <option value="">Select Wilaya</option>
                    {MOCK_WILAYAS.map((wilaya) => (
                      <option key={wilaya.code} value={wilaya.name}>
                        {wilaya.name}
                      </option>
                    ))}
                  </VendorSelect>

                  <VendorSelect
                    label="Commune"
                    name="commune"
                    value={formData.commune}
                    onChange={handleChange}
                    disabled={!formData.wilaya}
                  >
                    <option value="">Select Commune</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </VendorSelect>
                </div>

                <VendorInput
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Palm Street, Bordj El Kiffan District, Algiers 16120, Algeria"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 rounded-[15px] border-2 border-delivery-orange bg-delivery-orange text-white text-base font-medium leading-6 tracking-[0.5px] hover:bg-delivery-orange/90 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
