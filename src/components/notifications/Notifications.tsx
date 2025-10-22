"use client";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "highlighted",
      hasIndicator: true,
      title: "Daily Summary",
      description:
        "128 new orders 24 new client sign-ups 8 new vendors 6 returns processed Most active hub: Alger-Centre",
      timestamp: "Il ya 20 min",
    },
    {
      id: 2,
      type: "normal",
      hasIndicator: false,
      title: "Order Processing Delay",
      description:
        '32 orders have been in "Pending" status for over 2 hours. Affected vendors: FashionDZ, ElectroMax.',
      timestamp: "Il ya 20 min",
    },
    {
      id: 3,
      type: "highlighted",
      hasIndicator: true,
      title: "Security Alert: Unusual Activity",
      description:
        "A login attempt was detected from Nigeria on the admin account yahia.admin@plateforme.dz at 03:17.",
      timestamp: "Il ya 20 min",
    },
    {
      id: 4,
      type: "normal",
      hasIndicator: false,
      title: "Order Processing Delay",
      description:
        '32 orders have been in "Pending" status for over 2 hours. Affected vendors: FashionDZ, ElectroMax.',
      timestamp: "Il ya 20 min",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-[963px] mx-auto">
        <h1
          className="text-[#292D32] text-2xl font-medium tracking-[0.505px] mb-[52px]"
          style={{
            fontFamily: "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
          }}
        >
          Notifications
        </h1>

        <div className="flex flex-col gap-[25px]">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-5 rounded-[15px] ${
                notification.type === "highlighted"
                  ? "bg-[rgba(255,90,1,0.09)]"
                  : "bg-white border border-gray-100"
              }`}
            >
              <div
                className={`flex items-center justify-center p-4 rounded-[33px] flex-shrink-0 ${
                  notification.type === "highlighted"
                    ? "bg-[rgba(255,90,1,0.1)]"
                    : "bg-[rgba(255,90,1,0.2)]"
                }`}
              >
                <svg
                  className="relative"
                  width="23"
                  height="27"
                  viewBox="0 0 23 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.50001 24.4961C8.29601 25.1181 9.348 25.4961 10.5 25.4961C11.652 25.4961 12.704 25.1181 13.5 24.4961M1.03001 17.8901C0.817005 19.2431 1.76801 20.1821 2.93201 20.6501C7.39501 22.4451 13.605 22.4451 18.068 20.6501C19.232 20.1821 20.183 19.2431 19.97 17.8901C19.84 17.0581 19.193 16.3661 18.714 15.6901C18.087 14.7931 18.025 13.8161 18.024 12.7751C18.025 8.75609 14.657 5.49609 10.5 5.49609C6.343 5.49609 2.97501 8.75609 2.97501 12.7761C2.97501 13.8161 2.91301 14.7941 2.28501 15.6901C1.80701 16.3661 1.16101 17.0581 1.03001 17.8901Z"
                    stroke="#FF5A01"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {notification.hasIndicator && (
                    <circle cx="17" cy="6.49609" r="6" fill="#FF5A01" />
                  )}
                </svg>
              </div>

              <div className="flex flex-col justify-center gap-[15px] flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div
                    className="flex-1 text-[#292D32] text-base break-words"
                    style={{
                      fontFamily:
                        "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                    }}
                  >
                    <span className="font-bold">{notification.title}</span>
                    {notification.title && notification.description && " "}
                    <span className="font-normal">
                      {notification.description}
                    </span>
                  </div>
                </div>
                <div
                  className="text-[#292D32] text-sm font-bold"
                  style={{
                    fontFamily:
                      "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  {notification.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
