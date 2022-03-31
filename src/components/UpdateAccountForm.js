import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import colors from '../colors';
import { IconInputBox } from '.';
import { updateAccountData } from '../operations/accountScreenOperations/accountScreenOperations';
import { showToastMessage, showErrorAlertMessage } from '../services/ShowAlertMessages'
import { getData } from '../services/AsyncStorageServices';

const email = require('../images/mail.png');
const user = require('../images/about-hamula.png');
const lock = require('../images/lock.png');
const phone = require('../images/mobile.png');

export default class UpdateAccountForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            phone: '',
            password: '',
            loader: false
        };
    }

    async componentDidMount() {
        await this.getUserData()
    }

    async getUserData() {
        let userdata = await getData('userdata')
        userdata = JSON.parse(userdata)
        this.setState({
            email: userdata.email,
            name: userdata.name,
            phone: userdata.phone,
            password: 'Abc1234'
        })
    }

    async _updateProfileData() {
        const { email, name, phone, password } = this.state

        this.setState({ loader: true })
        const response = await updateAccountData(email, name, phone, password)
        this.setState({ loader: false })

        console.log(response);
        if (response.status == 'Success') {
            showErrorAlertMessage('Success!',response.status_message)
        } else if (response.status == 'Failure') {
            showErrorAlertMessage('Error!', response.status_message)
        }

    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <IconInputBox
                        iconSource={user}
                        placeholderTextColor={colors.black}
                        placeholder="Your Name"
                        onChangeText={(text) => this.setState({ name: text })}
                        value={this.state.name}
                    />
                    <IconInputBox
                        iconSource={email}
                        placeholderTextColor={colors.black}
                        placeholder="Your Email"
                        keyboardType="email-address"
                        onChangeText={(text) => this.setState({ email: text })}
                        value={this.state.email}
                    />
                    <IconInputBox
                        iconSource={phone}
                        placeholderTextColor={colors.black}
                        placeholder="Your Phone"
                        keyboardType="number-pad"
                        onChangeText={(text) => this.setState({ phone: text })}
                        value={this.state.phone}
                    />
                    <IconInputBox
                        iconSource={lock}
                        placeholderTextColor={colors.black}
                        placeholder="Your Password"
                        secureTextEntry
                        onChangeText={(text) => this.setState({ password: text })}
                        value={this.state.password}
                    />

                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.loginBtn} onPress={() => this._updateProfileData()}>
                            {
                                (this.state.loader) ?
                                    <ActivityIndicator
                                        size="small"
                                        color="#fff"
                                    />
                                    :
                                    <Text style={styles.btnText}>Submit</Text>
                            }

                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    content: {
        backgroundColor: '#fff',
        padding: 10
    },
    btnContainer: {
        justifyContent: 'center',
        marginTop: 20
    },
    loginBtn: {
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