import { prisma } from "@/lib/prisma";
import { addDeal, deleteDeal, updateDealStatus, updateDealStatusForm } from "@/lib/actions";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import DealForm from "@/components/DealForm";
import Tooltip from "@/components/Tooltip";
import DeleteButton from "@/components/DeleteButton";
import { AlertTriangle, Trash2 } from "lucide-react";

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

      <div className="dashboard-card no-mobile-card" style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 120px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", margin: 0 }}>Active & Past Deals</h3>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <Search placeholder="Search deals..." />
          </div>
        </div>
        
        <div className="table-container desktop-only" style={{ flex: 1 }}>
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
                    <td data-label="Connection" style={{ verticalAlign: "top", paddingTop: "1rem" }}>
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
                    <td data-label="Requirement" style={{ maxWidth: "250px", verticalAlign: "top", paddingTop: "1rem" }}>
                      <Tooltip text={deal.requirementDescription}>
                        <span style={{ color: "#475569" }}>{deal.requirementDescription}</span>
                      </Tooltip>
                    </td>
                    <td data-label="Value" style={{ verticalAlign: "top", paddingTop: "1rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <strong style={{ color: "var(--foreground)" }}>₹{deal.dealValue.toLocaleString('en-IN')}</strong>
                        <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                          Comm: {deal.commissionType === "PERCENTAGE" ? `${deal.commissionValue}%` : `Fixed`} (₹{deal.commissionAmount.toLocaleString('en-IN')})
                        </span>
                      </div>
                    </td>
                    <td data-label="Status" style={{ verticalAlign: "top", paddingTop: "1rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%", maxWidth: "190px" }}>
                        <form action={updateDealStatusForm.bind(null, deal.id, deal.commissionStatus)} style={{ width: "100%" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                            <div style={{ display: "flex", gap: "0.25rem", width: "100%" }}>
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
                                  minWidth: "0"
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
                        
                        <form action={updateDealStatus.bind(null, deal.id, deal.dealStatus, deal.commissionStatus === "PENDING" ? "RECEIVED" : "PENDING", deal.wonVendorId)} style={{ width: "100%" }}>
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
                    <td data-label="Actions" style={{ textAlign: "right", verticalAlign: "top", paddingTop: "1rem" }}>
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

        {/* Mobile-Only Custom Deals List */}
        <div className="mobile-only" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {deals.length === 0 ? (
             <div style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
               No deals found. Click "+ Add Deal" to create one.
             </div>
          ) : (
            deals.map(deal => (
              <div key={deal.id} style={{
                background: "#ffffff",
                border: "none",
                borderRadius: "16px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                position: "relative",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
                borderTop: "4px solid var(--primary)"
              }}>
                {/* Trash Icon Absolute Top Right */}
                <form action={deleteDeal.bind(null, deal.id)} style={{ position: "absolute", top: "1rem", right: "1rem" }}>
                   <DeleteButton itemType="deal" iconOnly={true} />
                </form>

                {/* Header: Customer and Value */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingRight: "2rem" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "800", color: "var(--foreground)", fontSize: "1.15rem", letterSpacing: "-0.02em" }}>{deal.customer.companyName}</span>
                    <span style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.4" }}>
                      {deal.requirementDescription}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <strong style={{ color: "var(--primary)", fontSize: "1.25rem", fontWeight: "800", letterSpacing: "-0.02em" }}>₹{deal.dealValue.toLocaleString('en-IN')}</strong>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", marginTop: "2px" }}>
                      {deal.commissionType === "PERCENTAGE" ? `${deal.commissionValue}%` : `Fixed`} (₹{deal.commissionAmount.toLocaleString('en-IN')})
                    </span>
                  </div>
                </div>

                {/* Vendors */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginTop: "0.25rem" }}>
                   {deal.referredVendors.map(v => (
                     <span key={v.id} style={{ 
                       background: deal.wonVendorId === v.id ? "rgba(16, 185, 129, 0.1)" : "#f1f5f9",
                       color: deal.wonVendorId === v.id ? "var(--success)" : "#475569",
                       padding: "4px 10px", 
                       borderRadius: "16px", 
                       fontSize: "0.75rem", 
                       fontWeight: "600"
                     }}>
                       {v.companyName} {deal.wonVendorId === v.id && "🏆"}
                     </span>
                   ))}
                </div>

                {/* Actions Row (Invisible Controls) */}
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "1rem", 
                  paddingTop: "1rem", 
                  borderTop: "1px solid rgba(0,0,0,0.04)"
                }}>
                  <form action={updateDealStatusForm.bind(null, deal.id, deal.commissionStatus)} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Top Row: 50/50 Split for Selects, styled as text */}
                    <div style={{ display: "flex", gap: "1rem", width: "100%", alignItems: "center", padding: "0 0.25rem" }}>
                      <select 
                        key={deal.dealStatus}
                        name="dealStatus" 
                        defaultValue={deal.dealStatus} 
                        style={{ 
                          fontSize: "0.95rem", 
                          flex: 1,
                          background: "transparent",
                          color: deal.dealStatus === "OPEN" ? "var(--primary)" : "var(--success)",
                          border: "none",
                          fontWeight: "700",
                          minWidth: "0",
                          outline: "none",
                          padding: 0
                        }}
                      >
                        <option value="OPEN">Open Deal</option>
                        <option value="CLOSED">Closed (Won)</option>
                      </select>
                      
                      <div style={{ width: "1px", height: "24px", background: "rgba(0,0,0,0.06)" }}></div>
                      
                      <select 
                        key={deal.wonVendorId || "none"}
                        name="wonVendorId" 
                        defaultValue={deal.wonVendorId || ""} 
                        style={{ fontSize: "0.95rem", flex: 1.5, minWidth: "0", background: "transparent", border: "none", outline: "none", padding: 0, fontWeight: "600", color: "#475569" }}
                      >
                        <option value="">Select Winner...</option>
                        {deal.referredVendors.map(v => (
                          <option key={v.id} value={v.id}>{v.companyName}</option>
                        ))}
                      </select>
                    </div>
                    {/* Bottom Row: Full Width Save Button (Pill) */}
                    <button type="submit" style={{ 
                      background: "var(--foreground)", color: "white", border: "none", padding: "0.85rem", borderRadius: "24px", fontSize: "0.95rem", fontWeight: "600", width: "100%", boxShadow: "0 4px 10px -2px rgba(0,0,0,0.15)"
                    }}>
                      Save Changes
                    </button>
                  </form>
                  
                  {/* Payout Button */}
                  <form action={updateDealStatus.bind(null, deal.id, deal.dealStatus, deal.commissionStatus === "PENDING" ? "RECEIVED" : "PENDING", deal.wonVendorId)} style={{ width: "100%" }}>
                    <button type="submit" style={{ 
                      background: deal.commissionStatus === "PENDING" ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)", 
                      color: deal.commissionStatus === "PENDING" ? "var(--warning)" : "var(--success)", 
                      border: "none", 
                      padding: "0.85rem", borderRadius: "24px", fontSize: "0.95rem", fontWeight: "700",
                      width: "100%"
                    }}>
                      Payout: {deal.commissionStatus}
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div style={{ marginTop: "1.5rem" }}>
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
