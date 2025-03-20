import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function WelcomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Sensor Ally!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("LoginScreen")} // Navega para a tela de login
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#16A34A", // Cor do botão
    top: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF", // Cor do texto do botão
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E293B", // Cor do fundo da página
  },
  subtitle:{
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF", // Cor do texto secundário
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFF", // Cor do texto principal
  },
});
