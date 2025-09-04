// src/screens/RegisterScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import api from '../services/api'; // Importa a instância do Axios

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      // console.log('Cadastro bem-sucedido:', response.data);
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso! Faça login para continuar.');
      navigation.navigate('Login'); // Volta para a tela de login após o cadastro
    } catch (error) {
      console.error('Erro no cadastro:', error.response?.data || error.message);
      Alert.alert('Erro no Cadastro', error.response?.data?.message || 'Ocorreu um erro ao tentar cadastrar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome de Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Cadastrar" onPress={handleRegister} color='#8e44ad' />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f6fc', // lilás clarinho
  },
  title: {
    fontSize: 28,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#8e44ad',
    textShadowColor: '#d1c4e9',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#cbbde8',
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#faf7fd',
    fontSize: 16,

    // sombra leve
    shadowColor: '#8e44ad',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  loginText: {
    marginTop: 20,
    color: '#8e44ad',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#8e44ad',

    shadowColor: '#8e44ad',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});


export default RegisterScreen;