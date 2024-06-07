import React, { Component } from 'react';
import { TextInput, Pressable, Text, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';

class Registrarse extends Component {
    handleSubmit = async (values) => {
        //console.log(values);
        const { navigation } = this.props;
        try {
            const response = await axios.post('http://localhost:8000/crear_usuario/', {
                nombre: values.nombreUsuario,
                usuario: values.usuario,
                clave: values.contraseña,
            });
            if (response.status === 201) {
                navigation.navigate('login');
            }
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}>Registrarse</Text>
                <Formik
                    initialValues={{
                        nombreUsuario: "",
                        usuario: "",
                        contraseña: "",
                    }}
                    onSubmit={this.handleSubmit}
                >
                    {({ handleChange, handleSubmit, values }) => (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre de Usuario"
                                onChangeText={handleChange("nombreUsuario")}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Usuario"
                                onChangeText={handleChange("usuario")}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                secureTextEntry={true}
                                onChangeText={handleChange("contraseña")}
                            />
                            <Pressable style={styles.botones} onPress={handleSubmit}>
                                <Text style={styles.textoboton}>Registrarse</Text>
                            </Pressable>
                        </>
                    )}
                </Formik>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 10,
    },
    botones: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
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
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default Registrarse;
