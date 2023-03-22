// src/components/SetHighScore.js
import React, { useState } from "react";
import {
  useFetchHighScoresTablesQuery,
  useSetNewHighScoreMutation,
} from "./scoresSlice";

const SetHighScore = () => {
  const { data: highScoresTables, error, isLoading } =
    useFetchHighScoresTablesQuery();
  const [setNewHighScore] = useSetNewHighScoreMutation();

  const [playerName, setPlayerName] = useState("");
  const [playerScore, setPlayerScore] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  const handleSetNewHighScore = async (e) => {
    e.preventDefault();

    if (!selectedTable || !playerName || !playerScore) return;

    try {
      await setNewHighScore({
        scoresTableId: selectedTable,
        newHighScore: { name: playerName, score: parseInt(playerScore) },
      }).unwrap();
      alert("High score submitted!");
      setPlayerName("");
      setPlayerScore("");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Set New High Score</h1>
      <form onSubmit={handleSetNewHighScore}>
        <label htmlFor="tableSelect">Select Score Table:</label>
        <select
          id="tableSelect"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="">Choose a table</option>
          {highScoresTables.map((table) => (
            <option key={table.id} value={table.id}>
              {table.name}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="playerName">Player Name:</label>
        <input
          id="playerName"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <br />
        <label htmlFor="playerScore">Player Score:</label>
        <input
          id="playerScore"
          type="number"
          value={playerScore}
          onChange={(e) => setPlayerScore(e.target.value)}
        />
        <br />
        <button type="submit">Submit High Score</button>
      </form>
    </div>
  );
};

export default SetHighScore;