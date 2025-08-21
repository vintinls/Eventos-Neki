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
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
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

      // Se o backend retorna status 400/409 para email já usado
      if (err.response && err.response.status === 400) {
        setErro('Este email já está cadastrado. Tente outro.');
      } else if (err.response && err.response.status === 409) {
        setErro('Email já existente. Por favor, escolha outro.');
      } else {
        setErro('Erro ao cadastrar. Verifique os dados.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0A192F] to-[#112D4E] px-4'>
      <div className='w-full max-w-md rounded-xl bg-[#0B1E34]/90 p-8 shadow-xl backdrop-blur-md'>
        <h1 className='mb-6 text-center text-2xl font-bold text-[#00ADB5]'>
          Cadastro de Administrador
        </h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Nome */}
          <div>
            <label className='block text-sm font-medium text-gray-200'>
              Nome
            </label>
            <input
              type='text'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className='mt-1 w-full rounded-lg border border-gray-600 bg-[#0F2742] px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/50'
              placeholder='Digite seu nome'
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-200'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 w-full rounded-lg border border-gray-600 bg-[#0F2742] px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/50'
              placeholder='Digite seu email'
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label className='block text-sm font-medium text-gray-200'>
              Senha
            </label>
            <input
              type='password'
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className='mt-1 w-full rounded-lg border border-gray-600 bg-[#0F2742] px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/50'
              placeholder='Digite sua senha'
              required
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className='block text-sm font-medium text-gray-200'>
              Confirmar Senha
            </label>
            <input
              type='password'
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className='mt-1 w-full rounded-lg border border-gray-600 bg-[#0F2742] px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/50'
              placeholder='Repita a senha'
              required
            />
          </div>

          {/* Mensagens */}
          {erro && (
            <p className='text-red-400 text-sm bg-red-500/20 rounded-md px-3 py-1'>
              {erro}
            </p>
          )}
          {sucesso && (
            <p className='text-green-400 text-sm bg-green-500/20 rounded-md px-3 py-1'>
              {sucesso}
            </p>
          )}

          {/* Botões */}
          <div className='space-y-2'>
            <button
              type='submit'
              disabled={loading}
              className='w-full rounded-lg bg-[#00ADB5] px-4 py-2 font-semibold text-white shadow-md transition hover:bg-[#00949A] disabled:opacity-60'
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>

            {/* Botão voltar para login */}
            <button
              type='button'
              onClick={() => navigate('/login')}
              className='w-full rounded-lg border border-[#00ADB5] px-4 py-2 font-semibold text-[#00ADB5] shadow-md transition hover:bg-[#00ADB5] hover:text-white'
            >
              Voltar para Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
