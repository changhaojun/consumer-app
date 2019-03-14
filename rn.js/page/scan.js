/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View ,Animated ,Alert,Dimensions} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
// import AddDevices from '../page/devices/addDevices';
// import Main from '../main';
// import DevicesBinding from './devices/devicesBinding';
import Register from './../register';
var { width, height } = Dimensions.get('window');

export default class Scan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show:true,
            moveAnim: new Animated.Value(0),
            params:{
                active:'devices'
            }
        };
    }

    componentDidMount() {
        this.startAnimation(); 
    }
    startAnimation = () => {
        if(this.state.show){
            this.state.moveAnim.setValue(0);
            Animated.timing(
                this.state.moveAnim,
                {
                    toValue: -200,
                    duration: 1500,
                }
            ).start(() => {
                this.startAnimation();   
            });
        }
    };
    //  识别二维码
    onBarCodeRead = (result) => {
        if(this.state.show){
            this.state.show =false;
            const {data} = result;
            console.log(data);
            if(data){
                if(data.indexOf('deviceId') !== -1) {
                    const datas = JSON.parse(data);
                    console.log(datas);
                    const {deviceId: deviceSn} = datas;
                    const params =  this.props.datas;
                    params.device_sn = deviceSn;
                    console.log('hiljlj::', params)
                    this.props.navigator.push({
                        name: 'Register',
                        component: Register,
                        passProps: {
                            showRegister: true,
                            param: params
                        }
                    })
                }else {
                    Alert.alert(
                        '提示',
                        '请扫描 绑定设备 二维码',
                        [
                            {text: '确定', onPress: () => {
                                    this.state.show = true,
                                    this.startAnimation();
                                }
                            }
                        ]
                    )
                }
            }else {
                Alert.alert(
                    '提示',
                    '扫描失败',
                    [
                        {text:'确定'}
                    ]
                )
            }
        }    
    };

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    onBarCodeRead={this.onBarCodeRead}
                >
                    <View style={{marginTop:20,width:width,marginLeft:20}}>
                        <Text onPress={()=>{this.props.navigator.pop()}}><Icon name="angle-left" size={26} color="#aaa"/></Text>
                    </View>
                    <View style={styles.rectangleContainer}>
                        <View style={styles.rectangle}/>
                        <Animated.View style={[
                            styles.border,
                            {transform: [{translateY: this.state.moveAnim}]}]}/>
                        <Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
                    </View>
                </RNCamera>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1
  },
  preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
  },
  rectangleContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent'
  },
  rectangle: {
      height: 200,
      width: 200,
      borderWidth: 1,
      borderColor: '#00FF00',
      backgroundColor: 'transparent'
  },
  rectangleText: {
      flex: 0,
      color: '#fff',
      marginTop: 10
  },
  border: {
      flex: 0,
      width: 200,
      height: 2,
      backgroundColor: '#00FF00',
  }
});
