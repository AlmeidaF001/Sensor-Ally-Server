import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { auth } from '../config/FirebaseConfig';
import { signOut } from 'firebase/auth';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [appId, setAppId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [mqttStatus, setMqttStatus] = useState('');
  const [sensorData, setSensorData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const navigation = useNavigation();
  const serverUrl = 'https://sensor-ally-server.onrender.com';

  // Function to connect to MQTT server
  const handleMqttSubmit = async () => {
    if (!appId || !apiKey) {
      Alert.alert('Input Error', 'Please enter both Application ID and API Key');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${serverUrl}/connect`, { appId, apiKey });
      console.log('MQTT connection response:', response.data);
      setMqttStatus(response.data.status || 'Connected successfully');
    } catch (error) {
      console.error('MQTT connection error:', error.response?.data || error.message);
      setError(`Error connecting to MQTT: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Update sensor data automatically every 5 seconds
  useEffect(() => {
    // Clear sensor data when appId changes
    setSensorData({});
    
    if (!appId) return;
    
    console.log('Setting up data fetch interval for appId:', appId);
    
    const interval = setInterval(async () => {
      try {
        setIsDataLoading(true);
        const response = await axios.get(`${serverUrl}/sensor-data`, { 
          params: { appId },
          timeout: 10000 // 10 second timeout
        });
        
        console.log('Sensor data response:', response.data);
        
        if (response.data && typeof response.data === 'object') {
          setSensorData(response.data);
        } else {
          console.warn('Unexpected data format:', response.data);
          setSensorData({});
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching sensor data:', error.response?.data || error.message);
        setError(`Failed to fetch sensor data: ${error.response?.data?.message || error.message}`);
      } finally {
        setIsDataLoading(false);
      }
    }, 5000);
  
    return () => {
      console.log('Clearing data fetch interval');
      clearInterval(interval);
    };
  }, [appId]);
  
  // Function to log out user
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSensorData({});
      navigation.replace('LoginScreen');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Failed', 'Unable to log out. Please try again.');
    }
  };

  // Function to format a sensor value for display - fixed to handle arrays
  const formatSensorValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      try {
        // Handle arrays by extracting first value
        if (Array.isArray(value)) {
          if (value.length === 0) return "--";
          return typeof value[0] === 'number' 
            ? (Number.isInteger(value[0]) ? value[0] : value[0].toFixed(2))
            : value[0];
        }
        
        // For objects, extract just the first value
        const firstValue = Object.values(value)[0];
        if (firstValue !== undefined) {
          if (typeof firstValue === 'number') {
            return Number.isInteger(firstValue) ? firstValue : firstValue.toFixed(2);
          }
          return firstValue;
        }
        
        // Fallback case: just return stringified without the outer brackets
        const jsonStr = JSON.stringify(value);
        return jsonStr.substring(1, jsonStr.length - 1);
      } catch (e) {
        return "Complex Value";
      }
    } else if (typeof value === 'number') {
      return Number.isInteger(value) ? value : value.toFixed(2);
    }
    return value;
  };

  // Function to render sensor data with enhanced UI
  const renderSensorData = () => {
    if (Object.keys(sensorData).length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="cloud-offline-outline" size={50} color="#B0B0B0" />
          <Text style={styles.loading}>Waiting for sensor data...</Text>
        </View>
      );
    }

    return Object.entries(sensorData).map(([deviceId, data]) => {
      // Skip rendering if data is null or not an object
      if (!data || typeof data !== 'object') {
        return (
          <View key={deviceId} style={styles.sensorCard}>
            <Text style={styles.sensorTitle}>Device: {deviceId}</Text>
            <Text style={styles.error}>Invalid data format received</Text>
          </View>
        );
      }

      // Extract sensor data - check for nested structure in bytes object
      let tempData = null;
      let humidityData = null;
      let co2Data = null;
      
      if (data.bytes && typeof data.bytes === 'object') {
        // Extract temperature data
        if (data.bytes.temperature) {
          tempData = data.bytes.temperature;
        }
        
        // Extract humidity data
        if (data.bytes.humidity) {
          humidityData = data.bytes.humidity;
        }
        
        // Extract CO2 data
        if (data.bytes.co2) {
          co2Data = data.bytes.co2;
        }
      } else {
        // Look for data at the top level if not in bytes
        Object.entries(data).forEach(([key, value]) => {
          if (key.toLowerCase().includes('temperature') || key.toLowerCase().includes('temp')) {
            tempData = value;
          } else if (key.toLowerCase().includes('humidity') || key.toLowerCase().includes('humid')) {
            humidityData = value;
          } else if (key.toLowerCase().includes('co2') || key.toLowerCase().includes('carbon')) {
            co2Data = value;
          }
        });
      }

      // If no data found at all
      if (!tempData && !humidityData && !co2Data) {
        return (
          <View key={deviceId} style={styles.sensorCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="hardware-chip-outline" size={24} color="#4CAF50" style={styles.deviceIcon} />
              <Text style={styles.sensorTitle}>Device: {deviceId}</Text>
            </View>
            <View style={styles.noDataContainer}>
              <Ionicons name="alert-circle-outline" size={32} color="#B0B0B0" />
              <Text style={styles.loading}>No sensor data available</Text>
            </View>
          </View>
        );
      }

      return (
        <View key={deviceId} style={styles.sensorCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="hardware-chip-outline" size={24} color="#4CAF50" style={styles.deviceIcon} />
            <Text style={styles.sensorTitle}>Device: {deviceId}</Text>
          </View>
          
          <View style={styles.sensorDataGrid}>
            {/* Temperature Data */}
            {tempData && (
              <View style={styles.sensorParameter}>
                <View style={styles.parameterHeader}>
                  <Ionicons name="thermometer-outline" size={24} color="#FF5722" />
                  <Text style={styles.parameterTitle}>Temperature</Text>
                </View>
                
                <View style={[styles.parameterValueContainer, {backgroundColor: 'rgba(255, 87, 34, 0.1)'}]}>
                  {typeof tempData === 'object' ? (
                    Object.entries(tempData)
                      .filter(([key]) => key.toLowerCase() !== 'unit')
                      .map(([key, value]) => (
                        <Text key={`temp-${key}`} style={styles.parameterValue}>
                          {formatSensorValue(value)}
                          <Text style={styles.parameterUnit}>°C</Text>
                        </Text>
                      ))[0] || <Text style={styles.parameterValue}>--</Text>
                  ) : (
                    <Text style={styles.parameterValue}>
                      {formatSensorValue(tempData)}
                      <Text style={styles.parameterUnit}>°C</Text>
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* Humidity Data */}
            {humidityData && (
              <View style={styles.sensorParameter}>
                <View style={styles.parameterHeader}>
                  <Ionicons name="water-outline" size={24} color="#2196F3" />
                  <Text style={styles.parameterTitle}>Humidity</Text>
                </View>
                
                <View style={[styles.parameterValueContainer, {backgroundColor: 'rgba(33, 150, 243, 0.1)'}]}>
                  {typeof humidityData === 'object' ? (
                    Object.entries(humidityData)
                      .filter(([key]) => key.toLowerCase() !== 'unit')
                      .map(([key, value]) => (
                        <Text key={`humid-${key}`} style={styles.parameterValue}>
                          {formatSensorValue(value)}
                          <Text style={styles.parameterUnit}>%</Text>
                        </Text>
                      ))[0] || <Text style={styles.parameterValue}>--</Text>
                  ) : (
                    <Text style={styles.parameterValue}>
                      {formatSensorValue(humidityData)}
                      <Text style={styles.parameterUnit}>%</Text>
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* CO2 Data */}
            {co2Data && (
              <View style={styles.sensorParameter}>
                <View style={styles.parameterHeader}>
                  <Ionicons name="cloud-outline" size={24} color="#673AB7" />
                  <Text style={styles.parameterTitle}>CO2</Text>
                </View>
                
                <View style={[styles.parameterValueContainer, {backgroundColor: 'rgba(103, 58, 183, 0.1)'}]}>
                  {typeof co2Data === 'object' ? (
                    Object.entries(co2Data)
                      .filter(([key]) => key.toLowerCase() !== 'unit')
                      .map(([key, value]) => (
                        <Text key={`co2-${key}`} style={styles.parameterValue}>
                          {formatSensorValue(value)}
                          <Text style={styles.parameterUnit}>ppm</Text>
                        </Text>
                      ))[0] || <Text style={styles.parameterValue}>--</Text>
                  ) : (
                    <Text style={styles.parameterValue}>
                      {formatSensorValue(co2Data)}
                      <Text style={styles.parameterUnit}>ppm</Text>
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Hamburger menu with navigation */}
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <View style={styles.menuButtonBackground}>
            <Ionicons name="menu" size={32} color="white" />
          </View>
        </TouchableOpacity>

        {/* Logout button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <View style={styles.logoutButtonBackground}>
            <Ionicons name="log-out-outline" size={28} color="white" />
          </View>
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
          secureTextEntry={true}
        />
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleMqttSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Connect to MQTT</Text>
          )}
        </TouchableOpacity>

        {mqttStatus ? <Text style={styles.status}>Status: {mqttStatus}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.dataContainer}>
          <Text style={styles.subtitle}>Sensor Data:</Text>
          
          {isDataLoading && Object.keys(sensorData).length === 0 ? (
            <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
          ) : (
            renderSensorData()
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#1E293B',
  },
  container: {
    flex: 1,
    top: 20,
    alignItems: 'center',
    padding: 20,
    paddingTop: 150,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20, 
    zIndex: 10, 
  },
  menuButtonBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 50,
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  logoutButtonBackground: {
    backgroundColor: 'rgba(255, 69, 0, 0.7)',
    padding: 12,
    borderRadius: 50,
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
    marginBottom: 10,
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
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  error: {
    color: '#FF6347',
    marginTop: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 10,
    minWidth: 180,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
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
    borderWidth: 0,
    borderRadius: 16,
    width: '90%',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  deviceIcon: {
    marginRight: 10,
  },
  sensorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  sensorDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  sensorParameter: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 12,
    padding: 5,
  },
  parameterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  parameterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#1E293B',
  },
  parameterValueContainer: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parameterValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  parameterUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  emptyStateContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  noDataContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loading: {
    fontSize: 16,
    color: '#B0B0B0',
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  loader: {
    marginTop: 30,
  },
});

export default HomeScreen;