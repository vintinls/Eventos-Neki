import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem!');
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        nome,
        email,
        senha,
      });

      console.log('Cadastro realizado:', response.data);

      setSucesso('Cadastro realizado com sucesso!');

      // Redireciona para login após 2 segundos
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      console.error('Erro no cadastro:', err);
      setErro('Erro ao cadastrar. Verifique os dados.');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-8'>
        <h1 className='text-2xl font-bold text-center text-blue-600 mb-6'>
          Cadastro de Administrador
        </h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Nome */}
          <div>
            <label className='block text-gray-700 mb-1'>Nome</label>
            <input
              type='text'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Digite seu nome'
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className='block text-gray-700 mb-1'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Digite seu email'
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label className='block text-gray-700 mb-1'>Senha</label>
            <input
              type='password'
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Digite sua senha'
              required
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className='block text-gray-700 mb-1'>Confirmar Senha</label>
            <input
              type='password'
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Repita a senha'
              required
            />
          </div>

          {/* Mensagens */}
          {erro && <p className='text-red-600 text-sm'>{erro}</p>}
          {sucesso && <p className='text-green-600 text-sm'>{sucesso}</p>}

          {/* Botão cadastrar */}
          <button
            type='submit'
            className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition'
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
