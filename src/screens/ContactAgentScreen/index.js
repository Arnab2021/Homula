import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header } from '../../components'
import colors from '../../colors';
import callApi from '../../global/callApi';
import { showErrorAlertMessage } from '../../services/ShowAlertMessages';

const today = moment(new Date()).format('MM/DD/yyyy')

const calender = require('../../images/calendar.png')
export default class ContactAgentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            fname: '',
            lname: '',
            email: ''
        };
    }

    async _submitData() {
        const { id } = this.props.route.params;
        const param = {
            firstname: this.state.fname,
            lastname: this.state.lname,
            email: this.state.email,
            property_id: id,
        };

        this.setState({ loader: true });
        const response = await callApi('contact_agent/', param);       
        this.setState({ loader: false });
        
        if (response.status == 'Success') {
            showErrorAlertMessage('Done!', response.status_message)
        } else if (response.status == 'Failure') {
            showErrorAlertMessage('Error',response.status_message)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation} headerTitle="Book An Appoinment" showBackBtn={true} />
                <KeyboardAwareScrollView contentContainerStyle={styles.content}>
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label} >First Name:</Text>
                            <TextInput style={styles.input} onChangeText={(text) => this.setState({ fname: text })} value={this.state.fname} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label} >Last Name:</Text>
                            <TextInput style={styles.input} onChangeText={(text) => this.setState({ lname: text })} value={this.state.lname} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label} >Email:</Text>
                            <TextInput style={styles.input} onChangeText={(text) => this.setState({ email: text })} value={this.state.email} />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.btn} onPress={() => this._submitData()}>
                        {
                            (this.state.loader) ?
                                <ActivityIndicator size="small" color="#fff" />
                                :
                                <Text style={styles.btnText}>Submit</Text>
                        }
                    </TouchableOpacity>
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
        backgroundColor: '#fff',
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
        textAlignVertical: 'top'
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
        justifyContent: 'center'
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: wp('5%')
    }
})
