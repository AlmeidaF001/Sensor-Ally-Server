import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomePage from '../screens/WelcomeScreen'; // A página de boas-vindas
import LoginScreen from '../screens/LoginScreen'; // A tela de login
import Register from '../screens/RegisterScreen'; // A tela de cadastro
import HomeScreen from '../screens/HomeScreen'; // A tela principal após login

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="WelcomePage">
      <Stack.Screen
        name="WelcomePage"
        component={WelcomePage}
        options={{ headerShown: false }} // Remove o cabeçalho (título)
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }} // Remove o cabeçalho da tela de login
      />
      <Stack.Screen
        name="RegisterScreen"
        component={Register}
        options={{ headerShown: false }} // Remove o cabeçalho da tela de registro
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }} // Remove o cabeçalho da tela inicial
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;