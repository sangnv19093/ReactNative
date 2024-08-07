import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

const API_URL = 'http://10.24.36.230:3000';

const HomeScreen = ({ navigation }) => {
  const [coffeeData, setCoffeeData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const isFocused = useIsFocused();

  const fetchProducts = () => {
    fetch(`${API_URL}/products`)
      .then(response => response.json())
      .then(data => setCoffeeData(data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchProducts();
    fetch(`${API_URL}/favorites`)
      .then(response => response.json())
      .then(data => setFavorites(data))
      .catch(error => console.error(error));
  }, [isFocused]);

  const handleFavorite = (item) => {
    const isFavorite = favorites.find(fav => fav.id === item.id);

    if (isFavorite) {
      fetch(`${API_URL}/favorites/${item.id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setFavorites(favorites.filter(fav => fav.id !== item.id));
        })
        .catch(error => console.error(error));
    } else {
      fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      })
        .then(response => response.json())
        .then(data => {
          setFavorites([...favorites, data]);
        })
        .catch(error => console.error(error));
    }
  };

  const handleAddToCart = (item) => {
    fetch(`${API_URL}/cart/${item.id}`)
      .then(response => {
        if (response.ok) {
          // Product exists in cart, update quantity
          return response.json().then(cartItem => {
            return fetch(`${API_URL}/cart/${item.id}`, {
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
            body: JSON.stringify({ ...item, quantity: 1 }),
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

  const filteredData = coffeeData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'All' || item.category === selectedCategory)
  );

  const categories = ['All', 'Cappuccino', 'Espresso', 'Americano', 'Macchiato', 'Mocha'];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('Product', { product: item })}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardPrice}>{item.price}$</Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
          <FontAwesome name="plus" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFavorite(item)}>
          <FontAwesome name={favorites.find(fav => fav.id === item.id) ? "heart" : "heart-o"} size={25} color="#d87d56" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find the best coffee for you</Text>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Find Your Coffee..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView horizontal style={styles.filterContainer}>
        {categories.map(category => (
          <TouchableOpacity key={category} onPress={() => setSelectedCategory(category)}>
            <Text style={[styles.filterText, selectedCategory === category && styles.selectedCategory]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
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
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop:20
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterText: {
    color: '#888',
    fontSize: 14,
    marginRight: 16,
  },
  selectedCategory: {
    color: '#d87d56',
    fontWeight: 'bold',
  },
  flatListContainer: {
    paddingBottom: 100,
  },
  card: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    margin: 8
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#d87d56',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
