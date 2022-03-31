import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CommonActions } from '@react-navigation/native';
import colors from '../colors';
import { IconInputBox } from '.';
import { userLogin } from '../operations/accountScreenOperations/accountScreenOperations';
import { showErrorAlertMessage } from '../services/ShowAlertMessages'
import { storeData } from '../services/AsyncStorageServices'

const email = require('../images/mail.png');
const lock = require('../images/lock.png');

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loader: false
        };
    }

    async onPressLogin() {
        const { navigation } = this.props

        this.setState({ loader: true })
        const response = await userLogin(this.state.email, this.state.password)
        this.setState({ loader: false })

        if (response.status == 'Success') {
            const resetAction = CommonActions.reset({
                index: 0,
                routes: [{ name: 'Root' }],
            });
            console.log(response);
            await storeData('userid', response.data.user_id)
            await storeData('userdata', JSON.stringify(response.data) )
            showErrorAlertMessage('Success!',response.status_message)
            navigation.dispatch(resetAction)

        } else if (response.status == 'Failure') {
            showErrorAlertMessage('Error', response.status_message)
        }
    }


    render() {
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <View style={styles.headingView}>
                    <Text style={styles.heading}>Sign In Here</Text>
                </View>
                <View style={styles.content}>
                    <IconInputBox
                        iconSource={email}
                        placeholderTextColor={colors.black}
                        placeholder="Your Email"
                        onChangeText={(text) => this.setState({ email: text })}
                        value={this.state.email}
                    />
                    <IconInputBox
                        iconSource={lock}
                        placeholderTextColor={colors.black}
                        placeholder="Your Password"
                        onChangeText={(text) => this.setState({ password: text })}
                        value={this.state.password}
                        secureTextEntry
                    />
                    <View style={styles.forgotPasswordSection}>
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.textBtn} onPress={() => navigation.navigate('ForgotPassword')}>
                                <Text style={{ color: colors.mainBlue }}>Forgot Password</Text>
                            </TouchableOpacity>
                            <Text>|</Text>
                            <TouchableOpacity style={styles.textBtn} onPress={() => navigation.navigate('Register')}>
                                <Text style={{ color: colors.mainBlue }}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.loginBtn} onPress={() => this.onPressLogin()}>
                            {
                                (this.state.loader) ?
                                    <ActivityIndicator
                                        size="small"
                                        color="#fff"
                                    />
                                    :
                                    <Text style={styles.btnText}>Sign In</Text>
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
    headingView: {
        marginVertical: 5
    },
    heading: {
        fontSize: wp('7%'),
        fontWeight: 'bold',
        color: colors.mainBlue,
        textAlign: 'center'
    },
    content: {
        backgroundColor: '#fff',
        padding: 10
    },
    forgotPasswordSection: {
        marginVertical: 6
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textBtn: {
        padding: 5,
        paddingHorizontal: 8,
        marginHorizontal: 2
    },
    btnContainer: {
        justifyContent: 'center',
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