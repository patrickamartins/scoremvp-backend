import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

interface Jogo {
  id: number;
  data: string;
  local: string;
  horario: string;
  adversario: string;
  categoria: string;
}

interface Estatistica {
  tipo: string;
  jogadora: string;
  quantidade: number;
}

interface DashboardData {
  totais: Record<string, number>;
  destaques: Estatistica[];
}

const API_URL = 'https://scoremvp-backend-production.up.railway.app';
const COLORS = ['#6366f1', '#f59e42', '#10b981', '#ef4444', '#fbbf24', '#3b82f6', '#a21caf', '#eab308', '#14b8a6', '#f472b6'];

const Dashboard: React.FC = () => {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [jogoSelecionado, setJogoSelecionado] = useState<string>('');
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const response = await axios.get(`${API_URL}/jogos`);
        setJogos(response.data);
        if (response.data.length > 0) {
          setJogoSelecionado(String(response.data[response.data.length - 1].id));
        }
      } catch (error) {
        setError('Erro ao carregar lista de jogos');
      }
    };
    fetchJogos();
  }, []);

  useEffect(() => {
    const fetchDados = async () => {
      if (!jogoSelecionado) {
        setDados(null);
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/dashboard?jogo_id=${jogoSelecionado}`);
        setDados(response.data);
        setError('');
      } catch (error) {
        setError('Erro ao carregar dados do dashboard');
        setDados(null);
      }
    };
    fetchDados();
  }, [jogoSelecionado]);

  const totaisData = dados
    ? Object.entries(dados.totais).map(([tipo, quantidade]) => ({ tipo, quantidade }))
    : [];

  const destaquesData = dados
    ? dados.destaques.map((d, i) => ({
        name: d.jogadora + ' - ' + d.tipo,
        value: d.quantidade,
        tipo: d.tipo,
        jogadora: d.jogadora,
        fill: COLORS[i % COLORS.length]
      }))
    : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">ScoreMVP</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <label htmlFor="jogo" className="block text-sm font-medium text-gray-700">
              Selecione o Jogo
            </label>
            <select
              id="jogo"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={jogoSelecionado}
              onChange={(e) => setJogoSelecionado(e.target.value)}
            >
              <option value="">Selecione um jogo...</option>
              {jogos.map((jogo) => (
                <option key={jogo.id} value={jogo.id}>
                  {new Date(jogo.data).toLocaleDateString()} - {jogo.adversario}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {!jogoSelecionado ? (
            <div className="text-center text-gray-500">
              Selecione um jogo para ver as estatísticas
            </div>
          ) : !dados ? (
            <div className="text-center text-gray-500">
              Carregando estatísticas...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Totais por Tipo de Estatística
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={totaisData}>
                    <XAxis dataKey="tipo" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Destaques Individuais
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={destaquesData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {destaquesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 