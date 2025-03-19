import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const App = () => {
  const [appId, setAppId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [deviceId, setDeviceId] = useState('');  // ID do dispositivo
  const [mqttStatus, setMqttStatus] = useState('');
  const [sensorData, setSensorData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Novo estado para controle de loading

  const serverUrl = 'https://sensor-ally-server.onrender.com'; // URL do servidor

  // Função para conectar ao servidor MQTT
  const handleMqttSubmit = async () => {
    try {
      const response = await axios.post(`${serverUrl}/connect`, {
        appId,
        apiKey
      });

      setMqttStatus(response.data.status);
    } catch (error) {
      setError('Erro ao conectar ao MQTT');
    }
  };

  // Função para buscar dados de um dispositivo específico
  const handleFetchData = async () => {
    setLoading(true); // Ativa o estado de loading antes de buscar os dados
    try {
      const response = await axios.get(`${serverUrl}/sensor-data/${deviceId}`);
      console.log('Resposta recebida:', response); // Log de resposta do servidor

      if (response.status === 200 && response.data) {
        setSensorData(response.data);
      } else {
        setSensorData(null);
      }
    } catch (error) {
      setError('Erro ao buscar dados do sensor');
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false); // Desativa o estado de loading após a requisição
    }
  };

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

      <TextInput
        style={styles.input}
        placeholder="ID do Dispositivo"
        value={deviceId}
        onChangeText={setDeviceId}
      />

      <Button title="Buscar Dados do Dispositivo" onPress={handleFetchData} />

      {mqttStatus && <Text>Status da Conexão: {mqttStatus}</Text>}

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.dataContainer}>
        {loading ? (
          <Text>Aguardando novos dados...</Text>  // Exibe enquanto carrega
        ) : sensorData ? (
          <View>
            {Object.keys(sensorData).map((key) => (
              <Text style={styles.sensorDataText} key={key}>
                {key}: {sensorData[key]}
              </Text>
            ))}
          </View>
        ) : (
          <Text>Nenhum dado encontrado.</Text>  // Caso não haja dados
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '80%',
  },
  error: {
    color: 'red',
  },
  dataContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  sensorDataText: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default App;
