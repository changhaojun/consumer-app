import React from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput, Alert, TouchableOpacity, ToastAndroid,ActivityIndicator } from 'react-native';
import Picker from 'react-native-picker';
import { Button } from 'react-native-material-ui';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import $http from './Axios';
import Login from './login';
import Url from './apiurl'
export default class ChoiceInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            community: '请输入并选择小区',
            communitys: [],
            communitysPickerData: [],
            communityID: 0,

            building: '请选择楼号',
            buildings: [],
            buildingsPickerData:[],
            buildingID: 0,

            unit: '请选择单元',
            units: [],
            unitID: 0,

            layer: '请选择楼层',
            layers: [],

            house: '请选择房间号',
            houses: [],
            houseID: 0,

            disabled: false
        }
    }

    render() {
        return (
            <View style={style.wrapper}>
                <Icon name="angle-left" style={style.backBtn} size={38} color="#aaa" onPress={() =>this.props.navigator.pop()}/>

                <Text style={style.tittxt}>注册</Text>
                {/* 选择小区 */}
                <TouchableOpacity onPress={this.choiceCommunity.bind(this)}>
                    <View style={style.inputList}>
                        <Icon name="building" size={16} color="#bbb" style={{position:'absolute',top:18}} />
                        <TextInput
                            underlineColorAndroid="transparent"
                            clearButtonMode="while-editing"
                            editable={true}
                            style={{fontSize:16,paddingLeft: 30,lineHeight:50}}
                            placeholder={this.state.community}
                            onChangeText={(txt) => {this.choiceCommunity(txt)}}
                            ref="commu"
                        />
                    </View>
                </TouchableOpacity>
                {/* 选择楼号 */}
                <TouchableOpacity onPress={this.choiceBuilding.bind(this)}>
                    <View style={style.inputList}>
                        <Icon name="building" size={16} color="#bbb" style={{position:'absolute',top:18}} />
                        <TextInput
                            underlineColorAndroid="transparent"
                            clearButtonMode="while-editing"
                            editable={false}
                            style={{fontSize:16,paddingLeft: 30,width:width-80}}
                            placeholder={this.state.building}
                        />
                    </View>
                </TouchableOpacity>
                {/* 选择单元 */}
                <TouchableOpacity onPress={this.choiceUnit.bind(this)}>
                    <View style={style.inputList}>
                        <Icon name="building" size={16} color="#bbb" style={{position:'absolute',top:18}} />
                        <TextInput
                            underlineColorAndroid="transparent"
                            clearButtonMode="while-editing"
                            editable={false}
                            style={{fontSize:16,paddingLeft: 30,width:width-80}}
                            placeholder={this.state.unit.toString()}
                        />
                    </View>
                </TouchableOpacity>
                {/* 选择楼层 */}
                <TouchableOpacity onPress={this.choiceLayer.bind(this)}>
                    <View style={style.inputList}>
                        <Icon name="building" size={16} color="#bbb" style={{position:'absolute',top:18}} />
                        <TextInput
                            underlineColorAndroid="transparent"
                            clearButtonMode="while-editing"
                            editable={false}
                            style={{fontSize:16,paddingLeft: 30,width:width-80}}
                            placeholder={this.state.layer.toString()}
                        />
                    </View>
                </TouchableOpacity>
                {/* 选择房间号 */}
                <TouchableOpacity onPress={this.choiceHouse.bind(this)}>
                    <View style={style.inputList}>
                        <Icon name="building" size={16} color="#bbb" style={{position:'absolute',top:18}} />
                        <TextInput
                            underlineColorAndroid="transparent"
                            clearButtonMode="while-editing"
                            editable={false}
                            style={{fontSize:16,paddingLeft: 30,width:width-80}}
                            placeholder={this.state.house.toString()}
                        />
                    </View>
                </TouchableOpacity>
                {/* 注册按钮 */}
                <View style={{marginTop:50,transition:'all 1s linear'}}>

                    <Text style={{alignSelf:'center'}}>
                        点击注册即表示同意
                        <Text style={{color:'#3a94ea'}}>lanyue+用户协议</Text>
                    </Text>
                    <Button
                        raised default
                        disabled={this.state.disabled} text="立即注册"
                        style={{ container: { borderRadius: 25, height: 50, marginTop: 10,backgroundColor:'#3a94ea'}, text: { color: '#fff', fontSize: 18 } }}
                        onPress={() => { this.register() }}
                    />
                </View>
                {
                this.state.loading ?
                <View style={{width:width,justifyContent:"center",flexDirection:"row"}}>
                    <View style={style.loading}>
                        <ActivityIndicator size="small" color={"#999"}/>
                        <Text style={{color:"#999"}}>正在注册,请稍等...</Text>
                    </View>
                </View>:<View></View>
            }
            </View>
         )
    }

    async register() {
        const { phone, code, password, username } = this.props;
        const {community, communityID, building, buildingID, unit, unitID, layer, house, houseID} = this.state;
        // console.log(phone + "---" + communityID);
        // console.log(password + '----' +  buildingID);
        // console.log(code + '----' +  unitID);
        this.setState({
            disabled: true,
            loading:true
        })
        const res = await $http.post('/user/register', {
            phone: phone,
            password: password,
            auth_code: code,
            user_name: username,
            heat_user_id: Number(this.state.houseID),
        })
        if(res.code === 200) {
            ToastAndroid.show('注册成功,3s后跳转到登录界面', ToastAndroid.SHORT);
            this.setState({
                loading: false
            })
            setTimeout(() => {
                this.props.navigator.push({
                    name: 'Login',
                    component: Login,
                })
            },3000)
        }else {
            this.setState({
                disabled: false
            })
        }
    }
    //初始化获取所有小区
    async getCommunity() {
        var uri =  `${Url.uri}/community` 
        console.log(uri)
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            if (responseJson.result.rows.length > 0) {
                const names = [];
                // console.log(rows)
                for(const row of responseJson.result.rows) {
                    names.push(row.community_name);
                }
                this.setState({
                    communitys: responseJson.result.rows,
                    communitysPickerData: names
                })
            }
            else {
              Alert.alert(
                '提示',
                '暂无数据'
              )
            }
          })
          .catch((error) => {
            console.error(error);
          });    
    }
    // 页面加载完成首先获取所有小区列表
    componentWillMount() {
        this.getCommunity();
    }

    // 选择小区
    choiceCommunity(txt) {
        const filterCommunity = this.state.communitysPickerData.filter(item => item.includes(txt));
        Picker && Picker.init({
            pickerData: filterCommunity.length === 0 ? ['无匹配小区'] : filterCommunity,
            pickerTitleText: '请选择小区',
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            onPickerConfirm: data => {
                const selectCommunity = this.state.communitys.find((item) => item.community_name === data[0]);
                this.setState({
                    community: data[0],
                    communityID: selectCommunity.community_id
                })
                this.refs.commu.blur()
            },
        })
        Picker.show();
    }

    // 选择楼
    async choiceBuilding() {

        var uri =  `${Url.uri}/community/building?community_id=${this.state.communityID}` 
        console.log(uri)
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            if (responseJson.result.rows.length > 0) {
                const names = [];
                for(const row of responseJson.result.rows) {
                    names.push(row.building_name);
                }
                Picker && Picker.init({
                    pickerData: names.length === 0 ? ['暂无可选楼号'] : names,
                    pickerTitleText: '请选择楼号',
                    pickerConfirmBtnText: '确定',
                    pickerCancelBtnText: '取消',
                    onPickerConfirm: data => {
                        const selectBuild = responseJson.result.rows.find((item) => item.building_name === data[0]);
                        this.setState({
                            building: data[0],
                            buildingID: selectBuild.building_id
                        })
                    },
                })
                Picker.show();
            }
            else {
              Alert.alert(
                '提示',
                '暂无数据'
              )
            }
          })
          .catch((error) => {
            console.error(error);
          }); 
        // const {result: {rows}} = await $http.get('/community/building', {
        //     data: {community_id: this.state.communityID}
        // });
    }

    // 选择单元
    async choiceUnit() {


        
        var uri =  `${Url.uri}/community/unit?building_id=${this.state.buildingID}` 
        console.log(uri)
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            if (responseJson.result.rows.length > 0) {
                const unitNums = [];
                for(const row of responseJson.result.rows) {
                    unitNums.push(row.unit_number);
                }
                Picker && Picker.init({
                    pickerData: unitNums === 0 ? ['暂无可选单元'] : unitNums,
                    pickerTitleText: '请选择单元',
                    pickerConfirmBtnText: '确定',
                    pickerCancelBtnText: '取消',
                    onPickerConfirm: data => {
                        const selectUnit = responseJson.result.rows.find((item) => item.unit_number === Number(data[0]));
                        this.setState({
                            unit: Number(data[0]),
                            unitID: selectUnit.unit_id
                        })
                    },
                })
                Picker.show();
            }
            else {
              Alert.alert(
                '提示',
                '暂无数据'
              )
            }
          })
          .catch((error) => {
            console.error(error);
          }); 


        // const {result: {rows}} = await $http.get('/community/unit', {
        //     data: {building_id: this.state.buildingID}
        // });
        
    }

    // 选择楼层
    async choiceLayer() {

        var uri =  `${Url.uri}/community/layer?unit_id=${this.state.unitID}` 
        console.log(uri)
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            if (responseJson.result.rows.length > 0) {
                console.log(this.state.unitID + '---');
                Picker && Picker.init({
                    pickerData: responseJson.result.rows.length === 0 ? ['暂无可选楼层'] : responseJson.result.rows,
                    pickerTitleText: '请选择楼层',
                    pickerConfirmBtnText: '确定',
                    pickerCancelBtnText: '取消',
                    onPickerConfirm: data => {
                        this.setState({
                            layer: data[0],
                        })
                    },
                })
                Picker.show();
            }
            else {
              Alert.alert(
                '提示',
                '暂无数据'
              )
            }
          })
          .catch((error) => {
            console.error(error);
          }); 


        // const {result: {rows}} = await $http.get('/community/layer', {
        //     data: {unit_id: this.state.unitID}
        // });
        
    }

    // 选择房间号
    async choiceHouse() {

        var uri =  `${Url.uri}/community/house?layer=${Number(this.state.layer)}&unit_id=${this.state.unitID}` 
        console.log(uri)
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            if (responseJson.result.rows.length > 0) {
                const houseList = [];
                for(const row of responseJson.result.rows) {
                    houseList.push(row.user_number);
                }
                Picker && Picker.init({
                    pickerData: houseList.length === 0 ? ['暂无可选房间'] : houseList,
                    pickerTitleText: '请选择房间号',
                    pickerConfirmBtnText: '确定',
                    pickerCancelBtnText: '取消',
                    onPickerConfirm: data => {
                        const selectHouse = responseJson.result.rows.find(item => item.user_number === data[0]);
                        this.setState({
                            house: data[0],
                            houseID: selectHouse.heat_user_id
                        })
                    },
                })
                Picker.show();
            }
            else {
              Alert.alert(
                '提示',
                '暂无数据'
              )
            }
          })
          .catch((error) => {
            console.error(error);
          }); 
        // const {result: {rows}} = await $http.get('/community/house', {
        //     data: {layer: Number(this.state.layer), unit_id: this.state.unitID}
        // });
        
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
        // width:width-20,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginTop:20,
        flexDirection:"row",
        // backgroundColor: "#ff00ff",
        position: 'relative',
        alignItems:"center",
        // justifyContent: 'center',
    },
    loading:{
        height:50,
        width:width-100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:"center",
        position:"absolute",
        bottom:80,
        // borderWidth: 1,
        left:20,
        // // backgroundColor: "#fff",
        // borderRadius: 6,
        // borderColor: "#eee",
     
    }
})
