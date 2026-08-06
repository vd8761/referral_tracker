import { prisma } from "@/lib/prisma";
import { addCustomer, deleteCustomer } from "@/lib/actions";
import Link from "next/link";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import CustomerForm from "@/components/CustomerForm";
import Tooltip from "@/components/Tooltip";
import DeleteButton from "@/components/DeleteButton";
import { Mail, Phone, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomersPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const ITEMS_PER_PAGE = 10;

  const whereClause = query ? {
    OR: [
      { companyName: { contains: query, mode: "insensitive" } },
      { contactPerson: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ]
  } : {};

  const totalCustomers = await prisma.customer.count({ where: whereClause });
  const totalPages = Math.ceil(totalCustomers / ITEMS_PER_PAGE);

  const customers = await prisma.customer.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <Modal buttonText="+ Add Customer" title="Add New Customer">
          <CustomerForm action={addCustomer} />
        </Modal>
      </div>

      <div className="dashboard-card no-mobile-card" style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 120px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", margin: 0 }}>Customer Directory</h3>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <Search placeholder="Search customers..." />
          </div>
        </div>
        
        <div className="table-container desktop-only" style={{ flex: 1 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact Person</th>
                <th>Email & Phone</th>
                <th>Notes</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "#64748b", padding: "3rem" }}>
                    No customers found. Click "+ Add Customer" to get started.
                  </td>
                </tr>
              ) : (
                customers.map(c => (
                  <tr key={c.id}>
                    <td data-label="Company" style={{ fontWeight: "600" }}>{c.companyName}</td>
                    <td data-label="Contact Person">{c.contactPerson || "-"}</td>
                    <td data-label="Email & Phone">
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        {c.email && <span style={{ fontSize: "0.85rem", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}><Mail size={12} /> {c.email}</span>}
                        {c.phone && <span style={{ fontSize: "0.85rem", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}><Phone size={12} /> {c.phone}</span>}
                        {!c.email && !c.phone && <span style={{ color: "#94a3b8" }}>-</span>}
                      </div>
                    </td>
                    <td data-label="Notes" style={{ maxWidth: "250px" }}>
                      {c.notes ? (
                        <Tooltip text={c.notes}>
                          <span style={{ fontStyle: "italic", color: "#64748b" }}>{c.notes}</span>
                        </Tooltip>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td data-label="Actions">
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                        <Link href={`/customers/${c.id}`} style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--primary)", border: "1px solid rgba(2, 132, 199, 0.2)", padding: "0.4rem 0.75rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "600", whiteSpace: "nowrap" }}>
                          History
                        </Link>
                        <form action={deleteCustomer.bind(null, c.id)}>
                          <DeleteButton itemType="customer" />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile-Only Custom Customers List */}
        <div className="mobile-only" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {customers.length === 0 ? (
             <div style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
               No customers found. Click "+ Add Customer" to get started.
             </div>
          ) : (
            customers.map(c => (
                <div key={c.id} style={{
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
                <form action={deleteCustomer.bind(null, c.id)} style={{ position: "absolute", top: "1rem", right: "1rem" }}>
                   <DeleteButton itemType="customer" iconOnly={true} />
                </form>

                {/* Header: Customer and Contact Person */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingRight: "2rem" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "800", color: "var(--foreground)", fontSize: "1.15rem", letterSpacing: "-0.02em" }}>{c.companyName}</span>
                    <span style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "4px" }}>
                      {c.contactPerson || "No Contact Person"}
                    </span>
                  </div>
                </div>

                {/* Clean Contact Info (No Background Blocks) */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", marginTop: "0.25rem" }}>
                  {c.email && (
                    <a href={`mailto:${c.email}`} style={{ fontSize: "0.85rem", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "6px", fontWeight: "500", textDecoration: "none" }}>
                      <Mail size={16} color="var(--primary)" /> {c.email}
                    </a>
                  )}
                  {c.phone && (
                    <a href={`tel:${c.phone}`} style={{ fontSize: "0.85rem", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "6px", fontWeight: "500", textDecoration: "none" }}>
                      <Phone size={16} color="var(--primary)" /> {c.phone}
                    </a>
                  )}
                </div>

                {c.notes && (
                  <div style={{ padding: "0.75rem 0 0 0", borderTop: "1px dashed rgba(0,0,0,0.06)" }}>
                    <span style={{ fontStyle: "italic", color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.4", display: "block" }}>"{c.notes}"</span>
                  </div>
                )}

                {/* View History Button */}
                <div style={{ marginTop: "0.25rem" }}>
                  <Link href={`/customers/${c.id}`} style={{ 
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    width: "100%", background: "rgba(2, 132, 199, 0.08)", color: "var(--primary)",
                    padding: "0.75rem", borderRadius: "12px", textDecoration: "none", fontWeight: "700", fontSize: "0.9rem",
                    transition: "background 0.2s"
                  }}>
                    View History &rarr;
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div>
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
