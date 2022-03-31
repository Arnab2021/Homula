import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign'
import colors from '../colors'

export default class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { onPressSearch, searchingProperty } = this.props
        let searchingText = '';
        if (searchingProperty.length > 28) {
            searchingText = searchingProperty.slice(0, 30) + '...';
        } else {
            searchingText = (searchingProperty == '') ? 'Search...' : searchingProperty;
        }
        return (
            <View style={styles.searchBoxContainer}>
                <TouchableOpacity style={styles.searchTextboxView} onPress={onPressSearch}>
                    <View style={styles.searchTextBox}>
                        <Text style={{ color: colors.grey }}>{searchingText}</Text>
                    </View>
                    <View style={{ padding: 8 }}>
                        <AntDesign
                            name="search1"
                            size={wp('8%')}
                        />
                    </View>
                </TouchableOpacity>
            </View>

        );
    }
}


const styles = StyleSheet.create({
    searchBoxContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    searchTextboxView: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: wp('5%'),
        paddingHorizontal: 5,
        borderRadius: 25,
        alignItems: 'center'
    },
    searchTextBox: {
        flex: 1,
        paddingHorizontal: 10,
    }
})