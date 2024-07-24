import React from "react";
import "./styles.css";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../../../firebase";

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isLoggedIn = !!auth.currentUser;
  return (
    <div className="navbar">
      <div className="gradient"></div>
      <div className="links">
        {!isLoggedIn && (
          <Link to="/" className={currentPath === "/" ? "active" : ""}>
            Signup
          </Link>
        )}

        <Link
          to="/ToDo-list"
          className={currentPath === "/ToDo-list" ? "active" : ""}
        >
          ToDo-List
        </Link>
        <Link
          to="/profile"
          className={currentPath === "/profile" ? "active" : ""}
        >
          Profile
        </Link>
      </div>
    </div>
  );
}

export default Header;
