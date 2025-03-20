import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Importando o FontAwesome

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      // Aqui você pode chamar a função de login, substitua pelo seu código
      console.log("Fazendo login com:", email, password);
      // Exemplo de navegação para outra tela (substitua com seu código)
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      {/* Campo de Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      {/* Campo de Senha */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible} // Define se a senha é visível ou não
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.iconContainer}
        >
          <Icon
            name={isPasswordVisible ? "eye-slash" : "eye"} // Alterando ícones entre "eye" e "eye-slash"
            size={24}
            color="black" // Cor do ícone
          />
        </TouchableOpacity>
      </View>

      {/* Botão de Login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Start your Journey!</Text>
      </TouchableOpacity>

      {/* Link para tela de Cadastro */}
      <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
        <Text style={styles.switchText}>Don't have an account? Sign Up</Text>
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
    width: "80%", // Largura do campo de email (mesma largura da senha)
    padding: 12, // Espaço interno do campo de email
    marginBottom: 15, // Espaço abaixo do campo
    backgroundColor: "#FFF", // Cor de fundo do campo
    borderRadius: 8, // Borda arredondada
    fontSize: 16, // Tamanho da fonte
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%", // Largura do campo de senha (mesma largura do email)
    position: "relative", // Para que o ícone fique dentro do campo de senha
  },
  passwordInput: {
    flex: 1, // Isso faz com que o campo de senha ocupe o espaço restante
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 8,
    fontSize: 16,
  },
  iconContainer: {
    position: "absolute",
    right: 10, // Posição do ícone à direita do campo de entrada
    padding: 10, // Adiciona algum espaço interno para o ícone
    justifyContent: "center", // Para centralizar verticalmente o ícone
  },
  button: {
    backgroundColor: "#16A34A",
    paddingVertical: 12,
    top: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchText: {
    marginTop: 15,
    color: "#93C5FD",
    top: 10,
  },
});
