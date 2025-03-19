import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const App = () => {
  const [appId, setAppId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Função para conectar ao servidor e se inscrever no tópico do dispositivo
  const connectToServer = async () => {
    if (!appId || !apiKey || !deviceId) {
      setErrorMessage('Por favor, forneça appId, apiKey e deviceId.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await axios.post('https://sensor-ally-server.onrender.com/connect', {
        appId,
        apiKey,
        deviceId
      });
      
      console.log(response.data);
      setLoading(false);
      setErrorMessage(''); // Limpa qualquer mensagem de erro
    } catch (error) {
      setLoading(false);
      setErrorMessage('Erro ao conectar ao servidor.');
      console.error(error);
    }
  };

  // Função para buscar os dados do sensor
  const fetchSensorData = async () => {
    if (!deviceId) {
      setErrorMessage('Por favor, forneça um deviceId válido.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.get(`https://sensor-ally-server.onrender.com/sensor-data/${deviceId}`);
      
      if (response.status === 204) {
        setSensorData(null);
        setErrorMessage('Nenhum dado encontrado.');
      } else {
        setSensorData(response.data);
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage('Erro ao buscar dados.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sensor Data</Text>
      
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
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Device ID"
        value={deviceId}
        onChangeText={setDeviceId}
      />
      
      <Button title="Conectar" onPress={connectToServer} />
      
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      <Button title="Buscar Dados" onPress={fetchSensorData} disabled={loading || !deviceId} />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {sensorData ? (
        <ScrollView style={styles.dataContainer}>
          {Object.entries(sensorData).map(([key, value]) => (
            <View key={key} style={styles.dataItem}>
              <Text style={styles.dataKey}>{key}:</Text>
              <Text style={styles.dataValue}>{value}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noData}>Aguardando dados...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  dataContainer: {
    marginTop: 20,
  },
  dataItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dataKey: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  dataValue: {
    color: 'gray',
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
});

export default App;
