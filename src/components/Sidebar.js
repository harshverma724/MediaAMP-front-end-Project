import React, { useState } from "react";

function Sidebar({ onFilter }) {
  const [filters, setFilters] = useState({ category: "", releaseYear: "", popularity: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    onFilter({ ...filters, [name]: value });
  };

  return (
    <aside style={styles.sidebar}>
      <h3>Filters</h3>

      {/* Categories */}
      <label>Category:</label>
      <select name="category" value={filters.category} onChange={handleChange}>
        <option value="">All</option>
        <option value="Action">Action</option>
        <option value="Adventure">Adventure</option>
        <option value="RPG">RPG</option>
        <option value="Sports">Sports</option>
      </select>

      {/* Release Year */}
      <label>Release Year:</label>
      <input type="number" name="releaseYear" value={filters.releaseYear} onChange={handleChange} placeholder="Year" />

      {/* Popularity */}
      <label>Popularity:</label>
      <select name="popularity" value={filters.popularity} onChange={handleChange}>
        <option value="">All</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    height: "100vh",
  },
};

export default Sidebar;
