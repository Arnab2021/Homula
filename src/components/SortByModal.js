import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Platform } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import {
    ifIphoneX,
    getBottomSpace,
    getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import colors from '../colors';
import { Checkbox } from '../components'

export default class SortByModal extends Component {
    constructor(props) {
        super(props);
        const isPortrait = () => {
            const dim = Dimensions.get('screen');
            return dim.height >= dim.width;
        };
        this.state = {
            orientation: isPortrait() ? 'portrait' : 'landscape',
            sortByContent: [
                {
                    id: 1,
                    title: 'Newest First',
                    value: 'newest'
                },
                {
                    id: 2,
                    title: 'Oldest First',
                    value: 'oldest'
                },
                {
                    id: 3,
                    title: 'Featured',
                    value: 'featured'
                },
                {
                    id: 4,
                    title: 'Only Near Me',
                    value: 'near_me'
                },
                {
                    id: 5,
                    title: 'Price Low to High',
                    value: 'price_low'
                },
                {
                    id: 5,
                    title: 'Price High to Low',
                    value: 'price_high'
                }
            ],
        };
        Dimensions.addEventListener('change', () => {
            this.setState({
                orientation: isPortrait() ? 'portrait' : 'landscape'
            });
        });
    }

    renderItem = ({ item, index }) => {
        const { selectedSortValue, selectAndCloseSortByModal } = this.props
        if (item.value == selectedSortValue) {
            return (
                <TouchableOpacity style={styles.item} onPress={() => selectAndCloseSortByModal(selectedSortValue)} >
                    <Text style={styles.itemText}>{item.title}</Text>
                    <Checkbox
                        style={styles.checkbox}
                        checkedText={styles.checkedText}
                        value={true}
                    />
                </TouchableOpacity>
            )
        }
        return (
            <TouchableOpacity style={styles.item} onPress={() => selectAndCloseSortByModal(item.value)} >
                <Text style={styles.itemText}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const { orientation } = this.state
        const { isVisible, selectAndCloseSortByModal, selectedSortValue, closeModal } = this.props
        return (
            <View style={{ flex: 1 }}>
                <Modal isVisible={isVisible}
                    style={styles.modalView}
                    propagateSwipe
                    supportedOrientations={['portrait', 'landscape']}
                    hasBackdrop
                    onBackdropPress={closeModal}
                    useNativeDriverForBackdrop={false}
                    animationIn="slideInUp"
                    animationInTiming={500}
                    animationOut="fadeOutDown"
                    animationOutTiming={500}
                    backdropTransitionOutTiming={10}
                    backdropTransitionInTiming={300}
                >

                    <View style={styles.content}>
                        <View style={[styles.headerView, (orientation == 'landscape')&& styles.landscapeIOSPadding ]}>
                            <Text style={{ fontSize: wp('5%'), fontWeight: 'bold', color: colors.mainBlue }}>Sort By</Text>
                            <TouchableOpacity style={{ padding: 5 }} onPress={closeModal}>
                                <Entypo
                                    name="cross"
                                    size={wp('8%')}
                                    color={colors.mainBlue}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[(orientation == 'landscape') && styles.landscapeIOSPadding, { height: 200 }]}>
                            <FlatList
                                data={this.state.sortByContent}
                                keyExtractor={(item, index) => index}
                                renderItem={this.renderItem}
                                contentContainerStyle={{ flexGrow: 1 }}
                            />
                        </View>
                    </View>

                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modalView: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        backgroundColor: 'white',
        padding: 10,
        //paddingTop: 50,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    headerView: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionsContainer: {
        //  height: 200     
    },
    landscapeIOSPadding: {
        ...Platform.select({
            ios: {
                paddingHorizontal: getStatusBarHeight()
            }
        })
    },
    item: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: colors.softGrey,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});