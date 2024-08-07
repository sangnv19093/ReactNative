import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const API_URL = 'http://10.24.36.230:3000';

const ContactScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !phone || !message) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const contactInfo = { name, email, phone, message };

    fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactInfo)
    })
      .then(response => response.json())
      .then(data => {
        Alert.alert('Success', 'Your message has been sent!');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', `There was an error sending your message: ${error.message}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send</Text>
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
  textArea: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#333',
    borderRadius: 5,
    color: '#fff',
    height: 100,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#d87d56',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ContactScreen;
