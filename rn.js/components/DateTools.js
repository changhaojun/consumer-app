import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import CalendarPicker from 'react-native-calendar-picker'
import commonStyle from '../commonStyle';
let lineColor = commonStyle.lineColor;
export default class DateTools extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showDate:false,
            start_time:this.props.defaultDate.start_time,
            end_time:this.props.defaultDate.end_time,
            months:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            weeks:["一","二","三","四","五","六","天"]
        }
    }
    render(){
        const defalutValue =`${moment(this.state.start_time).format('YYYY.MM.DD')} - ${moment(this.state.end_time).format('YYYY.MM.DD')}`
        const maxDate = new Date()
        lineColor = this.props.lineColor?this.props.lineColor:lineColor;
        width = this.props.width?this.props.width:'100%';
        return(
            <View>
                <View style={{width:width,alignSelf:'flex-end'}}>
                    <Text style={{color:'#ffffff',fontSize:16}}>选择日期</Text>
                    <Text style={[styles.line,{borderBottomColor:lineColor}]} 
                        onPress={this._inputFocus}>
                        {defalutValue}
                    </Text>
                </View>
                {
                    this.state.showDate?
                        <CalendarPicker
                        startFromMonday={true}
                        allowRangeSelection={true}
                        maxDate={maxDate}
                        previousTitle='<'
                        nextTitle='>'
                        weekdays={this.state.weeks}
                        months={this.state.months}
                        todayBackgroundColor='#f2e6ff'
                        selectedDayColor='#7300e6'
                        selectedDayTextColor='#FFFFFF'
                        textStyle={{color:'#ffffff'}}
                        onDateChange={this._onDateChange}
                        />:null
                }
            </View>
        )
    }

    _inputFocus = ()=>{
        this.setState({
          showDate:true
        })
    }

    _onDateChange = (date, type)=>{
        if (type === 'END_DATE') {
            const end_time = moment(date).valueOf()+86399000;
            this.setState({
            end_time: end_time,
            showDate:false
            })
            this.state.end_time =end_time;
            const sendDate={
                start_time:this.state.start_time.toString(),
                end_time:this.state.end_time.toString()
            }
            this.props.onChengeDate(sendDate);
        } else {
          this.setState({
              start_time: moment(date).valueOf(),
              end_time:null
          })
        }
      }
}
const styles = StyleSheet.create({
    line:{
        height:30,
        lineHeight:30,
        color:'#ffffff',
        borderBottomWidth:1
      },
})