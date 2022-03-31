import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Platform, Dimensions } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
    ifIphoneX,
    getBottomSpace,
    getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Share from 'react-native-share';
import { SliderBox } from 'react-native-image-slider-box';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../../colors'
import { Mapview } from '../../components'
import OverViewComponent from './OverViewComponent';
import FactsAndFeaturesComponent from './FactsAndFeaturesComponent';
import MortgageCalculatorComponent from './MortgageCalculatorComponent';
import SchoolInfoComponent from './SchoolInfoComponent';
import { userIsLogin, getPropertyDetails, addOrRemoveFromWatched, addToPropertyView } from '../../operations/propertyDetailsScreenOperations/propertyDetailsScreenOperations'
import { getData } from '../../services/AsyncStorageServices'
import { showErrorAlertMessage } from '../../services/ShowAlertMessages';
import { actuatedNormalize } from '../../services/actuatedNormalizeFont';

const arrow = require('../../images/arrow-white.png')
const share = require('../../images/dots.png')
const bed = require('../../images/bed.png')
const bathtub = require('../../images/bathtub.png')
const garage = require('../../images/garage.png')
const blank_image = require('../../images/blank-image.png')

export default class PropertyDetailsViewScreen extends Component {
    constructor(props) {
        super(props);
        const isPortrait = () => {
            const dim = Dimensions.get('screen');
            return dim.height >= dim.width;
        };
        const { width } = Dimensions.get('screen')
        this.state = {
            orientation: isPortrait() ? 'portrait' : 'landscape',
            screenWidth: width,
            isLogin: false,
            loader: true,
            menuItems: {
                items: [
                    'Description',
                    'Fact and features',
                    'Mortgage Calculator',
                    'School Info',
                ],
                activeIndex: 0,
            },
            overViewExpand: false,
            factAndFeaturesExpand: false,
            mortgageCalculatorExpand: false,
            schoolInfoExpand: false,
            shapeSourceList: {
                type: 'FeatureCollection',
                features: [],
            },
            originLocation: [],
            dupItemArray: [],
            base64ImageURL: '',
            propertyImageGallery: [blank_image],
            isWatched: false,
            propertyAddress: '---',
            propertyOwner: '---',
            propertyPrice: '---',
            propertyBedroom: '---',
            peropertyBathroom: '---',
            propertyGarage: '---',
            propertyUnitNum: '',

            overViewData: {
                propertyDescription: ''
            },
            factAndFeatureData: {
                propertyType: '',
                propertyCooling: '',
                propertyParking: '',
                propertyLot: '',
                propertyOwner: ''
            },

            mortgageData: {
                homePrice: 0
            },

            propertytimeonHomula: '0',
            propertyViewCount: 0,
            propertySavedCount: 0,
            isSoldProperty: false,
            soldPrice: 0,
            soldDate: '---'
        };
        Dimensions.addEventListener('change', () => {
            this.setState({
                orientation: isPortrait() ? 'portrait' : 'landscape',
                screenWidth: width,
            });
        });
    }

    async componentDidMount() {
        try {
            const isLogin = await userIsLogin()
            if (isLogin) {
                this.setState({
                    isLogin: true
                })
            }
            await this._addToPropertyView()
            await this._getPropertyDetails()
        } catch (error) {
            showErrorAlertMessage('Alert!','componentDidMount property details => '+error)
        }
       
    }

    async _getPropertyDetails() {

        const { id, type } = this.props.route.params

        const param = {
            id: id,
            type: type,
            isLogin: (this.state.isLogin) ? 1 : 0
        };
        console.log(param);
        this.setState({ loader: true })
        const response = await getPropertyDetails(param)

        if (response != false) {
            const data = response[0]
            let watched = false;
            let imgArr = [];

            let images = data.images.split(",");

            images.map((x, i) => {
                imgArr.push(x.trim());
            })

            if (data.images == '') {
                imgArr = ['https://forum.purestudy.com/assets/images/backgrounds/no-image.jpg'];
            }

            let Watchedproperties = await getData('watchedproperty');
            let watchedlist = JSON.parse(Watchedproperties);

            let watcharr = (watchedlist !== null) ? watchedlist.filter((e) => e.id == id) : [];
            if (watcharr.length > 0) {
                watched = true
            } else {
                watched = false
            }

            const unit_num = (data.type == 'condo') ? 'Unit ' + data.unit_num + ' - ' : ''
            const address = unit_num + data.street_address + ', ' + data.city + ', ' + data.county + ', ' + data.zip


            let shapeSourceList = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    id: '9d10456e-bdda-4aa9-9269-04c1667d4552',
                    properties: {
                        itemLabel: data.street_address, //address,
                        shouldRedirect: false,
                        colorCode: colors.mainBlue
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(data.lng), parseFloat(data.lat)],  // lng - lat                        
                    },
                }],
            };

            let amount = parseInt(data.price)
            amount = (amount && amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));

            let sold_date = ''
            if (data.sold_date != '' && data.sold_date != null && data.sold_date != '0000-00-00') {
                sold_date = data.sold_date.split(' ')
                sold_date = sold_date[0]
            }
            let sold_price = ''
            if (data.sold_price != '' && data.sold_price != null && data.sold_price != 0) {
                sold_price = parseInt(data.sold_price)
                sold_price = (sold_price && sold_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                
            }

            const dupItemArray = {
                imgGallery: imgArr,
                address: address,
                owner: data.list_brokerage,
                bedrooms: (data.bedrooms == null) ? 0 : data.bedrooms,
                bathroom: (data.washroom == null) ? 0 : data.washroom,
                garage: parseInt(data.garage),
                amount:  (sold_date != '' && sold_price != '' && sold_price != 0)? '$'+sold_price : '$'+amount,
                watched: watched,
                id: data.id,
                type: data.type,
                sold_date: sold_date,
                sold_price: sold_price
            }

            this.setState({
                propertyImageGallery: imgArr,
                propertyAddress: address,
                propertyUnitNum: data.unit_num,
                propertyPrice: amount,
                propertyBedroom: (data.bedrooms == null) ? 0 : data.bedrooms,
                peropertyBathroom: (data.washroom == null) ? 0 : data.washroom,
                propertyGarage: parseInt(data.garage),
                propertytimeonHomula: (data.homula_days == null)? 0: data.homula_days,
                propertyViewCount: data.view_count,
                propertySavedCount: data.save_count,
                originLocation: [parseFloat(data.lng), parseFloat(data.lat)],
                shapeSourceList: shapeSourceList,
                isWatched: watched,
                soldPrice: sold_price,
                soldDate: sold_date,
                isSoldProperty: (data.sold_price != '') ? true : false,

                overViewData: {
                    propertyDescription: data.property_description,
                },

                factAndFeatureData: {
                    propertyType: data.typeofproperty_detail,
                    propertyBuilt: data.tax_year,
                    propertyAge: data.built_age,
                    propertySize: data.propertysize,
                    propertyHeating: data.fuel,

                    propertyCooling: data.cooling,
                    propertyParking: data.garage_type,
                    propertyTotalParking: (data.garage == null) ? 0 : data.garage,
                    kitchen: (data.kitchen == null) ? 0 : data.kitchen,
                    basement: data.basement1 + ' ' + data.basement2,
                    propertyLot: data.sqft,
                    propertyLotSizeFrontDept: data.lot_front + ' - ' + data.lot_depth,

                    priceSqtf: data.pricesqtf,
                    propertyListingDate: data.listing_date,
                    lastUpdate: data.updated_date,
                    area: data.area,
                    community: data.community,

                    propertyOwner: data.list_brokerage,
                    familyRoom: (data.familyroom == 'Y') ? 'Yes' : 'No'
                },

                mortgageData: {
                    homePrice: parseInt(data.price),
                },

                dupItemArray: dupItemArray

            })
        }
        this.setState({ loader: false })
    }

    async _addToPropertyView() {

        const { id, type } = this.props.route.params
        const userid = await getData('userid')
        const propertyid = id
        const ptype = type

        const param = {
            userid: (userid == null)?0: userid,
            propertyid: propertyid,
            type: ptype
        }
        console.log('_addToPropertyView', param);

        this.setState({ loader: true })
        await addToPropertyView(param)
        this.setState({ loader: false })

    }

    async _addOrRemoveFromWatched() {

        //const { item } = this.props.route.params        
        const { isWatched, dupItemArray } = this.state
        this.setState({
            isWatched: !isWatched
        })

        if (!this.state.isLogin) {
            showErrorAlertMessage('Denied!', 'You need to login to save property in Watchlist.')
            return
        }

        addOrRemoveFromWatched(dupItemArray, !isWatched)
    }

    updateMenuIndex = (index) => {
        const { menuItems } = this.state;
        const copyMenuItems = { ...menuItems };

        copyMenuItems.activeIndex = index;

        if (index === 0) {
            console.log('overViewLayout', this.overViewLayout);
            this.setState(
                {
                    overViewExpand: true,
                    factAndFeaturesExpand: false,
                    mortgageCalculatorExpand: false,
                    schoolInfoExpand: false
                },
                () =>
                    this.scrollViewRef.scrollTo({
                        y: this.overViewLayout.width + 300,
                        animated: true,
                    }),
            );
        } else if (index === 1) {
            console.log('factAndFeaturesLayout', this.factAndFeaturesLayout);
            this.setState(
                {
                    factAndFeaturesExpand: true,
                    overViewExpand: false,
                    mortgageCalculatorExpand: false,
                    schoolInfoExpand: false
                },
                () =>
                    this.scrollViewRef.scrollTo({
                        y: this.factAndFeaturesLayout.width + 300,
                        animated: true,
                    }),
            );
        } else if (index === 2) {
            this.setState(
                {
                    mortgageCalculatorExpand: true,
                    factAndFeaturesExpand: false,
                    overViewExpand: false,
                    schoolInfoExpand: false
                },
                () =>
                    this.scrollViewRef.scrollTo({
                        y: this.mortgageCalcLayout.width + 300,
                        animated: true,
                    }),
            );
        } else {
            this.setState(
                {
                    schoolInfoExpand: true,
                    mortgageCalculatorExpand: false,
                    factAndFeaturesExpand: false,
                    overViewExpand: false,
                },
                () =>
                    this.scrollViewRef.scrollTo({
                        y: this.schoolInfoLayout.width + 300,
                        animated: true,
                    }),
            );
        }

        this.setState({
            menuItems: copyMenuItems,
        });
    };

    renderMenu = () => {
        const { menuItems } = this.state;
        return (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {menuItems.items.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                this.updateMenuIndex(index);
                            }}
                            style={
                                index === menuItems.activeIndex
                                    ? styles.activeMenuItem
                                    : styles.passiveMenuItem
                            }>
                            <Text
                                style={
                                    index === menuItems.activeIndex
                                        ? styles.activeMenuText
                                        : styles.passiveMenuText
                                }>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        );
    };

    renderDisplayedImages = () => {

        return (
            <View style={styles.imageBackgroundView} onLayout={(event) => {
                var { x, y, width, height } = event.nativeEvent.layout;
                this.setState({
                    screenWidth: width
                })
            }}>
                <SliderBox
                    images={this.state.propertyImageGallery}
                    ImageComponentStyle={{ width: wp('100%') }}
                    sliderBoxHeight={200}
                    resizeMode="cover"
                    resizeMethod="resize"
                    parentWidth={this.state.screenWidth}
                />
                <View style={styles.topViewButtons}>
                    <TouchableOpacity style={styles.backButtonView} onPress={() => this.props.navigation.goBack()}>
                        <Image
                            source={arrow}
                            style={styles.backButtonImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shareButtonView} onPress={() => { this._shareToMedia() }}>
                        <Image
                            source={share}
                            style={styles.shareButtonImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    async _shareToMedia() {
        const { dupItemArray, isLogin } = this.state

        const location_url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(this.state.propertyAddress)

        const isSold = (isLogin) ? 1 : 0
        const prop_detail_url = 'https://homula.ca/api/property/' + dupItemArray.type + '/' + dupItemArray.id + '/' + isSold
        console.log(prop_detail_url);
        const message = 'Hey there.\n' +
            'Check out this listing.\n' +
            '𝑷𝒓𝒐𝒑𝒆𝒓𝒕𝒚 𝑨𝒅𝒅𝒓𝒆𝒔𝒔 :' + this.state.propertyAddress + '\n' +
            '𝑷𝒓𝒊𝒄𝒆 : ' + '$' + this.state.propertyPrice + '\n' +
            '𝑶𝒗𝒆𝒓𝒗𝒊𝒆𝒘 : ' + this.state.overViewData.propertyDescription + '\n' +
            '𝑳𝒐𝒄𝒂𝒕𝒊𝒐𝒏 𝑳𝒊𝒏𝒌 : ' + location_url + '\n' +
            '𝑭𝒐𝒓 𝒎𝒐𝒓𝒆 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 : www.homula.com' + '\n'
        /*'𝑴𝒐𝒓𝒆 𝑨𝒃𝒐𝒖𝒕 𝑻𝒉𝒊𝒔 𝑷𝒓𝒐𝒑𝒆𝒓𝒕𝒚 : ' + prop_detail_url + '\n' +
        'Download the APP from here for more information:\n'*/

        const options = {
            title: 'Homula',
            message: message,
            //url: 'www.appurl.com',
        }
        Share.open(options)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                err && console.log(err);
            });

    }


    render() {
        const { orientation } = this.state
        const { showingSoldData } = this.props.route.params
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container} innerRef={(ref) => (this.scrollViewRef = ref)} enableOnAndroid extraHeight={100} >
                {this.renderDisplayedImages()}
                <View style={[styles.content, { paddingLeft: (orientation == 'landscape' && Platform.OS === 'ios') ? getStatusBarHeight() : null }]}>

                    <TouchableOpacity style={styles.startIconContainer} onPress={() => this._addOrRemoveFromWatched()}>
                        <AntDesign
                            name={(this.state.isWatched) ? 'star' : 'staro'}
                            size={20}
                            color={colors.mainBlue}
                        />
                    </TouchableOpacity>

                    <View style={styles.addresssView}>
                        {
                            (this.state.loader) &&
                            <ActivityIndicator size="small" color={colors.mainBlue} />
                        }
                        <Text style={styles.addressText} adjustsFontSizeToFit={true} numberOfLines={2}>{this.state.propertyAddress}</Text>
                    </View>
                    {
                        (showingSoldData) &&
                        <View style={{ backgroundColor: '#A8DAB5', width: 80, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginTop: 5 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Sold</Text>
                        </View>
                    }
                    {
                        (showingSoldData) &&
                        <View style={[styles.priceView, {}]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', width: '30%' }}>Sold Price: </Text>
                                <Text style={[styles.priceText, { fontSize: 17, color: 'red' }]} adjustsFontSizeToFit={true} numberOfLines={2}>${this.state.soldPrice}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', width: '30%' }}>Sold Date: </Text>
                                <Text style={[styles.priceText, { fontSize: 17 }]} adjustsFontSizeToFit={true} numberOfLines={2}>{this.state.soldDate}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', width: '30%' }}>Sold In: </Text>
                                <Text style={[styles.priceText, { fontSize: 17 }]} adjustsFontSizeToFit={true} numberOfLines={2}>{this.state.propertytimeonHomula} Days</Text>
                            </View>
                        </View>
                    }
                    <View style={styles.priceView}>
                        <Text style={[styles.priceText, { fontSize: 14 }]}>Listed: ${this.state.propertyPrice}</Text>
                    </View>

                    <View style={styles.iconContainer}>
                        <View style={styles.imageGap}>
                            <Image source={bed} style={styles.image} />
                            <Text style={styles.textCenter}>{this.state.propertyBedroom}</Text>
                        </View>
                        <View style={styles.imageGap}>
                            <Image source={bathtub} style={styles.image} />
                            <Text style={styles.textCenter}>{this.state.peropertyBathroom}</Text>
                        </View>
                        <View style={styles.imageGap}>
                            <Image source={garage} style={styles.image} />
                            <Text style={styles.textCenter}>{this.state.propertyGarage}</Text>
                        </View>

                        <TouchableOpacity style={styles.appoinmentBtn} onPress={() =>  this.props.navigation.navigate('BookAppoinment', { id: this.state.dupItemArray.id, address: this.state.propertyAddress }) }>
                            <Text style={{ color: '#fff', fontSize: actuatedNormalize(13) }}>Book An Appoinment</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menuContainer}>
                        {this.renderMenu()}
                    </View>

                    <View style={styles.overViewHeaderRow}>

                        <View style={[styles.overViewHeaderTextRow]}>
                            <Text style={styles.overViewHeaderText} adjustsFontSizeToFit={true} numberOfLines={2} >Time On Homula</Text>
                            <Text
                                style={[
                                    styles.overViewHeaderText,
                                    { fontWeight: 'bold', marginLeft: 5 },
                                ]} adjustsFontSizeToFit={true} numberOfLines={2} >
                                {this.state.propertytimeonHomula} Days
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row' }} >
                            <View style={[styles.overViewHeaderTextRow,]}>
                                <Text style={styles.overViewHeaderText}>Views</Text>
                                <Text
                                    style={[
                                        styles.overViewHeaderText,
                                        { fontWeight: 'bold', marginLeft: 5, textAlign: 'center' },
                                    ]} adjustsFontSizeToFit={true} numberOfLines={2} >
                                    {this.state.propertyViewCount}
                                </Text>
                            </View>

                            <View style={[styles.overViewHeaderTextRow, { marginLeft: 10 }]}>
                                <Text style={styles.overViewHeaderText}>Saves</Text>
                                <Text
                                    style={[
                                        styles.overViewHeaderText,
                                        { fontWeight: 'bold', marginLeft: 5 },
                                    ]}>
                                    {this.state.propertySavedCount}
                                </Text>
                            </View>
                        </View>

                    </View>

                    <View style={styles.mapView}>
                        <View style={styles.mapContent}>
                            {
                                (this.state.originLocation.length == 2 && !isNaN(this.state.originLocation[0]) ) &&
                                <Mapview
                                    originLocation={this.state.originLocation}
                                    satelliteIsOn={false}
                                    shapeSourceList={this.state.shapeSourceList}                                    
                                    zoomLevel={(Platform.OS === 'ios') ? 14 : 15}
                                />
                             }

                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>

                        <OverViewComponent onLayout={(event) => this.overViewLayout = event.nativeEvent.layout} overViewExpand={this.state.overViewExpand} onPress={() => this.setState({ overViewExpand: !this.state.overViewExpand })} overViewData={this.state.overViewData} />

                        <FactsAndFeaturesComponent onLayout={(event) => this.factAndFeaturesLayout = event.nativeEvent.layout} factAndFeaturesExpand={this.state.factAndFeaturesExpand} onPress={() => this.setState({ factAndFeaturesExpand: !this.state.factAndFeaturesExpand })} factAndFeatureData={this.state.factAndFeatureData} />

                        {
                            (this.state.mortgageData.homePrice > 0) &&
                            <MortgageCalculatorComponent onLayout={(event) => this.mortgageCalcLayout = event.nativeEvent.layout} mortgageCalculatorExpand={this.state.mortgageCalculatorExpand}
                                onPress={() => this.setState({ mortgageCalculatorExpand: !this.state.mortgageCalculatorExpand })} mortgageData={this.state.mortgageData} />
                        }


                        <SchoolInfoComponent onLayout={(event) => this.schoolInfoLayout = event.nativeEvent.layout} schoolInfoExpand={this.state.schoolInfoExpand} onPress={() => this.setState({ schoolInfoExpand: !this.state.schoolInfoExpand })} />

                    </View>

                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff'
    },
    imageBackgroundView: {
        //width: wp('100%'),
    },
    topViewButtons: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        ...Platform.select({
            ios: {
                top: getStatusBarHeight()
            }
        })
    },
    backButtonView: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.50)'
    },
    backButtonImage: {
        width: wp('7%'),
        height: wp('7%'),
    },
    shareButtonView: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.50)'
    },
    shareButtonImage: {
        width: wp('7%'),
        height: wp('7%'),
    },
    content: {
        flex: 1,
        paddingHorizontal: wp('3%'),
        marginBottom: 10
    },
    startIconContainer: {
        position: 'absolute',
        right: wp('8%'),
        top: -35,
        width: wp('15%'),
        height: wp('15%'),
        borderRadius: wp('15%') / 2,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
        zIndex: 1,

    },
    addresssView: {
        marginTop: hp('1.8%'),
        padding: 4,
    },
    addressText: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        color: colors.mainBlue,
    },
    priceView: {
        padding: 4,
        marginTop: 10,
    },
    priceText: {
        color: colors.mainBlue,
        fontWeight: 'bold'
    },
    iconContainer: {
        flexDirection: 'row',
        marginTop: 6,
        paddingVertical: 10,
        paddingHorizontal: 4,
        borderTopColor: colors.grey,
        borderTopWidth: 1,
        borderBottomColor: colors.grey,
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems:'center'
    },
    image: {
        width: 35,
        height: 35
    },
    imageGap: {
        marginRight: 18
    },
    appoinmentBtn: {
        height: 40,
        backgroundColor: colors.mainBlue,
        paddingHorizontal: 9,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent:'center'
    },
    textCenter: {
        textAlign: 'center'
    },
    menuContainer: {
        padding: 4,
        // backgroundColor: 'red',
        marginTop: 10,
    },
    passiveMenuItem: {
        borderBottomWidth: 1,
        borderBottomColor: colors.borderGrey,
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    activeMenuItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    activeMenuText: {
        color: '#000'
    },
    passiveMenuText: {
        color: colors.grey
    },
    mapView: {
        height: hp('30%'),
        backgroundColor: 'pink'
    },
    mapContent: {
        flex: 1
    },
    overViewHeaderRow: {
        paddingBottom: 15,
        marginVertical: 5
    },
    overViewHeaderTextRow: {
        flexDirection: 'row',
    },
    overViewHeaderText: {
        fontSize: 14,
    },
    
})