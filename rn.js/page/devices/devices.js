/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View ,Animated ,Alert,Image,Dimensions,ToastAndroid,StatusBar,AsyncStorage} from 'react-native';
// import { RNCamera } from 'react-native-camera';
// import { Button } from 'react-native-material-ui';
// import Scan from "../scan";
// import axios from '../../Axios'
// import Url from '../../apiurl'
const { width, height } = Dimensions.get('window');

 export default class Devices extends Component {
  constructor(props) {
      super(props);
      this.state = {
        // bindState:"未绑定设备",
        // deviceName:"暂未发现揽月+设备,请先扫描设备上的二维码添加设备",
        // type:1,
        // devicesId:"",
        deviceSn: '',
        imgUrl:require('../../image/facility_ico_binding.png'),
        // heat_user_id:null
      };
    //   AsyncStorage.getItem("heatUserId", (errs, result) => {
    //     this.state.heat_user_id = result
    //     this.getDevices();
    // })
    AsyncStorage.getItem("deviceSn", (errs, result) => {
      this.setState({deviceSn: result});
    })
  }
  // async getDevices(){
  //   var uri =  `${Url.uri}/device?heat_user_id=${Number(this.state.heat_user_id)}` 
  //       console.log(uri)
  //       fetch(uri)
  //         .then((response) => response.json())
  //         .then((responseJson) => {
  //           console.log(responseJson)
  //           if (responseJson.result) {
  //             if(responseJson.result.rows){
  //               this.setState({
  //                 bindState:"已绑定设备",
  //                 deviceName:responseJson.result.rows[0].device_name,
  //                 type:2,
  //                 devicesId:responseJson.result.rows[0].heat_user_device_id,
  //                 imgUrl:require('../../image/facility_ico_binding.png')
  //               })
  //             }
  //           }
  //           else {
  //             Alert.alert(
  //               '提示',
  //               '暂无数据'
  //             )
  //           }
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //         });
  // }
  // scan(){
  //   this.props.navigator.push({
  //     name: 'Scan',
  //     component: Scan,
  // })
  // }
  // async cancalBind(){
  //   console.log(this.state.devicesId)
  //   const res = await axios.post('/device/relieve',{heat_user_device_id:Number(this.state.devicesId),heat_user_id:Number(this.state.heat_user_id)});
  //   Alert.alert(
  //     '提示',
  //     '成功取消绑定'
  //   )
  //   // ToastAndroid.show(`成功取消绑定`, ToastAndroid.SHORT)
  //   this.reset()
  // }
  // reset(){
  //   this.setState({
  //     bindState:"未绑定设备",
  //     deviceName:"暂未发现揽月+设备,请先扫描设备上的二维码添加设备",
  //     type:1,
  //     devicesId:"",
  //     imgUrl:require('../../image/facility_ico_unbounded.png')
  //   })
  // }
  render() {
      return (
          <View style={styles.container}>
            <StatusBar backgroundColor={'#eee'} hidden={false} barStyle={'dark-content'}/>
            <Text style={styles.title}>设备</Text>
            <View style={[styles.ImageStyle]}>
              <Image source={this.state.imgUrl} style={{resizeMode:"center",width:width,height:140}}/>
              <Text style={styles.textTip}>已绑定设备</Text>
              <Text style={styles.textTipTwo}>
                 {this.state.deviceSn}
              </Text>
            </View>
            {/* <View style={styles.bottom}>   
              {
                this.state.type ===2 ?
                <Button raised primary text="取消绑定" style={{container:{borderRadius:20,height:40,backgroundColor:"#ff0000",marginTop:150}}} onPress={()=>this.cancalBind()}/>
                :
                <Button raised primary text="添加设备" style={{container:{borderRadius:20,height:40,backgroundColor:"#3994ea"}}} onPress={()=>this.scan()}/>
              }
              
            </View> */}
          </View>
      );
  }
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
      // flexDirection: 'row',
      backgroundColor: "#eee",
      // marginTop:-20
  },
  title:{
    width:width,
    height:40,
    textAlign:"center",
    lineHeight:40,
    fontSize: 16,
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
