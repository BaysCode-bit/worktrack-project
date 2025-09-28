"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HouseDoorFill,
  PeopleFill,
  BriefcaseFill,
  BoxArrowLeft,
} from "react-bootstrap-icons";
import { useAuth } from "@/context/authContext";

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: HouseDoorFill },
    { name: "Users", href: "/users", icon: PeopleFill },
    { name: "Employees", href: "/employees", icon: BriefcaseFill },
  ];

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-white shadow-sm"
      style={{ width: "280px", height: "100vh" }}
    >
      <Link
        href="/users"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
      >
        <span className="fs-4 fw-bold text-primary">WorkTrack</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {navLinks.map((link) => (
          <li className="nav-item" key={link.name}>
            <Link
              href={link.href}
              className={`nav-link d-flex align-items-center ${
                pathname.startsWith(link.href) ? "active" : "link-dark"
              }`}
            >
              <link.icon className="bi me-2" size={18} />
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <hr />
      <button
        className="btn btn-light text-start d-flex align-items-center"
        onClick={logout}
      >
        <BoxArrowLeft className="bi me-2" size={18} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
