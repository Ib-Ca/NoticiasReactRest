import React, {Component} from "react";
import { StyleSheet, Text, View, Image, Button, FlatList, ScrollView } from 'react-native';
import axios from 'axios'

class ListaPost extends Component{
    
    constructor(props) {
        super(props);
        this.state = {
          listaNoticias: [],
          sinConexion: 0
        };
      }
      formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
      }

      componentDidMount() {
        axios.get("http://localhost:8000/listanoticias") // Cambia la URL a la correcta para acceder a tu API
          .then(response => {
            this.setState({ listaNoticias: response.data });
            console.log(response);
          })
          .catch(error => {
            this.setState({ sinConexion: 1 });
          });
      }
      
    
      render() {
        const { listaNoticias, sinConexion } = this.state;
    
        if (sinConexion) {
          return <div>Error de conexión</div>;
        }
        return (
            <FlatList
              data={listaNoticias}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.tarjeta}>
                  <Image style={styles.imagen} source={{ uri: item.imagen }} />
                  <Text style={styles.titulo}>{item.titulo}</Text>
                  <Text style={styles.fecha}>{this.formatDate(item.fecha)}</Text>
                </View>
              )}
            />
          );
        }
      }

export default ListaPost;

const styles = StyleSheet.create({
    imagen: {
        resizeMode: 'cover',
        width: 200,
        height: 200,
    },
    tarjeta: {
        margin: 10,
        padding: 10,
        backgroundColor: "#DAF7A6",
        overflow: "hidden",
        flex: 1,
        borderRadius: 15,
        alignItems: 'center',
    },
    fecha: {
        fontSize: 12,
        color: 'gray',
        marginTop: 5,
      },
});