import { StatusBar } from 'expo-status-bar';
import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import ListaPost from './src/lista_post';
import Login from './src/categorias';
import CategoriaForm from './src/categoriaForm';
import DetalleNoticia from './src/noticia_detalle';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

function PantallaInicio({navigation, route}){
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nombre, setNombre] = useState("");

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('userData');
    setIsLoggedIn(false);
  };
  
  const verificarSesion = async () => {
    const userData = await AsyncStorage.getItem('userData');
    setIsLoggedIn(!!userData);
    console.log("Datos almacenados en AsyncStorage:", userData);
    const { nombre_usuario } = JSON.parse(userData);
    setNombre(nombre_usuario)
  };

  useEffect(() => {
    verificarSesion();
  }, []);
  
  return(
    <View style={styles.container}>
      <Image resizeMode='contain' style={styles.formatoimagen} source={{uri: 'https://www.guiltybit.com/wp-content/uploads/2019/08/Alucina-con-el-enfrentamiento-Perfect-Cell-vs-Son-Gohan-SSJ2-en-Dragon-Ball-Z-KAKAROT.jpg'}} ></Image>
      <Text style={styles.titulo}>Bienvenido {nombre ? `${nombre}` : 'a Noticias KingWinWin'}</Text>
      <ListaPost navigation={navigation}/>
      <View>
      {isLoggedIn ? (
        <Pressable style={styles.botones} onPress={cerrarSesion}>
          <Text style={styles.textoboton}>Cerrar Sesión</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.botones} onPress={() => navigation.navigate('login')}>
          <Text style={styles.textoboton}>Iniciar Sesión</Text>
        </Pressable>
      )}
      </View>
    </View>
  );
}
const cerrarSesion = async () => {
  try {
    await AsyncStorage.removeItem("userData");
    navigation.navigate('login');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

const Stack=createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ title: 'Noticias KingWinWin'}}>
        <Stack.Screen name="inicio" component={PantallaInicio} options={{title: "Noticias KingWinWin"}}/>
        <Stack.Screen name="login" component={Login}/>
        <Stack.Screen name="ncategorias" component={CategoriaForm}/>
        <Stack.Screen name="DetalleNoticia" component={DetalleNoticia} />
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
  formatoimagen: {
    width: 200,
    height: 200,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  botones: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  textoboton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
