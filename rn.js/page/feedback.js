/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View ,Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window');
export default class Feedback extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={{width:width,height:height,textAlign:"center",lineHeight:height/2}}> 努力开发中 ^-^...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }
});
