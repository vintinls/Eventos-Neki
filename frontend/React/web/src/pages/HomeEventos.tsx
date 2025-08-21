import { useEffect, useState } from 'react';
import api from '../services/api';
import EventoCard from '../components/EventoCard';
import EventoModal from '../components/EventoModal';
import EventoEditModal from '../components/EventoEditModal';

interface Evento {
  id: number;
  nome: string;
  data: string;
  localizacao: string;
  imagemUrl?: string;
}

export default function HomeEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);

  const admin = JSON.parse(localStorage.getItem('admin') || '{}');
  const token = localStorage.getItem('token');

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

  const handleAddEvento = async (dados: any) => {
    try {
      const dataFormatada = dados.data + 'T00:00:00';

      if (dados.modoImagem === 'url') {
        await api.post(
          '/eventos/url',
          {
            nome: dados.nome,
            data: dataFormatada,
            localizacao: dados.localizacao,
            imagemUrl: dados.imagemUrl,
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
                nome: dados.nome,
                data: dataFormatada,
                localizacao: dados.localizacao,
                administradorId: admin.id,
              }),
            ],
            { type: 'application/json' }
          )
        );
        if (dados.imagemFile) formData.append('imagem', dados.imagemFile);

        await api.post('/eventos/upload', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setShowModal(false);
      fetchEventos();
    } catch (err) {
      console.error('Erro ao adicionar evento:', err);
    }
  };

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
    <div className='min-h-screen bg-gradient-to-br from-[#0A192F] to-[#112D4E] px-6 py-10'>
      <h1 className='text-3xl font-bold text-[#00ADB5] mb-8 text-center'>
        Eventos de {admin.nome}
      </h1>

      <div className='flex justify-center mb-8'>
        <button
          onClick={() => setShowModal(true)}
          className='bg-[#00ADB5] hover:bg-[#00949A] text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition'
        >
          + Adicionar Evento
        </button>
      </div>

      {eventos.length === 0 ? (
        <p className='text-center text-gray-300'>
          Nenhum evento cadastrado ainda.
        </p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {eventos.map((evento) => (
            <EventoCard
              key={evento.id}
              evento={evento}
              onEdit={() => setEventoEditando(evento)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <EventoModal
          onClose={() => setShowModal(false)}
          onSave={handleAddEvento}
        />
      )}

      {eventoEditando && (
        <EventoEditModal
          evento={eventoEditando}
          onClose={() => setEventoEditando(null)}
          onSave={(id, novaData, novaLocal) => {
            handleEdit(id, novaData, novaLocal);
            setEventoEditando(null);
          }}
        />
      )}
    </div>
  );
}
