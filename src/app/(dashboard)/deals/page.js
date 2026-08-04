import { prisma } from "@/lib/prisma";
import { addDeal, deleteDeal, updateDealStatus, updateDealStatusForm } from "@/lib/actions";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import DealForm from "@/components/DealForm";
import Tooltip from "@/components/Tooltip";
import DeleteButton from "@/components/DeleteButton";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DealsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const ITEMS_PER_PAGE = 10;

  const whereClause = query ? {
    OR: [
      { requirementDescription: { contains: query, mode: "insensitive" } },
      { customer: { companyName: { contains: query, mode: "insensitive" } } },
      { vendor: { companyName: { contains: query, mode: "insensitive" } } },
    ]
  } : {};

  const totalDeals = await prisma.deal.count({ where: whereClause });
  const totalPages = Math.ceil(totalDeals / ITEMS_PER_PAGE);

  const deals = await prisma.deal.findMany({
    where: whereClause,
    include: {
      customer: true,
      referredVendors: true,
      wonVendor: true
    },
    orderBy: { createdAt: "desc" },
    take: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  const customers = await prisma.customer.findMany({ orderBy: { companyName: "asc" } });
  const vendors = await prisma.vendor.findMany({ orderBy: { companyName: "asc" } });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Deals & Commissions</h1>
      </div>

      <div className="dashboard-card" style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 120px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", margin: 0 }}>Active & Past Deals</h3>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <Search placeholder="Search deals..." />
            <Modal buttonText="+ Add Deal" title="Create New Deal">
              {vendors.length === 0 || customers.length === 0 ? (
                <p style={{ color: "#f59e0b", padding: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertTriangle size={18} /> 
                  Please add at least one Customer and one Vendor before creating deals.
                </p>
              ) : (
                <DealForm action={addDeal} customers={customers} vendors={vendors} />
              )}
            </Modal>
          </div>
        </div>
        
        <div className="table-container" style={{ flex: 1 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Connection</th>
                <th>Requirement</th>
                <th>Value</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "#64748b", padding: "3rem" }}>
                    No deals found. Click "+ Add Deal" to create one.
                  </td>
                </tr>
              ) : (
                deals.map(deal => (
                  <tr key={deal.id}>
                    <td style={{ verticalAlign: "top", paddingTop: "1rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <span style={{ fontWeight: "700", color: "var(--foreground)", fontSize: "0.95rem" }}>{deal.customer.companyName}</span>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                          <span style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "2px" }}>↳</span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {deal.referredVendors.map(v => (
                              <span key={v.id} style={{ 
                                background: deal.wonVendorId === v.id ? "rgba(16, 185, 129, 0.1)" : "rgba(37, 99, 235, 0.05)",
                                color: deal.wonVendorId === v.id ? "var(--success)" : "var(--primary)",
                                border: `1px solid ${deal.wonVendorId === v.id ? "var(--success)" : "rgba(37, 99, 235, 0.2)"}`,
                                padding: "2px 8px", 
                                borderRadius: "12px", 
                                fontSize: "0.75rem", 
                                fontWeight: "600",
                                whiteSpace: "nowrap"
                              }}>
                                {v.companyName} {deal.wonVendorId === v.id && "🏆"}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: "250px", verticalAlign: "top", paddingTop: "1rem" }}>
                      <Tooltip text={deal.requirementDescription}>
                        <span style={{ color: "#475569" }}>{deal.requirementDescription}</span>
                      </Tooltip>
                    </td>
                    <td style={{ verticalAlign: "top", paddingTop: "1rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <strong style={{ color: "var(--foreground)" }}>₹{deal.dealValue.toLocaleString('en-IN')}</strong>
                        <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                          Comm: {deal.commissionType === "PERCENTAGE" ? `${deal.commissionValue}%` : `Fixed`} (₹{deal.commissionAmount.toLocaleString('en-IN')})
                        </span>
                      </div>
                    </td>
                    <td style={{ verticalAlign: "top", paddingTop: "1rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "190px" }}>
                        <form action={updateDealStatusForm.bind(null, deal.id, deal.commissionStatus)}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <div style={{ display: "flex", gap: "0.25rem" }}>
                              <select 
                                key={deal.dealStatus}
                                name="dealStatus" 
                                defaultValue={deal.dealStatus} 
                                className="input-field" 
                                style={{ 
                                  padding: "0.25rem 0.5rem", 
                                  fontSize: "0.75rem", 
                                  flex: 1,
                                  background: deal.dealStatus === "OPEN" ? "rgba(2, 132, 199, 0.05)" : "rgba(16, 185, 129, 0.05)",
                                  color: deal.dealStatus === "OPEN" ? "var(--primary)" : "var(--success)",
                                  border: `1px solid ${deal.dealStatus === "OPEN" ? "rgba(2, 132, 199, 0.2)" : "rgba(16, 185, 129, 0.2)"}`,
                                  fontWeight: "600",
                                  minWidth: "0" // allows flex child to shrink properly
                                }}
                              >
                                <option value="OPEN">Open</option>
                                <option value="CLOSED">Closed (Won)</option>
                              </select>
                              
                              <button type="submit" style={{ 
                                background: "var(--primary)", color: "white", border: "none", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer", fontWeight: "600",
                                flexShrink: 0
                              }}>
                                Save
                              </button>
                            </div>
                            
                            <select 
                              key={deal.wonVendorId || "none"}
                              name="wonVendorId" 
                              defaultValue={deal.wonVendorId || ""} 
                              className="input-field" 
                              style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", width: "100%" }}
                            >
                              <option value="">-- No Winner Yet --</option>
                              {deal.referredVendors.map(v => (
                                <option key={v.id} value={v.id}>{v.companyName}</option>
                              ))}
                            </select>
                          </div>
                        </form>
                        
                        <form action={updateDealStatus.bind(null, deal.id, deal.dealStatus, deal.commissionStatus === "PENDING" ? "RECEIVED" : "PENDING", deal.wonVendorId)}>
                          <button type="submit" style={{ 
                            background: deal.commissionStatus === "PENDING" ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)", 
                            color: deal.commissionStatus === "PENDING" ? "var(--warning)" : "var(--success)", 
                            border: `1px solid ${deal.commissionStatus === "PENDING" ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)"}`, 
                            padding: "0.25rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: "600",
                            width: "100%"
                          }}>
                            Payout: {deal.commissionStatus}
                          </button>
                        </form>
                      </div>
                    </td>
                    <td style={{ textAlign: "right", verticalAlign: "top", paddingTop: "1rem" }}>
                        <form action={deleteDeal.bind(null, deal.id)}>
                          <DeleteButton itemType="deal" />
                        </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: "1.5rem" }}>
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
