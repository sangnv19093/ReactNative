import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const API_URL = 'http://192.168.92.106:3000';

const SelectProductScreen = ({ route, navigation }) => {
  const { action } = route.params;
  const [products, setProducts] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  }, [isFocused]);

  const handleSelectProduct = (product) => {
    if (action === 'edit') {
      navigation.navigate('EditProduct', { product });
    } else if (action === 'delete') {
      navigation.navigate('DeleteProduct', { product });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSelectProduct(item)}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Product</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
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
    marginTop: 20
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: Dimensions.get('window').width - 32, // Đảm bảo chiều rộng của card kéo dài hết màn hình trừ padding
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
  flatListContainer: {
    paddingBottom: 100,
  },
});

export default SelectProductScreen;
