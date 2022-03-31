import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from '../../colors';

export default class FactsAndFeaturesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { onLayout, factAndFeaturesExpand, onPress, factAndFeatureData } = this.props

        return (
            <View onLayout={(event) => onLayout(event)}>
                <TouchableOpacity
                    style={styles.expandItem}
                    onPress={onPress}>
                    <Text style={styles.expandText}>Facts and features</Text>
                    <Ionicons
                        name={factAndFeaturesExpand ? 'chevron-down' : 'chevron-back'}
                        style={styles.chevronIcon}
                    />
                </TouchableOpacity>
                {factAndFeaturesExpand ? (
                    <View style={{ marginTop: 10 }}>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Area:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.area}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Community:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.community}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>Type of property:</Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.propertyType}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Taxes for the property and year:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>

                                {factAndFeatureData.propertyBuilt}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Building Age:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>

                                {factAndFeatureData.propertyAge}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Size:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.propertyLot}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>Lot Size (Front and Dept):</Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.propertyLotSizeFrontDept}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Heating:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>

                                {factAndFeatureData.propertyHeating}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Cooling:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.propertyCooling}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Parking:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.propertyParking}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Total parking space:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.propertyTotalParking}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Kitchen:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.kitchen}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Basement:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.basement}
                            </Text>
                        </View>

                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Price/sqtf:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.pricesqtf}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Listing Date:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.propertyListingDate}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Last update Date:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.lastUpdate}
                            </Text>
                        </View>
                        <View style={styles.factTextRow}>
                            <Text style={[styles.factText, { fontWeight: 'bold' }]}>
                                Family Room:
                            </Text>
                            <Text style={[styles.factText, { marginLeft: 10, }]}>
                                {factAndFeatureData.familyRoom}
                            </Text>
                        </View>

                        <View style={{ marginTop: 15 }}>
                            <Text style={styles.rentOwner}>{factAndFeatureData.propertyOwner}</Text>
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
    factText: {
        width: wp('45%'),
        textTransform: 'capitalize',
        //backgroundColor:'red'
    }
})