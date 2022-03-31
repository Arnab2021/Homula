import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, PanResponder, Animated, Image, Alert, Platform } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo'
import { actuatedNormalize } from '../../services/actuatedNormalizeFont';

import { Header, SearchBarWithFilterBtn, PropertyBlock, SortByModal } from '../../components'
import { getAllProperties, userIsLogin, addOrRemoveFromWatched, searchProperty, getSoldProperties } from '../../operations/homeScreenOperations/homeScreenOperations';
import colors from '../../colors'
import { showErrorAlertMessage } from '../../services/ShowAlertMessages';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';

const loadermoreloader = require('../../images/loader.gif')



export default class HomeScreen extends PureComponent {

    constructor(props) {
        super(props);

        const isPortrait = () => {
            const dim = Dimensions.get('screen');
            return dim.height >= dim.width;
        };
        this.state = {           
            orientation: isPortrait() ? 'portrait' : 'landscape',
            loader: false,
            loadeMoreLoader: true,
            propertyLists: [],
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
            totalPropertyFound: 'No',
            offset: 0,
            isLogin: false,
            searchingPlaceName: "",
            searchingPropertyType: '',
            isOpenSortByModal: false,
            selectedSortValue: '',
            isFiltered: false,
            noDataFound: false,
            showingSoldData: false,

            sliderImageWidth: Dimensions.get('screen').width
        };
        Dimensions.addEventListener('change', () => {
            this.setState({
                orientation: isPortrait() ? 'portrait' : 'landscape',
                sliderImageWidth: Dimensions.get('screen').width
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
            await this._getAllProperties()
    
            this.willFocusSubscription = this.props.navigation.addListener(
                'focus',
                async () => {
    
                    if (this.props.route.params !== undefined && this.props.route.params.searchingPlace != undefined) {
                        console.log('here searching');
                        this.setState({
                            searchingPlaceName: this.props.route.params.searchingPlace,
                            propertyLists: [],
                            totalPropertyFound: 'No',
                            offset: 0,
                            isFiltered: true,
                            noDataFound: false
    
                        }, async () => await this._searchProperty())
                        this.props.navigation.setParams({ searchingPlace: null })
                    }
    
                    if (this.props.route.params !== undefined && this.props.route.params.filterData == 1) {
                        console.log('here all');
                        this.setState({
                            basicParam: this.props.route.params.filterParam,
                            isFiltered: true,
                            offset: 0,
                            totalPropertyFound: 'No',
                            propertyLists: [],
                            searchingPlaceName: '',
                            noDataFound: false
                        }, async () => await this._getAllProperties())
                        this.props.navigation.setParams({ filterData: null })
                    }
    
                }
            );
        } catch (error) {
            showErrorAlertMessage('Alert!','componentDidMount home error => '+error)
        }
       
    }

    async _getAllProperties() {

        const { propertyLists, loadeMoreLoader } = this.state

        const param = {
            ...this.state.basicParam,
            isLogin: (this.state.isLogin) ? 1 : 0,
            dataLimit: this.state.offset,
        }

        console.log('param', param);

        //if(!loadeMoreLoader)
        //this.setState({ loader: true })
        //else
        this.setState({ loadeMoreLoader: true })

        const response = await getAllProperties(param)
        this.setState({ loader: false, loadeMoreLoader: false })

        if (response !== false) {
            this.setState({
                propertyLists: [...propertyLists, ...response.propertydata],
                totalPropertyFound: response.total_property,
                noDataFound: false,
                showingSoldData: false,
            })
        } else {
            this.setState({ noDataFound: true, showingSoldData: false, })
        }
    }

    applySorting() {
        const { basicParam, selectedSortValue, isFiltered, searchingPlaceName } = this.state
        const copyOfParam = basicParam

        copyOfParam.sort = selectedSortValue

        if (isFiltered && searchingPlaceName != '') {
            this.setState({
                //basicParam: copyOfParam,
                propertyLists: [],
                totalPropertyFound: 'No',

            }, async () => await this._searchProperty())
        }
        else if (this.state.showingSoldData) {
            this.setState({
                propertyLists: [],
                totalPropertyFound: 'No',
            }, async () => await this._getSoldData())
        }
        else {
            this.setState({
                basicParam: copyOfParam,
                propertyLists: [],
                totalPropertyFound: 'No',

            }, async () => await this._getAllProperties())
        }


    }

    async _searchProperty() {

        const { searchingPlaceName, selectedSortValue, isLogin, offset, searchingPropertyType, propertyLists, loadeMoreLoader } = this.state
        const param = {
            type: searchingPropertyType,
            keyword: searchingPlaceName,
            sort: selectedSortValue,
            isLogin: (isLogin) ? 1 : 0,
            dataLimit: offset
        };
        console.log(param);

        this.setState({ loadeMoreLoader: true })
        const response = await searchProperty(param)
        this.setState({ loader: false, loadeMoreLoader: false })

        if (response !== false) {
            this.setState({
                propertyLists: [...propertyLists, ...response.propertydata],
                totalPropertyFound: response.total_property,
                searchingPropertyType: response.searchingPropertyType,
                noDataFound: false,
                showingSoldData: false,
            })
        } else {
            this.setState({ noDataFound: true, showingSoldData: false, })
        }
    }


    async operationSold(){
        if (this.state.isLogin == false) {
            Alert.alert(
                "Homula Says",
                "You are not registered and do not have access!",
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
        if (this.state.showingSoldData === false) {
            this.setState({
                showingSoldData: true,
                offset: 0,
                totalPropertyFound: 'No',
                propertyLists: [],
                searchingPropertyType:''
            }, async () => await this._getSoldData())
        }else{
            this.clearFilter()
        }
    }

    async _getSoldData() {
        const { selectedSortValue, searchingPropertyType, isLogin, offset, propertyLists } = this.state

        const param = {
            isLogin: (isLogin) ? 1 : 0,
            dataLimit: offset,
            type: searchingPropertyType,
            sort: selectedSortValue
        }

        console.log(param);
        this.setState({ loadeMoreLoader: true })
        const response = await getSoldProperties(param)
        this.setState({ loader: false, loadeMoreLoader: false })

        //console.log(response);
        if (response !== false) {
            this.setState({
                propertyLists: [...propertyLists, ...response.propertydata],
                totalPropertyFound: response.total_property,
                searchingPropertyType: response.searchingPropertyType,
                noDataFound: false,
                //isFiltered: true
            })
        } else {
            this.setState({ noDataFound: true, showingSoldData: false, })
        }

    }

    clearFilter() {
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
            searchingPlaceName: '',
            totalPropertyFound: 'No',
            propertyLists: [],
            loadeMoreLoader: true,
            noDataFound: false,
            showingSoldData: false,
            searchingPropertyType:''
        }, async () => await this._getAllProperties())

    }

    _renderProperties = ({ item, index }) => {

        return (
            <PropertyBlock
                item={item}
                navigation={this.props.navigation}
                fromScreen="Home"
                sliderImageWidth={this.state.sliderImageWidth}
                addOrRemoveFromWatched={() => this._updatePropertyData(item, index)}
                onPressItem={() => this._navigateTotPropertyDetails(item)}
            />
        )
    }

    _navigateTotPropertyDetails(item) {
        const { showingSoldData } = this.state
        const param = {
            type: item.type,
            id: item.id,
            showingSoldData: showingSoldData
        }

        this.props.navigation.navigate('PropertyDetails', param)
    }

    _updatePropertyData = (item, index) => {
        
        if (!this.state.isLogin) {
            showErrorAlertMessage('Denied!', 'You need to login to save property in Watchlist.')
            return
        }

        const { propertyLists } = this.state;
        const updatedData = propertyLists.slice();
        updatedData[index].watched = !updatedData[index].watched;

        addOrRemoveFromWatched(item, updatedData[index].watched)

        this.setState({
            propertyLists: updatedData,
        });
    }

    loadMore = async () => {
        const { offset, isFiltered, searchingPlaceName, showingSoldData } = this.state

        this.setState({ loadeMoreLoader: true })
        //return
        if (isFiltered && searchingPlaceName != '') {
            this.setState({
                offset: offset + 10
            }, async () => await this._searchProperty())
        }
        else if (showingSoldData) {
            this.setState({
                offset: offset + 10
            }, async () => await this._getSoldData())
        }
        else {
            this.setState({
                offset: offset + 10
            }, async () => await this._getAllProperties())
        }
    }

    renderFooterBtn() {
        const { loadeMoreLoader, noDataFound } = this.state

        if (noDataFound) {
            return (
                <View style={{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Entypo name="emoji-sad" style={{ fontSize: 25 }} />
                    <Text>No Data...</Text>
                </View>
            )
        }
        if (loadeMoreLoader) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={loadermoreloader}
                        style={{ width: 50, height: 50 }}
                    />
                </View>
            )
        }
        if (!loadeMoreLoader) {
            return (
                <TouchableOpacity style={styles.loadMoreBtn} onPress={() => this.loadMore()}>
                    <Text style={{ color: '#fff', textAlign: 'center' }} >Load More</Text>
                </TouchableOpacity>
            )
        }
    }


    _navigateToSearch = () => {
        this.props.navigation.navigate('SearchScreenFromHomeAndMap',
            { searchingFromScreen: 'HomeScreen', searchingPlaceName: this.state.searchingPlaceName })
    }

    _navigateToFilter = () => {
        this.props.navigation.navigate('Filter', { searchingFromScreen: 'HomeScreen' })
    }

    render() {
        const { orientation, showingSoldData } = this.state

        const headerContent = (
            <SearchBarWithFilterBtn searchingPlaceName={this.state.searchingPlaceName} onPressSearch={() => this._navigateToSearch()} onPressFilter={() => this._navigateToFilter()} />
        )
        return (
            <View style={[styles.container, { paddingLeft: (orientation == 'landscape' && Platform.OS === 'ios') ? getStatusBarHeight() : null }]}>

                <Header headerContent={headerContent} navigation={this.props.navigation} />

                <View style={[styles.propertyCountContainer, (orientation == 'landscape') && { marginVertical: 4 }]}>

                    <View style={[styles.row]}>
                        <View style={[styles.halfColumn, styles.soldBtnContainer]}>
                            <TouchableOpacity style={[styles.soldBtn]} onPress={() => {
                               this.operationSold()
                            }}  >
                                <Text style={{ color: '#fff', fontSize: 13 }} adjustsFontSizeToFit numberOfLines={1}>{(showingSoldData === true) ? 'Cancel' : 'Sold'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.halfColumn, styles.btnViewContainer,]}>
                            {
                                (this.state.isFiltered) &&
                                <TouchableOpacity onPress={() => this.clearFilter()} >
                                    <Text style={{ color: colors.mainBlue, fontWeight: 'bold', fontSize: actuatedNormalize(15) }} adjustsFontSizeToFit={true} numberOfLines={1}>Clear filter</Text>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={styles.sortByBtn} onPress={() => this.setState({ isOpenSortByModal: true })}>
                                <Text style={{ color: '#fff', fontSize: actuatedNormalize(14), textAlign: 'center' }} adjustsFontSizeToFit={true} numberOfLines={1}>Sort By</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.propertyCountTextView]}>
                        <Text style={{ fontSize: actuatedNormalize(13) }} adjustsFontSizeToFit={true} numberOfLines={2} >{this.state.totalPropertyFound} Proprety found.</Text>
                    </View>
                </View>

                <View style={styles.content} >
                    <FlatList
                        removeClippedSubviews
                        data={this.state.propertyLists}
                        renderItem={this._renderProperties}
                        ListFooterComponent={
                            this.renderFooterBtn.bind(this)
                        }
                        refreshing={this.state.loader}
                        onRefresh={async () => { await this.clearFilter() }}
                        keyExtractor={(item, index) => index}

                    />

                    <SortByModal
                        isVisible={this.state.isOpenSortByModal}
                        closeModal={() => { this.setState({ isOpenSortByModal: false }) }}
                        selectAndCloseSortByModal={(value) => {
                            this.setState({
                                selectedSortValue: value,
                                isOpenSortByModal: false
                            }, () => this.applySorting())
                        }}
                        selectedSortValue={this.state.selectedSortValue} />

                </View>

            </View >
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    propertyCountContainer: {
        marginVertical: 4,
        //width: wp('100%'),
        //backgroundColor:'pink'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    halfColumn: {
        flex: 0.5
        //width: wp('50%'),
        //backgroundColor: 'red'
    },
    propertyCountTextView: {
        paddingTop: 8,
        paddingLeft: 10,
        //backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnViewContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        //backgroundColor:'green',
        //paddingRight: 8
    },
    sortByBtn: {
        backgroundColor: colors.mainBlue,
        padding: 5,
        alignItems: 'center',
        width: actuatedNormalize(60),
        marginLeft: wp('4%'),
        marginRight: 10,
        elevation: 9,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
    },
    content: {
        flex: 1,
        //backgroundColor:'pink'
    },
    loadMoreBtn: {
        backgroundColor: 'rgba(19, 58, 122, 0.95)',
        padding: 10,
        marginHorizontal: wp('25%'),
        marginVertical: 15,
        elevation: 9,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
    },
    soldBtnContainer: {
        //backgroundColor:'pink'
    },
    soldBtn: {
        width: actuatedNormalize(60),
        padding: 5,
        marginLeft: 10,
        backgroundColor: '#EC3838',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 9,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
    }
})