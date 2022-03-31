import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from '../../colors';

export default class SchoolInfoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {        
        const{ onLayout,schoolInfoExpand, onPress } = this.props
        return (
            <View onLayout={(event) => onLayout(event)  }>
                <TouchableOpacity
                    style={styles.expandItem}
                    onPress={onPress}
                    >
                    <Text style={styles.expandText}>School Info</Text>
                    <Ionicons
                        name={schoolInfoExpand ? 'chevron-down' : 'chevron-back'}
                        style={styles.chevronIcon}
                    />
                </TouchableOpacity>
                {schoolInfoExpand ? (
                    <View style={{ marginTop: 10 }}>
                        <View style={styles.schoolInfoItem}>
                            <View style={styles.schoolRate}>
                                <Text style={styles.rateText}>6/10</Text>
                            </View>
                            <View style={styles.schoolInformationView}>
                                <Text
                                    style={[
                                        styles.schoolNameText,
                                        { fontWeight: 'bold', color: colors.black },
                                    ]}>
                                    Walter C. Black Elementary School
                                </Text>
                                <Text style={[styles.schoolNameText, { color: colors.grey }]}>
                                    Grades K:2 Distance 1.3mi
                                </Text>
                            </View>
                        </View>
                        <View style={styles.schoolInfoItem}>
                            <View style={styles.schoolRate}>
                                <Text style={styles.rateText}>6/10</Text>
                            </View>
                            <View style={styles.schoolInformationView}>
                                <Text
                                    style={[
                                        styles.schoolNameText,
                                        { fontWeight: 'bold', color: colors.black },
                                    ]}>
                                    Walter C. Black Elementary School
                                </Text>
                                <Text style={[styles.schoolNameText, { color: colors.grey }]}>
                                    Grades K:2 Distance 1.3mi
                                </Text>
                            </View>
                        </View>
                        <View style={styles.aboutSchool}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                About GreatSchools
                            </Text>
                            <Text
                                style={{ fontSize: 14, color: colors.grey, marginVertical: 10 }}>
                                The GreatSchools Summary Rating is based on several metrics
                            </Text>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 14, color: colors.mainBlue }}>
                                    Read More
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}
            </View>
        );
    }
}


const styles = StyleSheet.create({

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
    factTextRow: {
        flexDirection: 'row',
        marginTop: 5,
    },
    schoolInfoItem: {
        flexDirection: 'row',
        height: hp('8%'),
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.blurGrey,
        paddingBottom: 15,
        paddingTop: 15,
        marginVertical: 4
    },
    schoolRate: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rateText: {
        fontSize: 14,
        color: colors.white,
        fontWeight: 'bold',
    },
    schoolInformationView: {
        justifyContent: 'space-between',
        marginLeft: 5,
    },
    schoolNameText: {
        fontSize: 14,
    },
})