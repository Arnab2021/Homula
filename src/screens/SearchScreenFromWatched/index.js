import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, Platform, Dimensions } from 'react-native';
import axios from 'axios';
import {
    ifIphoneX,
    getBottomSpace,
    getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import Feather from 'react-native-vector-icons/Feather'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CommonActions } from '@react-navigation/native';

const arrowBack = require('../../images/arrow.png');

export default class SearchScreenFromWatched extends PureComponent {
    constructor(props) {
        super(props);
        const isPortrait = () => {
            const dim = Dimensions.get('screen');
            return dim.height >= dim.width;
        };
        this.state = {
            orientation: isPortrait() ? 'portrait' : 'landscape',
            watchedProperties: [],
            copyOfWatchedProperties: [],
            searchingPropertyName: '',
        };
        Dimensions.addEventListener('change', () => {
            this.setState({
                orientation: isPortrait() ? 'portrait' : 'landscape'
            });
        });
    }

    componentDidMount() {
        const{watchedProperties,searchingProperty} = this.props.route.params      
        this.setState({
            watchedProperties: watchedProperties,
            copyOfWatchedProperties: watchedProperties,
            searchingPropertyName: searchingProperty
        })
      
    }

    searchProperty = async (e) => {
        this.setState({ searchingPropertyName: e })
        let text = e.toLowerCase()
        let properties = this.state.watchedProperties
        let filteredName = properties.filter((item) => {
            return item.address.toLowerCase().match(text)
        })
        
        if (!text || text === '') {
            this.setState({
                copyOfWatchedProperties: properties
            })
        } else if (!Array.isArray(filteredName) && !filteredName.length) {
            // set no data flag to true so as to render flatlist conditionally           
        } else if (Array.isArray(filteredName)) {
            this.setState({
                copyOfWatchedProperties: filteredName
            })
        }
    };

    _selectPropertyAndReturn(item) {        
        this.props.navigation.navigate('WatchedScreen',{ searchedPorperties: item, searchingPropertyName: item.address })
    }
   
    _goBack(){     
        this.props.navigation.navigate('WatchedScreen',{ searchedPorperties: null, searchingPropertyName:'' })
    }

    renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity style={styles.resultItem} onPress={()=> this._selectPropertyAndReturn(item)}>
                <Text style={styles.resultText}>{item.address}</Text>
                <Feather
                    name="arrow-up-left"
                    size={wp('6%')}
                />
            </TouchableOpacity>
        );
    }


    render() {
        const { orientation } = this.state
        return (
            <View style={styles.container}>
                <View style={[styles.topSearchBar, (orientation == 'landscape') && styles.landscapeTopSearchBar]}>
                    <View style={styles.backBtnContainer}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => this._goBack() }>
                            <Image source={arrowBack} style={{ width: 20, height: 30 }} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.searchTextBoxContainer}>
                        <View style={{ flex: 1 }}>
                            <TextInput style={styles.textInputBox} placeholder="Search Property..." onChangeText={(text) => this.searchProperty(text)} autoFocus={true} value={this.state.searchingPropertyName} />
                        </View>
                    </View>
                </View>
                <View style={styles.content}>
                    <FlatList
                        data={this.state.copyOfWatchedProperties}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    topSearchBar: {
        ...Platform.select({
            ios: {
                marginTop: getStatusBarHeight()
            },
        }),
        padding: 10,
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    landscapeTopSearchBar: {
        ...Platform.select({
            ios: {
                marginTop: 0
            },
        }),
    },
    backBtnContainer: {
        flex: 0.15,
    },
    searchTextBoxContainer: {
        flex: 0.85,
    },
    backBtn: {
        padding: 8,
    },
    textInputBox: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 15,
        flex: 1
    },
    content: {
        flex: 1,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    resultText: {
        flex: 1,
        fontSize: wp('5%'),
        textTransform: 'capitalize',
        fontWeight: 'bold',
        paddingVertical: 2
    }
})