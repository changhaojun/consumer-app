import React, { Component } from 'react';
import { AppRegistry, BackHandler, StatusBar, View, Text, ToastAndroid, Alert, ProgressBarAndroid, StyleSheet, Platform } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import AppUpdate from 'rn-roc-appupdate';
// import Constants from './rn.js/url';
import Dimensions from 'Dimensions';
import Login from "./rn.js/login";
import Version from './rn.js/publicVar'
// import Commonstyle from './rn.js/commonStyle';
var { width, height } = Dimensions.get('window');
var _navigator;
var lastBackPressed;
var Progress = 0;
BackHandler.addEventListener('hardwareBackPress', function () {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        _navigator.pop();
        return true;
    } else if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
        //最近2秒内按过back键，可以退出应用。
        return false;
    }
    ToastAndroid.show("再按一次退出应用", ToastAndroid.SHORT);
    lastBackPressed = Date.now();
    return true;
});

export default class heatingConsumerApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            updateModal: false,
            downloaded: 0,  //下载进度
        };
        if (Platform.OS !== 'ios') {
            this.checkUpdate()
        }
    }
    checkUpdate() {
        const url = `http://114.215.46.56:17739/v1/appDetails?type=1`
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (Version.version != responseJson.result.version_name) {
                    const appUpdate = new AppUpdate({
                        apkUrl: responseJson.result.apk_url,
                        needUpdateApp: (needUpdate) => {
                        },
                        downloadApkStart: () => { this.setState({ updateModal: true }) },
                        downloadApkProgress: (progress) => { this.setState({ downloaded: progress, updateModal: true }) },
                        downloadApkEnd: () => { this.setState({ updateModal: false }) },
                        onError: () => { console.log("downloadApkError") }
                    });
                    if (responseJson.result.force_update) {
                        console.log(22)
                        appUpdate.downloadApk();
                    } else {
                        Alert.alert(
                            '更新提示',
                            responseJson.result.app_describe,
                            [
                                { text: '取消', onPress: () => { } },
                                { text: '更新', onPress: () => appUpdate.downloadApk() }
                            ]
                        );
                    }
                }
            })
            .catch((error) => {
                console.error(error)
                Alert.alert(
                    '提示',
                    '网络连接错误，请检查网络，或联系客服人员',
                );
            });
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {/*状态栏*/}
                <StatusBar
                    hidden={false}  //status显示与隐藏
                    translucent={true} //设置status栏是否透明效果,仅支持安卓
                    barStyle="light-content" //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                    backgroundColor={'#3994ea'}
                />
                <Navigator
                    initialRoute={{ name: "Login", component: Login }}// 路由初始化配置信息，就是说页面加载时，第一次需要展现什么内容
                    configureScene={(route) => {
                        return Navigator.SceneConfigs.FadeAndroid;//配置页面切换的方式（淡入淡出）
                    }}
                    renderScene={(route, navigator) => {//渲染场景，读取initialRouter传来的数据，确定显示那些内容。
                        let Component = route.component;
                        _navigator = navigator;
                        return <Component {...route.passProps} token={this.state.token} navigator={_navigator} setStatusBackground={(color) => StatusBar.setBackgroundColor(color)} setToken={(token) => this.setState({ token })} />
                    }
                    }
                />
                {
                    this.state.updateModal ?
                        <View style={styles.container}>
                            <ProgressBarAndroid
                                style={styles.progress}
                                styleAttr="Horizontal"
                                indeterminate={false}
                                progress={(this.state.downloaded / 100)}
                            />
                            <Text style={{ textAlign: "center" }}>正在更新{this.state.downloaded}%</Text>
                        </View> : <View></View>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: (height / 2 - 100),
        backgroundColor: "#fff",
        left: 25,
        paddingTop: 30,
        width: width - 50,
        height: 100
    },
    progress: {
        marginLeft: 20,
        width: (width - 90)
    }
});
AppRegistry.registerComponent('heatingConsumerApp', () => heatingConsumerApp);
