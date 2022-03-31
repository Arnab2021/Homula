import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from '../../colors';

export default class OverViewComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        };
    }

    render() {        
        const{ onLayout,overViewExpand, onPress, overViewData } = this.props
        return (
            <View
                style={styles.overView}
                onLayout={(event) => onLayout(event)}
            >
                <TouchableOpacity
                    style={styles.expandItem}
                    onPress={onPress}>
                    <Text style={styles.expandText}>Description</Text>
                    <Ionicons
                        name={overViewExpand ? 'chevron-down' : 'chevron-back'}
                        style={styles.chevronIcon}
                    />
                </TouchableOpacity>
                {overViewExpand ? (
                    <View style={styles.expandedView}>

                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: colors.mainBlue }}> {overViewData.propertyDescription} </Text>
                        </View>
                    </View>
                ) : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    overView: {

    },
    expandItem: {
        backgroundColor: colors.expandItemBackground,
        justifyContent: 'space-between',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    expandText: {
        fontWeight: 'bold',
        fontSize: wp('4.5%')
    },
    expandedView: {
        marginTop: 5,
    },
})