import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign'
import colors from '../colors'

export default class SearchBarWithFilterBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }



    render() {
        const { searchingPlaceName, onPressSearch, onPressFilter } = this.props

        let searchingText = '';
        if (searchingPlaceName.length > 28) {
            searchingText = searchingPlaceName.slice(0, 30) + '...';
        } else {
            searchingText = (searchingPlaceName == '')? 'Search...': searchingPlaceName;
        }

        return (
            <View style={styles.row}>
                <TouchableOpacity style={styles.searchBoxContainer} onPress={onPressSearch}>
                    <View style={styles.searchTextboxView}>
                        <View style={styles.searchTextContainer} >
                            <Text style={{ color: colors.mainBlue, fontWeight: 'bold' }}>{searchingText}</Text>
                        </View>
                        <View style={{ padding: 8 }}>
                            <AntDesign
                                name="search1"
                                size={wp('8%')}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.filterBtnContainer}>
                    <TouchableOpacity style={{ alignItems: 'center', padding: 5 }} onPress={onPressFilter}>
                        <AntDesign
                            name="filter"
                            size={wp('8%')}
                            color="#fff"
                        />
                        <Text style={{ color: '#fff' }}>Filter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    searchBoxContainer: {
        flex: 0.85,
        justifyContent: 'center',
    },
    filterBtnContainer: {
        flex: 0.15,
        justifyContent: 'center'
    },
    searchTextboxView: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 5,
        paddingHorizontal: 5,
        borderRadius: 25,
        alignItems: 'center'
    },
    searchTextContainer: {
        flex: 1,
        paddingHorizontal: 10,
        //backgroundColor:'red'
    }
})