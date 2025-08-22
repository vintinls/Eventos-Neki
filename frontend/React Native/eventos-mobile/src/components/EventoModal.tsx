import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (dados: {
    nome: string;
    data: string;
    localizacao: string;
    imagemUrl: string;
  }) => void;
}

export default function EventoModal({ visible, onClose, onSave }: Props) {
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [admin, setAdmin] = useState<any>({});
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const adminStr = await AsyncStorage.getItem('admin');
      const tokenStr = await AsyncStorage.getItem('token');
      if (adminStr) setAdmin(JSON.parse(adminStr));
      if (tokenStr) setToken(tokenStr);
    };
    loadData();
  }, []);

  // Máscara de data (dd/MM/yyyy)
  const handleChangeData = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;

    if (cleaned.length > 2 && cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(
        2,
        4
      )}/${cleaned.slice(4, 8)}`;
    }

    setData(formatted);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!nome.trim()) newErrors.nome = 'O nome do evento é obrigatório.';
    if (!data.trim()) newErrors.data = 'A data do evento é obrigatória.';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data))
      newErrors.data = 'A data deve estar no formato DD/MM/AAAA.';
    if (!localizacao.trim())
      newErrors.localizacao = 'A localização é obrigatória.';
    if (!imagemUrl.trim())
      newErrors.imagemUrl = 'A URL da imagem é obrigatória.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Converte "dd/MM/yyyy" → "yyyy-MM-ddTHH:mm:ss"
  const formatDateToISO = (dateStr: string): string => {
    const [dia, mes, ano] = dateStr.split('/');
    return `${ano}-${mes}-${dia}T00:00:00`;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const dataISO = formatDateToISO(data);

      onSave({
        nome,
        data: dataISO,
        localizacao,
        imagemUrl,
      });

      resetForm();
    } catch (err: any) {
      console.error('Erro ao salvar evento no modal:', err);
      Alert.alert('Erro', 'Falha ao salvar evento.');
    }
  };

  const resetForm = () => {
    setNome('');
    setData('');
    setLocalizacao('');
    setImagemUrl('');
    setErrors({});
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.title}>Novo Evento</Text>

            {/* Nome */}
            <TextInput
              style={styles.input}
              placeholder='Nome do evento'
              placeholderTextColor='#aaa'
              value={nome}
              onChangeText={setNome}
            />
            {errors.nome && <Text style={styles.error}>{errors.nome}</Text>}

            {/* Data */}
            <TextInput
              style={styles.input}
              placeholder='Data (DD/MM/AAAA)'
              placeholderTextColor='#aaa'
              value={data}
              onChangeText={handleChangeData}
              keyboardType='numeric'
              maxLength={10}
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

            {/* URL da imagem */}
            <TextInput
              style={styles.input}
              placeholder='URL da imagem'
              placeholderTextColor='#aaa'
              value={imagemUrl}
              onChangeText={setImagemUrl}
            />
            {errors.imagemUrl && (
              <Text style={styles.error}>{errors.imagemUrl}</Text>
            )}

            {/* Botões */}
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    maxHeight: '80%',
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
    padding: 12,
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
