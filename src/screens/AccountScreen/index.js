import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Dimensions, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Share from 'react-native-share';
import {
  ifIphoneX,
  getBottomSpace,
  getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import { CommonActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AntDesign from 'react-native-vector-icons/AntDesign'
import colors from '../../colors';
import { Header, LoginForm, UpdateAccountForm } from '../../components'
import { showErrorAlertMessage } from '../../services/ShowAlertMessages';
import { getData, removeData } from '../../services/AsyncStorageServices'

const recommend = require('../../images/recommend.png');
const abouthomula = require('../../images/about-hamula.png');

export default class AccountScreen extends Component {
  constructor(props) {
    super(props);
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };
    this.state = {
      isLogin: false,
      orientation: isPortrait() ? 'portrait' : 'landscape',
    };
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });
  }

  componentDidMount() {

    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      async () => {
        this._userIsLogin()
      }
    );
    this._userIsLogin()
  }

  _userIsLogin = async () => {
    const userid = await getData('userid')

    if (userid != null) {
      this.setState({
        isLogin: true
      })
    }

  }

  async _logout() {
    await removeData('userid')
    await removeData('userdata')
    this.setState({
      isLogin: false
    })
    showErrorAlertMessage('Success!', 'Log out successfully!');

    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'Root' }],
    });
    this.props.navigation.dispatch(resetAction)
  }

  render() {
    const { orientation } = this.state
    return (
      <View style={[styles.container,  { paddingLeft: (orientation == 'landscape' && Platform.OS === 'ios') ? getStatusBarHeight() : null }]}>
        <Header navigation={this.props.navigation} headerTitle="Account" />
        <KeyboardAwareScrollView contentContainerStyle={styles.content}>
          {
            (this.state.isLogin) ?
              <UpdateAccountForm navigation={this.props.navigation} />
              :
              <LoginForm navigation={this.props.navigation} />
          }

          <View style={styles.btncontainer}>

            <TouchableOpacity style={styles.iconBtn} onPress={() => {
              Share.open({
                title: 'test',
                url: 'www.appurl.com',
              })
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  err && console.log(err);
                });
            }}>
              <View style={styles.iconView}>
                <Image
                  source={recommend}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.btnTextView}>
                <Text style={styles.btnText} adjustsFontSizeToFit={true} numberOfLines={1} >Recommend Homula to Friends</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={() => {
              Linking.openURL('https://www.homula.com/about')
            }}>
              <View style={styles.iconView}>
                <Image
                  source={abouthomula}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.btnTextView}>
                <Text style={styles.btnText}>About Homula</Text>
              </View>
            </TouchableOpacity>

            {
              (this.state.isLogin) &&
              <TouchableOpacity style={styles.iconBtn} onPress={() => this._logout()} >
                <View style={styles.iconView}>
                  <AntDesign
                    name="logout"
                    size={20}
                    style={{ transform: [{ rotate: '180deg' }], }}
                  />
                </View>
                <View style={styles.btnTextView}>
                  <Text style={styles.btnText}>Log out</Text>
                </View>
              </TouchableOpacity>
            }

          </View>
        </KeyboardAwareScrollView>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#fff'
  },
  btncontainer: {
    marginTop: 20,
    backgroundColor: '#fff'
  },
  iconBtn: {
    borderColor: colors.mainBlue,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 50,
    marginVertical: 6,
    marginHorizontal: wp('10%'),
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconView: {
    justifyContent: 'center'
  },
  image: {
    width: 30,
    height: 30
  },
  btnTextView: {
    flex: 1
  },
  btnText: {
    textAlign: 'center',
    color: colors.mainBlue
  }
})