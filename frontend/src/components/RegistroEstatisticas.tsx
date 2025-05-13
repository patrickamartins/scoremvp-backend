import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://scoremvp-backend-production.up.railway.app';

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
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
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
          axios.get(`${API_URL}/jogadoras`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/jogos`, {
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
        setError('Erro ao carregar dados. Tente novamente.');
      }
    };

    fetchData();
  }, [navigate]);

  const handleNovoJogo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/jogos`, novoJogo, {
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
      setSuccess('Jogo criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar novo jogo:', error);
      setError('Erro ao criar novo jogo. Tente novamente.');
    }
  };

  const handleEstatistica = async (jogadoraId: number, tipo: string) => {
    if (!jogoSelecionado) {
      setError('Selecione um jogo primeiro!');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/estatistica`, {
        id_jogadora: jogadoraId,
        id_jogo: jogoSelecionado,
        tipo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Estatística registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar estatística:', error);
      setError('Erro ao registrar estatística. Tente novamente.');
    }
  };

  const handleDesfazer = async () => {
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/desfazer`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Última ação desfeita com sucesso!');
    } catch (error) {
      console.error('Erro ao desfazer ação:', error);
      setError('Erro ao desfazer ação. Tente novamente.');
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
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Novo Jogo</h2>
            <form onSubmit={handleNovoJogo} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="data" className="block text-sm font-medium text-gray-700">
                    Data
                  </label>
                  <input
                    type="date"
                    id="data"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={novoJogo.data}
                    onChange={(e) => setNovoJogo({ ...novoJogo, data: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="horario" className="block text-sm font-medium text-gray-700">
                    Horário
                  </label>
                  <input
                    type="time"
                    id="horario"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={novoJogo.horario}
                    onChange={(e) => setNovoJogo({ ...novoJogo, horario: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="local" className="block text-sm font-medium text-gray-700">
                    Local
                  </label>
                  <input
                    type="text"
                    id="local"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={novoJogo.local}
                    onChange={(e) => setNovoJogo({ ...novoJogo, local: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="adversario" className="block text-sm font-medium text-gray-700">
                    Adversário
                  </label>
                  <input
                    type="text"
                    id="adversario"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={novoJogo.adversario}
                    onChange={(e) => setNovoJogo({ ...novoJogo, adversario: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                    Categoria
                  </label>
                  <input
                    type="text"
                    id="categoria"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={novoJogo.categoria}
                    onChange={(e) => setNovoJogo({ ...novoJogo, categoria: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Criar Novo Jogo
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jogo Atual
            </label>
            <select
              value={jogoSelecionado || ''}
              onChange={(e) => setJogoSelecionado(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Selecione um jogo...</option>
              {jogos.map((jogo) => (
                <option key={jogo.id} value={jogo.id}>
                  {new Date(jogo.data).toLocaleDateString()} - {jogo.adversario}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <button
              onClick={handleDesfazer}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Desfazer Última Ação
            </button>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jogadora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    +2
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    +3
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    +1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assistência
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rebote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roubo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toco
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TurnOver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Falta
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jogadoras.map((jogadora) => (
                  <tr key={jogadora.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {jogadora.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEstatistica(jogadora.id, '+2')}
                        className="w-full px-3 py-1 border border-indigo-500 text-indigo-500 rounded hover:bg-indigo-50"
                      >
                        +2
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEstatistica(jogadora.id, '+3')}
                        className="w-full px-3 py-1 border border-indigo-500 text-indigo-500 rounded hover:bg-indigo-50"
                      >
                        +3
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEstatistica(jogadora.id, '+1')}
                        className="w-full px-3 py-1 border border-indigo-500 text-indigo-500 rounded hover:bg-indigo-50"
                      >
                        +1
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEstatistica(jogadora.id, 'Assistência')}
                        className="w-full px-3 py-1 border border-indigo-500 text-indigo-500 rounded hover:bg-indigo-50"
                      >
                        Assistência
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEstatistica(jogadora.id, 'Rebote')}
                        className="w-full px-3 py-1 border border-indigo-500 text-indigo-500 rounded hover:bg-indigo-50"
                      >
                        Rebote
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEstatistica(jogadora.id, 'Roubo')}
                        className="w-full px-3 py-1 border border-indigo-500 text-indigo-500 rounded hover:bg-indigo-50"
                      >
                        Roubo
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEstatistica(jogadora.id, 'Toco')}
                        className="w-full px-3 py-1 border border-indigo-500 text-indigo-500 rounded hover:bg-indigo-50"
                      >
                        Toco
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEstatistica(jogadora.id, 'TurnOver')}
                        className="w-full px-3 py-1 border border-indigo-500 text-indigo-500 rounded hover:bg-indigo-50"
                      >
                        TurnOver
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEstatistica(jogadora.id, 'Falta')}
                        className="w-full px-3 py-1 border border-indigo-500 text-indigo-500 rounded hover:bg-indigo-50"
                      >
                        Falta
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistroEstatisticas; 