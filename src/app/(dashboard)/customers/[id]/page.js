import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { updateDealStatus } from "@/lib/actions";
import { User, Mail, Phone, Handshake, Banknote, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerDetailsPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      deals: {
        include: {
          referredVendors: true,
          wonVendor: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!customer) {
    notFound();
  }

  // Analytics Math
  const totalDeals = customer.deals.length;
  const totalPipeline = customer.deals.reduce((sum, deal) => sum + deal.dealValue, 0);
  const closedWonValue = customer.deals
    .filter(d => d.dealStatus === "CLOSED")
    .reduce((sum, deal) => sum + deal.dealValue, 0);
  const commissionEarned = customer.deals
    .filter(d => d.commissionStatus === "RECEIVED")
    .reduce((sum, deal) => sum + deal.commissionAmount, 0);

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <Link href="/customers" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem" }}>← Back to Customers</Link>
          </div>
          <h1 className="page-title">{customer.companyName} History</h1>
          <div style={{ display: "flex", gap: "1.5rem", color: "#64748b", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            {customer.contactPerson && <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><User size={14} /> {customer.contactPerson}</span>}
            {customer.email && <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Mail size={14} /> {customer.email}</span>}
            {customer.phone && <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Phone size={14} /> {customer.phone}</span>}
          </div>
        </div>
      </div>

      {/* KPI Stats specific to this Customer */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--primary)" }}><Handshake /></div>
          <div>
            <p style={{ color: "#64748b", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "700" }}>Total Deals</p>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginTop: "0.25rem" }}>{totalDeals}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--warning)" }}><Banknote /></div>
          <div>
            <p style={{ color: "#64748b", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "700" }}>Total Pipeline</p>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginTop: "0.25rem" }}>₹{totalPipeline.toLocaleString('en-IN')}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--success)" }}><CheckCircle /></div>
          <div>
            <p style={{ color: "#64748b", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "700" }}>Closed / Won</p>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginTop: "0.25rem", color: "var(--success)" }}>₹{closedWonValue.toLocaleString('en-IN')}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(37, 99, 235, 0.1)", color: "var(--primary)" }}><Banknote /></div>
          <div>
            <p style={{ color: "#64748b", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "700" }}>Commissions Earned</p>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginTop: "0.25rem", color: "var(--primary)" }}>₹{commissionEarned.toLocaleString('en-IN')}</h2>
          </div>
        </div>
      </div>

      {/* Deals History */}
      <div className="dashboard-card">
        <h3 style={{ marginBottom: "1.5rem", fontSize: "1.2rem", fontWeight: "600" }}>Requirement & Deals History</h3>
        
        {customer.deals.length === 0 ? (
          <p style={{ color: "#64748b" }}>No deals or requirements logged for this customer yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {customer.deals.map(deal => {
              let vendorName = "Unknown/Pending";
              if (deal.wonVendor) {
                vendorName = deal.wonVendor.companyName;
              } else if (deal.referredVendors && deal.referredVendors.length === 1) {
                vendorName = deal.referredVendors[0].companyName;
              } else if (deal.referredVendors && deal.referredVendors.length > 1) {
                vendorName = "Multiple Vendors (Winner Undecided)";
              }

              return (
              <div key={deal.id} style={{ padding: "1.25rem", background: "#f8fafc", borderRadius: "12px", border: "1px solid var(--surface-border)", display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center", justifyContent: "space-between" }}>
                
                {/* Deal Info */}
                <div style={{ flex: "1 1 300px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "#64748b", background: "#e2e8f0", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                      {new Date(deal.createdAt).toLocaleDateString()}
                    </span>
                    <span style={{ color: "#94a3b8" }}>→ Sent to Vendor:</span>
                    <span style={{ fontWeight: "700", color: "var(--primary)", textDecoration: "none" }}>
                      {vendorName}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.95rem", color: "#475569", marginBottom: "0.75rem" }}>
                    <strong style={{ color: "var(--foreground)" }}>Requirement:</strong> {deal.requirementDescription}
                  </p>
                  <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                    Deal Value: <strong style={{ color: "var(--foreground)" }}>₹{deal.dealValue.toLocaleString('en-IN')}</strong> 
                    &nbsp;|&nbsp; 
                    Commission Expected: {deal.commissionType === "PERCENTAGE" ? `${deal.commissionValue}%` : `Fixed`} (₹{deal.commissionAmount.toLocaleString('en-IN')})
                  </div>
                </div>

                {/* Status Badges */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                  <form action={updateDealStatus.bind(null, deal.id, deal.dealStatus === "OPEN" ? "CLOSED" : "OPEN", deal.commissionStatus)}>
                    <button type="submit" style={{ 
                      background: deal.dealStatus === "OPEN" ? "rgba(2, 132, 199, 0.1)" : "rgba(16, 185, 129, 0.1)", 
                      color: deal.dealStatus === "OPEN" ? "var(--primary)" : "var(--success)", 
                      border: `1px solid ${deal.dealStatus === "OPEN" ? "rgba(2, 132, 199, 0.2)" : "rgba(16, 185, 129, 0.2)"}`, 
                      padding: "0.5rem 1rem", borderRadius: "2rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" 
                    }}>
                      Deal: {deal.dealStatus}
                    </button>
                  </form>

                  <form action={updateDealStatus.bind(null, deal.id, deal.dealStatus, deal.commissionStatus === "PENDING" ? "RECEIVED" : "PENDING")}>
                    <button type="submit" style={{ 
                      background: deal.commissionStatus === "PENDING" ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)", 
                      color: deal.commissionStatus === "PENDING" ? "var(--warning)" : "var(--success)", 
                      border: `1px solid ${deal.commissionStatus === "PENDING" ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)"}`, 
                      padding: "0.5rem 1rem", borderRadius: "2rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" 
                    }}>
                      Payout: {deal.commissionStatus}
                    </button>
                  </form>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
