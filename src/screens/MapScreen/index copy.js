import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacity, Alert, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder-reborn';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';

import { storeData } from '../../services/AsyncStorageServices';
import { Header, SearchBarWithFilterBtn, Mapview, MapTopButtons } from '../../components'
import LocationServices from '../../services/LocationServices'
import colors from '../../colors';
import { userIsLogin, propertyNearMe, getSoldData, getLeaseData, getFilterData } from '../../operations/mapScreenOperations/mapScreenOperations';

export default class MapScreen extends Component {
  constructor(props) {
    super(props);
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };
    this.state = {
      orientation: isPortrait() ? 'portrait' : 'landscape',
      loader: false,
      user_lat: 0,
      user_lng: 0,
      searchingPlaceName: '',
      originLocation: [],
      //max_distance_coords: [],
      satelliteIsOn: false,
      isLogin: false,
      shapeSourceList: {
        type: 'FeatureCollection',
        features: [],
      },
      basicParam: {
        bathroom: "",
        bedroom: "",
        costrange: "",
        daysOnMarketRange: "",
        descriptionText: "",
        distance: '',
        kitchen: "",
        garage: "",
        openhouse: "",
        basement: "",
        livingroom: "",
        lotFrontrange: "",
        maintenanceFees: "",
        prop_type: "",
        sale: "",
        sort: "",
        squareFootagerange: "",
        type: "",
        city: '',
        lat: '',
        lng: '',
      },
      visibleBoundsCoords: '',
      mapZoomLevel: (Platform.OS === 'ios' ? 14 : 15),
      isFiltered: false,
      showingPropertyNearMe: false,
      showingSoldData: false,
      showingLeaseData: false,
      showingFilteredData: false,
      setCameraToUserLocation: false,
      applyFitBoundOnMAP: false,
      fitBoundCoords: []
    };
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });
  }

  async componentDidMount() {

    const isLogin = await userIsLogin()
    if (isLogin) {
      this.setState({
        isLogin: true
      })
    }

    //getting location
    if (Platform.OS === 'android') {
      const LocPermission = await LocationServices.CheckAndroidLocationPermission()
      if (LocPermission == true) {
        await this.getLocation()
      }
    } else {
      const status = await LocationServices.hasPermissionIOS();
      if (status === true) {
        await this.getLocation()
      }
    }

    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      async () => {

        if (this.props.route.params != undefined && (this.props.route.params.searchingPlace != undefined || this.props.route.params.filterParam != undefined)) {
          const { searchingPlace, filterParam } = this.props.route.params
          const { basicParam, user_lat, user_lng } = this.state

          if ((searchingPlace != undefined)) {
            this.setState({
              visibleBoundsCoords: '',
            })
          }

          this.setState({
            basicParam: (filterParam != undefined) ? filterParam : basicParam,
            isFiltered: true,
            searchingPlaceName: (searchingPlace != undefined) ? searchingPlace : '',
            shapeSourceList: {
              type: 'FeatureCollection',
              features: [],
            },
            originLocation: [parseFloat(user_lng), parseFloat(user_lat)],
            //visibleBoundsCoords: '',
            max_distance_coords: [],
            //mapZoomLevel:  (Platform.OS === 'ios' ? 10 : 15),
          }, async () => await this._getFilterData())

          this.props.navigation.setParams({ filterData: null, searchingPlace: null, filterParam: null })
        }

      }
    );
  }

  async getLocation() {
    /*await storeData('user_lat', (37.4219983).toString())
    await storeData('user_lng', (-79.44370).toString())
    this.setState({      
      user_lat: 43.898562,
      user_lng: -79.44370,
      originLocation: [-79.443705, 43.898562]
    }, async () => await this._getUserCountry({ lat: 43.898562, lng: -79.443705 }))
    return*/
    Geolocation.getCurrentPosition(
      async (position) => {

        await this._getUserCountry({ lat: position.coords.latitude, lng: position.coords.longitude })

      },
      async (error) => {
        console.log(error);
        //if (error.message == 'No location provider available.') {
        await this.getLocation()
        //}
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog: true, forceRequestLocation: true }
    );
  }

  async _getUserCountry(coords) {
    //console.log('_getUserCountry',coords);
    let user_from_CANADA = false
    Geocoder.geocodePosition(coords).then(async res => {

      res.map((x, i) => {
        if (x.country == 'Canada') {
          user_from_CANADA = true
        } else {
          user_from_CANADA = false
        }
      })

      if (user_from_CANADA) {
        console.log('canada');
        await storeData('user_lat', (position.coords.latitude).toString())
        await storeData('user_lng', (position.coords.longitude).toString())
        this.setState({
          user_lat: parseFloat(position.coords.latitude),
          user_lng: parseFloat(position.coords.longitude),
          originLocation: [parseFloat(position.coords.longitude), parseFloat(position.coords.latitude)],

        }, async () => await this._propertyNearMe())

      } else {
        console.log('not canada');
        await storeData('user_lat', (43.898562).toString())
        await storeData('user_lng', (-79.44370).toString())
        this.setState({
          user_lat: 43.898562,
          user_lng: -79.44370,
          originLocation: [-79.443705, 43.898562]
        }, async () => await this._propertyNearMe())

        return
        const ne = [-79.797336, 43.572642]
        const sw = [-79.143055, 43.849583]

        this.setState({
          showingPropertyNearMe: true,
          showingSoldData: false,
          showingLeaseData: false,
          showingFilteredData: false,
          originLocation: [-79.421129, 43.712572],
          setCameraToUserLocation: false,
          applyFitBoundOnMAP: true,
          fitBoundCoords: [ne, sw],
          user_lat: 43.712572,
          user_lng: -79.421129
        })
      }

    }).catch(err => console.log(err))
    /*
      GTA boundaries
      43.572642, -79.797336
    
      43.849583, -79.143055

      origin
      43.712572, -79.421129
    */
  }

  async _propertyNearMe() {
    const { user_lat, user_lng, isLogin } = this.state
    const param = {
      type: '',
      lat: '',
      lng: '',
      isLogin: (isLogin) ? 1 : 0,
      visibleBounds: this.state.visibleBoundsCoords
    }

    this.setState({ loader: true })
    const response = await propertyNearMe(param)
    console.log(response);

    this.setState({ loader: false })

    if (response != false) {


      this.setState({
        showingPropertyNearMe: true,
        showingSoldData: false,
        showingLeaseData: false,
        showingFilteredData: false,
        shapeSourceList: response.shapeSourceList,
        originLocation: [user_lng, user_lat],
        setCameraToUserLocation: false
        //max_distance_coords: response.max_distance_coords
      })
    }
  }

  async _getSoldData() {

    if (this.state.isLogin == false) {
      Alert.alert(
        "Homula Says",
        "You are not registered and do not have access",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Register", onPress: () => { this.props.navigation.navigate('AccountTab') } }
        ]
      );
      return
    }

    const param = {
      lat: '', // this.state.user_lat,
      lng: '', // this.state.user_lng,
      isLogin: (this.state.isLogin) ? 1 : 0,
      visibleBounds: this.state.visibleBoundsCoords
    }

    this.setState({ loader: true })
    const response = await getSoldData(param)
    this.setState({ loader: false })

    if (response != false) {
      this.setState({
        showingPropertyNearMe: false,
        showingSoldData: true,
        showingLeaseData: false,
        showingFilteredData: false,
        shapeSourceList: response.shapeSourceList,
        setCameraToUserLocation: false
        //originLocation: response.originLocation,
        //max_distance_coords: response.max_distance_coords
      })
    }
  }

  async _getLeaseData() {

    const param = {
      lat: '', // this.state.user_lat,
      lng: '', //this.state.user_lng,
      isLogin: (this.state.isLogin) ? 1 : 0,
      visibleBounds: this.state.visibleBoundsCoords
    }

    this.setState({ loader: true })
    const response = await getLeaseData(param)
    this.setState({ loader: false })

    if (response != false) {
      this.setState({
        showingPropertyNearMe: false,
        showingSoldData: false,
        showingLeaseData: true,
        showingFilteredData: false,
        shapeSourceList: response.shapeSourceList,
        setCameraToUserLocation: false
        //originLocation: response.originLocation,
        //max_distance_coords: response.max_distance_coords
      })
    }
  }

  async _getFilterData() {
    const { basicParam, isLogin, searchingPlaceName } = this.state

    const param = {
      ...basicParam,
      isLogin: (isLogin) ? 1 : 0,
      keyword: searchingPlaceName,
      visibleBounds: this.state.visibleBoundsCoords
    }
    //console.log('_getFilterData param => ', param);

    this.setState({ loader: true })
    const response = await getFilterData(param)
    this.setState({ loader: false })

    console.log(response);
    //return

    if (response != false) {
      //console.log(response.originLocation);
      this.setState({
        showingPropertyNearMe: false,
        showingSoldData: false,
        showingLeaseData: false,
        showingFilteredData: true,
        shapeSourceList: response.shapeSourceList,
        setCameraToUserLocation: false,
        //originLocation: response.originLocation,
        //max_distance_coords: response.max_distance_coords
      })
    }

  }

  async onRegionDidChange(e) {
    const { showingPropertyNearMe, showingSoldData, showingLeaseData, showingFilteredData, mapZoomLevel } = this.state

    let visibleBounds = e.properties.visibleBounds
    let zoomLevel = e.properties.zoomLevel
    console.log(zoomLevel);
    console.log(visibleBounds);

    this.setState({
      visibleBoundsCoords: '[' + '[' + visibleBounds[0] + ']' + ',' + '[' + visibleBounds[1] + ']' + ']',
      //mapZoomLevel: zoomLevel,
      //originLocation: e.geometry.coordinates
    }, async () => {
      //return
      if (showingSoldData) {
        await this._getSoldData()
      }
      else if (showingLeaseData) {
        await this._getLeaseData()
      }
      else if (showingFilteredData) {
        await this._getFilterData()
      }
      else {
        await this._propertyNearMe()
      }
    })
  }

  clearFilter() {
    console.log('clear filter');
    const param = {
      bathroom: "",
      bedroom: "",
      costrange: "",
      daysOnMarketRange: "",
      descriptionText: "",
      distance: '',
      kitchen: "",
      garage: "",
      openhouse: "",
      basement: "",
      livingroom: "",
      lotFrontrange: "",
      maintenanceFees: "",
      prop_type: "",
      sale: "",
      sort: "",
      squareFootagerange: "",
      type: "",
      city: '',
      lat: '',
      lng: '',
    };

    this.setState({
      basicParam: param,
      isFiltered: false,
      setCameraToUserLocation: false,
      searchingPlaceName: '',
    }, async () => await this._propertyNearMe())

  }

  _navigateToSearch = () => {
    this.props.navigation.navigate('SearchScreenFromHomeAndMap',
      { searchingFromScreen: 'MapScreen', searchingPlaceName: this.state.searchingPlaceName })
  }

  _navigateToFilter = () => {
    this.props.navigation.navigate('Filter', { searchingFromScreen: 'MapScreen' })
  }

  render() {
    const { orientation } = this.state
    const headerContent = (
      <SearchBarWithFilterBtn searchingPlaceName={this.state.searchingPlaceName} onPressSearch={() => this._navigateToSearch()} onPressFilter={() => this._navigateToFilter()} />
    )

    return (
      <View style={[styles.container, { paddingLeft: (Platform.OS === 'ios' && orientation == 'landscape') ? getStatusBarHeight() : 0 }]}>
        <Header headerContent={headerContent} navigation={this.props.navigation} />
        <View style={styles.mapView}>

          {
            (this.state.originLocation.length == 2) ?
              <Mapview
                originLocation={this.state.originLocation}
                satelliteIsOn={this.state.satelliteIsOn}
                shapeSourceList={this.state.shapeSourceList}
                navigation={this.props.navigation}
                zoomLevel={this.state.mapZoomLevel}
                max_distance_coords={this.state.max_distance_coords}
                onRegionDidChange={(e) => this.onRegionDidChange(e)}
                setCameraToUserLocation={this.state.setCameraToUserLocation}
                //applyFitBoundOnMAP={this.state.applyFitBoundOnMAP}
                //fitBoundCoords={this.state.fitBoundCoords}
              />
              :
              (!this.state.loader) ?
                <Text style={{ textAlign: 'center' }}>Location not available</Text>
                :
                <View></View>
          }
          <View style={styles.mapButtonsContatiner}>
            <MapTopButtons
              onPressSatelliteBtn={(v) => this.setState({ satelliteIsOn: v })}
              onPressSchoolBtn={(isSchoolBtnActive) => console.log(isSchoolBtnActive)}
              onPressSoldBtn={(isSoldBtnAcive) => { (isSoldBtnAcive) ? this._getSoldData() : this._propertyNearMe() }}
              onPressLeaseBtn={(isLeaseBtnActive) => { (isLeaseBtnActive) ? this._getLeaseData() : this._propertyNearMe() }}
              isSoldBtnAcive={this.state.showingSoldData}
              isLeaseBtnActive={this.state.showingLeaseData}
            //isSchoolBtnActive={}
            />
          </View>

          {
            (this.state.loader) &&
            <View style={{ position: 'absolute', bottom: 50, right: 30 }}>
              <ActivityIndicator size="small" color={colors.mainBlue} />
            </View>
          }

          <View style={styles.bottomButtonContainer}>

            {
              (this.state.isFiltered) &&
              <TouchableOpacity style={styles.bottomBtn} onPress={() => this.clearFilter()} >
                <Text style={styles.btnText} > Reset Filter </Text>
              </TouchableOpacity>

            }

            <TouchableOpacity style={styles.bottomBtn} onPress={async () => {
              this.setState({
                mapZoomLevel: (Platform.OS === 'ios' ? 14 : 15),
                setCameraToUserLocation: true
              }, async () => await this._propertyNearMe())
            }} >
              <Text style={styles.btnText} > Property Near Me </Text>
            </TouchableOpacity>
          </View>

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
  mapView: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'pink'
  },
  mapButtonsContatiner: {
    position: 'absolute',
    top: 10,
    flexDirection: 'row',
    width: wp('100%')
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('100%'),
    paddingHorizontal: 10
  },
  bottomBtn: {
    padding: 5,
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.41,
    shadowRadius: 4.11,
  },
  btnText: {
    color: '#000',
    textAlign: 'center'
  }
})