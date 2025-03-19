import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar dados do sensor
  const fetchSensorData = async () => {
    try {
      const response = await axios.get('https://sensor-ally-server.onrender.com/sensor-data');
      const newData = response.data;

      // Atualiza os dados apenas se forem diferentes
      setSensorData((prevData) =>
        JSON.stringify(prevData) !== JSON.stringify(newData) ? newData : prevData
      );
      setLoading(false);
    } catch (error) {
      setError('Erro ao buscar dados do sensor');
      setLoading(false);
    }
  };

  // Atualiza automaticamente os dados a cada 60 segundos
  useEffect(() => {
    fetchSensorData(); // Busca ao iniciar o app

    const interval = setInterval(fetchSensorData, 60000); // Atualiza a cada 60s

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dados do Sensor</Text>
      {loading ? (
        <Text>Carregando...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View>
          <Text>🌡️ Temperatura: {sensorData?.ambient_temperature ?? 'N/A'} °C</Text>
          <Text>💧 Humidade: {sensorData?.relative_humidity ?? 'N/A'} %</Text>
        </View>
      )}
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
  error: {
    color: 'red',
  },
});

export default App;
