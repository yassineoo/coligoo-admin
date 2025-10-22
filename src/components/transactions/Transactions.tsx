"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Download,
} from "lucide-react";

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  const styles = {
    Successful:
      "bg-[#D1F4E0] text-[#0F7F3F] px-3 py-1 rounded-md text-sm font-normal",
    Failure:
      "bg-[#FFE1E1] text-[#D92D20] px-3 py-1 rounded-md text-sm font-normal",
    "In Progress":
      "bg-[#FFF4ED] text-[#F79009] px-3 py-1 rounded-md text-sm font-normal",
  };

  return <span className={styles[status]}>{status}</span>;
};

export type TransactionStatus = "Successful" | "Failure" | "In Progress";

export interface Transaction {
  id: string;
  date: string;
  hour: string;
  type: string;
  amount: string;
  initiator: {
    role: string;
    name: string;
  };
  beneficiary: {
    role: string;
    name: string;
  };
  description: string;
  status: TransactionStatus;
}

export const transactions: Transaction[] = [
  {
    id: "#123",
    date: "10-10-2025",
    hour: "11:02",
    type: "Client Order Payment",
    amount: "12 300 DA",
    initiator: { role: "Client", name: "Samir Boudjelal" },
    beneficiary: { role: "Seller", name: "Amina Khelifi" },
    description: "Purchase of 3 items",
    status: "Successful",
  },
  {
    id: "#123",
    date: "10-10-2025",
    hour: "11:02",
    type: "Platform Commission",
    amount: "12 300 DA",
    initiator: { role: "Seller", name: "Amina Khelifi" },
    beneficiary: { role: "Platform", name: "" },
    description: "10% fee from order TX-M001",
    status: "Successful",
  },
  {
    id: "#123",
    date: "10-10-2025",
    hour: "11:02",
    type: "Seller Payout",
    amount: "12 300 DA",
    initiator: { role: "Platform", name: "" },
    beneficiary: { role: "Seller", name: "Amina Khelifi" },
    description: "Purchase of 3 items",
    status: "Successful",
  },
  {
    id: "#123",
    date: "10-10-2025",
    hour: "11:02",
    type: "Hub Delivery Payment",
    amount: "12 300 DA",
    initiator: { role: "Platform", name: "" },
    beneficiary: { role: "Hub", name: "Mourad Benyahia (Boumerdès)" },
    description: "Payment for 5 successful deliveries",
    status: "Failure",
  },
  {
    id: "#123",
    date: "10-10-2025",
    hour: "11:02",
    type: "Client Order Payment",
    amount: "12 300 DA",
    initiator: { role: "Client", name: "Samir Boudjelal" },
    beneficiary: { role: "Seller", name: "Amina Khelifi" },
    description: "Payment for 5 successful deliveries",
    status: "Successful",
  },
  {
    id: "#123",
    date: "10-10-2025",
    hour: "11:02",
    type: "Client Order Payment",
    amount: "12 300 DA",
    initiator: { role: "Client", name: "Samir Boudjelal" },
    beneficiary: { role: "Seller", name: "Amina Khelifi" },
    description: "Payment for 5 successful deliveries",
    status: "In Progress",
  },
  {
    id: "#123",
    date: "10-10-2025",
    hour: "11:02",
    type: "Hub Delivery Payment",
    amount: "12 300 DA",
    initiator: { role: "Platform", name: "" },
    beneficiary: { role: "Hub", name: "Mourad Benyahia (Boumerdès)" },
    description: "Payment for 5 successful deliveries",
    status: "Failure",
  },
  {
    id: "#123",
    date: "10-10-2025",
    hour: "11:02",
    type: "Platform Commission",
    amount: "12 300 DA",
    initiator: { role: "Seller", name: "Amina Khelifi" },
    beneficiary: { role: "Platform", name: "" },
    description: "10% fee from order TX-M001",
    status: "Successful",
  },
];

export default function TransactionsTable() {
  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 5;
  const itemsPerPage = 10;

  return (
    <div className="w-full max-w-[1028px] mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-[#292D32] tracking-[0.505px]">
          Transactions
        </h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <SlidersHorizontal
              className="w-3.5 h-3.5 text-[#344054]"
              strokeWidth={1.5}
            />
            <span className="text-[#344054] text-[11px] font-medium leading-[16.62px] tracking-[0.346px]">
              Filters
            </span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#344054] hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 text-[#344054]" strokeWidth={1.5} />
            <span className="text-[#344054] text-[11px] font-medium leading-[16.62px] tracking-[0.346px]">
              Export
            </span>
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-[#D6D6D6] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FDF4FF] border-b border-[#D6D6D6]">
              <tr>
                <th className="px-3 py-3.5 text-left text-[#292D32] text-sm font-normal whitespace-nowrap min-w-[100px]">
                  Transaction ID
                </th>
                <th className="px-3 py-3.5 text-left text-[#292D32] text-sm font-normal whitespace-nowrap min-w-[85px]">
                  Date
                </th>
                <th className="px-3 py-3.5 text-left text-[#292D32] text-sm font-normal whitespace-nowrap min-w-[60px]">
                  Hour
                </th>
                <th className="px-3 py-3.5 text-left text-[#292D32] text-sm font-normal whitespace-nowrap min-w-[130px]">
                  Transaction Type
                </th>
                <th className="px-3 py-3.5 text-left text-[#292D32] text-sm font-normal whitespace-nowrap min-w-[85px]">
                  Amount
                </th>
                <th className="px-3 py-3.5 text-left text-[#292D32] text-sm font-normal whitespace-nowrap min-w-[130px]">
                  Initiator (Role + Name)
                </th>
                <th className="px-3 py-3.5 text-left text-[#292D32] text-sm font-normal whitespace-nowrap min-w-[130px]">
                  Beneficiary (Role + Name)
                </th>
                <th className="px-3 py-3.5 text-left text-[#292D32] text-sm font-normal whitespace-nowrap min-w-[150px]">
                  Description
                </th>
                <th className="px-3 py-3.5 text-left text-[#292D32] text-sm font-normal whitespace-nowrap min-w-[100px]">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className="border-b border-[#D6D6D6] last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-4 text-[#292D32] text-sm">
                    {transaction.id}
                  </td>
                  <td className="px-3 py-4 text-[#292D32] text-sm">
                    {transaction.date}
                  </td>
                  <td className="px-3 py-4 text-[#292D32] text-sm">
                    {transaction.hour}
                  </td>
                  <td className="px-3 py-4 text-[#292D32] text-sm">
                    {transaction.type}
                  </td>
                  <td className="px-3 py-4 text-[#292D32] text-sm">
                    {transaction.amount}
                  </td>
                  <td className="px-3 py-4 text-[#292D32] text-sm">
                    {transaction.initiator.name ? (
                      <>
                        {transaction.initiator.role} –{" "}
                        {transaction.initiator.name}
                      </>
                    ) : (
                      transaction.initiator.role
                    )}
                  </td>
                  <td className="px-3 py-4 text-[#292D32] text-sm">
                    {transaction.beneficiary.name ? (
                      <>
                        {transaction.beneficiary.role} –{" "}
                        {transaction.beneficiary.name}
                      </>
                    ) : (
                      transaction.beneficiary.role
                    )}
                  </td>
                  <td className="px-3 py-4 text-[#292D32] text-sm">
                    {transaction.description}
                  </td>
                  <td className="px-3 py-4">
                    <StatusBadge status={transaction.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#D6D6D6] px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-sm text-[#344054] hover:text-[#292D32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précedent</span>
          </button>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#FDF4FF] text-[#292D32] border border-[#D6D6D6]"
                    : "text-[#344054] hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 text-sm text-[#344054] hover:text-[#292D32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Prochain</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <select
              value={itemsPerPage}
              className="border border-[#D6D6D6] rounded-md px-2 py-1 text-sm text-[#344054] bg-white focus:outline-none focus:ring-2 focus:ring-[#FDF4FF]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
