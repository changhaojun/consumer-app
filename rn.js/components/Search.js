import React, { Component } from 'react';
import {View, Text,TextInput,StyleSheet,Dimensions } from 'react-native';
import { Icon } from 'react-native-material-ui';
import commonStyle from '../commonStyle';
import { Card } from 'react-native-material-ui';
const {width,height} = Dimensions.get('window');
export default class Search extends Component {
    constructor(props) {
      super(props);
      this.state = { 
          searText:'',
       };
    }
  
    render() {
      return (
          <Card style={{container:styles.container}}>
            <TextInput
            style={styles.text}
            value={this.state.searText}
            underlineColorAndroid='transparent'
            placeholderTextColor={commonStyle.placeholderColor}
            onChangeText={(text)=>{this.textChange(text)}}
            placeholder={this.props.placeholder?this.props.placeholder:''}
            />
            <Text onPress={()=>this.clear()}>
                <Icon name={this.state.searText===''?'search':'times-circle'} iconSet="FontAwesome" size={14}></Icon>
            </Text>
          </Card>
      );
    }
    textChange(data){
        this.state.searText=data
        this.setState({
            searText:data
        })
       this.props.onSearch(this.state.searText)
    }

    clear(){
        // if(this.state.searText!==''){
            this.state.searText=''
            this.setState({
                searText:''
            })
            this.props.onSearch(this.state.searText)
        }
  }

  const styles = StyleSheet.create({
    container: {
        height:30,
        width:'100%',
        alignItems:'center',
        alignSelf:'center',
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#ffffff',
        borderRadius:20,
        paddingLeft:10,
        paddingRight:10,
        // backgroundColor: commonStyle.white,
    },
    text:{
        height: 40, 
        width:'85%',
        borderWidth:0,
        color:commonStyle.gray,
        fontSize: 12,
    }
  });