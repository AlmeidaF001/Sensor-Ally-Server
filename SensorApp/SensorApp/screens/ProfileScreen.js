import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Importar para navegação

const ProfileScreen = () => {
  const navigation = useNavigation(); // Inicializar navegação

  // Dados do usuário (pode vir de uma API ou do Firebase)
  const user = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    photo: 'https://www.example.com/photo.jpg', // URL ou caminho local da foto
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Botão do Menu Hambúrguer */}
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <Ionicons name="menu" size={32} color="white" />
      </TouchableOpacity>

      {/* Cabeçalho com Foto e Nome */}
      <View style={styles.header}>
        <Image source={{ uri: user.photo }} style={styles.profileImage} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Seção de Ações do Perfil */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Alterar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Sair</Text>
        </TouchableOpacity>
      </View>

     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#4CAF50',
    width: '100%',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5, // Sombra suave
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: '#fff',
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.7,
  },
  actionSection: {
    marginTop: 30,
    width: '90%',
  },
  actionButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2, // Sombra leve
  },
  actionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10, // Certifique-se de que o botão do menu está no topo
  },
});

export default ProfileScreen;
