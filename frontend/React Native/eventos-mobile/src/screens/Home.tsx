import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import EventoCard from '../components/EventoCard';
import EventoModal from '../components/EventoModal';
import EventoEditModal, { Evento } from '../components/EventoEditModal';

type NovoEvento = {
  nome: string;
  data: string; // YYYY-MM-DD
  localizacao: string;
  imagemUrl?: string;
  imagemFile?: { uri: string; name: string; type: string } | null;
  modoImagem: 'url' | 'upload';
};

export default function Home() {
  const { admin, token, logout } = useContext(AuthContext);

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);

  const fetchEventos = useCallback(async () => {
    try {
      if (!admin || !token) return;
      const response = await api.get(`/eventos/admin/${admin.id}`);
      setEventos(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      Alert.alert('Erro', 'Não foi possível carregar os eventos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [admin, token]);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEventos();
  };

  // 🚀 Adicionar evento: URL OU Upload (upload via fetch para evitar "Network Error")
  const handleAddEvento = async (dados: NovoEvento) => {
    try {
      if (!token) return;

      const dataISO = `${dados.data}T00:00:00`;

      if (dados.modoImagem === 'url') {
        // JSON puro com axios
        await api.post('/eventos/url', {
          nome: dados.nome,
          data: dataISO,
          localizacao: dados.localizacao,
          imagemUrl: dados.imagemUrl,
          administradorId: admin?.id,
        });
      } else {
        // multipart com fetch
        const form = new FormData();

        form.append(
          'dados',
          JSON.stringify({
            nome: dados.nome,
            data: dataISO,
            localizacao: dados.localizacao,
            administradorId: admin?.id,
          })
        );

        if (dados.imagemFile) {
          form.append('imagem', {
            uri: dados.imagemFile.uri,
            name: dados.imagemFile.name ?? 'imagem.jpg',
            type: dados.imagemFile.type ?? 'image/jpeg',
          } as any);
        }

        const base = (api as any)?.defaults?.baseURL ?? 'http://10.0.2.2:8080';

        const res = await fetch(`${base}/eventos/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            // NÃO defina 'Content-Type' -> fetch cria o boundary
          },
          body: form,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.log('UPLOAD FAIL', res.status, text);
          throw new Error(`upload falhou: ${res.status}`);
        }
      }

      setShowAddModal(false);
      fetchEventos();
    } catch (err: any) {
      console.error('❌ Erro ao adicionar evento:', err?.response || err);
      Alert.alert('Erro', 'Não foi possível salvar o evento.');
    }
  };

  // Excluir
  const handleDelete = async (id: number) => {
    try {
      if (!token) return;
      await api.delete(`/eventos/${id}`);
      fetchEventos();
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      Alert.alert('Erro', 'Não foi possível excluir o evento.');
    }
  };

  // Editar
  const handleEditSave = async (
    id: number,
    novaData: string,
    novaLocal: string
  ) => {
    try {
      if (!token) return;
      await api.put(`/eventos/${id}`, {
        data: `${novaData}T00:00:00`,
        localizacao: novaLocal,
      });
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
          refreshControl={
            <RefreshControl
              tintColor='#00ADB5'
              colors={['#00ADB5']}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <TouchableOpacity
        style={styles.buttonAdd}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.buttonAddText}>+ Adicionar Evento</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonLogout} onPress={logout}>
        <Text style={styles.buttonLogoutText}>Sair</Text>
      </TouchableOpacity>

      <EventoModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddEvento}
      />

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
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00ADB5',
    marginBottom: 16,
    textAlign: 'center',
  },
  empty: { color: '#ccc', textAlign: 'center', marginTop: 40 },
  buttonAdd: {
    backgroundColor: '#00ADB5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonAddText: { color: '#fff', fontWeight: 'bold' },
  buttonLogout: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderColor: '#00ADB5',
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonLogoutText: { color: '#00ADB5', fontWeight: 'bold' },
});
