import React, { useState, useContext } from 'react'; // Importa useContext
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import api from '../services/api';
import AuthContext from '../context/AuthContext'; // Importa o AuthContext

const LoginScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext); // Pega a função signIn do contexto

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { identifier, password });
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      // Chamar signIn para salvar o token e atualizar o estado global
      await signIn(response.data.token, response.data.user); // Passa o token e os dados do usuário
      // Não precisa de navigation.replace('Home') aqui, o AppNavigator fará a transição
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      Alert.alert('Erro no Login', error.response?.data?.message || 'Ocorreu um erro ao tentar fazer login.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário ou E-mail"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} color= '#8e44ad' />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Não tem uma conta? Cadastre-se</Text>
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
    backgroundColor: '#f8f6fc', // fundo lilás bem suave
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 30,
    color: '#8e44ad', // lilás forte
    textShadowColor: '#d1c4e9', // sombra leve no título
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#d1c4e9',
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#faf7fd',
    fontSize: 16,

    // sombra leve no input
    shadowColor: '#8e44ad',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  registerText: {
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
    backgroundColor: '#9b59b6',

    // sombra no botão
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

export default LoginScreen;