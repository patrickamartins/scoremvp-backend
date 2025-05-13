import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Jogadora {
  id: number;
  nome: string;
}

interface Jogo {
  id: number;
  data: string;
  local: string;
  horario: string;
  adversario: string;
  categoria: string;
}

const RegistroEstatisticas: React.FC = () => {
  const [jogadoras, setJogadoras] = useState<Jogadora[]>([]);
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [jogoSelecionado, setJogoSelecionado] = useState<number | null>(null);
  const [novoJogo, setNovoJogo] = useState({
    data: '',
    local: '',
    horario: '',
    adversario: '',
    categoria: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [jogadorasRes, jogosRes] = await Promise.all([
          axios.get('http://localhost:5000/jogadoras', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/jogos', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setJogadoras(jogadorasRes.data);
        setJogos(jogosRes.data);
        if (jogosRes.data.length > 0) {
          setJogoSelecionado(jogosRes.data[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleNovoJogo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/jogos', novoJogo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setJogos([...jogos, response.data]);
      setJogoSelecionado(response.data.id);
      setNovoJogo({
        data: '',
        local: '',
        horario: '',
        adversario: '',
        categoria: ''
      });
    } catch (error) {
      console.error('Erro ao criar novo jogo:', error);
    }
  };

  const handleEstatistica = async (jogadoraId: number, tipo: string) => {
    if (!jogoSelecionado) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/estatistica', {
        id_jogadora: jogadoraId,
        id_jogo: jogoSelecionado,
        tipo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Erro ao registrar estatística:', error);
    }
  };

  const handleDesfazer = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/desfazer', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Erro ao desfazer ação:', error);
    }
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
                onClick={() => navigate('/dashboard')}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Formulário de Novo Jogo */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Novo Jogo</h2>
            <form onSubmit={handleNovoJogo} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Data</label>
                <input
                  type="date"
                  value={novoJogo.data}
                  onChange={(e) => setNovoJogo({ ...novoJogo, data: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Local</label>
                <input
                  type="text"
                  value={novoJogo.local}
                  onChange={(e) => setNovoJogo({ ...novoJogo, local: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Horário</label>
                <input
                  type="time"
                  value={novoJogo.horario}
                  onChange={(e) => setNovoJogo({ ...novoJogo, horario: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Adversário</label>
                <input
                  type="text"
                  value={novoJogo.adversario}
                  onChange={(e) => setNovoJogo({ ...novoJogo, adversario: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                <input
                  type="text"
                  value={novoJogo.categoria}
                  onChange={(e) => setNovoJogo({ ...novoJogo, categoria: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-5">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Criar Novo Jogo
                </button>
              </div>
            </form>
          </div>

          {/* Seleção de Jogo */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jogo Atual
            </label>
            <select
              value={jogoSelecionado || ''}
              onChange={(e) => setJogoSelecionado(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {jogos.map((jogo) => (
                <option key={jogo.id} value={jogo.id}>
                  {new Date(jogo.data).toLocaleDateString()} - {jogo.adversario}
                </option>
              ))}
            </select>
          </div>

          {/* Botão Desfazer */}
          <div className="mb-6">
            <button
              onClick={handleDesfazer}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Desfazer Última Ação
            </button>
          </div>

          {/* Lista de Jogadoras */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jogadoras.map((jogadora) => (
              <div key={jogadora.id} className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">{jogadora.nome}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleEstatistica(jogadora.id, 'ponto_2')}
                    className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => handleEstatistica(jogadora.id, 'ponto_3')}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    +3
                  </button>
                  <button
                    onClick={() => handleEstatistica(jogadora.id, 'lance_livre')}
                    className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    +1 (LL)
                  </button>
                  <button
                    onClick={() => handleEstatistica(jogadora.id, 'assistencia')}
                    className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    Assistência
                  </button>
                  <button
                    onClick={() => handleEstatistica(jogadora.id, 'rebote')}
                    className="px-3 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                  >
                    Rebote
                  </button>
                  <button
                    onClick={() => handleEstatistica(jogadora.id, 'roubo')}
                    className="px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  >
                    Roubo
                  </button>
                  <button
                    onClick={() => handleEstatistica(jogadora.id, 'toco')}
                    className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Toco
                  </button>
                  <button
                    onClick={() => handleEstatistica(jogadora.id, 'turnover')}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    TurnOver
                  </button>
                  <button
                    onClick={() => handleEstatistica(jogadora.id, 'falta')}
                    className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 col-span-2"
                  >
                    Falta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistroEstatisticas; 