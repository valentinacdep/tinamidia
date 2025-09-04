// src/screens/ProfileScreen.js

import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  Alert, Button, Image, TouchableOpacity, FlatList
} from 'react-native';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('myPosts');

  useEffect(() => {
    // Adicionar um listener para focar na tela e recarregar os dados
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfileData();
    });
    return unsubscribe; // Limpar o listener
  }, [navigation]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        Alert.alert('Erro', 'Token de autenticação não encontrado.');
        signOut();
        return;
      }

      const userResponse = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setUser(userResponse.data);

      const myPostsResponse = await api.get('/users/me/posts', {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setMyPosts(myPostsResponse.data);

      const favoritePostsResponse = await api.get('/users/me/favorites', {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      // CORREÇÃO AQUI: Use favoritePostsResponse.data
      setFavoritePosts(favoritePostsResponse.data); // LINHA CORRIGIDA

    } catch (error) {
      console.error('Erro ao buscar dados do perfil:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível carregar o perfil.');
      if (error.response?.status === 401 || error.response?.status === 403) {
        signOut();
      }
    } finally {
      setLoading(false);
    }
  };

  const renderPostItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: item.id })}>
      <View style={styles.postCard}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postContentPreview}>{item.content.substring(0, 100)}...</Text>
        <View style={styles.postStatsRow}>
            <Text style={styles.postStatItem}>{item.likes_count} Curtidas</Text>
            <Text style={styles.postStatItem}>{item.comments_count} Comentários</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Perfil não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { user })} style={styles.editButton}>
          <Ionicons name="settings-outline" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Informações do Usuário */}
        <View style={styles.profileInfoCard}>
          {/* Garante que a URL da imagem esteja completa */}
          {user.profile_picture_url ? (
            <Image source={{ uri: `${api.defaults.baseURL.replace('/api', '')}${user.profile_picture_url}` }} style={styles.profilePicture} />
          ) : (
            <Ionicons name="person-circle" size={100} color="#ccc" style={styles.profilePicturePlaceholder} />
          )}
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.memberSince}>Membro desde: {new Date(user.created_at).toLocaleDateString('pt-BR')}</Text>
        </View>

        {/* Abas de Navegação */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'myPosts' && styles.activeTab]}
            onPress={() => setActiveTab('myPosts')}
          >
            <Text style={[styles.tabText, activeTab === 'myPosts' && styles.activeTabText]}>Meus Posts ({myPosts.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'favorites' && styles.activeTab]}
            onPress={() => setActiveTab('favorites')}
          >
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>Favoritos ({favoritePosts.length})</Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo da Aba Ativa */}
        {activeTab === 'myPosts' ? (
          myPosts.length > 0 ? (
            <FlatList
              data={myPosts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderPostItem}
              scrollEnabled={false}
              contentContainerStyle={styles.postListContent}
            />
          ) : (
            <Text style={styles.noContentText}>Você ainda não fez nenhum post.</Text>
          )
        ) : (
          favoritePosts.length > 0 ? (
            <FlatList
              data={favoritePosts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderPostItem}
              scrollEnabled={false}
              contentContainerStyle={styles.postListContent}
            />
          ) : (
            <Text style={styles.noContentText}>Você ainda não favoritou nenhum post.</Text>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f6fc', // fundo lilás bem clarinho
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#8e44ad', // lilás forte
    borderBottomWidth: 1,
    borderBottomColor: '#d1c4e9',
    paddingTop: 40,

    shadowColor: '#8e44ad',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    padding: 6,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  profileInfoCard: {
    backgroundColor: '#fff',
    padding: 25,
    margin: 15,
    borderRadius: 15,
    alignItems: 'center',

    shadowColor: '#8e44ad',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  profilePicture: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#9b59b6', // borda lilás
  },
  profilePicturePlaceholder: {
    marginBottom: 15,
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 6,
  },
  email: {
    fontSize: 15,
    color: '#6a1b9a',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 13,
    color: '#9e9e9e',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 15,
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',

    shadowColor: '#8e44ad',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#8e44ad',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  activeTabText: {
    color: '#8e44ad',
  },
  postListContent: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 25,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,

    shadowColor: '#8e44ad',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#4a148c',
  },
  postContentPreview: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  postStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e1bee7',
    paddingTop: 8,
  },
  postStatItem: {
    fontSize: 13,
    color: '#6a1b9a',
  },
  noContentText: {
    textAlign: 'center',
    marginTop: 35,
    fontSize: 16,
    color: '#777',
    marginHorizontal: 20,
  },
});



export default ProfileScreen;