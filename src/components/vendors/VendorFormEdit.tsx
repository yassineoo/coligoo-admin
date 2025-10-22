"use client";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { VendorInput } from "./VendorInput";
import { VendorSelect } from "./VendorSelect";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VendorFormEdit() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    firstName: isEdit ? "Hamza" : "",
    lastName: isEdit ? "Bouchanane" : "",
    phone: isEdit ? "0549461543" : "",
    email: isEdit ? "hamza@email.com" : "",
    storeName: isEdit ? "Chic Boutique" : "",
    hub: isEdit ? "Alger centre" : "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    router.push("/dashboard/vendors");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1247px] mx-auto px-8 py-6">
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => router.push("/dashboard/vendors")}
            className="w-8 h-8 rounded-lg bg-delivery-orange flex items-center justify-center hover:bg-delivery-orange/90 transition-colors"
          >
            <img
              src="/icons/arrow-left.svg"
              alt="Delete"
              className="w-4 h-4 text-white"
            />
          </button>
          <h1 className="text-[#292D32] text-2xl font-medium tracking-[0.505px]">
            Edit Vendor
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#F1F1F1] rounded-xl p-12">
          <div className="max-w-[895px]">
            <div className="mb-8">
              <h2 className="text-[#292D32] text-2xl font-medium tracking-[0.505px] mb-3">
                General information
              </h2>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <VendorInput
                    label="First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                  />
                  <VendorInput
                    label="Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <VendorInput
                    label="Phone number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />
                  <VendorInput
                    label="Email address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-[#292D32] text-2xl font-medium tracking-[0.505px] mb-3">
                Store
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <VendorInput
                  label="Store name"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Store name"
                />
                <VendorSelect
                  label="Hub"
                  name="hub"
                  value={formData.hub}
                  onChange={handleChange}
                >
                  <option value="">Select hub</option>
                  <option value="Alger centre">Alger centre</option>
                  <option value="Oran">Oran</option>
                  <option value="Constantine">Constantine</option>
                </VendorSelect>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-[#292D32] text-2xl font-medium tracking-[0.505px] mb-3">
                Password
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <VendorInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  showPasswordToggle
                />
                <VendorInput
                  label="Rewrite password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Rewrite password"
                  showPasswordToggle
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 rounded-[15px] border-2 border-delivery-orange bg-delivery-orange text-white text-base font-medium leading-6 tracking-[0.5px] hover:bg-delivery-orange/90 transition-colors"
            >
              {isEdit ? "Update vendor" : "Add vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
