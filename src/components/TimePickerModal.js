import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import {
    ifIphoneX,
    getBottomSpace,
    getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import colors from '../colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Checkbox } from '.'
import moment from 'moment';

export default class TimePickerModal extends Component {
    constructor(props) {
        super(props);
        

        this.state = {
            currentTime: new Date()
        };

    }


    render() {
        const { closeTimePicker, isOpen } = this.props;

        if (Platform.OS === 'ios') {
            return (
                <View style={{ flex: 1 }}>
                    <Modal isVisible={isOpen}
                        style={styles.modalView}
                        propagateSwipe
                        supportedOrientations={['portrait', 'landscape']}
                        hasBackdrop
                    >
                        <View style={styles.content}>

                            <View style={styles.headerView}>
                                <TouchableOpacity style={{ padding: 5 }} onPress={() => closeTimePicker(false)} >
                                    <Entypo
                                        name="cross"
                                        size={wp('8%')}
                                        color={colors.mainBlue}
                                    />
                                </TouchableOpacity>
                            </View>

                            <DateTimePicker
                                value={this.state.currentTime}
                                onChange={(event, date) => this.setState({ currentTime: date })}
                                display="spinner"
                                mode="time"
                                is24Hour={false}
                            />

                            <View>
                                <TouchableOpacity style={styles.btn}  onPress={() => closeTimePicker(this.state.currentTime)}>
                                    <Text style={styles.btnText}>Select</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </Modal>
                </View>
            );
        }

        if (Platform.OS === 'android' && isOpen) {
            return (
                <DateTimePicker
                    value={this.state.currentTime}
                    mode="time"
                    is24Hour={false}
                    onChange={(event, date) => {                       
                        //console.log( moment(date).format('hh:mm') );
                        if (event.type === 'set') {
                            closeTimePicker(date);
                        }
                    }}
                />
            )
        }else{      
            return null
        }

    }
}

const styles = StyleSheet.create({
    modalView: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        ...Platform.select({
            ios: {
                paddingBottom: getStatusBarHeight()
            }
        })
    },
    headerView: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    landscapeIOSPadding: {
        ...Platform.select({
            ios: {
                paddingHorizontal: getStatusBarHeight()
            }
        })
    },
    btn:{
        backgroundColor: colors.mainBlue,
        padding: 10,
        marginHorizontal: wp('8%')
    },
    btnText:{
        color: '#fff',
        textAlign: 'center'
    }
});