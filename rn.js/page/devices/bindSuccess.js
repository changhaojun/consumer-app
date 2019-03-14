/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View ,Dimensions,TouchableOpacity,Image} from 'react-native';
import Main from "../../main";
import Icon from 'react-native-vector-icons/FontAwesome';
import Devices from './devices';
import { Button } from 'react-native-material-ui';
const { width, height } = Dimensions.get('window');
export default class Setting extends React.Component {
    constructor(props){
        super(props);
    }
    bindSuccess(){
        this.props.navigator.replace({
            name: 'Main',
            component: Main,     
            passProps:{
              active :"devices",
              centerComponent:Devices
            }
        }) 
    }
    render() {
        return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.title} onPress={()=>this.bindSuccess()}>
                <Text style={styles.titleIcon}>
                    <Icon name="angle-left" size={26} color="#444"/>
                </Text>
                <Text style={styles.titletext}>添加设备</Text>
            </TouchableOpacity>
            <View style={styles.ImageStyle}>
                <Image source={require('../../image/facility_ico_succeed.png')} style={{resizeMode:"center",width:width,height:140}}/>
                <Text style={styles.textTip}>绑定成功！</Text>
                <Text style={styles.textTipTwo}>
                    恭喜您！设备绑定成功！
                </Text>
                </View>
                <View style={styles.bottom}>
                <Button raised primary text="完成" style={{container:{borderRadius:20,height:40,backgroundColor:"#3994ea"}}} onPress={()=>this.bindSuccess()}/>
                </View>
        </View>
        );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:20,
    backgroundColor: "#eee",
  },
  titleIcon:{
    position:"absolute",
    left:10,
    top:5
  },
  titletext:{
    width:width,
    textAlign:"center",
    fontSize: 18,
    lineHeight:40,
    color:"#555"
  },
  ImageStyle:{
    height:300,
    width:width,
    // backgroundColor: "#999",
  },
  textTip:{
    textAlign:"center",
    color:"#444"
  },
  textTipTwo:{
    textAlign:"center",
    marginTop:5,
    paddingLeft:10,
    paddingRight:10
  },
  bottom:{
    height:60,
    paddingLeft:10,
    paddingRight:10
  }
});
