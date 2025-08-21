import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

export default function Cadastro() {
  const navigation = useNavigation<any>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErro('');
    setSucesso('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem!');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/register', {
        nome,
        email,
        senha,
      });

      console.log('Cadastro realizado:', response.data);
      setSucesso('Cadastro realizado com sucesso!');

      // Redireciona para login após 2 segundos
      setTimeout(() => navigation.navigate('Login'), 2000);
    } catch (err: any) {
      console.error('Erro no cadastro:', err);

      if (err.response && err.response.status === 400) {
        setErro('Este email já está cadastrado. Tente outro.');
      } else if (err.response && err.response.status === 409) {
        setErro('Email já existente. Por favor, escolha outro.');
      } else {
        setErro('Erro ao cadastrar. Verifique os dados.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Cadastro de Administrador</Text>

        {/* Nome */}
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder='Digite seu nome'
          placeholderTextColor='#aaa'
          value={nome}
          onChangeText={setNome}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder='Digite seu email'
          placeholderTextColor='#aaa'
          keyboardType='email-address'
          autoCapitalize='none'
          value={email}
          onChangeText={setEmail}
        />

        {/* Senha */}
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder='Digite sua senha'
          placeholderTextColor='#aaa'
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {/* Confirmar Senha */}
        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={styles.input}
          placeholder='Repita sua senha'
          placeholderTextColor='#aaa'
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        {/* Mensagens */}
        {erro ? <Text style={styles.error}>{erro}</Text> : null}
        {sucesso ? <Text style={styles.success}>{sucesso}</Text> : null}

        {/* Botão Cadastrar */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        {/* Botão Voltar */}
        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonOutlineText}>Voltar para Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#0B1E34',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ADB5',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#ddd',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#0F2742',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  error: {
    color: '#ff6b6b',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  success: {
    color: '#4cd964',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00ADB5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderColor: '#00ADB5',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonOutlineText: {
    color: '#00ADB5',
    fontWeight: 'bold',
  },
});
