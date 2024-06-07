import React, { Component, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, ScrollView, TextInput, Button } from 'react-native';
import axios from 'axios';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class DetalleNoticia extends Component {
    
  state = {
    noticia: null,
    idNoticia: null,
    comentarios: [],
    sinConexion: 0,
  };

  componentDidMount() {
    const { id } = this.props.route.params;
    idNoticia=id
    axios.get(`http://localhost:8000/listanoticias/${id}`)
      .then(response => {
        this.setState({ noticia: response.data });
        console.log(response.data);
        if (response.data.comentarios) {
            this.setState({ comentarios: response.data.comentarios });
          }
        })
      .catch(error => {
        this.setState({ sinConexion: 1 });
      });
  }
  
  handleSubmit = async (values) => {
    const { id } = this.props.route.params;
    const userData = await AsyncStorage.getItem('userData');
    const parsedData = JSON.parse(userData);
    const idUsuario = parsedData.id_usuario;
    if (idUsuario) {

        try {
            const response = await axios.post(`http://localhost:8000/noticias/${id}/comentarios/`, {
                cuerpo: values.comentario,
                autor: idUsuario,
                noticia: id,
                visible: "NO",
            });
            values.comentario = '';
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
        }
    } else {
        console.error('No se encontraron datos de usuario en AsyncStorage');
    }
};

  render() {
    const { noticia, sinConexion, comentarios } = this.state;
    if (sinConexion) {
      return <View style={styles.container}><Text>Error de conexión</Text></View>;
    }
    if (!noticia) {
      return <View style={styles.container}><Text>Cargando...</Text></View>;
    }
    return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.titulo}>{noticia.titulo}</Text>
        <Image style={styles.imagen} source={{ uri: noticia.imagen }} />
        <Text style={styles.cuerpo}>{noticia.cuerpo}</Text>
        <Text style={styles.titulo}>Comentarios:</Text>
        <Formik
                initialValues={{ comentario: '' }}
                onSubmit={this.handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View>
                        <TextInput
                            onChangeText={handleChange('comentario')}
                            onBlur={handleBlur('comentario')}
                            value={values.comentario}
                            placeholder="Escribe tu comentario"
                            multiline
                            style={styles.input}
                        />
                        <Button onPress={handleSubmit} title="Enviar" />
                    </View>
                )}
            </Formik>
        {comentarios.map(comentario => (
          <View key={comentario.id} >
            <Text style={styles.autor}>Autor: {comentario.autor_nombre}</Text>
            <View style={styles.contain}> 
            <Text>{comentario.cuerpo}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
    );
  }
}



const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 20,
      },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
  },
  imagen: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  grupo: {
    textDecorationLine: 'underline',
    fontSize: 18,
    marginBottom: 10,
  },
  fecha: {
    fontSize: 16,
    marginBottom: 10,
  },
  cuerpo: {
    fontSize: 16,
    marginBottom: 20,
  },
  comentario: {
    fontSize: 16,
    marginBottom: 5,
  },
  autor: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  contain: {
        width: 120,
        flexGrow: 1,
        flex: 1,
    
  }
});

export default DetalleNoticia;
