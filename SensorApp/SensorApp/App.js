import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [appId, setAppId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [deviceId, setDeviceId] = useState('');  // Novo estado para o ID do dispositivo
  const [mqttStatus, setMqttStatus] = useState('');
  const [sensorData, setSensorData] = useState(null);
  const [error, setError] = useState(null);

  const serverUrl = 'https://sensor-ally-server.onrender.com'; // Substitua pela URL real do seu servidor

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
    try {
      const response = await axios.get(`${serverUrl}/sensor-data/${deviceId}`);

      if (response.status === 200) {
        setSensorData(response.data);
      } else {
        setSensorData(null);
      }
    } catch (error) {
      setError('Erro ao buscar dados do sensor');
    }
  };

  return (
    <View style={styles.container}>
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
        {sensorData ? (
          <View>
            {Object.keys(sensorData).map((key) => (
              <Text style={styles.sensorDataText} key={key}>
                {key}: {sensorData[key]}
              </Text>
            ))}
          </View>
        ) : (
          <Text>Aguardando novos dados... {sensorData}</Text>
        )}
      </View>
    </View>
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
