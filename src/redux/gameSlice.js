import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 Fetch games from RAWG API with pagination
export const fetchGames = createAsyncThunk("games/fetchGames", async (page = 1) => {
  const API_KEY = "729a5c53841d440b9c05c17105a640e6";
  const response = await axios.get(
    `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=20`
  );

  const games = response.data.results.map((game) => ({
    id: game.id,
    name: game.name,
    description: game.slug,
    image: game.background_image,
    rating: game.rating,
    category: game.genres?.[0]?.name || "N/A",
    releaseYear: new Date(game.released).getFullYear(),
    tags: game.tags?.slice(0, 3) || [],
  }));

  return games;
});

const gameSlice = createSlice({
  name: "games",
  initialState: {
    games: [],
    savedGames: [],
    status: "idle",
    error: null,
  },
  reducers: {
    saveGame: (state, action) => {
      const exists = state.savedGames.find((g) => g.id === action.payload.id);
      if (!exists) {
        state.savedGames.push(action.payload);
      }
    },
    removeGame: (state, action) => {
      state.savedGames = state.savedGames.filter((g) => g.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.games = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { saveGame, removeGame } = gameSlice.actions;
export default gameSlice.reducer;
