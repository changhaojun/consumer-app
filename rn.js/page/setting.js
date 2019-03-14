/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Dimensions,TouchableOpacity,StatusBar,AsyncStorage} from 'react-native';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-material-ui';
import Version from '../publicVar';
import Login from '../login';
import AboutUs from './aboutus';
import ChangePassword from './changePassword';
export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state={
      userName:'',
      currentVersion:Version.version
    }
    AsyncStorage.getItem("userName", (errs, result)=> {
        this.setState({
          userName:result
        })
    })
  }
  loginOut(){
    this.props.navigator.replace({
      name: 'Login',
      component: Login,
    })
  }
  aboutus(){
    this.props.navigator.replace({
      name: 'AboutUs',
      component: AboutUs,
    })
  }
  changePassword() {
    this.props.navigator.replace({
      name: 'ChangePassword',
      component: ChangePassword
    })
  }
  render() {
    return (
      <View style={styles.container}>
          <StatusBar backgroundColor={'#eee'} hidden={false} barStyle={'dark-content'}/>
          {/* <TouchableOpacity style={styles.title}> */}
               {/* <Text style={styles.titleIcon}>
                 <Icon name="angle-left" size={26} color="#444"/>
               </Text> */}
               <Text style={styles.titletext}>设置</Text>
          {/* </TouchableOpacity> */}
          <View>
              <View style={[styles.item,{margiTop:20,marginBottom:20}]}>
                 <Text>当前账号</Text>
                 <Text style={styles.label}>{this.state.userName}</Text>
              </View>
              <View style={[styles.item,{borderBottomWidth:0}]} >
                <TouchableOpacity style={{flex: 1, width: width, justifyContent:"space-between", flexDirection: 'row',}} onPress={()=>{this.aboutus()}}>
                 <Text>关于我们</Text>
                 <Text ><Icon name="angle-right" size={26} color="#aaa"/></Text> 
                </TouchableOpacity>
              </View>
              <View style={[styles.item,{borderBottomWidth:0}]}>
                <TouchableOpacity style={{flex: 1, width: width, justifyContent:"space-between", flexDirection: 'row'}} onPress={()=>{this.changePassword()}}>
                  <Text>修改密码</Text>
                  <Text><Icon name="angle-right" size={26} color="#aaa"/></Text>
                </TouchableOpacity>
              </View>
              <View style={styles.item}>
                 <Text>当前版本</Text>
                 <Text  style={styles.label}>V{this.state.currentVersion}</Text>
              </View>
          </View>
          <View style={styles.bottom}>
            <Button raised primary text="退出登录" style={{container:{borderRadius:20,height:40,backgroundColor:"#3994ea"}}} onPress={()=>this.loginOut()}/>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  titletext:{
    width:width,
    textAlign:"center",
    fontSize: 18,
    lineHeight:40,
    color:"#555",
    marginBottom:20
  },
  item:{
    // borderWidth: 1,
    paddingLeft:10,
    paddingRight:10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    borderTopColor: "#ddd",
    flexDirection: 'row',
    height:40,
    justifyContent:"space-between",
    alignItems:"center"
  },
  label:{
    color:"#bbb"
  },
  bottom:{
    height:60,
    paddingLeft:10,
    paddingRight:10,
    marginTop:height-350
  },
});
