import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// Certifique-se de que o serviço signUp está configurado corretamente.

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      // Função de registro que você provavelmente tem em authService
      await signUp(email, password, navigation);
    } catch (error) {
      console.error("Erro ao fazer o cadastro:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* Campo de Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Campo de Senha */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Botão de Cadastro */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Link para a tela de Login */}
      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.switchText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E293B",
  },
  title: {
    fontSize: 26,
    bottom: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  input: {
    width: "80%", // Largura do campo
    padding: 12, // Espaço interno
    marginBottom: 15, // Espaço abaixo do campo
    backgroundColor: "#FFF", // Cor de fundo do campo
    borderRadius: 8, // Bordas arredondadas
    fontSize: 16, // Tamanho da fonte
  },
  button: {
    backgroundColor: "#16A34A", // Cor do botão
    paddingVertical: 12, // Padding vertical
    paddingHorizontal: 40, // Padding horizontal
    borderRadius: 8, // Bordas arredondadas
  },
  buttonText: {
    color: "#FFF", // Cor do texto
    fontSize: 16, // Tamanho da fonte
    fontWeight: "bold", // Peso da fonte
  },
  switchText: {
    marginTop: 15, // Margem superior
    color: "#93C5FD", // Cor do texto
  },
});
