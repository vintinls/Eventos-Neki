import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

interface LoginForm {
  email: string;
  senha: string;
}

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  const { control, handleSubmit, setValue } = useForm<LoginForm>();
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [showSenha, setShowSenha] = useState(false);

  // 🔹 Carregar credenciais salvas
  useEffect(() => {
    const loadSaved = async () => {
      const savedEmail = await AsyncStorage.getItem('savedEmail');
      const savedSenha = await AsyncStorage.getItem('savedSenha');
      if (savedEmail && savedSenha) {
        setValue('email', savedEmail);
        setValue('senha', savedSenha);
        setLembrar(true);
      }
    };
    loadSaved();
  }, []);

  const onSubmit = async (data: LoginForm) => {
    setErro('');
    setLoading(true);
    try {
      await login(data.email, data.senha);

      // 🔹 Salvar ou limpar credenciais
      if (lembrar) {
        await AsyncStorage.setItem('savedEmail', data.email);
        await AsyncStorage.setItem('savedSenha', data.senha);
      } else {
        await AsyncStorage.removeItem('savedEmail');
        await AsyncStorage.removeItem('savedSenha');
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err) {
      console.error('Erro no login:', err);
      setErro('Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login do Administrador</Text>

        {erro ? <Text style={styles.error}>{erro}</Text> : null}

        {/* Campo Email */}
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name='email'
          rules={{ required: 'Email é obrigatório' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder='seu@email.com'
              placeholderTextColor='#aaa'
              keyboardType='email-address'
              value={value}
              onChangeText={onChange}
              autoCapitalize='none'
            />
          )}
        />

        {/* Campo Senha */}
        <Text style={styles.label}>Senha</Text>
        <Controller
          control={control}
          name='senha'
          rules={{ required: 'Senha é obrigatória' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder='Digite sua senha'
              placeholderTextColor='#aaa'
              secureTextEntry={!showSenha}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <TouchableOpacity onPress={() => setShowSenha((s) => !s)}>
          <Text style={styles.toggleSenha}>
            {showSenha ? '🙈 Ocultar' : '👁️ Mostrar'}
          </Text>
        </TouchableOpacity>

        {/* 🔹 Checkbox Lembrar-me */}
        <TouchableOpacity
          onPress={() => setLembrar((prev) => !prev)}
          style={styles.checkboxContainer}
        >
          <Text style={{ color: '#fff' }}>
            {lembrar ? '☑️ ' : '⬜ '} Lembrar-me
          </Text>
        </TouchableOpacity>

        {/* Botão de Login */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        {/* Link para Cadastro */}
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.link}>Cadastre-se</Text>
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
  error: {
    color: '#ff6b6b',
    marginBottom: 10,
    textAlign: 'center',
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
  toggleSenha: {
    color: '#00ADB5',
    marginTop: 4,
    marginBottom: 12,
    textAlign: 'right',
  },
  checkboxContainer: {
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#00ADB5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#00ADB5',
    textAlign: 'center',
    marginTop: 8,
  },
});
