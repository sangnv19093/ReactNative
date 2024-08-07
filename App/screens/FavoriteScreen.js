import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://10.24.36.230:3000';

const FavoriteScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = () => {
    fetch(`${API_URL}/favorites`)
      .then(response => response.json())
      .then(data => setFavorites(data))
      .catch(error => console.error(error));
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const handleRemove = (itemId) => {
    fetch(`${API_URL}/favorites/${itemId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setFavorites(favorites.filter(item => item.id !== itemId));
      })
      .catch(error => console.error(error));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('Product', { product: item })}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.id)}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
        <Text style={{fontSize: 30, fontWeight:'bold', color:'#FFFFFF', textAlign:'center', marginBottom: 20}}>Yêu thích</Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  card: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    margin: 8,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  cardPrice: {
    color: '#d87d56',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#d87d56',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  flatListContainer: {
    paddingBottom: 100,
  },
});

export default FavoriteScreen;
