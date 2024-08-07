import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const API_URL = 'http://10.24.36.230:3000';

const ProductScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/favorites`)
      .then(response => response.json())
      .then(data => {
        const isFavorite = data.some(fav => fav.id === product.id);
        setFavorite(isFavorite);
      })
      .catch(error => console.error(error));
  }, [product]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const toggleFavorite = () => {
    const url = `${API_URL}/favorites/${product.id}`;
    const method = favorite ? 'DELETE' : 'POST';
    const body = favorite ? null : JSON.stringify(product);

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(() => setFavorite(!favorite))
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'There was an error toggling favorite status.');
      });
  };

  const handleAddToCart = () => {
    fetch(`${API_URL}/cart/${product.id}`)
      .then(response => {
        if (response.ok) {
          // Product exists in cart, update quantity
          return response.json().then(cartItem => {
            return fetch(`${API_URL}/cart/${product.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ quantity: cartItem.quantity + 1 }),
            });
          });
        } else if (response.status === 404) {
          // Product does not exist in cart, add new
          return fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...product, quantity: 1 }),
          });
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        navigation.navigate('Cart');
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', 'There was an error adding the product to the cart.');
      });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <FontAwesome name={favorite ? "heart" : "heart-o"} size={24} color="#d87d56" />
      </TouchableOpacity>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.subtitle}>From {product.origin}</Text>
      <View style={styles.ratingContainer}>
        <FontAwesome name="star" size={16} color="#ffd700" />
        <Text style={styles.ratingText}>{product.rating} ({product.reviews})</Text>
      </View>
      <View style={styles.tagsContainer}>
        <Text style={styles.tag}>{product.type}</Text>
        <Text style={styles.tag}>{product.origin}</Text>
        <Text style={styles.tag}>{product.roast}</Text>
      </View>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.sectionTitle}>Size</Text>
      <View style={styles.sizeContainer}>
        <TouchableOpacity style={styles.sizeButton}>
          <Text style={styles.sizeText}>250gm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sizeButton}>
          <Text style={styles.sizeText}>500gm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sizeButton}>
          <Text style={styles.sizeText}>1000gm</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.price}>${product.price}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 16,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 8,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    color: '#ffd700',
    fontSize: 16,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#444',
    color: '#fff',
    padding: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
  },
  sizeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sizeButton: {
    backgroundColor: '#444',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  sizeText: {
    color: '#fff',
  },
  price: {
    color: '#d87d56',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#d87d56',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 18,
  },
});

export default ProductScreen;
