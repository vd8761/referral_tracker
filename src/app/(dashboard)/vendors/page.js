import { prisma } from "@/lib/prisma";
import { addVendor, deleteVendor } from "@/lib/actions";
import Link from "next/link";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import VendorForm from "@/components/VendorForm";
import Tooltip from "@/components/Tooltip";
import DeleteButton from "@/components/DeleteButton";
import { Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VendorsPage({ searchParams }) {
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

  const totalVendors = await prisma.vendor.count({ where: whereClause });
  const totalPages = Math.ceil(totalVendors / ITEMS_PER_PAGE);

  const vendors = await prisma.vendor.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Vendors</h1>
        <Modal buttonText="+ Add Vendor" title="Add New Vendor">
          <VendorForm action={addVendor} />
        </Modal>
      </div>

      <div className="dashboard-card" style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 120px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", margin: 0 }}>Vendor Directory</h3>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <Search placeholder="Search vendors..." />
          </div>
        </div>
        
        <div className="table-container" style={{ flex: 1 }}>
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
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "#64748b", padding: "3rem" }}>
                    No vendors found. Click "+ Add Vendor" to get started.
                  </td>
                </tr>
              ) : (
                vendors.map(v => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: "600" }}>{v.companyName}</td>
                    <td>{v.contactPerson || "-"}</td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        {v.email && <span style={{ fontSize: "0.85rem", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}><Mail size={12} /> {v.email}</span>}
                        {v.phone && <span style={{ fontSize: "0.85rem", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}><Phone size={12} /> {v.phone}</span>}
                        {!v.email && !v.phone && <span style={{ color: "#94a3b8" }}>-</span>}
                      </div>
                    </td>
                    <td style={{ maxWidth: "250px" }}>
                      {v.specialties ? (
                        <Tooltip text={v.specialties}>
                          <span style={{ fontStyle: "italic", color: "#64748b" }}>{v.specialties}</span>
                        </Tooltip>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                        <Link href={`/vendors/${v.id}`} style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--primary)", border: "1px solid rgba(2, 132, 199, 0.2)", padding: "0.4rem 0.75rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "600", whiteSpace: "nowrap" }}>
                          History
                        </Link>
                        <form action={deleteVendor.bind(null, v.id)}>
                          <DeleteButton itemType="vendor" />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div>
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
