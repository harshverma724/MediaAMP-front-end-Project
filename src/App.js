import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
} from "@clerk/clerk-react";

// Import Pages
import Home from "./pages/Home";
import GameDetail from "./pages/GameDetail";
import Library from "./pages/Library";

// Import Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div style={darkMode ? styles.appContainerDark : styles.appContainer}>
      <Header onSearch={setSearchQuery} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div style={styles.mainLayout}>
        <Sidebar onFilter={setFilters} darkMode={darkMode} />

        <main style={darkMode ? styles.contentDark : styles.content}>
          <Routes>
            {/* Auth Pages */}
            <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
            <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />

            {/* Public Routes */}
            <Route path="/" element={<Home searchQuery={searchQuery} filters={filters} darkMode={darkMode} />} />
            <Route path="/game/:id" element={<GameDetail darkMode={darkMode} />} />

            {/* Protected Route */}
            <Route
              path="/library"
              element={
                <SignedIn>
                  <Library darkMode={darkMode} />
                </SignedIn>
              }
            />
            <Route
              path="/library"
              element={
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              }
            />

            {/* Fallback for unknown routes */}
            <Route
              path="*"
              element={
                <div style={{ color: darkMode ? "#fff" : "#000", padding: 20 }}>
                  Page not found.
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#f8f9fa",
  },
  appContainerDark: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#121212",
  },
  mainLayout: {
    display: "flex",
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#fff",
  },
  contentDark: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#1e1e1e",
  },
};

export default App;
