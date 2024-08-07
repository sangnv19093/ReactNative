import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const API_URL = 'http://10.24.36.230:3000'; // Cập nhật URL API của bạn

const PaymentScreen = ({ navigation }) => {

  const handlePayment = () => {
    // Gửi yêu cầu thanh toán tới server
    fetch(`${API_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'credit_card',
        amount: 4.20,
        cardNumber: '3897 8923 6745 4638',
        cardName: 'Robert Evans',
        cardExpiry: '02/30',
      }),
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text) });
      }
      return response.json();
    })
    .then(data => {
      Alert.alert('Success', 'Payment was successful!');
      navigation.goBack(); // Quay lại màn hình trước đó sau khi thanh toán thành công
    })
    .catch(error => {
      console.error(error);
      Alert.alert('Error', `There was an error processing your payment: ${error.message}`);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Payment</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardText}>Credit Card</Text>
        <View style={styles.cardDetails}>
          <Image source={require('../../assets/images/credit-card.png')} style={styles.cardImage} />
          <Text style={styles.cardNumber}>3897 8923 6745 4638</Text>
          <Text style={styles.cardName}>Robert Evans</Text>
          <Text style={styles.cardExpiry}>02/30</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.paymentOption}>
        <FontAwesome name="money" size={24} color="#fff" />
        <Text style={styles.paymentOptionText}>Wallet $100.50</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.paymentOption}>
        <FontAwesome name="google-wallet" size={24} color="#fff" />
        <Text style={styles.paymentOptionText}>Google Pay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.paymentOption}>
        <FontAwesome name="apple" size={24} color="#fff" />
        <Text style={styles.paymentOptionText}>Apple Pay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.paymentOption}>
        <FontAwesome name="amazon" size={24} color="#fff" />
        <Text style={styles.paymentOptionText}>Amazon Pay</Text>
      </TouchableOpacity>

      <Text style={styles.price}>Price: $4.20</Text>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay from Credit Card</Text>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 8,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
  },
  cardDetails: {
    alignItems: 'center',
  },
  cardImage: {
    width: 60,
    height: 40,
    marginBottom: 8,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 4,
  },
  cardName: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  cardExpiry: {
    color: '#888',
    fontSize: 14,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  paymentOptionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  price: {
    color: '#d87d56',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  payButton: {
    backgroundColor: '#d87d56',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
