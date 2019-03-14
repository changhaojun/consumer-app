import axios from 'axios';
import Url from './apiurl'
import {
    ToastAndroid,AsyncStorage
} from 'react-native';
const Axios = axios.create({
    // baseURL: 'http://114.215.46.56:17739/v1',
    // baseURL: 'http://192.168.1.133:7002/v1',
    // baseURL: "http://121.42.253.149:18859/app/mock/28/v1",
    baseURL:Url.uri,
    timeout: 30000,
    responseType: 'json',
    withCredentials: false, // 是否允许带cookie这些
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    }
});

getActk = async () => {
    const res = await AsyncStorage.getItem('actk');
    return res;
}

Axios.interceptors.request.use(
     (config) => {
        if (config.method === 'get') {
            config.params = config.data;
        }
        return getActk().then(res => {
            if(res){
                config.headers.common.actk = res;
            }
            return Promise.resolve(config);
        });
    },
    (error) => {
        ToastAndroid.showWithGravity(error, ToastAndroid.SHORT, ToastAndroid.CENTER);
        return Promise.reject(error);
    }
);

Axios.interceptors.response.use(
    res => {
        if (!res.data.code) {
            ToastAndroid.showWithGravity('请求超时，请重新请求', ToastAndroid.SHORT, ToastAndroid.CENTER);
            return Promise.reject(res.data);
        } else if (res.data.code !== 200) {
            console.log(res.data)
            ToastAndroid.showWithGravity(res.data.errMsg ? res.data.errMsg : res.data.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
            if (res.data.code === 400001 || res.data.code === 423) {
                return res.data;
            }

            return Promise.reject(res.data);
        }
        return res.data;
    });
export default Axios;