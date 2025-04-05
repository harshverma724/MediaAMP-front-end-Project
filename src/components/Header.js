import React from "react";
import { Link } from "react-router-dom";
import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";

function Header({ onSearch }) {
  return (
    <header style={styles.header}>
      {/* 🔹 Logo from Public Folder */}
      <img src="logo.png" alt="MediaAMP Logo" style={styles.logo} />

      <input
        type="text"
        placeholder="Search games..."
        onChange={(e) => onSearch(e.target.value)}
        style={styles.searchBar}
      />

      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/library" style={styles.link}>Library</Link>

        <SignedOut>
          <Link to="/sign-in" style={styles.link}>Sign In</Link>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
  },
  logo: {
    height: "50px",  // Adjust logo size
    width: "auto",
  },
  searchBar: {
    flexGrow: 1,
    maxWidth: "600px",
    padding: "12px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    margin: "0 20px",
  },
  nav: {
    display: "flex",
    alignItems: "center",
  },
  link: {
    marginLeft: "15px",
    textDecoration: "none",
    color: "#fff",
    fontSize: "1rem",
  },
};

export default Header;
