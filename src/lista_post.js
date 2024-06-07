import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Picker,
} from "react-native";
import axios from "axios";

class ListaPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listaNoticias: [],
      sinConexion: 0,
      listaCat: {},
      catagoriaSelec: "todos",
    };
  }
  formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("es-ES", options);
  };

  componentDidMount() {
    axios
      .get("http://localhost:8000/listanoticias")
      .then((response) => {
        this.setState({ listaNoticias: response.data });
        //console.log(response);
      })
      .catch((error) => {
        this.setState({ sinConexion: 1 });
      });
    axios
      .get("http://localhost:8000/listagrupos")
      .then((response) => {
        const grupos = {};
        response.data.forEach((grupo) => {
          grupos[grupo.id] = grupo.grupo;
        });
        this.setState({ listaCat: grupos }, () => {
         // console.log("lista cat: ",this.state.listaCat); 
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ sinConexion: 1 });
      });
  }

  getCategoria = (id) => {
    return this.state.listaCat[id] || "Categoria desconocida";
  };

  handleChangeCat = (id) => {
    this.setState({ catagoriaSelec: id });
  };

  verDetalle = (item) => {
    this.props.navigation.navigate("DetalleNoticia", {
      id: item.id,
      titulo: item.titulo,
      cuerpo: item.cuerpo,
      imagen: item.imagen,
      grupo: item.grupo,
      fecha: item.fecha,
    });
  };

  render() {
    const { listaNoticias, sinConexion, listaCat, catagoriaSelec } = this.state;
    if (sinConexion==1) {
      return <div>Error de conexión</div>;
    }
    let filter = listaNoticias;
    if (catagoriaSelec !== 'todos') {
      filter = listaNoticias.filter(item => {
        return item.grupo.id === parseInt(catagoriaSelec);
      });
    }
    return (
      <ScrollView style={styles.container}> 
      <Picker
      selectedValue={catagoriaSelec}
      style={styles.picker}
      onValueChange={(itemValue) => this.handleChangeCat(itemValue)}>
      <Picker.Item style={styles.pickerItem} label="Todo" value="todos" />
      {Object.keys(listaCat).map(id => (
        <Picker.Item key={id} style={styles.pickerItem} label={listaCat[id]} value={id} />
      ))}
    </Picker>
      <FlatList
        data={filter}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => this.verDetalle(item)}>
            <View style={styles.tarjeta}>
              <Image style={styles.imagen} source={{ uri: item.imagen }} />
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.grupo}>{this.getCategoria(item.grupo.id)} </Text>
              <Text style={styles.fecha}>{this.formatDate(item.fecha)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      </ScrollView>
    );
  }
}

export default ListaPost;

const styles = StyleSheet.create({
  picker: {
    height: 36,
    width: '100%',
    marginBottom: 14,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  pickerItem: {
    height: 50,
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imagen: {
    resizeMode: "cover",
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
    alignItems: "center",
  },
  grupo: {
    textDecorationLine: "underline",
  },
  fecha: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});
