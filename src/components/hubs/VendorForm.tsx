"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import adminUsers, {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from "@/app/api/usersmanagement";
import { VendorInput } from "./VendorInput";
import { VendorSelect } from "./VendorSelect";
import { ArrowLeft } from "lucide-react";

export default function VendorForm() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id?: string };
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    storeName: "",
    hub: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    storeName: "",
    hub: "",
    password: "",
    confirmPassword: "",
  });

  const hubMap: Record<string, number> = {
    "Alger centre": 1,
    Oran: 2,
    Constantine: 3,
  };
  const reverseHubMap: Record<number, string> = {
    1: "Alger centre",
    2: "Oran",
    3: "Constantine",
  };

  useEffect(() => {
    if (isEdit && id) {
      const fetchUser = async () => {
        try {
          const user: User & { storeName?: string } =
            await adminUsers.getUserById(id);
          setFormData({
            firstName: user.prenom || "",
            lastName: user.nom || "",
            phone: user.phoneNumber || "",
            email: user.email,
            storeName: (user as any).storeName || "",
            hub: user.hubId ? reverseHubMap[user.hubId as number] || "" : "",
            password: "",
            confirmPassword: "",
          });
        } catch (err: any) {
          toast.error(err.body?.message || "Failed to load vendor");
        }
      };
      fetchUser();
    }
  }, [isEdit, id]);

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Please enter a valid email address.";
  };

  const validatePhone = (phone: string): string => {
    const phoneRegex = /^0[5-7]\d{8}$/;
    return phoneRegex.test(phone)
      ? ""
      : "Please enter a valid phone number (e.g., 0549461543).";
  };

  const validatePassword = (password: string): string => {
    if (password.length < 8)
      return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number.";
    if (!/[!@#$%^&*]/.test(password))
      return "Password must contain at least one special character.";
    return "";
  };

  const validateName = (name: string): string => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s-]+$/;
    return name.length > 0 && nameRegex.test(name)
      ? ""
      : "Please enter a valid name (letters only).";
  };

  const validateStoreName = (storeName: string): string => {
    return storeName.length > 0 ? "" : "Please enter a store name.";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: validateName(formData.firstName),
      lastName: validateName(formData.lastName),
      phone: validatePhone(formData.phone),
      email: validateEmail(formData.email),
      storeName: validateStoreName(formData.storeName),
      hub: formData.hub ? "" : "Please select a hub.",
      password: isEdit ? "" : validatePassword(formData.password),
      confirmPassword: isEdit
        ? ""
        : formData.password !== formData.confirmPassword
        ? "Passwords do not match."
        : "",
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setLoading(true);
    const t = toast.loading(`${isEdit ? "Updating" : "Adding"} vendor...`);

    try {
      const commonPayload = {
        email: formData.email,
        prenom: formData.firstName,
        nom: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        phoneNumber: formData.phone,
        storeName: formData.storeName,
        hubId: formData.hub ? hubMap[formData.hub] : undefined,
      };

      if (isEdit) {
        const updatePayload: UpdateUserPayload = { ...commonPayload };
        await adminUsers.updateUser(id!, updatePayload);
      } else {
        const createPayload: CreateUserPayload = {
          ...commonPayload,
          password: formData.password,
          role: "vendor" as const,
          blocked: false,
        };
        await adminUsers.createUser(createPayload);
      }

      toast.dismiss(t);
      toast.success(
        `${isEdit ? "Vendor updated" : "Vendor added"} successfully`
      );
      router.push("/dashboard/vendors"); 
    } catch (err: any) {
      toast.dismiss(t);
      const msg = err.body?.message || "Failed to save vendor";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1247px] mx-auto px-8 py-6">
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-8 h-8 rounded-lg bg-delivery-orange flex items-center justify-center hover:bg-delivery-orange/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-[#292D32] text-2xl font-medium tracking-[0.505px]">
            {isEdit ? "Edit Vendor" : "Add Vendor"}
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
                  <div>
                    <VendorInput
                      label="First name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      error={errors.firstName}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <VendorInput
                      label="Last name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      error={errors.lastName}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <VendorInput
                      label="Phone number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      error={errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <VendorInput
                      label="Email address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      error={errors.email}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-[#292D32] text-2xl font-medium tracking-[0.505px] mb-3">
                Store
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div>
                  <VendorInput
                    label="Store name"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    placeholder="Store name"
                    error={errors.storeName}
                  />
                  {errors.storeName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.storeName}
                    </p>
                  )}
                </div>
                <div>
                  <VendorSelect
                    label="Hub"
                    name="hub"
                    value={formData.hub}
                    onChange={handleChange}
                    error={errors.hub}
                  >
                    <option value="">Select hub</option>
                    <option value="Alger centre">Alger centre</option>
                    <option value="Oran">Oran</option>
                    <option value="Constantine">Constantine</option>
                  </VendorSelect>
                  {errors.hub && (
                    <p className="text-red-500 text-xs mt-1">{errors.hub}</p>
                  )}
                </div>
              </div>
            </div>

            {!isEdit && (
              <div className="mb-12">
                <h2 className="text-[#292D32] text-2xl font-medium tracking-[0.505px] mb-3">
                  Password
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <VendorInput
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      showPasswordToggle
                      error={errors.password}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div>
                    <VendorInput
                      label="Rewrite password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Rewrite password"
                      showPasswordToggle
                      error={errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-6 py-3 rounded-[15px] border-2 border-delivery-orange bg-delivery-orange text-white text-base font-medium leading-6 tracking-[0.5px] hover:bg-delivery-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? `${isEdit ? "Updating" : "Adding"}...`
                : isEdit
                ? "Update vendor"
                : "Add vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
