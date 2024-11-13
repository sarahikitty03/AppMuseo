import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, Alert, Modal, StyleSheet } from 'react-native';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../path/to/your/firebase/config';

const GestionObraScreen = () => {
  const [obras, setObras] = useState([]);
  const [selectedObra, setSelectedObra] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchObras();
  }, []);

  const fetchObras = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'catalogoarte'));
      const obrasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setObras(obrasData);
    } catch (error) {
      console.error("Error al obtener las obras: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'catalogoarte', id));
      Alert.alert("Éxito", "Obra eliminada correctamente");
      fetchObras();
    } catch (error) {
      console.error("Error al eliminar la obra: ", error);
    }
  };

  const handleUpdate = async () => {
    if (Object.values(selectedObra).some(value => value === '')) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const obraRef = doc(db, 'catalogoarte', selectedObra.id);
      await updateDoc(obraRef, {
        ...selectedObra,
        año: parseInt(selectedObra.año),
        valor_estimado: parseFloat(selectedObra.valor_estimado)
      });
      Alert.alert("Éxito", "Obra actualizada correctamente");
      setModalVisible(false);
      fetchObras();
    } catch (error) {
      console.error("Error al actualizar la obra: ", error);
    }
  };

  const renderObraItem = ({ item }) => (
    <View style={styles.obraContainer}>
      <Text style={styles.obraTitle}>{item.nombre}</Text>
      <Text>Artista: {item.artista}</Text>
      <Text>Año: {item.año}</Text>
      <Text>Descripción: {item.descripcion}</Text>
      <Text>Dimensiones: {item.dimensiones}</Text>
      <Text>Valor Estimado: {item.valor_estimado}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => {
            setSelectedObra(item);
            setModalVisible(true);
          }}
          style={styles.editButton}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={obras}
        keyExtractor={(item) => item.id}
        renderItem={renderObraItem}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Obra de Arte</Text>

          <TextInput
            placeholder="Artista"
            style={styles.input}
            value={selectedObra?.artista}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, artista: text })}
          />
          <TextInput
            placeholder="Año"
            style={styles.input}
            value={selectedObra?.año.toString()}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, año: text })}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Descripción"
            style={styles.input}
            value={selectedObra?.descripcion}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, descripcion: text })}
          />
          <TextInput
            placeholder="Dimensiones"
            style={styles.input}
            value={selectedObra?.dimensiones}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, dimensiones: text })}
          />
          <TextInput
            placeholder="URL de la Imagen"
            style={styles.input}
            value={selectedObra?.imagen_url}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, imagen_url: text })}
          />
          <TextInput
            placeholder="Nombre"
            style={styles.input}
            value={selectedObra?.nombre}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, nombre: text })}
          />
          <TextInput
            placeholder="Tipo"
            style={styles.input}
            value={selectedObra?.tipo}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, tipo: text })}
          />
          <TextInput
            placeholder="Ubicación"
            style={styles.input}
            value={selectedObra?.ubicacion}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, ubicacion: text })}
          />
          <TextInput
            placeholder="Valor Estimado"
            style={styles.input}
            value={selectedObra?.valor_estimado.toString()}
            onChangeText={(text) => setSelectedObra({ ...selectedObra, valor_estimado: text })}
            keyboardType="numeric"
          />

          <View style={styles.modalActions}>
            <Button title="Guardar Cambios" onPress={handleUpdate} />
            <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f7f7f7',
  },
  obraContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  obraTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  modalActions: {
    marginTop: 20,
  },
});

export default GestionObraScreen;
