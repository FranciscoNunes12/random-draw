import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

export default function SorteioFutebol() {
  const [history, setHistory] = useState([]);
  const [currentDraw, setCurrentDraw] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [userName, setUserName] = useState("");
  const [players, setPlayers] = useState(Array(10).fill(""));
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("sorteios")) || [];
    setHistory(storedHistory);
  }, []);

  const realizarSorteio = () => {
    setOpenDialog(true);
  };

  const confirmarSorteio = () => {
    if (!userName || players.some(player => player.trim() === "")) return;

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const team1 = shuffledPlayers.slice(0, 5);
    const team2 = shuffledPlayers.slice(5, 10);
    const teamColors = Math.random() < 0.5 ? ["Branca", "Colorida"] : ["Colorida", "Branca"];

    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    const result = {
      id: uuidv4(),
      date: new Date().toLocaleString(),
      name: userName,
      attempt: newAttemptCount,
      teams: [
        { name: teamColors[0], players: team1 },
        { name: teamColors[1], players: team2 },
      ],
    };

    const updatedHistory = [result, ...history];
    setHistory(updatedHistory);
    setCurrentDraw(result);
    localStorage.setItem("sorteios", JSON.stringify(updatedHistory));
    setOpenDialog(false);
    setUserName("");
    setPlayers(Array(10).fill(""));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/4 bg-gray-100 p-4 overflow-auto hidden md:block">
        <h2 className="text-xl font-bold mb-4">Sorteios Anteriores</h2>
        <ul>
          {history.map((draw) => (
            <li
              key={draw.id}
              className="cursor-pointer p-2 border-b hover:bg-gray-200"
              onClick={() => setCurrentDraw(draw)}
            >
              <strong>{draw.name}</strong> - {draw.date} (Tentativa: {draw.attempt})
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Sorteio de Futebol</h1>
        <button
          onClick={realizarSorteio}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mb-4 w-full max-w-xs"
        >
          Realizar Sorteio
        </button>
        {currentDraw && (
          <div className="mt-4 p-4 border rounded-lg shadow-lg w-full max-w-lg bg-white">
            <h2 className="text-xl font-semibold text-center">Resultado do Sorteio</h2>
            <p className="text-gray-600 text-center">Sorteado por: {currentDraw.name}</p>
            <p className="text-gray-600 text-center">Data: {currentDraw.date}</p>
            <p className="text-gray-600 text-center">Tentativa Nº: {currentDraw.attempt}</p>
            {currentDraw.teams.map((team, index) => (
              <div key={index} className="mt-2">
                <h3 className={`text-lg font-bold text-center ${team.name === "Branca" ? "text-blue-600" : "text-red-600"}`}>
                  {team.name}
                </h3>
                <ul className="list-disc ml-4 text-center">
                  {team.players.map((player, idx) => (
                    <li key={idx} className="text-gray-700">{player}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Informações do Sorteio</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Sorteador"
            fullWidth
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          {players.map((player, index) => (
            <TextField
              key={index}
              margin="dense"
              label={`Jogador ${index + 1}`}
              fullWidth
              value={player}
              onChange={(e) => {
                const newPlayers = [...players];
                newPlayers[index] = e.target.value;
                setPlayers(newPlayers);
              }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={confirmarSorteio} color="primary">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
