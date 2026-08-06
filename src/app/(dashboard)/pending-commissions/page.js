import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, Building2, User } from "lucide-react";
import { updateDealStatus } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function PendingCommissionsPage() {
  const pendingDeals = await prisma.deal.findMany({
    where: { commissionStatus: "PENDING" },
    include: {
      customer: true,
      referredVendors: true,
      wonVendor: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalPendingAmount = pendingDeals.reduce((acc, deal) => acc + deal.commissionAmount, 0);

  return (
    <div>
      <div className="page-header" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem", padding: "0.5rem 1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div>
          <h1 className="page-title">Pending Collections</h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem" }}>Track and manage outstanding commissions from vendors.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="dashboard-card" style={{ background: "rgba(239, 68, 68, 0.05)", borderColor: "rgba(239, 68, 68, 0.2)" }}>
          <p style={{ color: "var(--danger)", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "700" }}>Total Pending Amount</p>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", marginTop: "0.25rem", color: "var(--danger)" }}>₹{totalPendingAmount.toLocaleString('en-IN')}</h2>
        </div>
        <div className="dashboard-card">
          <p style={{ color: "#64748b", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "700" }}>Unpaid Deals</p>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", marginTop: "0.25rem", color: "var(--foreground)" }}>{pendingDeals.length}</h2>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--foreground)", marginBottom: "0.5rem" }}>Action Required</h3>
        
        {pendingDeals.length === 0 ? (
          <div className="dashboard-card" style={{ textAlign: "center", padding: "3rem", color: "#64748b", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <CheckCircle size={48} color="var(--success)" />
            <div>
              <h3 style={{ color: "var(--foreground)", fontSize: "1.2rem", marginBottom: "0.5rem" }}>All Caught Up!</h3>
              <p>You have no pending commissions to collect.</p>
            </div>
          </div>
        ) : (
          pendingDeals.map((deal) => {
            let vendorName = "Unknown/Pending";
            if (deal.wonVendor) {
              vendorName = deal.wonVendor.companyName;
            } else if (deal.referredVendors && deal.referredVendors.length === 1) {
              vendorName = deal.referredVendors[0].companyName;
            } else if (deal.referredVendors && deal.referredVendors.length > 1) {
              vendorName = "Multiple Vendors (Winner Undecided)";
            }

            return (
              <div key={deal.id} className="dashboard-card" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1.5rem", borderLeft: "4px solid var(--danger)" }}>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--danger)", fontWeight: "700", fontSize: "1.1rem" }}>
                    <AlertCircle size={20} />
                    ₹{deal.commissionAmount.toLocaleString('en-IN')}
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--foreground)", fontWeight: "600" }}>
                      <Building2 size={16} color="#94a3b8" /> {vendorName}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", fontSize: "0.9rem" }}>
                      <User size={16} color="#94a3b8" /> {deal.customer.companyName}
                    </div>
                  </div>
                  
                  <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem", color: "#475569", border: "1px solid #e2e8f0" }}>
                    "{deal.requirementDescription}"
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: "160px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#64748b", background: "#f8fafc", padding: "0.5rem", borderRadius: "6px" }}>
                    <span>Deal Value:</span>
                    <strong style={{ color: "var(--foreground)" }}>₹{deal.dealValue.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#64748b", background: "#f8fafc", padding: "0.5rem", borderRadius: "6px" }}>
                    <span>Comm Type:</span>
                    <strong style={{ color: "var(--foreground)" }}>{deal.commissionType === "PERCENTAGE" ? `${deal.commissionValue}%` : 'Fixed'}</strong>
                  </div>
                  
                  <form action={updateDealStatus.bind(null, deal.id, deal.dealStatus, "RECEIVED", deal.wonVendorId)}>
                    <button type="submit" style={{ 
                      width: "100%", marginTop: "0.5rem", background: "var(--success)", color: "white", border: "none", 
                      padding: "0.75rem", borderRadius: "8px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)"
                    }}>
                      <CheckCircle size={18} /> Mark as Received
                    </button>
                  </form>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
