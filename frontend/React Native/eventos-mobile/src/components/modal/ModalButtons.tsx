import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  onCancel: () => void;
  onSave: () => void;
  canSave: boolean;
  saving: boolean;
}

export default function ModalButtons({
  onCancel,
  onSave,
  canSave,
  saving,
}: Props) {
  return (
    <View style={styles.buttons}>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.saveButton, !canSave || saving ? styles.disabled : null]}
        onPress={onSave}
        disabled={!canSave || saving}
      >
        <Text style={styles.saveText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: { flexDirection: 'row', marginTop: 12 },
  cancelButton: {
    flex: 1,
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 6,
    alignItems: 'center',
  },
  cancelText: { color: '#aaa', fontWeight: 'bold' },
  saveButton: {
    flex: 1,
    backgroundColor: '#00ADB5',
    padding: 10,
    borderRadius: 8,
    marginLeft: 6,
    alignItems: 'center',
  },
  disabled: { opacity: 0.6 },
  saveText: { color: '#fff', fontWeight: 'bold' },
});
