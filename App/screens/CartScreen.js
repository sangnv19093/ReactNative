import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const API_URL = 'http://10.24.36.230:3000';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const isFocused = useIsFocused();

  const fetchCartItems = () => {
    fetch(`${API_URL}/cart`)
      .then(response => response.json())
      .then(data => setCartItems(data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    if (isFocused) {
      fetchCartItems();
    }
  }, [isFocused]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const incrementQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      fetch(`${API_URL}/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: item.quantity + 1 }),
      })
        .then(response => response.json())
        .then(() => {
          setCartItems(prevItems => 
            prevItems.map(i => 
              i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
            )
          );
        })
        .catch(error => console.error(error));
    }
  };

  const decrementQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      fetch(`${API_URL}/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: item.quantity - 1 }),
      })
        .then(response => response.json())
        .then(() => {
          setCartItems(prevItems => 
            prevItems.map(i => 
              i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            )
          );
        })
        .catch(error => console.error(error));
    }
  };

  const removeFromCart = (itemId) => {
    fetch(`${API_URL}/cart/${itemId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      })
      .catch(error => console.error(error));
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={{ width: 60, height: 60, marginRight: 10 }} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => decrementQuantity(item.id)}>
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => incrementQuantity(item.id)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginTop: 20, marginBottom: 20, color: '#ffffff' }}>Giỏ Hàng</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.totalContainer}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#ffffff' }}>Total Price</Text>
          <Text style={styles.totalText}>${calculateTotal()}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('Payment')}>
          <Text style={styles.checkoutButtonText}>Pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
    marginVertical: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
  },
  itemPrice: {
    color: '#d87d56',
    fontSize: 16,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    color: '#fff',
    fontSize: 16,
    padding: 8,
    backgroundColor: '#444',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  quantityText: {
    color: '#fff',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#d32f2f',
    padding: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  flatListContainer: {
    paddingBottom: 100,
  },
  totalContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    flexDirection: 'row',
    backgroundColor: '#333'
  },
  totalText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    flex: 1
  },
  checkoutButton: {
    backgroundColor: '#d87d56',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: 100,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
