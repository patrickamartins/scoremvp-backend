import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// --- Login ---
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        setMessage("Login realizado com sucesso!");
        setTimeout(() => {
          navigate("/estatisticas");
        }, 1000);
      } else {
        setMessage(data.message || "Erro ao fazer login.");
      }
    } catch (err) {
      setMessage("Erro de conexão com o servidor.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f3f3" }}>
      <form onSubmit={handleLogin} style={{ background: "#fff", padding: 32, borderRadius: 8, boxShadow: "0 2px 8px #0001", minWidth: 320 }}>
        <h2 style={{ marginBottom: 24, textAlign: "center" }}>Login</h2>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 4,
            border: "none",
            background: "#1976d2",
            color: "#fff",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {message && (
          <div style={{ marginTop: 16, color: message.includes("sucesso") ? "green" : "red", textAlign: "center" }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

// --- Estatísticas e Dashboard ---
function Estatisticas() {
  const [jogadoras, setJogadoras] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [tipo, setTipo] = useState("");
  const [idJogadora, setIdJogadora] = useState("");
  const [idJogo, setIdJogo] = useState("");
  const [message, setMessage] = useState("");
  const [dashboard, setDashboard] = useState(null);

  // Busca jogadoras e jogos ao carregar
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/jogadoras", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setJogadoras);

    fetch("/jogos", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setJogos);
  }, []);

  // Busca dashboard ao selecionar um jogo
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (idJogo) {
      fetch(`/dashboard?jogo_id=${idJogo}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then(setDashboard);
    }
  }, [idJogo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");
    const res = await fetch("/estatistica", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id_jogadora: idJogadora, id_jogo: idJogo, tipo }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Estatística registrada com sucesso!");
      // Atualiza o dashboard
      fetch(`/dashboard?jogo_id=${idJogo}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then(setDashboard);
    } else {
      setMessage(data.message || "Erro ao registrar estatística.");
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
      <h2>Registrar Estatística</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 16 }}>
          <label>Jogadora:</label>
          <select value={idJogadora} onChange={e => setIdJogadora(e.target.value)} required style={{ width: "100%", padding: 8 }}>
            <option value="">Selecione</option>
            {jogadoras.map(j => (
              <option key={j.id} value={j.id}>{j.nome}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Jogo:</label>
          <select value={idJogo} onChange={e => setIdJogo(e.target.value)} required style={{ width: "100%", padding: 8 }}>
            <option value="">Selecione</option>
            {jogos.map(j => (
              <option key={j.id} value={j.id}>{`${j.data} - ${j.adversario}`}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Tipo de Estatística:</label>
          <input
            type="text"
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            placeholder="Ex: Gol, Assistência, Defesa..."
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" style={{ padding: 10, background: "#1976d2", color: "#fff", border: "none", borderRadius: 4 }}>
          Registrar
        </button>
        {message && (
          <div style={{ marginTop: 16, color: message.includes("sucesso") ? "green" : "red" }}>
            {message}
          </div>
        )}
      </form>

      <h2>Dashboard do Jogo</h2>
      {dashboard ? (
        <div>
          <h4>Totais:</h4>
          <ul>
            {Object.entries(dashboard.totais).map(([tipo, qtd]) => (
              <li key={tipo}>{tipo}: {qtd}</li>
            ))}
          </ul>
          <h4>Destaques:</h4>
          <ul>
            {dashboard.destaques.map((d, idx) => (
              <li key={idx}>{d.tipo}: {d.jogadora} ({d.quantidade})</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Selecione um jogo para ver o dashboard.</p>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/estatisticas" element={<Estatisticas />} />
      </Routes>
    </Router>
  );
}

export default App;
