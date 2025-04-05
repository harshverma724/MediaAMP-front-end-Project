import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeGame } from "../redux/gameSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Library({ darkMode }) {
  const dispatch = useDispatch();
  const savedGames = useSelector((state) => state.games.savedGames);
  const [previewImages, setPreviewImages] = useState({});

  useEffect(() => {
    const fetchPreviewImages = async () => {
      const previews = {};
      await Promise.all(
        savedGames.map(async (game) => {
          try {
            const response = await fetch(
              `https://api.rawg.io/api/games/${game.id}/screenshots?key=YOUR_RAWG_API_KEY`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              previews[game.id] = data.results[0].image;
            }
          } catch (error) {
            console.error(`Error fetching screenshot for game ${game.id}:`, error);
          }
        })
      );
      setPreviewImages(previews);
    };

    if (savedGames.length > 0) {
      fetchPreviewImages();
    }
  }, [savedGames]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={darkMode ? styles.containerDark : styles.container}
    >
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={darkMode ? styles.titleDark : styles.title}
      >
        My Library
      </motion.h1>

      <div style={styles.grid}>
        {savedGames.map((game, index) => (
          <motion.div
            key={game.id}
            style={darkMode ? styles.cardDark : styles.card}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.03 }}
          >
            <img
              src={
                previewImages[game.id] ||
                game.image ||
                "https://via.placeholder.com/250"
              }
              alt={game.name}
              style={styles.image}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/250";
              }}
            />
            <h3 style={darkMode ? styles.gameTitleDark : styles.gameTitle}>
              {game.name}
            </h3>
            <p style={darkMode ? styles.descriptionDark : styles.description}>
              {game.description || "No description available."}
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
              <Link to={`/game/${game.id}`} style={styles.detailsButton}>
                View Details
              </Link>
              <button
                onClick={() => dispatch(removeGame(game.id))}
                style={styles.button}
              >
                Remove from Library
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  containerDark: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#121212",
    minHeight: "100vh",
  },
  title: {
    color: "#333",
    fontSize: "28px",
    fontWeight: "bold",
  },
  titleDark: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "bold",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    textAlign: "center",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  cardDark: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    padding: "15px",
    border: "1px solid #444",
    borderRadius: "8px",
    backgroundColor: "#222",
    textAlign: "center",
    boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.1)",
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
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  detailsButton: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    borderRadius: "5px",
    textDecoration: "none",
  },
};

export default Library;
