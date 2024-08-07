import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const API_URL = 'http://10.24.36.230:3000';

const DeleteProductScreen = ({ route, navigation }) => {
  const { product } = route.params;

  const handleDeleteProduct = () => {
    fetch(`${API_URL}/products/${product.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Delete product from cart
        fetch(`${API_URL}/cart/${product.id}`, {
          method: 'DELETE',
        }).catch(error => console.error('Error deleting product from cart:', error));

        // Delete product from favorites
        fetch(`${API_URL}/favorites/${product.id}`, {
          method: 'DELETE',
        }).catch(error => console.error('Error deleting product from favorites:', error));

        Alert.alert('Success', 'Product deleted successfully!');
        navigation.goBack(); // Quay lại màn hình trước đó sau khi xóa thành công
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', `There was an error deleting the product: ${error.message}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Product</Text>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Text style={styles.productPrice}>{product.price}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProduct}>
        <Text style={styles.buttonText}>Confirm Delete</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  productName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productDescription: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  productPrice: {
    color: '#d87d56',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  deleteButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#d32f2f',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DeleteProductScreen;
