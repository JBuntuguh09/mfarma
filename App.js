import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Home from './app/pages/Home';
import Prices from './app/pages/Prices';
import New_Products from './app/pages/New_Product';
import Edit_Product from './app/pages/Edit_Product';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer >
    <Stack.Navigator  >

    <Stack.Screen name="Main" component={Home} />
    <Stack.Screen name="Prices" component={Prices} />
    <Stack.Screen name="Add" component={New_Products} />
    <Stack.Screen name="Edit" component={Edit_Product} />
    
    
    </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
