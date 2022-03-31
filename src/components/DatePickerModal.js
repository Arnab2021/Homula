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
import { Checkbox } from '../components'

export default class DatePickerModal extends Component {
    constructor(props) {
        super(props);
        const{currentDate} = this.props

        this.state = {
            currentDate: currentDate
        };

    }


    render() {
        const { closeDatePicker, isOpen, currentDate } = this.props;

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
                                <TouchableOpacity style={{ padding: 5 }} onPress={closeDatePicker} >
                                    <Entypo
                                        name="cross"
                                        size={wp('8%')}
                                        color={colors.mainBlue}
                                    />
                                </TouchableOpacity>
                            </View>

                            <DateTimePicker
                                value={this.state.currentDate}
                                onChange={(event, date) => this.setState({ currentDate: date })}
                                display="spinner"
                            />

                            <View>
                                <TouchableOpacity style={styles.btn}  onPress={() => closeDatePicker(this.state.currentDate)}>
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
                    value={currentDate}
                    onChange={(event, date) => {
                        if (event.type === 'set') {
                            closeDatePicker(date);
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