import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

const API_URL = 'http://10.24.36.230:3000';

const EditProductScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [image, setImage] = useState(product.image);

  const updateProductInCartAndFavorites = (updatedProduct) => {
    // Update product in cart
    fetch(`${API_URL}/cart/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    }).catch(error => console.error('Error updating product in cart:', error));

    // Update product in favorites
    fetch(`${API_URL}/favorites/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    }).catch(error => console.error('Error updating product in favorites:', error));
  };

  const handleEditProduct = () => {
    const updatedProduct = { ...product, name, description, price, image };

    fetch(`${API_URL}/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProduct)
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => {
        updateProductInCartAndFavorites(updatedProduct);
        Alert.alert('Success', 'Product updated successfully!');
        navigation.goBack(); // Quay lại màn hình trước đó sau khi sửa thành công
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', `There was an error updating the product: ${error.message}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor={"#FFFFFF"}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor={"#FFFFFF"}
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        placeholderTextColor={"#FFFFFF"}
        value={price}
        onChangeText={setPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        placeholderTextColor={"#FFFFFF"}
        value={image}
        onChangeText={setImage}
      />
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
      ) : null}
      <TouchableOpacity style={styles.button} onPress={handleEditProduct}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e1e1e',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#333',
    borderRadius: 5,
    color: '#fff',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#d87d56',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 20,
    borderRadius: 5,
  },
});

export default EditProductScreen;
