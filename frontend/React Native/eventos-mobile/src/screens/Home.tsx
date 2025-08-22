import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
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

export default function Home() {
  const { admin, token, logout } = useContext(AuthContext);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);

  // Buscar eventos do admin
  const fetchEventos = async () => {
    try {
      if (!admin || !token) return;
      const response = await api.get(`/eventos/admin/${admin.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEventos(response.data);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Adicionar evento (apenas com URL)
  const handleAddEvento = async (dados: {
    nome: string;
    data: string;
    localizacao: string;
    imagemUrl: string;
  }) => {
    try {
      if (!token) return;

      await api.post(
        '/eventos/url',
        {
          nome: dados.nome,
          data: dados.data,
          localizacao: dados.localizacao,
          imagemUrl: dados.imagemUrl,
          administradorId: admin?.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowAddModal(false);
      fetchEventos();
    } catch (err: any) {
      console.error('❌ Erro ao adicionar evento:', err);
      Alert.alert('Erro', 'Não foi possível salvar o evento.');
    }
  };

  // Excluir evento
  const handleDelete = async (id: number) => {
    try {
      if (!token) return;
      await api.delete(`/eventos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEventos();
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      Alert.alert('Erro', 'Não foi possível excluir o evento.');
    }
  };

  // Salvar edição de evento
  const handleEditSave = async (
    id: number,
    novaData: string,
    novaLocal: string
  ) => {
    try {
      if (!token) return;
      await api.put(
        `/eventos/${id}`,
        {
          data: novaData,
          localizacao: novaLocal,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEventoEditando(null);
      fetchEventos();
    } catch (err) {
      console.error('Erro ao editar evento:', err);
      Alert.alert('Erro', 'Não foi possível editar o evento.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#00ADB5' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos de {admin?.nome}</Text>

      {eventos.length === 0 ? (
        <Text style={styles.empty}>Nenhum evento cadastrado ainda.</Text>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EventoCard
              evento={item}
              onEdit={() => setEventoEditando(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}

      {/* Botão Adicionar Evento */}
      <TouchableOpacity
        style={styles.buttonAdd}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.buttonAddText}>+ Adicionar Evento</Text>
      </TouchableOpacity>

      {/* Botão Logout */}
      <TouchableOpacity style={styles.buttonLogout} onPress={logout}>
        <Text style={styles.buttonLogoutText}>Sair</Text>
      </TouchableOpacity>

      {/* Modal de adicionar evento */}
      <EventoModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddEvento}
      />

      {/* Modal de edição de evento */}
      <EventoEditModal
        visible={eventoEditando !== null}
        evento={eventoEditando}
        onClose={() => setEventoEditando(null)}
        onSave={handleEditSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00ADB5',
    marginBottom: 16,
    textAlign: 'center',
  },
  empty: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 40,
  },
  buttonAdd: {
    backgroundColor: '#00ADB5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonAddText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonLogout: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderColor: '#00ADB5',
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonLogoutText: {
    color: '#00ADB5',
    fontWeight: 'bold',
  },
});
