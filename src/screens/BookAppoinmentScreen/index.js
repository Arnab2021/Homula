import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, DatePickerModal, TimePickerModal } from '../../components'
import colors from '../../colors';
import callApi from '../../global/callApi'
import Feather from 'react-native-vector-icons/Feather'
import { showErrorAlertMessage, showToastMessage } from '../../services/ShowAlertMessages';


const calender = require('../../images/calendar.png')
export default class BookAppoinmentScreen extends Component {
    constructor(props) {
        super(props);
        const { address } = this.props.route.params
        var date = new Date()       

        this.state = {
            loader: false,
            fname: '',
            lname: '',
            address: address,
            date: date,
            time: this.formatAMPM(date),
            comment: '',
            isOpenDatePickerModal: false,
            isOpenTimePickerModal: false
        };
    }

    formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    async _bookAppoinment() {
        
        const { id } = this.props.route.params

        const param = {
            firstname: this.state.fname,
            lastname: this.state.lname,
            address: this.state.address,
            date: moment(this.state.date).format('MM/DD/yyyy'),
            preferredtime: this.state.time,
            comments: this.state.comment,
            property_id: id
        };

        this.setState({ loader: true })
        const response = await callApi('book_appointment/', param);
        this.setState({ loader: false })

        if (response.status == 'Success') {
            showErrorAlertMessage('Successfull !', 'Thank you for contacting Homula.com, we will get back to you soon!')
        } else {
            showErrorAlertMessage('Error', response.status_message)
        }

    }

    closeDatePicker = (selectedDate) => {
     
        if (selectedDate) {
            this.setState({
                isOpenDatePickerModal: false,
                date: selectedDate,
            });

        } else {
            this.setState({ isOpenDatePickerModal: false });
        }
    };

    closeTimePicker = (selectedTime) => {
             
        if (selectedTime === false) {
            this.setState({ isOpenTimePickerModal: false });
            return
        } else {
            var time = this.formatAMPM(selectedTime)
            this.setState({
                isOpenTimePickerModal: false,
                time: time,
            });
        }
    };

    render() {

        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation} headerTitle="Book An Appoinment" showBackBtn={true} />

                <KeyboardAwareScrollView contentContainerStyle={styles.content}>
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label} >First Name:</Text>
                            <TextInput style={styles.input} value={this.state.fname} onChangeText={(text) => this.setState({ fname: text })} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label} >Last Name:</Text>
                            <TextInput style={styles.input} value={this.state.lname} onChangeText={(text) => this.setState({ lname: text })} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label} >Address:</Text>
                            <TextInput style={styles.input} value={this.state.address} onChangeText={(text) => this.setState({ address: text })} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label} >Select date:</Text>
                            <TouchableOpacity style={styles.datePickerBtn} onPress={() => this.setState({ isOpenDatePickerModal: true })}>
                                <Text>{moment(this.state.date).format('MM/DD/yyyy')}</Text>
                                <Image source={calender} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label} >Preferred Time:</Text>
                            <TouchableOpacity style={styles.datePickerBtn} onPress={() => this.setState({ isOpenTimePickerModal: true })}>
                                <Text>{this.state.time}</Text>
                                <Feather name='clock' size={20} color={colors.mainBlue} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label} >Comment:</Text>
                            <TextInput style={styles.commentInput} multiline={true} numberOfLines={5} value={this.state.comment} onChangeText={(text) => this.setState({ comment: text })} />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.btn} onPress={() => this._bookAppoinment()}>
                        {
                            (this.state.loader) ?
                                <ActivityIndicator size="small" color='#fff' />
                                :
                                <Text style={styles.btnText}>Submit</Text>
                        }
                    </TouchableOpacity>

                    <DatePickerModal
                        isOpen={this.state.isOpenDatePickerModal}
                        currentDate={this.state.date}
                        closeDatePicker={(date) => this.closeDatePicker(date)}
                    />
                    <TimePickerModal
                        isOpen={this.state.isOpenTimePickerModal}                        
                        closeTimePicker={(time) => this.closeTimePicker(time)}
                    />
                </KeyboardAwareScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flexGrow: 1,
        backgroundColor: '#fff'
    },
    formContainer: {
        padding: 10,
        borderColor: colors.mainBlue,
        borderWidth: 1,
        margin: 20,
    },
    inputContainer: {
        marginVertical: 5
    },
    label: {
        fontSize: 15,
        marginBottom: 4
    },
    input: {
        borderColor: colors.mainBlue,
        borderWidth: 1,
        height: 40,
        paddingHorizontal: 4
    },
    commentInput: {
        borderColor: colors.mainBlue,
        borderWidth: 1,
        paddingHorizontal: 4,
        textAlignVertical: 'top',
        height: 60,
    },
    datePickerBtn: {
        flexDirection: 'row',
        height: 40,
        borderColor: colors.mainBlue,
        borderWidth: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4
    },
    btn: {
        backgroundColor: colors.mainBlue,
        marginHorizontal: wp('12%'),
        height: 50,
        justifyContent: 'center',
        marginVertical: 10
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: wp('5%')
    }
})
