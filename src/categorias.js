import React, { Component } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
function NavegarPagina({ pagina, mensaje }) {
    const navigation = useNavigation();
  
    return (
        <Pressable style={styles.botones2} onPress={() => navigation.navigate(pagina)}>
            <Text style={styles.textoboton}>{mensaje}</Text>
        </Pressable>
    );
}

class Login extends Component {
    state = {
        usuario: '',
        clave: '',
        error: ''
    };

    iniciarSesion = () => {
        const { usuario, clave } = this.state;
        axios.post("http://localhost:8000/login/", { usuario, clave })
            .then(async response => {
                const data = response.data;
                if (data.mensaje === 'Inicio de sesión exitoso') {
                    await AsyncStorage.setItem("userData", JSON.stringify(data));
                    this.props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'inicio' }],
                    });
                } else {
                    this.setState({ error: 'Credenciales incorrectas' });
                }
            })
            .catch(error => {
                console.error(error);
                this.setState({ error: 'Ocurrió un error al iniciar sesión' });
            });
    };

    render() {
        const { error } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}>Iniciar Sesión</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Usuario"
                    onChangeText={text => this.setState({ usuario: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    onChangeText={text => this.setState({ clave: text })}
                />
                <Pressable style={styles.botones} onPress={this.iniciarSesion}>
                    <Text style={styles.textoboton}>Iniciar Sesión</Text>
                </Pressable>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <NavegarPagina pagina='Registrarse' mensaje='Registrarse'/>
            </View>
        );
    }
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    titulo: {
        fontSize: 24,
        marginBottom: 20,
        marginTop: 10,
    },
    input: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    botones: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'justify',
        paddingVertical: 12,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        width: 150,
    },
    botones2: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'blue',
    },
    textoboton: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
});
