import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { fetchGames, saveGame } from "../redux/gameSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home({ searchQuery, filters, darkMode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { games, status, savedGames } = useSelector((state) => state.games);
  const { user, isLoaded } = useUser();

  const [filteredGames, setFilteredGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 8;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGames());
    }
  }, [status, dispatch]);

  useEffect(() => {
    let filtered = games;
    if (searchQuery) {
      filtered = filtered.filter((game) =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filters.category) {
      filtered = filtered.filter((game) => game.category === filters.category);
    }
    if (filters.releaseYear) {
      filtered = filtered.filter(
        (game) => game.releaseYear?.toString() === filters.releaseYear
      );
    }
    setFilteredGames(filtered);
    setCurrentPage(1);
  }, [games, searchQuery, filters]);

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const currentGames = filteredGames.slice(startIndex, startIndex + gamesPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const isGameSaved = (gameId) => {
    return savedGames.some((savedGame) => savedGame.id === gameId);
  };

  if (!isLoaded) {
    return (
      <div style={darkMode ? styles.containerDark : styles.container}>
        <p style={darkMode ? styles.pageTextDark : styles.pageText}>Loading...</p>
      </div>
    );
  }

  return (
    <motion.div
      style={darkMode ? styles.containerDark : styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <h1 style={darkMode ? styles.titleDark : styles.title}>
        {user ? `Welcome, ${user?.firstName}!` : "🎮 Welcome to MediaAMP!"}
      </h1>
      <p style={darkMode ? styles.subtitleDark : styles.subtitle}>
        Discover, search, and save your favorite games.
      </p>
      {!user && (
        <p style={darkMode ? styles.pageTextDark : styles.pageText}>
          Create an account or log in to explore all features including bookmarking and viewing game details.
        </p>
      )}

      {/* Game List */}
      <h2 style={{ ...styles.subtitle, marginTop: "30px", textAlign: "left" }}>
        Game List
      </h2>

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error loading games.</p>}

      <div style={styles.grid}>
        {currentGames.map((game) => (
          <motion.div
            key={game.id}
            style={darkMode ? styles.cardDark : styles.card}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate(`/game/${game.id}`)}
          >
            <img
              src={
                game.image && game.image.startsWith("http")
                  ? game.image
                  : "https://via.placeholder.com/250"
              }
              alt={game.name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/250";
              }}
              style={styles.image}
            />
            <h3 style={darkMode ? styles.gameTitleDark : styles.gameTitle}>
              {game.name}
            </h3>
            <p style={darkMode ? styles.descriptionDark : styles.description}>
              {game.description ? game.description : "No description available."}
            </p>
            <p style={darkMode ? styles.tagsDark : styles.tags}>
              <strong>Tags:</strong>
              {game.tags && game.tags.length > 0 ? (
                <span> {game.tags.map((tag) => tag.name).join(", ")}</span>
              ) : (
                " N/A"
              )}
            </p>
            <div style={styles.infoContainer}>
              <p><strong>Category:</strong> {game.category || "N/A"}</p>
              <p><strong>Rating:</strong> ⭐ {game.rating || "N/A"}</p>
            </div>
            <div style={styles.buttonContainer}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (user && !isGameSaved(game.id)) {
                    dispatch(saveGame(game));
                  }
                }}
                style={{
                  ...styles.button,
                  backgroundColor: user
                    ? (isGameSaved(game.id) ? "#28a745" : "#dc3545")
                    : "#6c757d",
                  cursor: user
                    ? (isGameSaved(game.id) ? "not-allowed" : "pointer")
                    : "not-allowed",
                }}
                disabled={!user || isGameSaved(game.id)}
              >
                {user
                  ? isGameSaved(game.id)
                    ? "Saved"
                    : "Save to Library"
                  : "Sign in to Save"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div style={styles.paginationContainer}>
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          style={styles.paginationButton}
        >
          Previous
        </button>
        <span style={darkMode ? styles.pageTextDark : styles.pageText}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}


const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  containerDark: {
    padding: "20px",
    backgroundColor: "#121212",
    minHeight: "100vh",
  },
  title: {
    color: "#333",
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
  },
  titleDark: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#555",
    fontSize: "22px",
    marginBottom: "20px",
    textAlign: "center",
  },
  subtitleDark: {
    color: "#bbb",
    fontSize: "22px",
    marginBottom: "20px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },
  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    textAlign: "center",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  cardDark: {
    padding: "15px",
    border: "1px solid #444",
    borderRadius: "8px",
    backgroundColor: "#222",
    textAlign: "center",
    boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  gameTitle: {
    color: "#333",
    fontSize: "18px",
    fontWeight: "bold",
  },
  gameTitleDark: {
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
  },
  description: {
    color: "#666",
    fontSize: "14px",
    minHeight: "40px",
  },
  descriptionDark: {
    color: "#aaa",
    fontSize: "14px",
    minHeight: "40px",
  },
  tags: {
    color: "#777",
    fontSize: "13px",
  },
  tagsDark: {
    color: "#bbb",
    fontSize: "13px",
  },
  infoContainer: {
    marginTop: "auto",
    marginBottom: "10px",
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    padding: "10px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  paginationContainer: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
  },
  paginationButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  pageText: {
    color: "#333",
    fontSize: "16px",
  },
  pageTextDark: {
    color: "#ccc",
    fontSize: "16px",
  },
};

export default Home;
