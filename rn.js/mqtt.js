import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';
init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});
const mqttOptions = {
  host: '121.42.143.106',
  port: 8083,
  username: 'admin',
  password: 'finfosoft123',
  protocolId: 'mqtt'
};
export default class myMqtt {
  constructor(topic, callBack) {
    this.state = {
      topic: topic
    }
    this.mqttConnect();
    this.callBack = callBack;
  }
  mqttConnect() {
    const client = new Paho.MQTT.Client(mqttOptions.host, mqttOptions.port, '');
    const _options = {
      userName: mqttOptions.username,
      password: mqttOptions.password,
      // timeout: 5,
      // // useSSL: true,
      // keepAliveInterval: 240,
      onSuccess: () => {
        console.log(`onConnected,订阅主题 ${this.state.topic}`);
        client.subscribe(this.state.topic); //订阅主题  
      },
      onFailure: (e) => {
        console.log(e);
      }
    };
    client.connect(_options);
    client.onConnectionLost = responseObject => {
      this.onConnectionLost(responseObject);
    }; //注册连接断开处理事件
    client.onMessageArrived = (message) => {
      this.onMessageArrived(message)
    }; //注册消息接收处理事件

    this.destroyed = client.disconnect;
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log(`主题${this.state.topic}连接已断开,正在重新连接。。。`);
      this.mqttConnect();
    }
  }

  onMessageArrived(message) {
    // console.log(eval('(' + message.payloadString + ')'))
    const msg = eval('(' + message.payloadString + ')');
    // console.log(JSON.parse(message.payloadString))
    // const mag =JSON.parse(message.payloadString)
    console.log(msg)
    this.callBack && this.callBack(msg);
  }
}
