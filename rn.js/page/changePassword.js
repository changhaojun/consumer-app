/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View, ToastAndroid, AsyncStorage, Dimensions,TouchableOpacity} from 'react-native';
import { Button } from 'react-native-material-ui';
import Icon from 'react-native-vector-icons/FontAwesome';
import Setting from './setting';
import Main from '../main';
import $http from './../Axios';
const { width, height } = Dimensions.get('window');

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            originalPassword: '',
            newPassword: '',
            confirmPassword: '',
            heat_user_id: null,
            userName: '',
            password: '',
            phoneNumber: ''
        }
        AsyncStorage.getItem("heatUserId", (errs, result) => {
            this.setState({heat_user_id: Number(result)}); 
        })
        AsyncStorage.getItem("userName", (errs, result) => {
            this.setState({userName: result});
        })
        AsyncStorage.getItem("user", (errs, result) => {
            result = (JSON.parse(result));
            this.setState({
                password: result.password,
                phoneNumber: result.phone
            });
        })
    }
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
    async save() {
        const {originalPassword, newPassword, confirmPassword, password, heat_user_id} = this.state;
        if(originalPassword && newPassword && confirmPassword) {
            if(originalPassword !== password) {
                ToastAndroid.show('原密码错误', ToastAndroid.SHORT);
                return;
            }
            if(newPassword !== confirmPassword) {
                ToastAndroid.show('两次填写的密码不一致', ToastAndroid.SHORT);
                return;
            }
            const res = await $http.put('/user/passwd', {
                heat_user_id: heat_user_id,
                old_password: originalPassword,
                password: newPassword
            })
            if(res.code === 200) {
                ToastAndroid.show('密码修改成功', ToastAndroid.SHORT);
                const userInfo = { phone: this.state.phoneNumber, password: newPassword } 
                AsyncStorage.setItem("user", JSON.stringify(userInfo), function (errs) { });
                this.onPress();
            }else {
                ToastAndroid.show('密码修改失败', ToastAndroid.SHORT);
            }
        }else {
            ToastAndroid.show('原密码、新密码或确认密码不能为空', ToastAndroid.SHORT);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.title} onPress={()=>this.onPress()}>
                    <Text style={styles.titleIcon}>
                        <Icon name="angle-left" size={26} color="#444"/>
                    </Text>
                    <Text style={styles.titletext}>修改密码</Text>
                </TouchableOpacity>
                <View style={styles.wrapper}>
                    <View style={styles.inputList}>
                        <Text style={[styles.label, {color: '#ccc'}]}>用户名</Text>
                        <Text style={{color: '#3a94ea'}}>{this.state.userName}</Text>
                    </View>
                    <View style={styles.inputList}>
                        <Text style={styles.label}>原密码</Text>
                        <TextInput
                            onChangeText={(originalPassword) => this.setState({originalPassword: originalPassword})}
                            underlineColorAndroid="transparent"
                            style={{fontSize:16, paddingLeft: 0,width:width-80}}
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.inputList}>
                        <Text style={styles.label}>新密码</Text>
                        <TextInput
                            onChangeText={(newPassword) => this.setState({newPassword: newPassword})}
                            underlineColorAndroid="transparent"
                            style={{fontSize:16, paddingLeft: 0,width:width-80}}
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.inputList}>
                        <Text style={styles.label}>确认密码</Text>
                        <TextInput
                            onChangeText={(confirmPassword) => this.setState({confirmPassword: confirmPassword})}
                            underlineColorAndroid="transparent"
                            style={{fontSize:16, paddingLeft: 0,width:width-80}}
                            secureTextEntry
                        />
                    </View>
                    <View style={{marginTop:50,transition:'all 1s linear'}}>
                        <Button
                            raised default
                            text="保存"
                            style={{ container: { borderRadius: 25, height: 50, marginTop: 10,backgroundColor:'#3a94ea'}, text: { color: '#fff', fontSize: 18 } }}
                            onPress={() => { this.save() }}
                        />
                    </View>
                </View>
            </View>
        )
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
    wrapper: {
        width: width - 60,
        alignSelf: 'center',
        flex:1,
        height: height
    },
    titletext:{
        width:width,
        textAlign:"center",
        fontSize: 18,
        lineHeight:40,
        color:"#555"
    },
    label: {
        width: 80,
        fontSize:16
    },
    inputList: {
        height:50,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginTop:20,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    }
})