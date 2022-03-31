import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
    ifIphoneX,
    getBottomSpace,
    getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import colors from '../colors'

const arrow = require('../images/arrow-dark.png')
const arrowdark = require('../images/arrow.png')

export default class LandscapeHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { headerContent, headerTitle, navigation, showBackBtn, backgroundColor } = this.props

        return (
            <View style={[styles.container, (backgroundColor != undefined) && { backgroundColor: backgroundColor }]}>

                {
                    (headerContent) &&
                    headerContent
                }
                {
                    (headerTitle) &&
                    <View style={styles.headerTitleContainer}>
                        {
                            (showBackBtn) ?
                                <TouchableOpacity style={{ flex: 0.3, paddingLeft: 5 }} onPress={() => navigation.goBack()}>
                                    <Image source={(backgroundColor != undefined) ? arrowdark : arrow} style={{ width: 30, height: 30 }} resizeMode="contain" />
                                </TouchableOpacity>
                                :
                                <View style={styles.gap}>
                                </View>
                        }
                        <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.headerTitle, (backgroundColor != undefined) && { color: '#000' }]}>{headerTitle}</Text>
                        </View>

                        <View style={styles.gap}>
                        </View>

                    </View>
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.mainBlue,
        ...Platform.select({
            ios: {
                height: 30 + getStatusBarHeight(),
            },
            android: {
                height: hp('9%'),
            }
        }),
        justifyContent: 'center'
    },
    headerTitleContainer: {
        flexDirection: 'row',
        // backgroundColor:'pink'
    },
    headerTitle: {
        fontSize: wp('6%'),
        color: '#fff',
    },
    gap: {
        flex: 0.3
    }
})