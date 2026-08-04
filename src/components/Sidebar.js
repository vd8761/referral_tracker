"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Briefcase, Handshake, LogOut, TrendingUp, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import InstallAppButton from "./InstallAppButton";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "600", "700"] });

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Customers", href: "/customers", icon: <Users size={20} /> },
    { name: "Vendors", href: "/vendors", icon: <Briefcase size={20} /> },
    { name: "Deals", href: "/deals", icon: <Handshake size={20} /> },
    { name: "Settings", href: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <>
      <div className="mobile-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", userSelect: "none" }}>
          <div style={{
            position: "relative",
            width: "32px",
            height: "32px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            pointerEvents: "none"
          }}>
            <Image 
              src="/logo-icon-custom.jpg" 
              alt="Logo Icon" 
              fill 
              style={{ objectFit: "contain", mixBlendMode: "darken", transform: "scale(1.2)" }}
              priority
              unoptimized
            />
          </div>
          <div className={montserrat.className} style={{ fontSize: "1.25rem", fontWeight: "600", letterSpacing: "-0.3px", color: "#0f172a" }}>
            ReferralTracker
          </div>
        </div>
        <button onClick={() => signOut()} className="mobile-logout">
          <LogOut size={20} />
        </button>
      </div>

      <aside className="sidebar">
        <div className="desktop-logo" style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "flex-start", paddingLeft: "0.25rem", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", userSelect: "none" }}>
            <div style={{
              position: "relative",
              width: "42px",
              height: "42px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              pointerEvents: "none"
            }}>
              <Image 
                src="/logo-icon-custom.jpg" 
                alt="Logo Icon" 
                fill 
                style={{ objectFit: "contain", mixBlendMode: "darken", transform: "scale(1.2)" }}
                priority
                unoptimized
              />
            </div>
            <div className={montserrat.className} style={{ fontSize: "1.15rem", fontWeight: "700", letterSpacing: "-0.2px", color: "#0f172a" }}>
              ReferralTracker
            </div>
          </div>
        </div>
        
        <nav className="nav-menu" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`nav-item ${pathname === link.href ? "active" : ""}`}
            >
              {link.icon}
              <span className="nav-label">{link.name}</span>
            </Link>
          ))}
        </nav>
        
        <InstallAppButton />
        
        <button 
          onClick={() => signOut()}
          className="nav-item desktop-logout" 
          style={{ background: "transparent", border: "none", cursor: "pointer", width: "100%", textAlign: "left", color: "var(--danger)", marginTop: "auto" }}
        >
          <LogOut size={20} />
          <span className="nav-label">Sign Out</span>
        </button>
      </aside>
    </>
  );
}
