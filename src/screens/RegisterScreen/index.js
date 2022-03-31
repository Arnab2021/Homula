import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, IconInputBox } from '../../components'
import colors from '../../colors';
import { userRegistration } from '../../operations/accountScreenOperations/accountScreenOperations';
import { showToastMessage, showErrorAlertMessage  } from '../../services/ShowAlertMessages';

const bg = require('../../images/gredient-back.png')
const logo = require('../../images/logo-white.png')
const email = require('../../images/mail.png');
const user = require('../../images/about-hamula.png');
const lock = require('../../images/lock.png');
const phone = require('../../images/mobile.png');

export default class RegisterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: '',
            lname: '',
            email: '',
            phone: '',
            password: '',
            loader: false
        };
    }

    async _userRegistration(){
        const{ fname, lname, email, phone, password } = this.state
       
        this.setState({ loader: true })
        const response = await userRegistration( fname, lname, email, phone, password )
        this.setState({ loader: false })
        console.log(response);

        if(response.status == 'Success'){
            showToastMessage('Registration Successfull!', 'bottom')
            this.props.navigation.navigate('Verify',{email: email})
          }else if(response.status == 'Failure'){
            showErrorAlertMessage('Error', response.status_message)
          }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header backgroundColor='#fff' headerTitle="Sign Up" showBackBtn={true} navigation={this.props.navigation} />

                <ImageBackground style={styles.content} source={bg} >
                    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={styles.imageView} >
                            <Image source={logo} style={styles.image} resizeMode="contain" />
                        </View>
                        <View style={styles.formView}>
                            <View style={styles.fieldsContainer}>
                                <IconInputBox
                                    iconSource={user}
                                    placeholderTextColor={colors.black}
                                    placeholder="First Name"
                                    onChangeText={(text) => this.setState({ fname: text })}
                                    value={this.state.fname}
                                />
                                <IconInputBox
                                    iconSource={user}
                                    placeholderTextColor={colors.black}
                                    placeholder="Last Name"
                                    onChangeText={(text) => this.setState({ lname: text })}
                                    value={this.state.lname}
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
                                    <TouchableOpacity style={styles.loginBtn} onPress={() => this._userRegistration()}>
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
        paddingVertical: wp('10%')
    },
    formView: {
        flex: 1,
        justifyContent: 'center'
    },
    image: {
        width: wp('55%'),
        flex: 1,
    },
    fieldsContainer: {
        padding: 10,
        backgroundColor: '#fff',
        marginHorizontal: wp('5%'),
        marginBottom: 30
    },
    btnContainer: {
        justifyContent: 'center',
        marginTop: 10
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