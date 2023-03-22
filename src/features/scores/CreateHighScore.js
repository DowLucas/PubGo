// src/components/CreateScoresTable.js
import React, { useState } from "react";
import { useCreateScoresTableMutation } from "./scoresSlice";

const CreateScoresTable = () => {
  const [tableName, setTableName] = useState("");
  const [createScoresTable, { isLoading, error }] = useCreateScoresTableMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tableName.trim() === "") return;
    try {
      await createScoresTable({ tableName }).unwrap();
      setTableName("");
      // Handle success, e.g., show a success message or redirect
    } catch (error) {
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div>
      <h2>Create a new scores table</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Table name"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          Create table
        </button>
      </form>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
};

export default CreateScoresTable;