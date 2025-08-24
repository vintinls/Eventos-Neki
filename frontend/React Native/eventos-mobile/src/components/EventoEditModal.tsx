import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export interface Evento {
  id: number;
  nome: string;
  data: string; // ISO ex.: "2025-08-24T15:00:00" ou "2025-08-24"
  localizacao: string;
  imagemUrl?: string;
}

interface Props {
  visible: boolean;
  evento: Evento | null;
  onClose: () => void;
  onSave: (id: number, novaData: string, novaLocal: string) => void;
}

function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseToDate(value: string | undefined): Date {
  if (!value) return new Date();
  if (value.includes('T')) {
    const dt = new Date(value);
    return isNaN(dt.getTime()) ? new Date() : dt;
  }
  const dt = new Date(`${value}T00:00:00`);
  return isNaN(dt.getTime()) ? new Date() : dt;
}

export default function EventoEditModal({
  visible,
  evento,
  onClose,
  onSave,
}: Props) {
  const [dateObj, setDateObj] = useState<Date>(new Date());
  const [dataTexto, setDataTexto] = useState<string>(''); // exibição "YYYY-MM-DD"
  const [localizacao, setLocalizacao] = useState<string>('');
  const [errors, setErrors] = useState<{ data?: string; localizacao?: string }>(
    {}
  );

  const [showPicker, setShowPicker] = useState<boolean>(false);

  useEffect(() => {
    if (evento) {
      const base = parseToDate(evento.data);
      setDateObj(base);
      setDataTexto(toYYYYMMDD(base));
      setLocalizacao(evento.localizacao || '');
      setErrors({});
      setShowPicker(Platform.OS === 'ios');
    } else {
      setShowPicker(false);
    }
  }, [evento, visible]);

  const validate = () => {
    const newErrors: { data?: string; localizacao?: string } = {};
    if (!dataTexto.trim()) newErrors.data = 'A data é obrigatória.';
    if (!localizacao.trim())
      newErrors.localizacao = 'A localização é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChangeDate = (_event: any, selected?: Date) => {
    if (!selected) {
      if (Platform.OS === 'android') setShowPicker(false);
      return;
    }
    setDateObj(selected);
    setDataTexto(toYYYYMMDD(selected));
    if (Platform.OS === 'android') setShowPicker(false);
  };

  const handleSave = () => {
    if (!validate()) return;
    try {
      if (!evento) return;
      onSave(evento.id, dataTexto, localizacao);
    } catch (err) {
      console.error('Erro ao editar evento:', err);
      Alert.alert('Erro', 'Não foi possível editar o evento.');
    }
  };

  if (!evento) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          style={{ width: '90%' }}
        >
          <View style={styles.modal}>
            <Text style={styles.title}>Editar Evento</Text>

            {/* Nome somente leitura */}
            <TextInput
              style={[styles.input, styles.readonlyInput]}
              value={evento.nome}
              editable={false}
              pointerEvents='none'
            />

            <Text style={styles.label}>Data</Text>

            {Platform.OS === 'android' ? (
              <>
                <TouchableOpacity
                  onPress={() => setShowPicker(true)}
                  activeOpacity={0.8}
                  style={[styles.input, styles.touchableInput]}
                >
                  <Text style={styles.touchableInputText}>
                    {dataTexto || 'Selecionar data'}
                  </Text>
                </TouchableOpacity>

                {errors.data ? (
                  <Text style={styles.error}>{errors.data}</Text>
                ) : null}

                {showPicker && (
                  <DateTimePicker
                    value={dateObj}
                    mode='date'
                    display='calendar'
                    onChange={onChangeDate}
                  />
                )}
              </>
            ) : (
              <>
                <View style={[styles.input, styles.iosPickerContainer]}>
                  <DateTimePicker
                    value={dateObj}
                    mode='date'
                    display='inline'
                    onChange={onChangeDate}
                    style={styles.iosPicker}
                  />
                </View>
                <Text style={styles.helperText}>{dataTexto}</Text>
                {errors.data ? (
                  <Text style={styles.error}>{errors.data}</Text>
                ) : null}
              </>
            )}

            <Text style={[styles.label, { marginTop: 10 }]}>Localização</Text>
            <TextInput
              style={styles.input}
              placeholder='Localização'
              placeholderTextColor='#aaa'
              value={localizacao}
              onChangeText={setLocalizacao}
            />
            {errors.localizacao ? (
              <Text style={styles.error}>{errors.localizacao}</Text>
            ) : null}

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    width: '100%',
    backgroundColor: '#0B1E34',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ADB5',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#9BB0C8',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0F2742',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#233A57',
    marginBottom: 8,
  },
  readonlyInput: {
    backgroundColor: '#1E2A3C',
    color: '#AAB1BA',
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 6,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  cancelButton: {
    borderColor: '#aaa',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelText: {
    color: '#aaa',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#00ADB5',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  touchableInput: {
    justifyContent: 'center',
  },
  touchableInputText: {
    color: '#fff',
  },
  iosPickerContainer: {
    padding: 0,
    overflow: 'hidden',
  },
  iosPicker: {
    width: '100%',
  },
  helperText: {
    color: '#9BB0C8',
    marginBottom: 6,
  },
});
