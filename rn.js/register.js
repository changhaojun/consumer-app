import React from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput, ToastAndroid, KeyboardAvoidingView  } from 'react-native';
import { Button } from 'react-native-material-ui';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import $http from './Axios';
import Login from './login';
import Scan from './page/scan';
// import Choice from './choiceInfo';

export default class Register extends React.Component {
    // 初始化数据
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            code: '',
            username: '',
            password: '',
            confirmPassword: '',
            getCodeTxt: '获取验证码',
            regetCode: true,
            bottom: 150,

            buttonText: '下一步',
            showRegister: false,
            deviceSn: ''
        }
    }

    componentWillMount() {
        this.state.showRegister = this.props.showRegister;
        if(this.state.showRegister) {
            this.state.buttonText = '正在注册,请稍等...';
            this.state.deviceSn = this.props.deviceSn;
            this.register();
        }
    }
    async register() {
        const res = await $http.post('/user/register', this.props.param)
        console.log('res:::', res);
        if(res.code === 200) {
            ToastAndroid.show('注册成功,3s后跳转到登录界面', ToastAndroid.SHORT);
            setTimeout(() => {
                this.props.navigator.push({
                    name: 'Login',
                    component: Login,
                })
            },3000)
        }else {
            ToastAndroid.show(`${res.message}`, ToastAndroid.SHORT);
            this.setState({
                buttonText: '下一步',
                showRegister: false
            })
        }
    }
    next() {
        const {username, password, confirmPassword, code, phone} = this.state;
        const datas = {
            phone: phone,
            password: password,
            auth_code: code,
            user_name: username,
        }
        if(username && password && confirmPassword && code && phone) {
            if(password !== confirmPassword) {
                ToastAndroid.show('两次填写的密码不一致', ToastAndroid.SHORT);
                return;
            }else {
                this.props.navigator.push({
                    name: 'Scan',
                    component: Scan,
                    passProps: {
                        datas: datas
                    }
                }) 
            }
        }else {
            ToastAndroid.show('电话号、密码、确认密码、验证码或姓名不能为空', ToastAndroid.SHORT);
        }
    }
    async getCode() {
        const {phone} = this.state;
        if(phone === '' || !/^1[34578]\d{9}$/.test(phone)) {
            ToastAndroid.show('请输入正确的手机号', ToastAndroid.SHORT)
            return;
        }
        if(this.state.regetCode) {
            this.setState({
                regetCode: false
            })
            
            const res = await $http.post('/user/sendCode',{phone: phone});
            console.log('res:::', res);
            if(res.code === 200) {
                let time = 60;
                const timer = setInterval(() => {
                    time --;
                    this.setState({
                        getCodeTxt: `${time}秒后重新获取`,
                    })
                    if(time === 0) {
                        clearInterval(timer);
                        this.setState({
                            getCodeTxt: '获取验证码',
                            regetCode: true
                        })
                    }
                }, 1000)
            }else {
                ToastAndroid.show('该手机号码已注册', ToastAndroid.SHORT);
            }
            
        }
    }
    goBack() {
        this.props.navigator.push({
            name: 'Login',
            component: Login,
        })
    }


    render() {
        return (
            <View style={style.wrapper}>
                <Icon name="angle-left" style={style.backBtn} size={38} color="#aaa" onPress={() => { this.goBack() }}/>
                <Text style={style.tittxt}>注册</Text>
                <KeyboardAvoidingView behavior="padding" enabled>
                    <View style={style.inputList}>
                        <Icon name="mobile" size={22} color="#bbb" style={{position:'absolute',top:14}}/>
                        <TextInput
                            onChangeText={(phone) => this.setState({phone: phone})}
                            underlineColorAndroid="transparent"
                            clearButtonMode="while-editing"
                            secureTextEntry={false}
                            style={{fontSize:16,paddingLeft: 30,width:width-80}}
                            placeholder="请输入手机号"
                        />
                        <Text style={{position:'absolute',bottom:13,right:5,fontSize:16,color:'#3a94ea'}} onPress={() => { this.getCode() }}>{this.state.getCodeTxt}</Text>
                    </View>
                    <View style={style.inputList}>
                        <Icon name="unlock-alt" size={20} color="#bbb" style={{position:'absolute',top:14}}/>
                        <TextInput
                            onChangeText={(code) => this.setState({code: code})}
                            underlineColorAndroid="transparent"
                            style={{fontSize:16, paddingLeft: 30,width:width-80}}
                            placeholder="请输入手机4位数验证码"
                        />
                    </View>
                    <View style={style.inputList}>
                        <Icon name="user" size={20} color="#bbb" style={{position:'absolute',top:14}}/>
                        <TextInput
                            onChangeText={(username) => this.setState({username: username})}
                            underlineColorAndroid="transparent"
                            style={{fontSize:16, paddingLeft: 30,width:width-80}}
                            placeholder="请输入姓名"
                        />
                    </View>
                    <View style={style.inputList}>
                        <Icon name="unlock-alt" size={20} color="#bbb" style={{position:'absolute',top:14}}/>
                        <TextInput
                            onChangeText={(password) => this.setState({password: password})}
                            underlineColorAndroid="transparent"
                            style={{fontSize:16, paddingLeft: 30,width:width-80}}
                            secureTextEntry
                            placeholder="请输入密码"
                        />
                    </View>
                    <View style={style.inputList}>
                        <Icon name="unlock-alt" size={20} color="#bbb" style={{position:'absolute',top:14}}/>
                        <TextInput
                            onChangeText={(confirmPassword) => this.setState({confirmPassword: confirmPassword})}
                            underlineColorAndroid="transparent"
                            style={{fontSize:16, paddingLeft: 30,width:width-80}}
                            secureTextEntry
                            placeholder="请确认密码"
                        />
                    </View>
                </KeyboardAvoidingView>
                <View style={{marginTop:50,transition:'all 1s linear'}}>
                    {
                        !this.state.showRegister ? 
                            <Text style={{alignSelf:'center'}}>
                                点击下一步去完善信息
                            </Text> : <Text></Text>
                    }
                    <Button
                        raised default
                        text={this.state.buttonText}
                        style={{ container: { borderRadius: 25, height: 50, marginTop: 10,backgroundColor:'#3a94ea'}, text: { color: '#fff', fontSize: 18 } }}
                        onPress={() => { this.next() }}
                    />
                </View>
            </View>
         )
    }
}

const style = StyleSheet.create({
    wrapper: {
        width: width - 60,
        alignSelf: 'center',
        flex:1,
        height: height
    },
    backBtn:{
        position:'absolute',
        left: -10,
        top: 48,
    },
    tittxt:{
        color: '#000000',
        height:80,
        lineHeight:120,
        alignSelf: 'center',
        fontSize: 20,
    },
    inputList: {
        height:50,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginTop:20,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center'
    }
})
