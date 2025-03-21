import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SensorHistoryScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <Ionicons name="menu" size={32} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Sensor History</Text>
      <Text style={styles.text}>No data available</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20, 
    zIndex: 10, 
  },
  menuButtonBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fundo semi-transparente
    padding: 12,
    borderRadius: 50, // Botão circular
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default SensorHistoryScreen;