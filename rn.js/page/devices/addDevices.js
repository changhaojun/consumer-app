/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View ,Animated ,Alert,Image,Dimensions,TouchableOpacity,TextInput,KeyboardAvoidingView,ToastAndroid } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Button } from 'react-native-material-ui';
import Scan from "../scan";
import Icon from 'react-native-vector-icons/FontAwesome';
import Devices from './devices';
import Main from '../../main';
import { Navigator } from 'react-native-deprecated-custom-components';
const { width, height } = Dimensions.get('window');
import wifi from 'react-native-android-wifi';
import Smartconfig from 'react-native-smartconfig';
import DevicesBinding from './devicesBinding';
// var _navigator;
 export default class AddDevices extends React.Component {
  constructor(props) {
      super(props);
      
      this.state = {
          wifissid:"",
          wifipass:"",
          bssid:""
      };
      this.getCurrentWifi()
  }
  getCurrentWifi(){
    wifi.getSSID(ssid => {
      console.log(ssid)
      if(ssid !=="<unknown ssid>"){
        this.setState({
            wifissid:ssid
        }) 
      }  
    })
    wifi.getBSSID(bssid => {
        this.state.bssid=bssid;
    })
    wifi.reScanAndLoadWifiList((wifiStringList) => {
      // console.log(wifiStringList)
      var wifiArray = JSON.parse(wifiStringList);
        console.log(wifiArray);
      },
      (error) => {
        console.log(error);
      }
    );
    
  }
  postNext(){

    Smartconfig.start({
        type: 'esp8266', //or airkiss, now doesn't not effect
        ssid: this.state.wifissid,
        bssid: this.state.bssid, //"" if not need to filter (don't use null)
        password: this.state.wifipass,
        timeout: 1000 //now doesn't not effect
      }).then(function(results){
        //Array of device success do smartconfig
        console.log(results);
      }).catch(function(error) {
       
      });
      Smartconfig.stop();
      if(this.state.wifissid && this.state.wifipass){
        this.props.navigator.replace({
            name: 'DevicesBinding',
            component: DevicesBinding,     
            passProps:{
              data:this.props.data
            }
        })
      }
  }
  componentDidMount() {  
     
  }
  onPress(){
    this.props.navigator.replace({
        name: 'Main',
        component: Main,
        passProps:{
            active:"devices",
            centerComponent:Devices
        }
    })
  }
  render() {
      return (
          <KeyboardAvoidingView  style={styles.container}  behavior="padding" enabled>
            <TouchableOpacity style={styles.title} onPress={()=>this.onPress()}>
               <Text style={styles.titleIcon}>
                 <Icon name="angle-left" size={26} color="#444"/>
               </Text>
               <Text style={styles.titletext}>添加设备</Text>
            </TouchableOpacity>
            
            <View style={styles.ImageStyle}>
              <Image source={require('../../image/facility_ico_add.png')} style={{resizeMode:"center",width:width,height:140}}/>
              {/* <Text style={styles.textTip}>未绑定设备</Text> */}
              <Text style={styles.textTipTwo}>
                  请输入设备需要连接的wifi名称和密码
              </Text>
              <Text style={styles.textTipTwo}>
                 （家庭，办公等无线网络）
              </Text>
            </View>
            <View style={{paddingLeft:20,paddingRight:20}}>
                    <View  style={{width:width-40,height:30,borderBottomColor:"#bbb",borderBottomWidth:1}}>
                       <Text style={{position:"absolute",paddingLeft:8}}><Icon name="wifi" size={16} color="#bbb"/></Text>
                       <TextInput 
                        style={styles.textinput} 
                        placeholder="请输入wifi名称"
                        onChangeText={(wifissid) => this.setState({wifissid})}
                        value={this.state.wifissid}
                        />
                    </View>
                    <View  style={{width:width-40,height:30,borderBottomColor:"#bbb",borderBottomWidth:1,marginTop:20}}>
                       <Text style={{position:"absolute",paddingLeft:8}}><Icon name="unlock-alt" size={16} color="#bbb"/></Text>
                       <TextInput 
                        style={styles.textinput} 
                        placeholder="请输入密码"
                        secureTextEntry
                        onChangeText={(wifipass) => this.setState({wifipass})}
                        value={this.state.wifipass}
                        />
                    </View>
            </View>
            <View style={styles.bottom}>
              <Button raised primary text="下一步" style={{container:{borderRadius:20,height:40,backgroundColor:"#3994ea"}}} onPress={()=>this.postNext()}/>
              <Text style={styles.tip}>请确认输入的wifi名称及密码准确无误</Text>
              <Text style={styles.tip}>(暂不支持5G频道的Wi-Fi)</Text>
            </View>
          </KeyboardAvoidingView >
      );
  }
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
      // flexDirection: 'row',
      backgroundColor: "#eee",
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
  ImageStyle:{
    height:230,
    width:width,
    // backgroundColor: "#999",
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
    paddingRight:10,
    marginTop:40
  },
  textinput:{
    width:width-60,
    height:40,
    marginLeft:27,
    marginTop:-10,
    color:"#777"
},
tip:{
    textAlign:"center",
    marginTop:10
}
});
