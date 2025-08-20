import { useEffect, useState } from 'react';
import api from '../services/api';
import ImagemEvento from '../components/ImagemEvento'; // ✅ importa o componente

interface Evento {
  id: number;
  nome: string;
  data: string;
  localizacao: string;
  imagemUrl?: string; // pode ser preenchido quando for URL externa
}

export default function HomeEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [showModal, setShowModal] = useState(false);

  // campos do novo evento
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [modoImagem, setModoImagem] = useState<'url' | 'upload'>('url');

  // pegar admin logado e token
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');
  const token = localStorage.getItem('token');

  // Buscar eventos
  const fetchEventos = async () => {
    try {
      const response = await api.get(`/eventos/admin/${admin.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEventos(response.data);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // cadastrar evento
  const handleAddEvento = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataFormatada = data + 'T00:00:00';

      if (modoImagem === 'url') {
        await api.post(
          '/eventos/url',
          {
            nome,
            data: dataFormatada,
            localizacao,
            imagemUrl,
            administradorId: admin.id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const formData = new FormData();
        formData.append(
          'dados',
          new Blob(
            [
              JSON.stringify({
                nome,
                data: dataFormatada,
                localizacao,
                administradorId: admin.id,
              }),
            ],
            { type: 'application/json' }
          )
        );
        if (imagemFile) {
          formData.append('imagem', imagemFile);
        }

        await api.post('/eventos/upload', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setShowModal(false);
      setNome('');
      setData('');
      setLocalizacao('');
      setImagemUrl('');
      setImagemFile(null);

      fetchEventos();
    } catch (err) {
      console.error('Erro ao adicionar evento:', err);
    }
  };

  // excluir evento
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/eventos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEventos();
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
    }
  };

  // editar evento
  const handleEdit = async (
    id: number,
    novaData: string,
    novaLocal: string
  ) => {
    try {
      const dataFormatada = novaData + 'T00:00:00';
      await api.put(
        `/eventos/${id}`,
        { data: dataFormatada, localizacao: novaLocal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEventos();
    } catch (err) {
      console.error('Erro ao editar evento:', err);
    }
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold text-blue-600 mb-6'>
        Eventos de {admin.nome}
      </h1>

      {/* Botão adicionar */}
      <button
        onClick={() => setShowModal(true)}
        className='mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
      >
        Adicionar Evento
      </button>

      {/* Lista de eventos */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {eventos.map((evento) => (
          <div
            key={evento.id}
            className='bg-white shadow-md rounded-lg overflow-hidden'
          >
            {/* ✅ Usa o componente de imagem */}
            <ImagemEvento
              imagemUrl={evento.imagemUrl}
              alt={evento.nome}
              className='w-full h-40 object-cover'
            />

            <div className='p-4'>
              <h2 className='text-lg font-bold'>{evento.nome}</h2>
              <p className='text-gray-600'>
                Data: {new Date(evento.data).toLocaleDateString()}
              </p>
              <p className='text-gray-600'>Local: {evento.localizacao}</p>

              <div className='mt-2'>
                <button
                  onClick={() =>
                    handleEdit(
                      evento.id,
                      prompt(
                        'Nova data (YYYY-MM-DD)',
                        evento.data.split('T')[0]
                      ) || evento.data.split('T')[0],
                      prompt('Nova localização', evento.localizacao) ||
                        evento.localizacao
                    )
                  }
                  className='mr-2 text-blue-600 hover:underline'
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(evento.id)}
                  className='text-red-600 hover:underline'
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de adicionar */}
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Novo Evento</h2>
            <form onSubmit={handleAddEvento} className='space-y-4'>
              <input
                type='text'
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder='Nome do evento'
                className='w-full border px-3 py-2 rounded-lg'
                required
              />
              <input
                type='date'
                value={data}
                onChange={(e) => setData(e.target.value)}
                className='w-full border px-3 py-2 rounded-lg'
                required
              />
              <input
                type='text'
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder='Localização'
                className='w-full border px-3 py-2 rounded-lg'
                required
              />

              {/* Escolha do modo da imagem */}
              <div className='flex space-x-4'>
                <label>
                  <input
                    type='radio'
                    checked={modoImagem === 'url'}
                    onChange={() => setModoImagem('url')}
                  />
                  <span className='ml-2'>Usar URL</span>
                </label>
                <label>
                  <input
                    type='radio'
                    checked={modoImagem === 'upload'}
                    onChange={() => setModoImagem('upload')}
                  />
                  <span className='ml-2'>Upload</span>
                </label>
              </div>

              {modoImagem === 'url' ? (
                <input
                  type='text'
                  value={imagemUrl}
                  onChange={(e) => setImagemUrl(e.target.value)}
                  placeholder='URL da imagem'
                  className='w-full border px-3 py-2 rounded-lg'
                  required
                />
              ) : (
                <input
                  type='file'
                  onChange={(e) =>
                    setImagemFile(e.target.files ? e.target.files[0] : null)
                  }
                  className='w-full'
                  required
                />
              )}

              <div className='flex justify-end space-x-2'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 border rounded-lg'
                >
                  Cancelar
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg'
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
