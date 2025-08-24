import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import Home from './src/screens/Home';

const Stack = createNativeStackNavigator();

function Routes() {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    // Pode retornar um Splash ou ActivityIndicator
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        // Usuário autenticado → vai pro Home
        <Stack.Screen name='Home' component={Home} />
      ) : (
        // Usuário não autenticado → Login e Cadastro
        <>
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='Cadastro' component={Cadastro} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </AuthProvider>
  );
}
