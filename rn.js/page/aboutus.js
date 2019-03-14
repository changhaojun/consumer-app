/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View ,Dimensions,TouchableOpacity,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Setting from './setting';
import Main from '../main';
const { width, height } = Dimensions.get('window');
export default class Aboutus extends React.Component {
    onPress(){
        this.props.navigator.replace({
            name: 'Main',
            component: Main,     
            passProps:{
              active :"settings",
              centerComponent:Setting
            }
          })
    }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.title} onPress={()=>this.onPress()}>
            <Text style={styles.titleIcon}>
                <Icon name="angle-left" size={26} color="#444"/>
            </Text>
            <Text style={styles.titletext}>关于我们</Text>
        </TouchableOpacity>
        <View style={styles.imagestyles}>
            <Image source={require('../image/aboutus_icon.png')} style={{resizeMode:"center",width:width,height:100}}/>
            <Text style={{color:"#444",width:width,textAlign:"center"}}>揽月+</Text>
            <Text style={{color:"#bbb",width:width,textAlign:"center"}}>尽探索之力，享节能之极</Text>
        </View>
        <View>
            <Text style={{textAlign:"center",marginBottom:20}}>Beijing Finfosoft</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title:{
    marginTop:20
  },
  titleIcon:{
    position:"absolute",
    left:10,
    top:5,  
  },
  titletext:{
    width:width,
    textAlign:"center",
    fontSize: 18,
    lineHeight:40,
    color:"#555"
  },
  imagestyles:{
      flexDirection: 'column',
      width:width,
      marginTop:50,
    //   justifyContent: 'center',   
      flex:1
  }
});
