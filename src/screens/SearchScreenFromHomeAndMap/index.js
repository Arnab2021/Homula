import React, { Component } from 'react';
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

export default class SearchScreenFromHomeAndMap extends Component {
  constructor(props) {
    super(props);
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };
    this.state = {
      orientation: isPortrait() ? 'portrait' : 'landscape',
      predictionPlaces: [],
      searchingPlaceName: ''
    };
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });
  }

  componentDidMount() {
    const { searchingPlaceName } = this.props.route.params
    this.setState({
      searchingPlaceName: (searchingPlaceName == '') ? '' : searchingPlaceName
    })
  }

  searchLocation = async (text) => {
    this.setState({ searchingPlaceName: text })
    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + text + '.json?access_token=pk.eyJ1IjoicmVkYm9uZSIsImEiOiJja2ViZnI4cTAwN3UxMnJydjEwZTMzM3E2In0.ZzpdGXLpEPIZVNxKAwgZPA'
    axios
      .request({
        method: 'get',
        url: url,
      })
      .then((response) => {
        let json = JSON.parse(response.request._response);
       
        this.setState({
          predictionPlaces: json.features
        })
      })
      .catch((e) => {
        console.log('e', e.response);
      });
  };

  _selectPlaceAndReturnToMainScreen(place_name) {
    const { searchingFromScreen } = this.props.route.params

    this.props.navigation.navigate({
      name: searchingFromScreen,
      params: { searchingPlace: place_name },
      merge: true,
    })
  }

  renderItem = ({ item, index }) => {

    return (
      <TouchableOpacity style={styles.resultItem} onPress={() => this._selectPlaceAndReturnToMainScreen(item.text)} >
        <Text style={styles.resultText}>{item.place_name}</Text>
        <Feather
          name="arrow-up-left"
          size={wp('6%')}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const{orientation} = this.state
    return (
      <View style={styles.container}>
        <View style={[styles.topSearchBar, (orientation == 'landscape')&& styles.landscapeTopSearchBar ]}>
          <View style={styles.backBtnContainer}>
            <TouchableOpacity style={styles.backBtn} onPress={() => this.props.navigation.goBack()}>
              <Image source={arrowBack} style={{ width: 20, height: 30 }} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchTextBoxContainer}>
            <View style={{ flex: 1 }}>
              <TextInput style={styles.textInputBox} placeholder="Search Place..." onChangeText={(text) => this.searchLocation(text)} autoFocus={true} value={this.state.searchingPlaceName} />
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <FlatList
            data={this.state.predictionPlaces}
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
  landscapeTopSearchBar:{
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