import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Paper, Typography, Box, List, ListItem, 
  ListItemText, Container, Card, CardContent, IconButton 
} from "@mui/material";
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import CasinoIcon from '@mui/icons-material/Casino';

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
    <Container sx={{ mt: 4, textAlign: "center" }}>
      {/* Histórico de sorteios */}
      <Paper elevation={4} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          📜 Sorteios Anteriores
        </Typography>
        <List>
          {history.map((draw) => (
            <ListItem 
              button 
              key={draw.id} 
              onClick={() => setCurrentDraw(draw)} 
              sx={{ borderBottom: "1px solid #ddd", borderRadius: 2, "&:hover": { backgroundColor: "#f1f1f1" } }}
            >
              <ListItemText 
                primary={<strong>{draw.name}</strong>} 
                secondary={`${draw.date} (Tentativa: ${draw.attempt})`} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Botão de sorteio */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          <SportsSoccerIcon sx={{ fontSize: 40, color: "#1565c0" }} /> Peladinha - Sorteio de Equipas
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          startIcon={<CasinoIcon />}
          onClick={realizarSorteio}
          sx={{
            borderRadius: 3,
            padding: "12px 24px",
            fontSize: "1rem",
            fontWeight: "bold",
            transition: "0.3s",
            "&:hover": { backgroundColor: "#003c8f" }
          }}
        >
          SORTEAR EQUIPAS
        </Button>
      </Box>

      {/* Resultado do sorteio */}
      {currentDraw && (
        <Card elevation={4} sx={{ maxWidth: 500, mx: "auto", p: 3, borderRadius: 3 }}>
          <Typography variant="h5" align="center">
            🎯 Resultado do Sorteio
          </Typography>
          <Typography align="center">Sorteado por: <strong>{currentDraw.name}</strong></Typography>
          <Typography align="center">📅 {currentDraw.date}</Typography>
          <Typography align="center">🔄 Tentativa Nº: {currentDraw.attempt}</Typography>

          {currentDraw.teams.map((team, index) => (
            <CardContent 
              key={index} 
              sx={{
                mt: 2, 
                backgroundColor: team.name === "Branca" ? "#e3f2fd" : "#ffebee", 
                borderRadius: 2
              }}
            >
              <Typography variant="h6" align="center" sx={{ fontWeight: "bold", color: team.name === "Branca" ? "#1565c0" : "#b71c1c" }}>
                {team.name} 🏆
              </Typography>
              <List>
                {team.players.map((player, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={player} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          ))}
        </Card>
      )}

      {/* Modal de entrada */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>🎲 Informações do Sorteio</DialogTitle>
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
    </Container>
  );
}
