import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface Evento {
  id: number;
  nome: string;
  data: string;
  localizacao: string;
  imagemUrl?: string;
}

interface Props {
  evento: Evento;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EventoCard({ evento, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      {/* Imagem do evento */}
      {evento.imagemUrl ? (
        <Image
          source={{ uri: evento.imagemUrl }}
          style={styles.image}
          resizeMode='cover'
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={{ color: '#999' }}>Sem imagem</Text>
        </View>
      )}

      {/* Informações */}
      <View style={styles.info}>
        <Text style={styles.eventName}>{evento.nome}</Text>
        <Text style={styles.eventInfo}>
          📅 {new Date(evento.data).toLocaleDateString()}
        </Text>
        <Text style={styles.eventInfo}>📍 {evento.localizacao}</Text>

        {/* Botões */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.actionText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0B1E34',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#1E2A3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: 12,
  },
  eventName: {
    color: '#00ADB5',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventInfo: {
    color: '#ccc',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#112D4E',
    padding: 8,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#B00020',
    padding: 8,
    borderRadius: 6,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
