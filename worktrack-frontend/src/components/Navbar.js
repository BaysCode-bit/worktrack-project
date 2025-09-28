"use client";
import { BellFill, PersonCircle } from "react-bootstrap-icons";
import { NavDropdown } from "react-bootstrap";
import { useAuth } from "@/context/authContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid">
        {/* Dibiarkan kosong agar item didorong ke kanan */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <BellFill size={20} />
              </a>
            </li>
            <li className="nav-item">
              <NavDropdown
                title={
                  <div className="d-flex align-items-center">
                    <PersonCircle size={24} className="me-2" />
                    <span>{user ? user.email : "User"}</span>
                  </div>
                }
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
