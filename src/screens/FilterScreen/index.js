import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform, ActivityIndicator, Dimensions, ScrollView, TextInput } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  ifIphoneX,
  getBottomSpace,
  getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Geolocation from 'react-native-geolocation-service';
import colors from '../../colors';
const { width, height } = Dimensions.get('window');
import { Header, SingleSlider, MultiSliderComponent, Checkbox, ModalDropDown } from '../../components'
import { updateBedroom, updateBathroom, updateKitchen, updateGarage, updateOpenHouse, updateBasement } from './updateLivingSpaceButtons';
import LocationServices from '../../services/LocationServices'
import { getPropertyTypeOptions, userIsLogin } from '../../operations/filterScreenOperations/filterScreenOperations';
import { getData, storeData } from '../../services/AsyncStorageServices';
import { showErrorAlertMessage } from '../../services/ShowAlertMessages';

export default class FilterScreen extends PureComponent {
  constructor(props) {
    super(props);
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };
    this.state = {
      isLogin: false,
      orientation: isPortrait() ? 'portrait' : 'landscape',
      locationLoader: false,
      loader: false,
      saledDropdown: {
        data: ['For Sale', 'For Rent'],
        selectedIndex: -1,
      },
      houseDropdown: {
        data: ['House', 'Condo', 'Commercial'],
        activeIndexes: [],
      },
      propertyTypeDropdown: {
        data: [],
        dataValues: [],
        activeIndexes: [],
      },

      bedroom: {
        buttons: ['Any', '1', '2', '3', '4', '5+'],
        activeIndexes: [-1],
      },
      bathroom: {
        buttons: ['Any', '1', '2', '3', '4', '5+'],
        activeIndexes: [-1],
      },
      kitchen: {
        buttons: ['Any', '1', '2', '3', '4', '5+'],
        activeIndexes: [-1],
      },
      garage: {
        buttons: ['Any', '1', '2', '3', '4', '5+'],
        activeIndexes: [-1],
      },
      openHouse: {
        //buttons: ['Unspecified', 'Today', 'Tomorrow', '7 days'],
        buttons: ['Any', 'Today', 'Tomorrow', '7 days'],
        activeIndex: -1,
      },
      basement: {
        //buttons: ['Finished', 'Separate Entrance', 'Walk Out'],
        buttons: ['Any', 'Separate Entrance', 'Walk Out'],
        activeIndex: -1,
      },
      distanceSliderValue: 0,
      minprice: '',
      maxprice: '',

      daysOnMarketDropdown: {
        data: ['None', 'Less than 1 day', 'Less than 2 days', 'Less than 3 days', 'Less than 4 days', 'Less than 5 days', 'Less than 6 days', 'Less than a week', '7 to 10 Days', '10 to 30 Days', '30 to 60 Days', '60 to 90 Days', '90 to 120 Days', 'More than 120 Days'],
        range: ['', '<1', '<2', '<3', '<4', '<5', '<6', '<7', '7-10', '10-30', '30-60', '60-90', '90-120', '>120'],
        activeIndex: -1,
      },
      lotFrontSliderValue: [0, 100],
      squareFootageSliderValue: [0, 5000],
      squareFootageOver5000: false,
      familyRoomChecked: false,
      maintenanceFees: '',
      descriptionText: '',

      showHideMaintenanceFees: true,
      showHideLot: true,
      showHideGarageParking: true
    };
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });
  }

  async componentDidMount() {
    const isLogin = await userIsLogin()
    await this.checkLocationAccess()      
    this.setState({
      isLogin: isLogin
    })
  }

  async _applyFilter() {
    const { saledDropdown, houseDropdown, propertyTypeDropdown, bedroom, bathroom, kitchen, garage, openHouse, basement, distanceSliderValue, minprice, maxprice, daysOnMarketDropdown, lotFrontSliderValue, squareFootageSliderValue, squareFootageOver5000, familyRoomChecked, descriptionText, maintenanceFees } = this.state

    const copyOfhouseDropdown = { ...houseDropdown };
    const copyOfSaledDropdown = { ...saledDropdown };
    const copyOfpropertyTypeDropdown = { ...propertyTypeDropdown };
    const copyOfBedRoom = { ...bedroom };
    const copyOfBathRoom = { ...bathroom };
    const copyOfKitchen = { ...kitchen };
    const copyOfGarage = { ...garage }
    const copyOfOpenhouse = { ...openHouse }
    const copyOfBasement = { ...basement }

    let type = '';
    let sale = '';
    let dayonMarket = '';
    let lotFront = '';
    let squreFootage = ''
    let bdroom = '';
    let bthroom = '';
    let ktchn = '';
    let _garage = '';
    let _openhouse = '';
    let _basement = '';
    let familyRoom = (familyRoomChecked) ? 'Y' : '';
    let prop_type = '';
    let lat = '';
    let lng = '';
    let price = ''

    /*if ((minprice != '' && maxprice == '') || (minprice == '' && maxprice != '')) {
      showErrorAlertMessage('Alert!', 'Minimum price and maximum price should not blank.')
      return
    }*/

  
      console.log('minprice',minprice);
      console.log('maxprice',maxprice);
     
      if(minprice != '' && maxprice != '' ){
        price = minprice + '-' + maxprice
      }
      if(minprice == '' && maxprice != '' ){
        price = '0-' + maxprice
      }
      if(minprice != '' && maxprice == '' ){
        price = minprice + '-0'
      }
   

    if(minprice == '' && maxprice == '' ){
      price = ''
    }

    copyOfhouseDropdown.activeIndexes.forEach((element) => {
      let title = copyOfhouseDropdown.data[element]
      if (title == 'House') {
        title = 'residential'
      }
      if (title == 'Condo') {
        title = 'condo'
      }
      if (title == 'Commercial') {
        title = 'commercial'
      }
      type += title + ','
    })
    type = type.substr(0, type.length - 1)

    if (copyOfSaledDropdown.selectedIndex == 0) {
      sale = 'Sale'
    }
    if (copyOfSaledDropdown.selectedIndex == 1) {
      sale = 'Lease'
    }

    if (daysOnMarketDropdown.activeIndex != -1) {
      dayonMarket = daysOnMarketDropdown.range[daysOnMarketDropdown.activeIndex]
    }

    if (lotFrontSliderValue[0] != 0 || lotFrontSliderValue[1] != 100) {
      lotFront = lotFrontSliderValue[0] + '-' + lotFrontSliderValue[1]
    }

    if (squareFootageSliderValue[0] != 0 || squareFootageSliderValue[1] != 5000) {
      squreFootage = squareFootageSliderValue[0] + '-' + squareFootageSliderValue[1]
    }

    if (squareFootageOver5000) {
      squreFootage = '>5000'
    }

    copyOfBedRoom.activeIndexes.map((v, i) => {
      if (v == -1) {
        bdroom = ''
      } else if (v == 0) {
        bdroom = 'any'
      } else {
        bdroom += copyOfBedRoom.buttons[v] + ',';
      }
    })
    if (bdroom != 'any') {
      bdroom = bdroom.substr(0, bdroom.length - 1)
    }

    bthroom = '';
    copyOfBathRoom.activeIndexes.map((v, i) => {
      if (v == -1) {
        bthroom = ''
      } else if (v == 0) {
        bthroom = 'any'
      } else {
        bthroom += copyOfBathRoom.buttons[v] + ',';
      }
    })
    if (bthroom != 'any') {
      bthroom = bthroom.substr(0, bthroom.length - 1)
    }

    ktchn = '';
    copyOfKitchen.activeIndexes.map((v, i) => {
      if (v == -1) {
        ktchn = ''
      } else if (v == 0) {
        ktchn = 'any'
      } else {
        ktchn += copyOfKitchen.buttons[v] + ',';
      }
    })
    if (ktchn != 'any') {
      ktchn = ktchn.substr(0, ktchn.length - 1)
    }

    _garage = '';
    copyOfGarage.activeIndexes.map((v, i) => {
      if (v == -1) {
        _garage = ''
      } else if (v == 0) {
        _garage = 'any'
      } else {
        _garage += copyOfGarage.buttons[v] + ',';
      }
    })
    if (_garage != 'any') {
      _garage = _garage.substr(0, _garage.length - 1)
    }

    _openhouse = (copyOfOpenhouse.activeIndex == -1) ? '' : (copyOfOpenhouse.buttons[copyOfOpenhouse.activeIndex] == 'Any') ? 'any' : copyOfOpenhouse.buttons[copyOfOpenhouse.activeIndex]

    _basement = (copyOfBasement.activeIndex == -1) ? '' : (copyOfBasement.buttons[copyOfBasement.activeIndex] == 'Any') ? 'any' : copyOfBasement.buttons[copyOfBasement.activeIndex]

    copyOfpropertyTypeDropdown.activeIndexes.forEach((element) => {
      let title = copyOfpropertyTypeDropdown.dataValues[element]
      prop_type += title + ',';
    })
    prop_type = prop_type.substr(0, prop_type.length - 1)


    let distance = (Math.floor(distanceSliderValue) == 0) ? '' : Math.floor(distanceSliderValue)
    if (distance != '') {          
      lat = await getData('user_lat')
      lng = await getData('user_lng')
    }

    const param = {
      type: type,
      sale: sale,
      prop_type: (prop_type == undefined) ? '' : prop_type,
      bedroom: bdroom,
      bathroom: bthroom,
      kitchen: ktchn,
      garage: _garage,
      openhouse: _openhouse,
      basement: _basement,
      livingroom: familyRoom,
      sort: '',
      descriptionText: descriptionText,
      maintenanceFees: maintenanceFees,
      distance: distance,
      lat: lat,
      lng: lng,
      city: '',
      costrange: price,
      daysOnMarketRange: dayonMarket,
      lotFrontrange: lotFront,
      squareFootagerange: squreFootage,
    };

   
    const { searchingFromScreen } = this.props.route.params

    this.props.navigation.navigate({
      name: searchingFromScreen,
      params: { filterData: 1, filterParam: param },
      merge: true
    })

  }

  async checkLocationAccess() {
    this.setState({ locationLoader: true })
    
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

  }

  async getLocation() {
    Geolocation.getCurrentPosition(
      async (position) => {
      
        await storeData('user_lat', (position.coords.latitude).toString())
        await storeData('user_lng', (position.coords.longitude).toString())
       
        this.setState({ locationLoader: false })
      },
      async (error) => {
        console.log(error);
        await this.getLocation()
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog: true, forceRequestLocation: true }
    );
  }

  _renderSaledDropdown = ({ item, index }) => {
    const { saledDropdown } = this.state;
    return (
      <TouchableOpacity
        onPress={() => {
          const copyOfSaledDropdown = { ...saledDropdown };
          copyOfSaledDropdown.selectedIndex = index;
          this.setState({
            saledDropdown: copyOfSaledDropdown,
          });
          /*if (item == 'For Rent') {
            this.setState({
              price: [0, 30000]
            })
          } else {
            this.setState({
              price: [0, 50000000]
            })
          }*/
        }}
        style={[styles.disablePropertyButton, (saledDropdown.selectedIndex === index) && styles.enablePropertyButton]}>
        <Text style={[styles.disablePropertyText, (saledDropdown.selectedIndex === index) && styles.enablePropertyText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  }

  async _getPropertyTypeList() {
    const { houseDropdown, propertyTypeDropdown } = this.state;

    this.setState({ loader: true })
    const response = await getPropertyTypeOptions(houseDropdown)
    this.setState({ loader: false })

    if (response !== false) {
      // console.log(response);
      let data = [];
      let dataValues = [];

      response.map((x, i) => {
        data.push(x.property_type);
        dataValues.push(x.search_type);
      })

      const propertyTypeArr = { ...propertyTypeDropdown };
      propertyTypeArr.data = data;
      propertyTypeArr.dataValues = dataValues;
      propertyTypeArr.activeIndexes = [];
      // console.log(propertyTypeArr);
      this.setState({
        propertyTypeDropdown: propertyTypeArr
      })

    }
  }

  _renderHouseDropdown = ({ item, index }) => {
    const { houseDropdown } = this.state;
    return (
      <TouchableOpacity
        onPress={async () => {
          await this.updateHouseDropdown(index)
          if (this.state.houseDropdown.activeIndexes.length > 0) {
            await this._getPropertyTypeList()
          }

        }}
        style={[styles.disablePropertyButton, (houseDropdown.activeIndexes.includes(index)) && styles.enablePropertyButton]}>
        <Text
          style={[styles.disablePropertyText, (houseDropdown.activeIndexes.includes(index)) && styles.enablePropertyText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };
  updateHouseDropdown = async (index) => {
    const { houseDropdown, garage } = this.state;
    const newhouseDropdownArray = { ...houseDropdown };

    const findIndex = newhouseDropdownArray.activeIndexes.findIndex(
      (element) => element === index,
    );


    if (findIndex === -1) {
      newhouseDropdownArray.activeIndexes.push(index);
      if (index == 0) {
        this.setState({
          showHideMaintenanceFees: false
        })
      }
      if (index == 2) {
        this.setState({
          showHideMaintenanceFees: false
        })
      }
      if (index == 1) {
        this.setState({
          showHideLot: false
        })
      }

      // console.log('index', index);
    } else {
      newhouseDropdownArray.activeIndexes.splice(findIndex, 1);
      if (index == 0 && garage.activeIndexes[0] == -1) {
        this.setState({
          showHideMaintenanceFees: true
        })
      }
      if (index == 2 && garage.activeIndexes[0] == -1) {
        this.setState({
          showHideMaintenanceFees: true
        })
      }
      if (index == 1) {
        this.setState({
          showHideLot: true
        })
      }
    }

    this.setState({
      houseDropdown: newhouseDropdownArray,
    });
  }

  _renderPropertyOption = ({ item, index }) => {
    const { propertyTypeDropdown } = this.state;
    return (
      <TouchableOpacity
        onPress={() => {
          this.updatePropertyTypeList(index)
        }}
        style={[styles.disablePropertyButton, (propertyTypeDropdown.activeIndexes.includes(index)) && styles.enablePropertyButton]}>
        <Text
          style={[styles.disablePropertyText, propertyTypeDropdown.activeIndexes.includes(index)
            && styles.enablePropertyText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  }


  updatePropertyTypeList = (index) => {
    const { propertyTypeDropdown } = this.state;
    const newpropertyTypeArray = { ...propertyTypeDropdown };

    const findIndex = newpropertyTypeArray.activeIndexes.findIndex(
      (element) => element === index,
    );

    if (findIndex === -1) {
      newpropertyTypeArray.activeIndexes.push(index);
    } else {
      newpropertyTypeArray.activeIndexes.splice(findIndex, 1);
    }

    this.setState({
      propertyTypeDropdown: newpropertyTypeArray
    })
  }

  returnBedroomButtons = () => {
    const { bedroom } = this.state;

    return (
      <View style={styles.buttonsView}>
        {bedroom.buttons.map((item, index) => {
          if (index === 0) {
            return (
              <TouchableOpacity onPress={() => {
                const array = updateBedroom(bedroom, index)
                this.setState({
                  bedroom: array
                })
              }} key={index} >
                <View
                  style={[
                    bedroom.activeIndexes.includes(index)
                      ? styles.enableButton
                      : styles.disableButton,
                    { width: 55 },
                  ]}>
                  <Text
                    style={
                      bedroom.activeIndexes.includes(index)
                        ? styles.enableText
                        : styles.disableText
                    }>
                    Any
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity onPress={() => {
              const array = updateBedroom(bedroom, index)
              this.setState({
                bedroom: array
              })
            }} key={index} >
              <View
                style={
                  bedroom.activeIndexes.includes(index)
                    ? styles.enableButton
                    : styles.disableButton
                }>
                <Text
                  style={
                    bedroom.activeIndexes.includes(index)
                      ? styles.enableText
                      : styles.disableText
                  }>
                  {item}
                </Text>
              </View>
            </TouchableOpacity >
          );
        })}
      </View >
    );
  };

  returnBathroomButtons = () => {
    const { bathroom } = this.state;

    return (
      <View style={styles.buttonsView}>
        {bathroom.buttons.map((item, index) => {
          if (index === 0) {
            return (
              <TouchableOpacity onPress={() => {
                const array = updateBathroom(bathroom, index)
                this.setState({
                  bathroom: array
                })
              }} key={index}>
                <View
                  style={[
                    bathroom.activeIndexes.includes(index)
                      ? styles.enableButton
                      : styles.disableButton,
                    { width: 55 },
                  ]}>
                  <Text
                    style={
                      bathroom.activeIndexes.includes(index)
                        ? styles.enableText
                        : styles.disableText
                    }>
                    Any
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity onPress={() => {
              const array = updateBathroom(bathroom, index)
              this.setState({
                bathroom: array
              })
            }} key={index}>
              <View
                style={
                  bathroom.activeIndexes.includes(index)
                    ? styles.enableButton
                    : styles.disableButton
                }>
                <Text
                  style={
                    bathroom.activeIndexes.includes(index)
                      ? styles.enableText
                      : styles.disableText
                  }>
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  returnKitchenButtons = () => {
    const { kitchen } = this.state;

    return (
      <View style={styles.buttonsView}>
        {kitchen.buttons.map((item, index) => {
          if (index === 0) {
            return (
              <TouchableOpacity onPress={() => {
                const array = updateKitchen(kitchen, index)
                this.setState({
                  kitchen: array
                })
              }} key={index}>
                <View
                  style={[
                    kitchen.activeIndexes.includes(index)
                      ? styles.enableButton
                      : styles.disableButton,
                    { width: 55 },
                  ]}>
                  <Text
                    style={
                      kitchen.activeIndexes.includes(index)
                        ? styles.enableText
                        : styles.disableText
                    }>
                    Any
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity onPress={() => {
              const array = updateKitchen(kitchen, index)
              this.setState({
                kitchen: array
              })
            }} key={index}>
              <View
                style={
                  kitchen.activeIndexes.includes(index)
                    ? styles.enableButton
                    : styles.disableButton
                }>
                <Text
                  style={
                    kitchen.activeIndexes.includes(index)
                      ? styles.enableText
                      : styles.disableText
                  }>
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  returnGarage = () => {
    const { garage, houseDropdown } = this.state;
    const newhouseDropdownArray = { ...houseDropdown };

    const findIndexZero = newhouseDropdownArray.activeIndexes.findIndex(
      (element) => element === 0,
    );
    const findIndexTwo = newhouseDropdownArray.activeIndexes.findIndex(
      (element) => element === 2,
    );

    return (
      <View style={styles.buttonsView}>
        {garage.buttons.map((item, index) => {
          if (index === 0) {
            return (
              <TouchableOpacity onPress={() => {
                const array = updateGarage(garage, index)

                this.setState({
                  garage: array
                })
                if (array.activeIndexes[0] !== -1) {
                  this.setState({ showHideMaintenanceFees: false })
                } else {
                  if (findIndexZero == -1 && findIndexTwo == -1) {
                    this.setState({ showHideMaintenanceFees: true })
                  }
                }
              }} key={index}>
                <View
                  style={[
                    garage.activeIndexes.includes(index)
                      ? styles.enableButton
                      : styles.disableButton,
                    { width: 55 },
                  ]}>
                  <Text
                    style={
                      garage.activeIndexes.includes(index)
                        ? styles.enableText
                        : styles.disableText
                    }>
                    Any
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity onPress={() => {
              const array = updateGarage(garage, index)

              this.setState({
                garage: array
              })
              if (array.activeIndexes[0] !== -1) {
                this.setState({ showHideMaintenanceFees: false })
              } else {
                if (findIndexZero == -1 && findIndexTwo == -1) {
                  this.setState({ showHideMaintenanceFees: true })
                }
              }
            }} key={index}>
              <View
                style={
                  garage.activeIndexes.includes(index)
                    ? styles.enableButton
                    : styles.disableButton
                }>
                <Text
                  style={
                    garage.activeIndexes.includes(index)
                      ? styles.enableText
                      : styles.disableText
                  }>
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  returnOpenHouse = () => {
    const { openHouse } = this.state;
    return (
      <View style={styles.buttonsView}>
        {openHouse.buttons.map((item, index) => {
          if (index === 0) {
            return (
              <TouchableOpacity onPress={() => {
                const array = updateOpenHouse(openHouse, index)
                this.setState({
                  openHouse: array
                })
              }} key={index}>
                <View
                  style={[
                    openHouse.activeIndex === index
                      ? styles.enableButton
                      : styles.disableButton,
                    { width: wp('22.5%') },
                  ]}>
                  <Text
                    style={
                      openHouse.activeIndex === index
                        ? styles.enableText
                        : styles.disableText
                    }>
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity onPress={() => {
              const array = updateOpenHouse(openHouse, index)
              this.setState({
                openHouse: array
              })
            }} key={index}>
              <View
                style={[
                  openHouse.activeIndex === index
                    ? styles.enableButton
                    : styles.disableButton,
                  { width: wp('22.5%') },
                ]}>
                <Text
                  style={
                    openHouse.activeIndex === index
                      ? styles.enableText
                      : styles.disableText
                  }>
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  returnBasement = () => {
    const { basement } = this.state;
    return (
      <View style={styles.buttonsView}>
        {basement.buttons.map((item, index) => {
          if (index === 0) {
            return (
              <TouchableOpacity onPress={() => {
                const array = updateBasement(basement, index)
                this.setState({
                  basement: array
                })
              }} key={index}>
                <View
                  style={[
                    basement.activeIndex === index
                      ? styles.enableButton
                      : styles.disableButton,
                    { width: wp('30%') },
                  ]}>
                  <Text
                    adjustsFontSizeToFit={true}
                    numberOfLines={2}
                    style={
                      basement.activeIndex === index
                        ? styles.enableText
                        : styles.disableText
                    }>
                    Any
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity onPress={() => {
              const array = updateBasement(basement, index)
              this.setState({
                basement: array
              })
            }} key={index}>
              <View
                style={[
                  basement.activeIndex === index
                    ? styles.enableButton
                    : styles.disableButton,
                  { width: wp('30%') },
                ]}>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={2}
                  style={[
                    basement.activeIndex === index
                      ? styles.enableText
                      : styles.disableText,
                    { textAlign: 'center' }
                  ]}>
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  render() {
    const { orientation } = this.state
    const left = (this.state.distanceSliderValue * (width - 80)) / 100;
    return (
      <View style={[styles.container,{ paddingLeft: (orientation == 'landscape' && Platform.OS === 'ios') ? getStatusBarHeight() : null }]}>
        <Header navigation={this.props.navigation} headerTitle="Filter" showBackBtn={true} />
        <KeyboardAwareScrollView contentContainerStyle={styles.content}>

          <View style={styles.propertyTypeView}>
            <Text style={styles.itemText}>Property Type</Text>
            <View style={[styles.propertyTypeItem, { marginTop: 5 }]}>
              <FlatList
                data={this.state.saledDropdown.data}
                horizontal={true}
                renderItem={this._renderSaledDropdown}
                keyExtractor={(item, index) => index}
              />
            </View>
            {this.state.saledDropdown.selectedIndex > -1 ? (
              <View style={styles.propertyTypeItem}>
                <FlatList
                  data={this.state.houseDropdown.data}
                  horizontal={true}
                  renderItem={this._renderHouseDropdown}
                  keyExtractor={(item, index) => index}
                />
              </View>
            ) : null}
            {this.state.houseDropdown.activeIndexes.length > 0 ? (
              <View style={{ height: 'auto' }}>
                {
                  (this.state.loader) ?
                    <View style={{ padding: 10 }}>
                      <ActivityIndicator
                        animating={true}
                        size="small"
                        color={colors.mainBlue}
                      />
                    </View>
                    :
                    <View style={styles.propertyTypeItem}>
                      <FlatList
                        data={this.state.propertyTypeDropdown.data}
                        horizontal={true}
                        renderItem={this._renderPropertyOption}
                        keyExtractor={(item, index) => index}
                      />
                    </View>
                }
              </View>
            ) : null}
          </View>

          <View style={styles.sliderView}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.itemText}>Distance</Text>
              <View style={{ marginLeft: 10 }}>
                <ActivityIndicator size="small" color={colors.mainBlue} animating={this.state.locationLoader} />
              </View>
              {
                (this.state.locationLoader) &&
                <Text style={{ marginLeft: 8 }}>Fetching Location...</Text>
              }
            </View>
            <View style={styles.sliderContainer}>

              <Text style={[styles.sliderDescriptionText, { textAlign: 'center' }]}> {Math.floor(this.state.distanceSliderValue)} Km</Text>

              <View style={{ alignItems: 'center' }}>
                <SingleSlider
                  sliderValue={this.state.distanceSliderValue}
                  min={0}
                  max={100}
                  onValuesChange={(value) => {
                    this.setState({ distanceSliderValue: parseInt(value) });
                    //this.checkLocationAccess() 
                  }}
                  sliderLength={wp('85%')} />
              </View>
              <View style={styles.sliderDescriptionView}>
                <Text style={[styles.sliderDescriptionText, { marginLeft: wp('9%') }]}>0 Km</Text>
                <Text style={[styles.sliderDescriptionText, { marginRight: wp('8%') }]}>100 Km</Text>
              </View>

            </View>
          </View>

          <View style={styles.sliderView}>
            <Text style={styles.itemText}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter min price"
              keyboardType="numeric"
              placeholderTextColor={colors.grey}
              onChangeText={(text) => this.setState({ minprice: text })}
              value={this.state.minprice}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter max price"
              keyboardType="numeric"
              placeholderTextColor={colors.grey}
              onChangeText={(text) => this.setState({ maxprice: text })}
              value={this.state.maxprice}
            />

          </View>

          <View style={styles.textInputView}>
            <Text style={[styles.itemText]}>Description Containt Keywords</Text>
            <TextInput
              style={styles.input}
              placeholder="Waterfront,Pool,Fireplace..."
              placeholderTextColor={colors.grey}
              onChangeText={(text) => this.setState({ descriptionText: text })}
              value={this.state.descriptionText}
            />
          </View>

          <View style={styles.sliderView}>
            <Text style={styles.itemText}>Days On The Market</Text>
            <View style={styles.sliderContainer}>

              <ModalDropDown
                items={this.state.daysOnMarketDropdown.data}
                textStyle={{ fontSize: 14, textAlign: 'center', flex: 1 }}
                style={styles.dropDownMainStyle}
                dropdownStyle={styles.dropdownStyle}
                dropdownTextStyle={styles.dropdownTextStyle}
                selectedItem={this.state.daysOnMarketDropdown.data[this.state.daysOnMarketDropdown.activeIndex]}
                onSelect={(index, value) => {
                  const copyOfIron = { ...this.state.daysOnMarketDropdown };
                  copyOfIron.activeIndex = index;
                  this.setState({
                    daysOnMarketDropdown: copyOfIron,
                  })
                }}
              />
              {/*<Text style={[styles.sliderDescriptionText, { textAlign: 'center' }]}>
                {this.state.daysOnMarketDropdown[0]} -{' '}
                {(this.state.daysOnMarketDropdown[1] === 300) ? 'Max' : this.state.daysOnMarketDropdown[1] + ' Days'}
              </Text>

              <View style={{ alignItems: 'center' }}>
                <MultiSliderComponent
                  values={[this.state.daysOnMarketDropdown[0], this.state.daysOnMarketDropdown[1]]}
                  onValuesChange={(v) => this.setState({ daysOnMarketDropdown: v })}
                  min={0}
                  max={this.state.daysOnMarketDropdown[1]}
                  sliderLength={wp('85%')}
                  step={5}
                />
              </View>
              <View style={styles.sliderDescriptionView}>
                <Text style={styles.sliderDescriptionText}>0</Text>
                <Text style={styles.sliderDescriptionText}>Max</Text>
            </View>*/}

            </View>
          </View>

          <View style={styles.livingSpaceView}>
            <Text style={styles.itemText}>Living Space</Text>
            <View style={styles.livingItemsContent}>
              <View style={styles.itemRow}>
                <Text style={styles.itemRowText}>Bedroom</Text>
                {this.returnBedroomButtons()}
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemRowText}>Bathroom</Text>
                {this.returnBathroomButtons()}
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemRowText}>Kitchen</Text>
                {this.returnKitchenButtons()}
              </View>
              {
                (this.state.showHideGarageParking) &&
                <View style={styles.itemRow}>
                  <Text style={styles.itemRowText}>Garage/Parking</Text>
                  {this.returnGarage()}
                </View>
              }

              {
                (this.state.isLogin) &&
                <View style={styles.itemRow}>
                  <Text style={styles.itemRowText}>Open House</Text>
                  <ScrollView horizontal={true}>
                    {this.returnOpenHouse()}
                  </ScrollView>
                </View>
              }

              <View style={styles.itemRow}>
                <Text style={styles.itemRowText}>Basement</Text>
                <ScrollView horizontal={true}>
                  {this.returnBasement()}
                </ScrollView>
              </View>
            </View>
          </View>

          {
            (this.state.showHideMaintenanceFees) &&
            <View style={styles.textInputView}>
              <Text style={[styles.itemText]}>Max Maintenance Fees</Text>
              <TextInput
                style={[styles.input, { paddingLeft: 10 }]}
                placeholder="$100"
                placeholderTextColor={colors.grey}
                keyboardType="numeric"
                onChangeText={(text) => {
                  this.setState({ maintenanceFees: text });
                  if (text == '') {
                    this.setState({ showHideGarageParking: true })
                  } else {
                    this.setState({ showHideGarageParking: false })
                  }
                }}
                value={this.state.maintenanceFees}
              />
            </View>
          }


          {
            (this.state.showHideLot) &&

            <View style={styles.sliderView}>
              <Text style={styles.itemText}>Lot Front</Text>
              <View style={styles.sliderContainer}>

                <Text style={[styles.sliderDescriptionText, { textAlign: 'center' }]}>
                  Lot Front(feet) :{' '}
                  {this.state.lotFrontSliderValue[0] === 0
                    ? '0'
                    : this.state.lotFrontSliderValue[0]}{' '}
                  - {this.state.lotFrontSliderValue[1]}
                  {this.state.lotFrontSliderValue[1] === 100 ? '+' : null}
                </Text>

                <View style={{ alignItems: 'center' }}>
                  <MultiSliderComponent
                    values={[this.state.lotFrontSliderValue[0], this.state.lotFrontSliderValue[1]]}
                    onValuesChange={(v) => {
                      //this.setState({ lotFrontSliderValue: v })
                      const value = v.split('-')
                      this.setState({
                        lotFrontSliderValue: [parseInt(value[0]), parseInt(value[1])]
                      })
                      console.log(v);
                    }}
                    min={0}
                    max={this.state.lotFrontSliderValue[1]}
                    step={1}
                  />
                </View>
                <View style={styles.sliderDescriptionView}>
                  <Text style={[styles.sliderDescriptionText, { marginLeft: wp('9%') }]}>0</Text>
                  <Text style={[styles.sliderDescriptionText, { marginRight: wp('8%') }]}>100+</Text>
                </View>

              </View>
            </View>
          }

          <View style={styles.sliderView}>
            <Text style={styles.itemText}>Square Footage</Text>
            <View style={styles.sliderContainer}>

              <Text style={[styles.sliderDescriptionText, { textAlign: 'center' }]}>
                Square Footage(feet) :{' '}
                {this.state.squareFootageSliderValue[0] === 0
                  ? '0'
                  : this.state.squareFootageSliderValue[0]}{' '}
                -{' '}
                {this.state.squareFootageSliderValue[1] === 5000
                  ? 'Max'
                  : this.state.squareFootageSliderValue[1]}
              </Text>

              <View style={{ alignItems: 'center' }}>
                <MultiSliderComponent
                  values={[this.state.squareFootageSliderValue[0], this.state.squareFootageSliderValue[1]]}
                  onValuesChange={(v) => {
                    //this.setState({ squareFootageSliderValue: v })
                    const value = v.split('-')
                    this.setState({
                      squareFootageSliderValue: [parseInt(value[0]), parseInt(value[1])]
                    })
                  }}
                  min={0}
                  max={this.state.squareFootageSliderValue[1]}
                  step={1}
                />
              </View>
              <View style={styles.sliderDescriptionView}>
                <Text style={[styles.sliderDescriptionText, { marginLeft: wp('9%') }]}>0</Text>
                <Text style={[styles.sliderDescriptionText, { marginRight: wp('8%') }]}>Max</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginVertical: 12 }}>
                <Text style={[{ marginRight: 8 }]}>For Over 5000</Text>
                <Checkbox
                  value={this.state.squareFootageOver5000}
                  onValueChange={() =>
                    this.setState({ squareFootageOver5000: !this.state.squareFootageOver5000 })
                  }
                  checboxStyle={{
                    width: 20,
                    height: 20
                  }}
                />
              </View>

            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
            <Text style={styles.itemRowText}>Family Room</Text>
            <Checkbox
              value={this.state.familyRoomChecked}
              onValueChange={() =>
                this.setState({ familyRoomChecked: !this.state.familyRoomChecked })
              }
              checboxStyle={{
                width: 30,
                height: 30
              }}
            />
          </View>

        </KeyboardAwareScrollView>

        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.btn} onPress={() => this._applyFilter()} >
            <Text style={styles.btnText}>Search</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  itemText: {
    fontSize: wp('5%'),
    color: colors.black,
    fontWeight: 'bold',
  },
  propertyTypeView: {
    // padding: 10,
    //backgroundColor: 'pink'
  },
  propertyTypeItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
  },
  enablePropertyButton: {
    backgroundColor: colors.mainBlue,
  },
  disablePropertyButton: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    backgroundColor: colors.blurGrey,
    marginRight: 10,
    marginVertical: 10
  },
  enablePropertyText: {
    color: colors.white,
  },
  disablePropertyText: {
    fontSize: wp('3.5%'),
    color: colors.black,
  },
  sliderView: {
    marginVertical: 12,
  },
  sliderContainer: {
    paddingHorizontal: 5,
    backgroundColor: '#F5F5F4',
    marginTop: 12,
    borderRadius: 8,
    paddingVertical: 3
  },
  sliderDescriptionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -5
  },
  sliderDescriptionText: {
    fontSize: wp('3.5%'),
    color: colors.hardGrey,
  },
  livingSpaceView: {
    marginVertical: 12,
  },
  livingItemsContent: {
    marginTop: 12,
    backgroundColor: '#F5F5F4',
    paddingVertical: 3
  },
  dropDownMainStyle: {
    backgroundColor: colors.white,
    width: '100%',
    height: hp('6%'),
    justifyContent: 'center',
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: colors.grey,
    borderRadius: 3,
    borderWidth: 1,
  },
  dropdownStyle: {
    width: wp('86%'),
    height: hp('30%'),
    marginTop: hp('2%'),
    padding: 2,
    backgroundColor: colors.grey,
    elevation: 10
  },
  dropdownTextStyle: {
    fontWeight: 'bold',
    fontSize: 12
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'pink',
    marginVertical: 5
  },
  itemRowText: {
    fontSize: hp('2%'),
    width: '28%',
  },
  buttonsView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    //backgroundColor: 'red',
  },
  enableButton: {
    backgroundColor: colors.mainBlue,
    width: wp('10%'),
    height: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  disableButton: {
    width: wp('10%'),
    height: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  enableText: {
    fontSize: wp('4%'),
    color: colors.white,
  },
  disableText: {
    fontSize: wp('4%'),
    color: colors.black,
  },
  textInputView: {
    marginVertical: 12,
  },
  input: {
    borderColor: colors.grey,
    borderWidth: 1,
    marginTop: 12,
    paddingVertical: 5,
    height: 45
  },
  buttonView: {
    marginVertical: 12,
  },
  btn: {
    backgroundColor: colors.mainBlue,
    marginLeft: wp('10%'),
    marginRight: wp('10%'),
    paddingVertical: 15
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: wp('5%')
  }
})