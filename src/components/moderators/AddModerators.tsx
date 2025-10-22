"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import adminUsers, { CreateUserPayload } from "@/app/api/usersmanagement";

export default function AddModerator() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPermissionsDropdown, setShowPermissionsDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    permissions: "",
  });

  const availablePermissions = [
    "Edit vendors",
    "Edit Delivery men",
    "Edit Hubs",
  ];

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Please enter a valid email address.";
  };

  const validatePhone = (phone: string): string => {
    const phoneRegex = /^0[1-7]\d{8}$/;
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

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
    if (errors.permissions) {
      setErrors((prev) => ({ ...prev, permissions: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: validateName(formData.firstName),
      lastName: validateName(formData.lastName),
      phone: validatePhone(formData.phone),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword:
        formData.password !== formData.confirmPassword
          ? "Passwords do not match."
          : "",
      permissions:
        selectedPermissions.length === 0
          ? "Please select at least one permission."
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
    const t = toast.loading("Creating moderator...");

    try {
      const payload: CreateUserPayload = {
        email: formData.email,
        password: formData.password,
        prenom: formData.firstName,
        nom: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        role: "moderator",
        phoneNumber: formData.phone,
        permissions: selectedPermissions,
        blocked: false,
      };

      await adminUsers.createUser(payload);
      toast.dismiss(t);
      toast.success("Moderator created successfully");
      router.push("/dashboard/moderators");
    } catch (err: any) {
      toast.dismiss(t);
      const msg = err.body?.message || "Failed to create moderator";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-center gap-3 mb-[49px]">
          <button
            onClick={() => router.push("/dashboard/moderators")}
            className="w-8 h-8 flex items-center justify-center bg-[#FF5A01] rounded-lg"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="31.6895"
                y="31.833"
                width="31.6699"
                height="31.6699"
                rx="8.63725"
                transform="rotate(180 31.6895 31.833)"
                fill="#FF5A01"
              />
              <path
                d="M8.64367 15.9974H23.0664"
                stroke="white"
                strokeWidth="1.43954"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.4614 21.7904C14.4614 21.7904 8.64425 18.6549 8.64425 15.9992C8.64425 13.3415 14.4614 10.2051 14.4614 10.2051"
                stroke="white"
                strokeWidth="1.43954"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1
            className="text-[#292D32] text-2xl font-normal tracking-[0.505px]"
            style={{
              fontFamily:
                "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            Add moderator
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-[10px]">
              <h2
                className="text-[#292D32] text-2xl font-normal tracking-[0.505px]"
                style={{
                  fontFamily:
                    "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                General information
              </h2>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div className="flex flex-col gap-0.5">
                    <label
                      className="text-[#7C8BA0] text-xs font-normal leading-[160%] tracking-[-0.24px]"
                      style={{
                        fontFamily:
                          "Plus Jakarta Sans, -apple-system, Roboto, Helvetica, sans-serif",
                      }}
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className={`h-[46px] px-[14px] rounded-[10px] border ${
                        errors.firstName ? "border-red-500" : "border-[#EDF1F3]"
                      } bg-white text-[#292D32] text-sm font-medium leading-[140%] tracking-[-0.14px] shadow-[0_1px_2px_0_rgba(228,229,231,0.24)]`}
                      style={{
                        fontFamily:
                          "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                      }}
                      placeholder="Hamza"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label
                      className="text-[#7C8BA0] text-xs font-normal leading-[160%] tracking-[-0.24px]"
                      style={{
                        fontFamily:
                          "Plus Jakarta Sans, -apple-system, Roboto, Helvetica, sans-serif",
                      }}
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className={`h-[46px] px-[14px] rounded-[10px] border ${
                        errors.lastName ? "border-red-500" : "border-[#EDF1F3]"
                      } bg-white text-[#292D32] text-sm font-medium leading-[140%] tracking-[-0.14px] shadow-[0_1px_2px_0_rgba(228,229,231,0.24)]`}
                      style={{
                        fontFamily:
                          "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                      }}
                      placeholder="Bouchanane"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div className="flex flex-col gap-0.5">
                    <label
                      className="text-[#7C8BA0] text-xs font-normal leading-[160%] tracking-[-0.24px]"
                      style={{
                        fontFamily:
                          "Plus Jakarta Sans, -apple-system, Roboto, Helvetica, sans-serif",
                      }}
                    >
                      Phone number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={`h-[46px] px-[14px] rounded-[10px] border ${
                        errors.phone ? "border-red-500" : "border-[#EDF1F3]"
                      } bg-white text-[#292D32] text-sm font-medium leading-[140%] tracking-[-0.14px] shadow-[0_1px_2px_0_rgba(228,229,231,0.24)]`}
                      style={{
                        fontFamily:
                          "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                      }}
                      placeholder="0549461543"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label
                      className="text-[#7C8BA0] text-xs font-normal leading-[160%] tracking-[-0.24px]"
                      style={{
                        fontFamily:
                          "Plus Jakarta Sans, -apple-system, Roboto, Helvetica, sans-serif",
                      }}
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`h-[46px] px-[14px] rounded-[10px] border ${
                        errors.email ? "border-red-500" : "border-[#EDF1F3]"
                      } bg-white text-[#292D32] text-sm font-medium leading-[140%] tracking-[-0.14px] shadow-[0_1px_2px_0_rgba(228,229,231,0.24)]`}
                      style={{
                        fontFamily:
                          "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                      }}
                      placeholder="hamza@email.com"
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

            <div className="flex flex-col gap-[10px]">
              <h2
                className="text-[#292D32] text-2xl font-normal tracking-[0.505px]"
                style={{
                  fontFamily:
                    "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Permissions
              </h2>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5 relative">
                  <label
                    className="text-[#7C8BA0] text-xs font-normal leading-[160%] tracking-[-0.24px]"
                    style={{
                      fontFamily:
                        "Plus Jakarta Sans, -apple-system, Roboto, Helvetica, sans-serif",
                    }}
                  >
                    Choose permissions
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setShowPermissionsDropdown(!showPermissionsDropdown)
                    }
                    className={`h-[46px] px-[14px] rounded-[10px] border ${
                      errors.permissions ? "border-red-500" : "border-[#EDF1F3]"
                    } bg-white text-[#7C8BA0] text-xs font-medium leading-[160%] tracking-[-0.24px] shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] flex items-center justify-between`}
                    style={{
                      fontFamily:
                        "Plus Jakarta Sans, -apple-system, Roboto, Helvetica, sans-serif",
                    }}
                  >
                    {selectedPermissions.length > 0
                      ? `${selectedPermissions.length} permission(s) selected`
                      : "Permissions"}
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.8611 7.7041L11.4278 13.1374C10.7861 13.7791 9.73613 13.7791 9.09447 13.1374L3.66113 7.7041"
                        stroke="#292D32"
                        strokeWidth="1.25"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {errors.permissions && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.permissions}
                    </p>
                  )}

                  {showPermissionsDropdown && (
                    <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-10 p-[15px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] flex flex-col gap-[10px]">
                      {availablePermissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(permission)}
                              onChange={() => togglePermission(permission)}
                              className="sr-only"
                            />
                            <div
                              className={`w-[15px] h-[15px] rounded border ${
                                selectedPermissions.includes(permission)
                                  ? "border-[#FF5A01] bg-[#FF5A01]"
                                  : "border-[#D0D5DD] bg-white"
                              } flex items-center justify-center`}
                            >
                              {selectedPermissions.includes(permission) && (
                                <svg
                                  width="11"
                                  height="12"
                                  viewBox="0 0 11 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.14111 3.3418L4.26718 8.21573L2.05176 6.00031"
                                    stroke="white"
                                    strokeWidth="1.51915"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span
                            className="text-[#292D32] text-sm font-medium leading-[140%] tracking-[-0.14px]"
                            style={{
                              fontFamily:
                                "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                            }}
                          >
                            {permission}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[10px]">
              <h2
                className="text-[#292D32] text-2xl font-normal tracking-[0.505px]"
                style={{
                  fontFamily:
                    "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Password
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="flex flex-col gap-0.5">
                  <label
                    className="text-[#7C8BA0] text-xs font-normal leading-[160%] tracking-[-0.24px]"
                    style={{
                      fontFamily:
                        "Plus Jakarta Sans, -apple-system, Roboto, Helvetica, sans-serif",
                    }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={`h-[46px] px-[14px] pr-10 w-full rounded-[10px] border ${
                        errors.password ? "border-red-500" : "border-[#EDF1F3]"
                      } bg-white text-[#292D32] text-sm font-medium leading-[140%] tracking-[-0.14px] shadow-[0_1px_2px_0_rgba(228,229,231,0.24)]`}
                      style={{
                        fontFamily:
                          "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                      }}
                      placeholder="*******"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.70661 7.30404C7.4566 7.55414 7.31618 7.89331 7.31624 8.24694C7.31631 8.60057 7.45685 8.93969 7.70694 9.1897C7.95704 9.43971 8.29622 9.58013 8.64985 9.58007C9.00348 9.58001 9.3426 9.43947 9.59261 9.18937M11.7706 11.3614C10.8354 11.9465 9.75301 12.2534 8.6499 12.2461C6.2499 12.2461 4.2499 10.9128 2.6499 8.24611C3.4979 6.83278 4.4579 5.79411 5.5299 5.13011M7.43657 4.36611C7.83593 4.28527 8.24244 4.24506 8.6499 4.24611C11.0499 4.24611 13.0499 5.57945 14.6499 8.24611C14.2059 8.98611 13.7306 9.62411 13.2246 10.1594M2.6499 2.24609L14.6499 14.2461"
                          stroke="#ACB5BB"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-0.5">
                  <label
                    className="text-[#7C8BA0] text-xs font-normal leading-[160%] tracking-[-0.24px]"
                    style={{
                      fontFamily:
                        "Plus Jakarta Sans, -apple-system, Roboto, Helvetica, sans-serif",
                    }}
                  >
                    Rewrite password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`h-[46px] px-[14px] pr-10 w-full rounded-[10px] border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-[#EDF1F3]"
                      } bg-white text-[#292D32] text-sm font-medium leading-[140%] tracking-[-0.14px] shadow-[0_1px_2px_0_rgba(228,229,231,0.24)]`}
                      style={{
                        fontFamily:
                          "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                      }}
                      placeholder="*******************"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.31843 7.30404C7.06842 7.55414 6.928 7.89331 6.92806 8.24694C6.92812 8.60057 7.06866 8.93969 7.31876 9.1897C7.56886 9.43971 7.90803 9.58013 8.26166 9.58007C8.61529 9.58001 8.95442 9.43947 9.20443 9.18937M11.3824 11.3614C10.4472 11.9465 9.36482 12.2534 8.26172 12.2461C5.86172 12.2461 3.86172 10.9128 2.26172 8.24611C3.10972 6.83278 4.06972 5.79411 5.14172 5.13011M7.04839 4.36611C7.44774 4.28527 7.85426 4.24506 8.26172 4.24611C10.6617 4.24611 12.6617 5.57945 14.2617 8.24611C13.8177 8.98611 13.3424 9.62411 12.8364 10.1594M2.26172 2.24609L14.2617 14.2461"
                          stroke="#ACB5BB"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-[36px] px-4 py-3 bg-[#FF5A01] border-2 border-[#FF5A01] rounded-[15px] text-white text-base font-medium leading-6 tracking-[0.5px] hover:bg-[#e65001] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily:
                "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            {loading ? "Creating..." : "Add moderator"}
          </button>
        </form>
      </div>
    </div>
  );
}
