import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';

interface Evento {
  id: number;
  nome: string;
  data: string;
  localizacao: string;
}

interface Props {
  visible: boolean;
  evento: Evento | null;
  onClose: () => void;
  onSave: (id: number, novaData: string, novaLocal: string) => void;
}

export default function EventoEditModal({
  visible,
  evento,
  onClose,
  onSave,
}: Props) {
  if (!evento) return null;

  const [data, setData] = useState(evento.data.split('T')[0]); // formato YYYY-MM-DD
  const [localizacao, setLocalizacao] = useState(evento.localizacao);

  const [errors, setErrors] = useState<{ data?: string; localizacao?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { data?: string; localizacao?: string } = {};
    if (!data.trim()) newErrors.data = 'A data é obrigatória.';
    if (!localizacao.trim())
      newErrors.localizacao = 'A localização é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    try {
      onSave(evento.id, data, localizacao);
    } catch (err) {
      console.error('Erro ao editar evento:', err);
      Alert.alert('Erro', 'Não foi possível editar o evento.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Editar Evento</Text>

          {/* Nome (só exibe, não editável) */}
          <TextInput
            style={[
              styles.input,
              { backgroundColor: '#1E2A3C', color: '#aaa' },
            ]}
            value={evento.nome}
            editable={false}
          />

          {/* Data */}
          <TextInput
            style={styles.input}
            placeholder='Data (YYYY-MM-DD)'
            placeholderTextColor='#aaa'
            value={data}
            onChangeText={setData}
          />
          {errors.data && <Text style={styles.error}>{errors.data}</Text>}

          {/* Localização */}
          <TextInput
            style={styles.input}
            placeholder='Localização'
            placeholderTextColor='#aaa'
            value={localizacao}
            onChangeText={setLocalizacao}
          />
          {errors.localizacao && (
            <Text style={styles.error}>{errors.localizacao}</Text>
          )}

          {/* Botões */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#0B1E34',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ADB5',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#0F2742',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 8,
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 6,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cancelButton: {
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
    alignItems: 'center',
  },
  cancelText: {
    color: '#aaa',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#00ADB5',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 6,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
