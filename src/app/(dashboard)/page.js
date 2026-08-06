import { prisma } from "@/lib/prisma";
import DashboardCharts from "@/components/DashboardCharts";
import { Handshake, Banknote, Clock, CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const deals = await prisma.deal.findMany({
    include: { referredVendors: true, wonVendor: true, customer: true },
    orderBy: { createdAt: "desc" },
  });

  const totalDealsValue = deals.reduce((acc, deal) => acc + deal.dealValue, 0);
  const totalExpectedCommission = deals.reduce((acc, deal) => acc + deal.commissionAmount, 0);
  const totalReceived = deals
    .filter((d) => d.commissionStatus === "RECEIVED")
    .reduce((acc, deal) => acc + deal.commissionAmount, 0);
  const totalPending = deals
    .filter((d) => d.commissionStatus === "PENDING")
    .reduce((acc, deal) => acc + deal.commissionAmount, 0);

  // Group by vendor for chart
  const vendorStats = deals.reduce((acc, deal) => {
    let vendorName = "Unknown/Pending";
    if (deal.wonVendor) {
      vendorName = deal.wonVendor.companyName;
    } else if (deal.referredVendors && deal.referredVendors.length === 1) {
      vendorName = deal.referredVendors[0].companyName;
    } else if (deal.referredVendors && deal.referredVendors.length > 1) {
      vendorName = "Multiple (Undecided)";
    }

    if (!acc[vendorName]) {
      acc[vendorName] = { name: vendorName, expected: 0, received: 0 };
    }
    acc[vendorName].expected += deal.commissionAmount;
    if (deal.commissionStatus === "RECEIVED") {
      acc[vendorName].received += deal.commissionAmount;
    }
    return acc;
  }, {});
  
  const chartData = Object.values(vendorStats);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--primary)" }}><Handshake /></div>
          <div>
            <p style={{ color: "#64748b", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "700" }}>Total Deals</p>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginTop: "0.25rem" }}>₹{totalDealsValue.toLocaleString('en-IN')}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--warning)" }}><Banknote /></div>
          <div>
            <p style={{ color: "#64748b", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "700" }}>Expected Commission</p>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginTop: "0.25rem" }}>₹{totalExpectedCommission.toLocaleString('en-IN')}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--success)" }}><CheckCircle /></div>
          <div>
            <p style={{ color: "#64748b", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "700" }}>Received</p>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginTop: "0.25rem", color: "var(--success)" }}>₹{totalReceived.toLocaleString('en-IN')}</h2>
          </div>
        </div>
        <Link href="/pending-commissions" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
          <div className="stat-card" style={{ cursor: "pointer", position: "relative" }}>
            <div className="stat-icon" style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)" }}><Clock /></div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#64748b", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "700" }}>Pending</p>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginTop: "0.25rem", color: "var(--danger)" }}>₹{totalPending.toLocaleString('en-IN')}</h2>
            </div>
            <div style={{ color: "var(--danger)", opacity: 0.5, paddingRight: "0.5rem" }}>
              <ChevronRight size={24} />
            </div>
          </div>
        </Link>
      </div>

      <div className="dashboard-card">
        <h3 style={{ marginBottom: "1.5rem", fontSize: "1.2rem", fontWeight: "600" }}>Commissions by Vendor</h3>
        {chartData.length > 0 ? (
          <DashboardCharts data={chartData} />
        ) : (
          <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
            No data available yet. Create some deals to see charts!
          </div>
        )}
      </div>
    </div>
  );
}
