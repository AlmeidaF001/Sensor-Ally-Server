import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const App = () => {
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configuração do Sensor MQTT</Text>
      <TextInput
        style={styles.input}
        placeholder="App ID"
        value={appId}
        onChangeText={setAppId}
      />
      <TextInput
        style={styles.input}
        placeholder="API Key"
        value={apiKey}
        onChangeText={setApiKey}
      />
      <Button title="Conectar ao MQTT" onPress={handleMqttSubmit} />

      {mqttStatus && <Text style={styles.status}>Status: {mqttStatus}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.dataContainer}>
        <Text style={styles.subtitle}>Dados dos Sensores:</Text>
        {Object.keys(sensorData).length > 0 ? (
          Object.entries(sensorData).map(([deviceId, data]) => (
            <View key={deviceId} style={styles.sensorCard}>
              <Text style={styles.sensorTitle}>Dispositivo: {deviceId}</Text>
              {Object.entries(data).map(([key, value]) => (
                <Text key={key} style={styles.sensorData}>
                  {key}: {value}
                </Text>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.loading}>Aguardando dados dos sensores...</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '80%',
  },
  status: {
    marginTop: 10,
    fontSize: 16,
    color: 'green',
  },
  error: {
    color: 'red',
  },
  dataContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  sensorCard: {
    padding: 15,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '90%',
  },
  sensorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sensorData: {
    fontSize: 16,
  },
  loading: {
    fontSize: 16,
    color: 'gray',
  },
});

export default App;
