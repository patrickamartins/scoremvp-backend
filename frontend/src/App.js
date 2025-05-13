import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
        // Redirecione para o dashboard ou outra página se desejar
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

export default App;
