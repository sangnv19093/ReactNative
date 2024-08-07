import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductScreen from '../screens/ProductScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProductScreen from '../screens/EditProductScreen';
import SelectProductScreen from '../screens/SelectProductScreen';
import DeleteProductScreen from '../screens/DeleteProductScreen';
import PaymentScreen from '../screens/PaymentScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = () => {
    fetch('http://192.168.92.106:3000/cart')
      .then(response => response.json())
      .then(data => setCartItems(data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const addToCart = (item) => {
    fetch('http://192.168.92.106:3000/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
      .then(response => response.json())
      .then(data => {
        setCartItems((prevItems) => {
          const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
          if (existingItem) {
            return prevItems.map((cartItem) =>
              cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            );
          }
          return [...prevItems, { ...item, quantity: 1 }];
        });
      })
      .catch(error => console.error(error));
  };

  const incrementQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      fetch(`http://192.168.92.106:3000/cart/${itemId}`, {
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
      fetch(`http://192.168.92.106:3000/cart/${itemId}`, {
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
    fetch(`http://192.168.92.106:3000/cart/${itemId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      })
      .catch(error => console.error(error));
  };

  const HomeTabNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Cart') {
            iconName = 'shopping-bag';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Favorites') {
            iconName = 'heart';
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#d87d56',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#333' },
        headerShown: false
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} addToCart={addToCart} />}
      </Tab.Screen>
      <Tab.Screen name="Cart">
        {(props) => (
          <CartScreen
            {...props}
            cartItems={cartItems}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
            removeFromCart={removeFromCart}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Favorites" component={FavoriteScreen} />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="welcome">
        <Stack.Screen
          name="welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Product"
          component={ProductScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProduct"
          component={EditProductScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectProduct"
          component={SelectProductScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DeleteProduct"
          component={DeleteProductScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
