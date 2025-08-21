import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import EventoCard from '../components/EventoCard';

interface Evento {
  id: number;
  nome: string;
  data: string;
  localizacao: string;
  imagemUrl?: string;
}

export default function Home() {
  const { admin, logout } = useContext(AuthContext);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEventos = async () => {
    try {
      if (!admin) return;
      const response = await api.get(`/eventos/admin/${admin.id}`);
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
              onEdit={() => console.log('Editar', item.id)}
              onDelete={() => console.log('Excluir', item.id)}
            />
          )}
        />
      )}

      {/* Botão Adicionar Evento */}
      <TouchableOpacity
        style={styles.buttonAdd}
        onPress={() => console.log('Abrir modal')}
      >
        <Text style={styles.buttonAddText}>+ Adicionar Evento</Text>
      </TouchableOpacity>

      {/* Botão Logout */}
      <TouchableOpacity style={styles.buttonLogout} onPress={logout}>
        <Text style={styles.buttonLogoutText}>Sair</Text>
      </TouchableOpacity>
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
