import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, IconInputBox } from '../../components'
import colors from '../../colors';
import { forgotPassword } from '../../operations/accountScreenOperations/accountScreenOperations';
import { showToastMessage, showErrorAlertMessage  } from '../../services/ShowAlertMessages';

const bg = require('../../images/gredient-back.png')
const logo = require('../../images/logo-white.png')
const email = require('../../images/mail.png');
const user = require('../../images/about-hamula.png');
const lock = require('../../images/lock.png');
const phone = require('../../images/mobile.png');

export default class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            loader: false
        };
    }

    async forgotPassword(){
        this.setState({ loader: true })
        const response = await forgotPassword(this.state.email)
        this.setState({ loader: false })
        console.log(response);
        if(response.status == 'Success'){
            showToastMessage(response.status_message,'bottom')
        }else if(response.status == 'Failure'){
            showErrorAlertMessage('Error!',response.status_message)
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <Header backgroundColor='#fff' headerTitle="Forgot Password" showBackBtn={true} navigation={this.props.navigation} />

                <ImageBackground style={styles.content} source={bg} >
                    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>

                        <View style={styles.imageView} >
                            <Image source={logo} style={styles.image} resizeMode="contain" />
                        </View>

                        <View style={styles.formView}>
                            <View style={styles.fieldsContainer}>
                                <Text style={styles.title}>Forgot Password</Text>
                                <IconInputBox
                                    iconSource={email}
                                    placeholderTextColor={colors.black}
                                    placeholder="Your Email"
                                    keyboardType="email-address"
                                    onChangeText={(text) => this.setState({ email: text })}
                                    value={this.state.email}
                                />

                                <View style={styles.btnContainer}>
                                    <TouchableOpacity style={styles.loginBtn} onPress={() => this.forgotPassword()}>
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

                    </KeyboardAwareScrollView>
                </ImageBackground>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flex: 1,
        backgroundColor: colors.mainBlue
    },
    imageView: {
       
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 50
    },
    formView: {
        flex: 1,
    },
    image: {
        width: wp('55%'),
        flex: 1
    },
    title: {
        fontSize: wp('6%'),
        textAlign: 'center',
        color: colors.mainBlue,
        marginBottom: 30
    },
    fieldsContainer: {
        padding: 10,
        backgroundColor: '#fff',
        marginHorizontal: wp('5%'),
        paddingTop: wp('8%'),
        paddingBottom: wp('20%'),
        marginBottom: 20
    },
    btnContainer: {
        justifyContent: 'center',
        marginTop: 20,
    },
    loginBtn: {
        backgroundColor: colors.mainBlue,
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