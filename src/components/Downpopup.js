import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Platform, Image } from 'react-native';
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
import { Checkbox } from '.'

const schoolicon = require('../images/school-border.png')

export default class Downpopup extends Component {
    constructor(props) {
        super(props);
        const isPortrait = () => {
            const dim = Dimensions.get('screen');
            return dim.height >= dim.width;
        };
        this.state = {
            orientation: isPortrait() ? 'portrait' : 'landscape',

        };
        Dimensions.addEventListener('change', () => {
            this.setState({
                orientation: isPortrait() ? 'portrait' : 'landscape'
            });
        });
    }


    render() {
        const { orientation } = this.state
        const { isVisible, closeModal, schoolName } = this.props
        return (
            <View>
                <Modal isVisible={isVisible}
                    style={styles.modalView}
                    propagateSwipe
                    supportedOrientations={['portrait', 'landscape']}
                    hasBackdrop
                    onBackdropPress={closeModal}
                    useNativeDriverForBackdrop={false}
                    animationIn="slideInUp"
                    animationInTiming={500}
                    animationOut="fadeOutDown"
                    animationOutTiming={500}
                    backdropTransitionOutTiming={10}
                    backdropTransitionInTiming={300}
                >

                    <View style={styles.content}>
                        <View style={[styles.headerView, (orientation == 'landscape') && styles.landscapeIOSPadding]}>
                            <TouchableOpacity style={{ padding: 5 }} onPress={closeModal}>
                                <Entypo
                                    name="cross"
                                    size={wp('8%')}
                                    color={colors.mainBlue}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center',  paddingHorizontal: 8 }}>
                            <Image source={schoolicon} style={{ width: 40, height: 40,marginRight: 5}} resizeMode="contain" />
                            <View>
                                <Text adjustsFontSizeToFit numberOfLines={2} style={{ fontSize: 16 }}>{schoolName}</Text>
                            </View>

                        </View>

                    </View>

                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modalView: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        backgroundColor: 'white',
        padding: 5,
        paddingBottom: 30,
        //paddingTop: 50,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    headerView: {
        paddingTop: 10,
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
});