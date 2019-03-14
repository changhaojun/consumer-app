/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View ,Image ,Dimensions,AsyncStorage,ToastAndroid,Alert} from 'react-native';
const { width, height } = Dimensions.get('window');
import { Button } from 'react-native-material-ui';
import axios from '../../Axios';
import AddDevices from './addDevices'
import Main from '../../main';
import Devices from './devices';
import BindSuccess from './bindSuccess';
import myMqtt from '../../mqtt';
let Hstimer;
export default class DevicesBinding extends React.Component {
  constructor(props){
    super(props);
    this.state={
      number:0,
      fail:true,
      userId:null,
      client:null
    }
    AsyncStorage.getItem("heatUserId", (errs, result)=> {
      this.state.userId=result
      if(this.props.data.type==='HSH01'){
         this.waitResponse();
      }else{
         this.mqtt()
      }
    })
    this.getPer();
   
  }
  mqtt(){
    console.log(this.props.data.deviceId)
    this.state.client =new myMqtt(`${this.props.data.deviceId}`,this.updata); 
  }
  updata=(data)=>{
    console.log(data);
    if((data.collector_id === this.props.data.deviceId) && data.result===1){
      this.destroyed()
      this.waitResponse()
    }
  }
  destroyed() { //组件销毁则mqtt端口
    this.state.client.destroyed();
    this.state.client = null;
}
  async waitResponse(){
    const res = await axios.post('/device/add', { collector_id: this.props.data.deviceId, heat_user_id:Number(this.state.userId) ,deviceType: this.props.data.type});
   if(res.code === 200){
    this.props.navigator.replace({
        name: 'BindSuccess',
        component: BindSuccess,     
        // passProps:{
        //   data:this.props.data,
        //   active :"devices",
        //   centerComponent:AddDevices
        // }
    })
   }
  }
  getPer(){
    let time = 0;
    Hstimer = setInterval(() => {     
        this.setState({
          number:time,
        })
        time ++;
        if(time > 100) {
            clearInterval(Hstimer);
            this.destroyed()
            this.setState({
              fail:false,
              number:0
            })
        }
    }, 3000)
  }
 againPass(){
  clearInterval(Hstimer);
  this.props.navigator.replace({
      name: 'Main',
      component: Main,     
      passProps:{
        data:this.props.data,
        active :"devices",
        centerComponent:AddDevices
      }
  })
 }
 againAdd(){
  clearInterval(Hstimer);
  this.props.navigator.replace({
    name: 'Main',
    component: Main,     
    passProps:{
      // data:this.props.data,
      active :"devices",
      centerComponent:Devices
    }
})
 }
 againLink(){
  this.setState({
    fail:true
  })
  this.getPer()
  if(this.props.data.type==='HSH01'){
      this.waitResponse();
  }else{
      this.mqtt();
  }
 }
  render() {
    return (
      <View style={styles.container}>
      {
        this.state.fail ?
        <View>
            <View style={{width:width,height:300}}>
              <Image source={require('../../image/facility_img_loading.png')} style={{resizeMode:"center",width:width,height:height/1.5}}/>
              <View style={styles.count}>
                <Text style={{color:"#fff",fontSize:46}}>
                    {this.state.number}
                </Text>
                <Text style={{color:"#fff",fontSize:18}}>%</Text>
              </View> 
            </View>
            <Text style={{textAlign:"center",color:"#fff"}}>绑定设备中...</Text>
            <Text style={{textAlign:"center",color:"#aaa",fontSize:12}}>请勿断电或者关闭APP,并保持网络畅通</Text>
            <Text style={{textAlign:"center",color:"#aaa",fontSize:12}}>(绑定需3-5分钟，请耐心等待)</Text>
        </View>  :
        <View>
            <View style={{width:width,height:230}}>
              <Image source={require('../../image/facility_ico_failure.png')} style={{resizeMode:"center",width:width,height:height/2}}/>
            </View>
            <Text style={{textAlign:"center",color:"#fff"}}>设备连接失败</Text>
            <Text style={{textAlign:"center",color:"#aaa",fontSize:12}}>请确认您的wifi密码是否正确，网络是否良好</Text>
            <View style={{flexDirection:"row",justifyContent:"center",marginTop:20}}>
              <Button raised primary text="再次尝试" style={{container:{borderRadius:20,height:40,backgroundColor:"#3994ea",width:width/2-40,marginRight:20}}} onPress={()=>this.againLink()}/> 
              {
                this.props.data.type==="HSH01"?
                <Button raised  text="重新添加" style={{container:{borderRadius:20,height:40,backgroundColor:"#fff",width:width/2-40},text:{color:"#3994ea"}}} onPress={()=>this.againAdd()}/> 
                :
                <Button raised  text="重输密码" style={{container:{borderRadius:20,height:40,backgroundColor:"#fff",width:width/2-40},text:{color:"#3994ea"}}} onPress={()=>this.againPass()}/> 
              }
            </View>
        </View>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    opacity:0.85,
  },
  count:{
    position:"absolute",
    flexDirection: 'row',
    justifyContent: 'center',
    width:width,
    top:height/3.5
    // backgroundColor: "#eee",
  }
});
