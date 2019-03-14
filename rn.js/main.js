import React from 'react';
import {
    View, Text, Image, TextInput, StyleSheet, Platform, TouchableOpacity, StatusBar,
    Switch, AsyncStorage, Dimensions, ToastAndroid
} from 'react-native';
import { BottomNavigation } from 'react-native-material-ui';
import Icon from 'react-native-vector-icons/FontAwesome';
import Home from './page/home';
import Setting from './page/setting';
import Feedback from './page/feedback';
import Devices from './page/devices/devices';
// import AddDevices from './page/devices/addDevices';
// import DevicesBinding from './page/devices/devicesBinding';
const { width, height } = Dimensions.get('window');

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: "home",
            centerComponent: Home,
            heat_user_id: null

        }
        AsyncStorage.getItem("heatUserId", (errs, result) => {
            this.state.heat_user_id = Number(result)
        })
    }
    home() {
        this.setState({
            active: "home",
            centerComponent: Home
        })
    }
    setting() {
        this.setState({
            active: "settings",
            centerComponent: Setting
        })

    }
    feedback() {
        this.setState({
            active: "feedback",
            centerComponent: Feedback
        })
    }
    devices() {
        this.setState({
            active: "devices",
            centerComponent: Devices
        })
    }
    componentWillMount() {
        if (this.props.active) {
            this.setState({
                active: this.props.active,
                centerComponent: this.props.centerComponent,
            })
        }
    }
    render() {
        return (
            <View style={styles.viewbox}>
                <View style={{ flex: 1,width:width,height:height,marginTop:20}}>
                    <this.state.centerComponent navigator={this.props.navigator} data={this.props.data} userId={this.state.heat_user_id}></this.state.centerComponent>
                </View>
                <BottomNavigation active={this.state.active}>
                    <BottomNavigation.Action
                        key="home"
                        icon="home"
                        label="揽月+"
                        onPress={() => this.home()}
                    />
                    <BottomNavigation.Action
                        key="devices"
                        icon="devices"
                        label="设备"
                        onPress={() => this.devices()}
                    />
                    {/* <BottomNavigation.Action
                        key="feedback"
                        icon="feedback"
                        label="反馈"
                        onPress={() => this.feedback()}
                    /> */}
                    <BottomNavigation.Action
                        key="settings"
                        icon="settings"
                        label="设置"
                        onPress={() => this.setting()}
                    />
                </BottomNavigation>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    viewbox: {
        flex: 1,
        // position: "absolute",
        // top:0,
        // bottom:0,
        // backgroundColor: "#eee",
        width: width,
        height: height,
        // marginBottom:0
    }
})