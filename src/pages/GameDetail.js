import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function GameDetail({ darkMode }) {
  const { id } = useParams();
  const [gameDetail, setGameDetail] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [trailers, setTrailers] = useState([]);

  const API_KEY = "729a5c53841d440b9c05c17105a640e6";

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        const detailRes = await axios.get(
          `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
        );
        setGameDetail(detailRes.data);

        const screenshotRes = await axios.get(
          `https://api.rawg.io/api/games/${id}/screenshots?key=${API_KEY}`
        );
        setScreenshots(screenshotRes.data.results || []);

        const trailerRes = await axios.get(
          `https://api.rawg.io/api/games/${id}/movies?key=${API_KEY}`
        );
        setTrailers(trailerRes.data.results || []);
      } catch (error) {
        console.error("Error fetching game detail:", error);
      }
    };

    fetchGameDetail();
  }, [id]);

  if (!gameDetail) return <div>Loading game details...</div>;

  return (
    <div style={darkMode ? styles.containerDark : styles.container}>
      <h2 style={darkMode ? styles.titleDark : styles.title}>{gameDetail.name}</h2>

      <img
        src={gameDetail.background_image}
        alt={gameDetail.name}
        style={styles.mainImage}
      />

      <p style={darkMode ? styles.descriptionDark : styles.description}>
        {gameDetail.description_raw || "No description available."}
      </p>

      <p style={darkMode ? styles.textDark : styles.text}>
        <strong>Released:</strong> {gameDetail.released}
      </p>
      <p style={darkMode ? styles.textDark : styles.text}>
        <strong>Rating:</strong> ⭐ {gameDetail.rating}
      </p>
      <p style={darkMode ? styles.textDark : styles.text}>
        <strong>Platforms:</strong>{" "}
        {gameDetail.platforms
          ?.map((p) => p.platform.name)
          .join(", ") || "N/A"}
      </p>
      <p style={darkMode ? styles.textDark : styles.text}>
        <strong>Genres:</strong>{" "}
        {gameDetail.genres?.map((g) => g.name).join(", ") || "N/A"}
      </p>

      {/* Screenshots Section */}
      {screenshots.length > 0 && (
        <div style={styles.screenshotContainer}>
          <h3 style={darkMode ? styles.subtitleDark : styles.subtitle}>🖼️ Screenshots</h3>
          <div style={styles.screenshotScroll}>
            {screenshots.map((shot) => (
              <img
                key={shot.id}
                src={shot.image}
                alt="Screenshot"
                style={styles.screenshot}
              />
            ))}
          </div>
        </div>
      )}

      {/* Trailers Section */}
      {trailers.length > 0 && (
        <div style={styles.trailerContainer}>
          <h3 style={darkMode ? styles.subtitleDark : styles.subtitle}>🎬 Trailers</h3>
          <div style={styles.trailerScroll}>
            {trailers.map((trailer) => (
              <video
                key={trailer.id}
                src={trailer.data.max}
                controls
                style={styles.trailer}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  containerDark: {
    padding: "20px",
    backgroundColor: "#121212",
    minHeight: "100vh",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#222",
  },
  titleDark: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#fff",
  },
  mainImage: {
    width: "100%",
    maxHeight: "400px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  description: {
    fontSize: "16px",
    color: "#444",
    marginBottom: "15px",
  },
  descriptionDark: {
    fontSize: "16px",
    color: "#ccc",
    marginBottom: "15px",
  },
  text: {
    fontSize: "15px",
    color: "#333",
    marginBottom: "8px",
  },
  textDark: {
    fontSize: "15px",
    color: "#bbb",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "25px 0 10px",
    color: "#333",
  },
  subtitleDark: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "25px 0 10px",
    color: "#fff",
  },
  screenshotContainer: {
    marginTop: "20px",
  },
  screenshotScroll: {
    display: "flex",
    overflowX: "auto",
    gap: "10px",
    paddingBottom: "10px",
  },
  screenshot: {
    width: "100%",
    maxWidth: "300px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    flexShrink: 0,
  },
  trailerContainer: {
    marginTop: "30px",
  },
  trailerScroll: {
    display: "flex",
    overflowX: "auto",
    gap: "10px",
    paddingBottom: "10px",
  },
  trailer: {
    width: "100%",
    maxWidth: "400px",
    height: "250px",
    borderRadius: "10px",
    flexShrink: 0,
    backgroundColor: "#000",
  },
};

export default GameDetail;
