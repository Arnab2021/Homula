import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { actuatedNormalize } from '../services/actuatedNormalizeFont'

const bathtub = require('../images/bathtub.png');
const bed = require('../images/bed.png');
const garage = require('../images/garage.png');

export default class PropertyBlock extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderImagesBlocks = ({ item, index }) => {
        //  console.log(item);
        const{onPressItem, sliderImageWidth} = this.props
        return (
            <TouchableOpacity style={[ styles.imageContainer, { width: sliderImageWidth }]} onPress={onPressItem}>
                <Image source={{ uri: `${item}` }} style={styles.image} />
            </TouchableOpacity>
        )
    }

    render() {
        const { item, index, navigation, fromScreen,addOrRemoveFromWatched, onPressItem } = this.props

        return (
            <View style={styles.container} key={index}>

                <View style={styles.imageSliderView}>
                    <FlatList
                        data={item.imgGallery}
                        keyExtractor={(item, index) => index}
                        renderItem={this.renderImagesBlocks}
                        horizontal={true}                        
                    />
                </View>

                <View style={styles.detailsContainer}>

                    <View style={styles.upRow}>
                        <View style={styles.priceAddressContainer}>
                            <View style={styles.priceView}>
                                <Text style={styles.amount} adjustsFontSizeToFit={true} numberOfLines={2} >{item.amount}</Text>
                                {/*<Text style={styles.amount} adjustsFontSizeToFit={true} numberOfLines={2} >{item.amount}</Text>*/}
                            </View>
                            <TouchableOpacity style={styles.addressView} onPress={onPressItem}>
                                <Text style={styles.address} adjustsFontSizeToFit={true} numberOfLines={2} >{item.address}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.startIconContainer}>
                            <TouchableOpacity style={styles.watchedBtn} onPress={addOrRemoveFromWatched}>
                                <AntDesign
                                    name={(item.watched) ? "star" : 'staro'}
                                    size={wp('8%')}
                                    color={colors.mainBlue}
                                />
                            </TouchableOpacity>
                            {
                                (item.watched) &&
                                <Text style={{ fontSize: wp('3%'), textAlign: 'center' }} adjustsFontSizeToFit={true} numberOfLines={2} >Remove From Watched</Text>
                            }
                        </View>
                    </View>

                    <View style={styles.downRow}>
                        <View style={styles.iconContainer}>
                            <View style={styles.iconRow}>
                                <View>
                                    <Image source={bed} style={styles.icon} />
                                    <Text style={styles.textCenter}>{item.bedrooms}</Text>
                                </View>
                                <View>
                                    <Image source={bathtub} style={styles.icon} />
                                    <Text style={styles.textCenter}>{item.bathroom}</Text>
                                </View>
                                <View>
                                    <Image source={garage} style={styles.icon} />
                                    <Text style={styles.textCenter}>{item.garage}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.appoinmentBtnContainer}>
                            <TouchableOpacity style={styles.appoinmentBtn} onPress={() => (fromScreen == "Home") ? navigation.navigate('BookAppoinment',{ id: item.id, address: item.address }) : navigation.navigate('ContactAgent', { id: item.id })}>
                                <Text style={{ color: '#fff', fontSize: actuatedNormalize(13) }}> {(fromScreen == "Home") ? 'Book An Appoinment' : 'Contact Agent'} </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //backgroundColor: 'red',
        marginVertical: 10
    },
    imageSliderView: {
        //backgroundColor: 'green'
    },
    imageContainer: {
        //flex:1,
       // width: width, // wp('100%'),
        height: hp('18%'),
        //backgroundColor:'red'
    },
    image: {
        flex: 1,
        //width: wp('100%'),
        //height: hp('18%'),
    },
    detailsContainer: {
        paddingHorizontal: 10,
        marginTop: 10,
    },
    upRow: {
        flexDirection: 'row',
        marginBottom: 5
    },
    downRow: {
        flexDirection: 'row'
    },
    priceAddressContainer: {
        flex: 0.65,
    },
    startIconContainer: {
        flex: 0.35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    priceView: {
        marginBottom: 3
    },
    amount: {
        fontSize: wp('4.5%'),
        color: colors.mainBlue,
        fontWeight: 'bold'
    },
    addressView: {
        fontSize: wp('4.5%'),
        color: colors.mainBlue,
        fontWeight: 'bold'
    },
    address: {
        fontSize: wp('4.5%'),
        color: colors.mainBlue,
        fontWeight: 'bold'
    },
    watchedBtn: {
        padding: 10,
    },
    iconContainer: {
        flex: 0.5,
    },
    appoinmentBtnContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    icon: {
        width: 30,
        height: 30
    },
    textCenter: {
        textAlign: 'center'
    },
    appoinmentBtn: {
        backgroundColor: colors.mainBlue,
        paddingHorizontal: 9,
        paddingVertical: 8
    }
})
