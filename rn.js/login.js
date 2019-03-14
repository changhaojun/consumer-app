import React from 'react';
import {
    View, Text, Image, TextInput, StyleSheet, Platform, TouchableOpacity, StatusBar,
    Switch, AsyncStorage, Dimensions,ToastAndroid,ActivityIndicator, KeyboardAvoidingView
} from 'react-native';
import { Button } from 'react-native-material-ui';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from './Axios';
import Main from './main';
import Register from './register';
const { width, height } = Dimensions.get('window');
export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state={
            password:"",
            phoneNumber:"",
            loading:false
        }
        AsyncStorage.getItem('user', (err, res) => {
            if(res) {
                const user = JSON.parse(res);
                this.setState({
                    phoneNumber: user.phone,
                    password: user.password
                })
            }
        })
    }
    async login(){
        if(this.state.phoneNumber==='' ||this.state.password===''){
            ToastAndroid.show(`密码或者电话号码不能为空`, ToastAndroid.SHORT)
        }else{
            this.setState({
                loading:true
            })
            const userInfo = { phone: this.state.phoneNumber, password: this.state.password }
            
            const res = await axios.post('/user/login',{ phone: this.state.phoneNumber, password: this.state.password });
            if(res.code!==200){
                this.setState({
                    loading:false
                })
                ToastAndroid.show(`用户名或密码错误`, ToastAndroid.SHORT)
            }else{
                AsyncStorage.setItem("heatUserId", `${res.result.heat_user_id}`, function (errs) { });
                AsyncStorage.setItem("userName", `${res.result.user_name}`, function (errs) { });
                AsyncStorage.setItem("user", JSON.stringify(userInfo), function (errs) { });
                this.props.navigator.replace({
                    name: 'Main',
                    component: Main,
                })
            }
        }
    }
    register(){
        this.props.navigator.push({
            name: 'Register',
            component: Register,
        })
    }
    render(){
        return(
            <View style={styles.viewbox}>
                <StatusBar hidden={true}/>
                <View style={{flex:1}}>
                   <Image source={require('./image/login_bg.png')} style={{resizeMode:"cover",width:width,height:210}}/>
                   <Image source={require('./image/LOGO.png')} resizeMode="contain" style={styles.imglogo}/>
                </View>
                <View style={{flex:1,paddingLeft:20,paddingRight:20,marginTop:-20}}>
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <View  style={{width:width-40,height:30,borderBottomColor:"#bbb",borderBottomWidth:1}}>
                        <Text style={{position:"absolute",paddingLeft:10}}><Icon name="mobile" size={20} color="#bbb"/></Text>
                        <TextInput 
                            style={styles.textinput} 
                            placeholder="请输入手机号"
                            onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                            value={this.state.phoneNumber}/>
                        </View>
                        <View  style={{width:width-40,height:30,borderBottomColor:"#bbb",borderBottomWidth:1,marginTop:30}}>
                        <Text style={{position:"absolute",paddingLeft:10}}><Icon name="unlock-alt" size={20} color="#bbb"/></Text>
                        <TextInput 
                            style={[styles.textinput,{width:width-150}]} 
                            secureTextEntry
                            placeholder="请输入密码"
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}/>
                        {/* <Text style={styles.forgetpass}>忘记密码？</Text> */}
                        </View>
                    </KeyboardAvoidingView>
                    <View style={{marginTop:40}}>
                        <Button raised primary text="登录" style={{container:{borderRadius:20,height:40,backgroundColor:"#3994ea"}}} onPress={()=>this.login()}/>
                        <Button accent  text="注册" style={{container:styles.registercontainer,text:styles.registertext}} onPress={()=>this.register()}/>
                    </View>
                </View>
                <View style={{height:30,paddingTop:5}}>
                    <Text style={{textAlign:"center",fontSize:12}}>Beijing Finfosoft</Text>
                </View>
                {
                    this.state.loading?
                    <View style={{width:width,justifyContent:"center",flexDirection:"row"}}>
                        <View style={styles.loading}>
                            <ActivityIndicator size="small" color={"#999"}/>
                            <Text style={{color:"#999"}}>正在登陆,请稍等...</Text>
                        </View>
                    </View>:<View></View>
                }
            </View>
        )  
    }
}
const styles = StyleSheet.create({
    viewbox:{
        flex:1,
        backgroundColor:"#eee",
        width:width,
        height:height
    },
    imglogo:{
        width:100,
        height:100,
        position:"absolute",
        top:50,
        left:width/2-50
    },
    registercontainer:{
        borderRadius:20,
        height:40,
        marginTop:20,
        borderWidth:0.5,
        borderColor:"#3994ea"
    },
    registertext:{
        color:"#3994ea"
    },
    textinput:{
        width:width-60,
        height:40,
        marginLeft:25,
        marginTop:-10,
        color:"#777"
    },
    forgetpass:{
        position:"absolute",
        right:0,
        color:"#3994ea"
    },
    loading:{
        height:50,
        width:width-100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:"center",
        position:"absolute",
        bottom:50,
        // borderWidth: 1,
        // backgroundColor: "#fff",
        // borderRadius: 6,
        // borderColor: "#eee",
     
    }
})