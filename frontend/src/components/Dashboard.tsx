import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const Dashboard: React.FC = () => {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [jogoSelecionado, setJogoSelecionado] = useState<number | null>(null);
  const [dados, setDados] = useState<DashboardData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchJogos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/jogos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJogos(response.data);
        if (response.data.length > 0) {
          setJogoSelecionado(response.data[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar jogos:', error);
      }
    };

    fetchJogos();
  }, [navigate]);

  useEffect(() => {
    const fetchDados = async () => {
      if (!jogoSelecionado) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/dashboard?jogo_id=${jogoSelecionado}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDados(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      }
    };

    fetchDados();
  }, [jogoSelecionado]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sair
              </button>
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
              value={jogoSelecionado || ''}
              onChange={(e) => setJogoSelecionado(Number(e.target.value))}
            >
              {jogos.map((jogo) => (
                <option key={jogo.id} value={jogo.id}>
                  {new Date(jogo.data).toLocaleDateString()} - {jogo.adversario}
                </option>
              ))}
            </select>
          </div>

          {dados && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Totais
                  </h3>
                  <div className="mt-4">
                    {Object.entries(dados.totais).map(([tipo, quantidade]) => (
                      <div key={tipo} className="flex justify-between py-2">
                        <span className="text-gray-500">{tipo}</span>
                        <span className="font-medium">{quantidade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Destaques
                  </h3>
                  <div className="mt-4">
                    {dados.destaques.map((destaque) => (
                      <div key={destaque.tipo} className="py-2">
                        <p className="text-sm text-gray-500">
                          {destaque.jogadora} lidera em {destaque.tipo} com {destaque.quantidade}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 