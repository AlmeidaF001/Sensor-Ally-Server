import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import WelcomePage from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import Register from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SensorHistoryScreen from '../screens/SensorHistoryScreen';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../config/FirebaseConfig'; // Certifique-se de que está importando corretamente a configuração do Firebase

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="WelcomePage">
      <Stack.Screen
        name="WelcomePage"
        component={WelcomePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeDrawer}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const handleLogout = async (navigation) => {
  try {
    await signOut(auth);
    navigation.replace('LoginScreen');
  } catch (error) {
    console.error("Erro ao fazer logout", error);
  }
};

// Criar um componente separado para o Logout
const Logout = ({ navigation }) => {
  handleLogout(navigation);
  return null; // Não precisamos renderizar nada
};

const HomeDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Sensor History"
        component={SensorHistoryScreen}
        options={{
          title: 'Sensor History',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      {/* Aqui criamos um componente de Logout separado */}
      <Drawer.Screen
        name="Logout"
        component={Logout} // Referencia o componente de Logout diretamente
        options={{
          title: 'Logout',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppNavigator;
