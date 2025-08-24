import ImagemEvento from './ImagemEvento';

interface Evento {
  id: number;
  nome: string;
  data: string;
  localizacao: string;
  imagemUrl?: string;
}

interface Props {
  evento: Evento;
  onEdit: () => void; // abre modal de edição
  onDelete: (id: number) => void;
}

export default function EventoCard({ evento, onEdit, onDelete }: Props) {
  return (
    <div className='bg-[#0B1E34]/90 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:scale-[1.02] transition'>
      <ImagemEvento
        imagemUrl={evento.imagemUrl}
        alt={evento.nome}
        className='w-full h-70 object-cover'
      />

      <div className='p-5 text-white'>
        <h2 className='text-xl font-bold text-[#00ADB5]'>{evento.nome}</h2>
        <p className='text-gray-300'>
          {new Date(evento.data).toLocaleDateString()}
        </p>
        <p className='text-gray-300'>{evento.localizacao}</p>

        <div className='mt-4 flex gap-3'>
          <button
            onClick={onEdit}
            className='px-3 py-1 text-sm rounded bg-[#112D4E] hover:bg-[#00ADB5] transition'
          >
            Editar
          </button>

          <button
            onClick={() => onDelete(evento.id)}
            className='px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700 transition'
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
