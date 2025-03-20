import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { auth } from '../config/FirebaseConfig';
import { signOut } from 'firebase/auth';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // Para usar o ícone do menu hambúrguer

const HomeScreen = ({ navigation }) => {
  const [appId, setAppId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [mqttStatus, setMqttStatus] = useState('');
  const [sensorData, setSensorData] = useState({});
  const [error, setError] = useState(null);

  const serverUrl = 'https://sensor-ally-server.onrender.com';

  // Conectar ao servidor MQTT
  const handleMqttSubmit = async () => {
    try {
      const response = await axios.post(`${serverUrl}/connect`, { appId, apiKey });
      setMqttStatus(response.data.status);
    } catch (error) {
      setError('Erro ao conectar ao MQTT');
    }
  };

  // Atualizar dados do sensor automaticamente
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${serverUrl}/sensor-data`);
        setSensorData(response.data || {});
      } catch (error) {
        console.error('Erro ao buscar dados do sensor:', error);
      }
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  // Logout do usuário
  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Menu hambúrguer */}
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Add Sensors via MQTT</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Application ID"
          value={appId}
          onChangeText={setAppId}
        />
        <TextInput
          style={styles.input}
          placeholder="API Key"
          value={apiKey}
          onChangeText={setApiKey}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleMqttSubmit}>
          <Text style={styles.buttonText}>Connect to MQTT </Text>
        </TouchableOpacity>

        {mqttStatus && <Text style={styles.status}>Status: {mqttStatus}</Text>}
        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.dataContainer}>
          <Text style={styles.subtitle}>Sensor Data:</Text>
          {Object.keys(sensorData).length > 0 ? (
            Object.entries(sensorData).map(([deviceId, data]) => (
              <View key={deviceId} style={styles.sensorCard}>
                <Text style={styles.sensorTitle}>Device: {deviceId}</Text>

                <ScrollView style={styles.sensorDataScroll}>
                  {Object.entries(data).map(([key, value]) => (
                    <Text key={key} style={styles.sensorData}>
                      {key}: {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                    </Text>
                  ))}
                </ScrollView>
              </View>
            ))
          ) : (
            <Text style={styles.loading}>Waiting for values...</Text>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#1E293B', // Cor de fundo escura
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60, // Para dar um espaçamento extra no topo
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1, // Para garantir que o botão fique acima dos outros componentes
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 15,
    width: '85%',
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  status: {
    marginTop: 10,
    fontSize: 16,
    color: 'green',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dataContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  sensorCard: {
    padding: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    width: '90%',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sensorDataScroll: {
    maxHeight: 180,
  },
  sensorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sensorData: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  loading: {
    fontSize: 16,
    color: 'gray',
  },
  logoutButton: {
    backgroundColor: '#E53935',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 30,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
