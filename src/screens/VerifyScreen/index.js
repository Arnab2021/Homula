import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../../colors';
import { verifyCode } from '../../operations/accountScreenOperations/accountScreenOperations';
import { showToastMessage, showErrorAlertMessage  } from '../../services/ShowAlertMessages';

const firstTextInputRef = React.createRef(null);
const secondTextInputRef = React.createRef(null);
const thirdTextInputRef = React.createRef(null);
const fourthTextInputRef = React.createRef(null);

export default class VerifyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ['', '', '', ''],
      inputRefs: [null, null, null, null],
      loader: false,
      invalidMsg: ''
    };
  }

  notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.LONG)
    } else {
      Alert.alert(msg);
    }
  }

  returnInputRef = (index) => {
    if (
      index === 1 &&
      secondTextInputRef.current &&
      secondTextInputRef.current.isFocused()
    ) {
      return true;
    } else if (
      index === 2 &&
      thirdTextInputRef.current &&
      thirdTextInputRef.current.isFocused()
    ) {
      return true;
    } else if (
      index === 3 &&
      fourthTextInputRef.current &&
      fourthTextInputRef.current.isFocused()
    ) {
      return true;
    }
    return false;
  };

  returnInput = () => {
    let { input } = this.state;
    console.log('returnInput - ', input)
    return input.map((item, index) => {
      const inputAvailable =
        index === 0 || this.returnInputRef(index) || item !== '';
      return (
        <View style={inputAvailable ? styles.enableInput : styles.disableInput} key={index}>
          <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType="number-pad"
            value={input[index]}
            ref={this.setInputRef(index)}
            autoFocus={index === 0 ? true : false}
            onChangeText={(value) => this.onOtpChange(index, value)}
            onKeyPress={(e) => this.focusPrevious(e.nativeEvent.key, index)}
            key={index}
          />
          {inputAvailable ? null : <View style={styles.emptyInputContent} />}
        </View>
      );
    });
  };

  focusPrevious = (key, index) => {
    const { input } = this.state;

    if (key === 'Backspace' && index > 0) {
      if (index === 3) {
        thirdTextInputRef.current.focus();
      } else if (index === 2) {
        secondTextInputRef.current.focus();
      } else if (index === 1) {
        firstTextInputRef.current.focus();
      }

      const otpArray = input.slice();
      otpArray[index - 1] = '';
      this.setState({
        input: otpArray,
      });
    }
  };

  onOtpChange = async (index, value) => {
    if (isNaN(Number(value))) {
      return;
    }
    let list = this.state.input;
    let otpArray = list.slice();
    otpArray[index] = value;

    this.setState({
      input: otpArray,
      invalidMsg: ''
    });

    if (value !== '') {
      if (index === 0) {
        secondTextInputRef.current.focus();
      } else if (index === 1) {
        thirdTextInputRef.current.focus();
      } else if (index === 2) {
        fourthTextInputRef.current.focus();
      }
    }

    if (otpArray.join('').length === 4) {
      console.log('here');
      await this._verify(otpArray.join(''))
    }
  };

  setInputRef = (index) => {
    if (index === 0) {
      return firstTextInputRef;
    } else if (index === 1) {
      return secondTextInputRef;
    } else if (index === 2) {
      return thirdTextInputRef;
    }
    return fourthTextInputRef;
  };

  async _verify(code) {
    const { email } = this.props.route.params;

    this.setState({ loader: true });  
    const response = await verifyCode(email, code)
    this.setState({ loader: false });
    
    if(response.status == 'Success'){
      showToastMessage('Email Verified', 'bottom')
      this.props.navigation.navigate('AccountScreen')
    }else if(response.status == 'Failure'){
      showErrorAlertMessage('Error', response.status_message)
    }
  }

  render() {
    React;
    const { email } = this.props.route.params;
   
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title}>We sent a code to verify your email</Text>
        </View>
        <KeyboardAwareScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="always">
          <View style={styles.emailView}>
            <Text style={styles.emailText}>Sent to {email}</Text>
          </View>
          {
            (this.state.loader)&&
            <ActivityIndicator size="small" color={colors.mainBlue} />
          }
          <View style={styles.inputCodeView}>
            <View style={styles.inputCodeContent}>{this.returnInput()}</View>
          </View>

          <View style={styles.bottomTextView}>
            <View style={styles.receiveCod}>
              <Text style={styles.receiveCodText}>
                I didnt received a code
              </Text>
            </View>
            <TouchableOpacity style={styles.resendButton}>
              <Text style={styles.resendText}>Resend</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
    marginHorizontal: wp('5%'),
    backgroundColor: '#fff'
  },
  titleView: {
    marginTop: 20,
    paddingVertical: 5,
  },
  title: {
    fontSize: wp('6%'),
    textAlign: 'center',
    color: colors.black,
    fontWeight: 'bold',
  },
  emailView: {
    marginVertical: 10,
    justifyContent: 'center',
  },
  emailText: {
    textAlign: 'center',
    fontSize: wp('4%'),
    color: colors.grey,
  },
  inputCodeView: {
    flex: 0.5,
    justifyContent: 'center',
  },
  inputCodeContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  enableInput: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.mainBlue,
    color: colors.black,
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
  },
  disableInput: {
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.black,
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    backgroundColor: colors.blurGrey,
  },
  input: {
    flex: 1,
    textAlign: 'center',
    fontSize: wp('7%'),
  },
  emptyInputContent: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: colors.grey,
    position: 'absolute',
  },
  bottomTextView: {
    marginTop: 10
  },
  receiveCod: {
    justifyContent: 'center',    
    marginBottom: 15
  },
  receiveCodText: {
    color: colors.grey,
    fontSize: wp('4%'),
    textAlign: 'center'
  },
  resendButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontWeight: 'bold',
    color: colors.mainBlue,
    fontSize: wp('4%'),
  },
});
