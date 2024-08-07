import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const LoginScreen = (props) => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [visibleModal, setvisibleModal] = useState(false)
    const {navigation} =props;
  return (
    <View style={styles.container}>
        <View 
        style={{
            
            justifyContent:'center',
            alignItems:'center',
            marginTop: 81
        }}>
      <Image style={{width: 142, height: 142}} source={require('../../assets/images/logo.png')} />
      <Text style ={{fontSize:16, fontWeight:'bold', color:'#FFFFFF', lineHeight:26}}>Welcome to Lungo !!</Text>
      <Text style={{fontSize:12, fontWeight:700, color:'#828282',lineHeight: 26, marginTop: 30}}>Login to Continue</Text>
    </View>
    <View
    style= {{
        marginTop: 50,
        // justifyContent:'center',
        alignItems:'center'
    }}>
        <TextInput
            onChangeText={(text) => setUserName(text)}
            placeholder='Emall Address' 
            color = {'#828282'}
            placeholderTextColor={'#828282'}
        style={{
            width:348,
            height:48,
            borderRadius: 8,
            borderWidth: 1, 
            borderColor:'#828282',
            padding: 10
        }} />
        <View style={{
            width:348,
            height:48,
            borderRadius: 8,
            borderWidth: 1, 
            borderColor:'#828282', 
            marginTop: 20,
            padding:10,
            flexDirection:'row'
        }}>
        <TextInput style={{flex:1}}
            onChangeText={(text) => setPassword(text)}
            placeholder='Password'
            color = {'#828282'}
            placeholderTextColor={'#828282'}
            secureTextEntry={!showPassword}
         />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image
                            style={{ width: 25, height: 25, marginRight: 10 }}
                            source={showPassword ? require('../../assets/images/show.png') : require('../../assets/images/hide.png')}
                        />
                    </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => {
                        if(userName == "sangnv"&&password =="123456"){
                            navigation.navigate("HomeTabs");
                        }else{
                            setvisibleModal(true)
                        }
                       
                    }}
            style={{
                backgroundColor:'#D17842', 
                width: 348,
                height: 57,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems:'center',
                marginTop: 30
            }} >
            <Text style={{color:'#FFFFFF', fontSize: 14,fontWeight: 700}}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={{
                backgroundColor:'#FFFFFF', 
                width: 348,
                height: 57,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems:'center',
                marginTop: 15
            }} >
            <Text style={{color:'#121212', fontSize: 14,fontWeight: 700}}>Sign in with Google</Text>
        </TouchableOpacity>
        <Text style={{marginTop: 40, fontSize: 12, fontWeight: 700, color:'#828282'}}>Don’t have account? Click Register</Text>
        <Text style={{marginTop: 30, fontSize: 12, fontWeight: 700, color:'#828282'}}>Forget Password? Click Reset</Text>
    </View>
    <Modal 
            animationType ="slide"  
            transparent ={true}
            visible ={visibleModal} >
                <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
                <View 
                style={{width: "80%", height: "30%", borderColor:"gray", borderWidth:2, borderTopLeftRadius:10,borderTopRightRadius:10}}>
                    <View 
                    style={{
                        flex:1, 
                        backgroundColor:'gray', 
                        justifyContent:'center', 
                        alignItems:'center'}}>
                    <Text 
                    style={{
                        fontSize:20, 
                        }}>
                            bạn nhập sai tài khoản
                            </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={()=> setvisibleModal(false)} 
                      style={{
                        backgroundColor: 'blue', 
                        height: 48, 
                        justifyContent:'center',
                        alignItems:'center', 
                        borderTopLeftRadius:10, 
                        borderTopRightRadius:10,
                        borderWidth:2,
                        borderColor:'gray'
                        }}>
                        <Text style={{fontSize:20, color:'#FFFFFF'}}>OK</Text>
                    </TouchableOpacity>
                </View>
                </View>
                
            </Modal>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#0C0F14'
    }
})