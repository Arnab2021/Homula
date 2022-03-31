import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from '../../colors';
import { ModalDropDown, SingleSlider, MortgageSingleSlider } from '../../components'

export default class MortgageCalculatorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homePrice: 0,
            downpaymentValue: 0,
            downpaymentInterest: 20,
            sliderValue: 20,
            lengthOfLoan: {
                data: ['10 Years', '15 Years', '20 Years', '25 Years', '30 Years'],
                activeIndex: 3,
            },
            interestRate: 2,
            mortgagePaymentAmount: 0
        };
    }

    componentDidMount() {
        const { downpaymentInterest } = this.state
        const { mortgageData } = this.props
        const downpaymentvalue = ((parseInt(mortgageData.homePrice) * downpaymentInterest) / 100)

        this.setState({
            homePrice: mortgageData.homePrice,
            downpaymentValue: parseInt(downpaymentvalue)
        }, () => this.calculateMortgagePayment())

    }

    priceFormat(price) {
        const amount = (price && price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
        return amount
    }

    calculateMortgagePayment = () => {
        const { homePrice, downpaymentValue, downpaymentInterest, sliderValue, lengthOfLoan, interestRate } = this.state;

        if (isNaN(parseInt(interestRate))) {
            return 0;
        }

        let selectedlengthOfLoan = null;

        if (lengthOfLoan.activeIndex === 0) {
            selectedlengthOfLoan = 10;
        } else if (lengthOfLoan.activeIndex === 1) {
            selectedlengthOfLoan = 15;
        } else if (lengthOfLoan.activeIndex === 2) {
            selectedlengthOfLoan = 20;
        } else if (lengthOfLoan.activeIndex === 3) {
            selectedlengthOfLoan = 25;
        } else {
            selectedlengthOfLoan = 30;
        }
        const P = homePrice - downpaymentValue;
        const r = parseInt(interestRate) / 100 / 12;
        const n = selectedlengthOfLoan * 12;

        const mortgatePayment =
            P * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

        //console.log('mortgatePayment',mortgatePayment);
        //return mortgatePayment.toFixed(1);
        this.setState({
            mortgagePaymentAmount: mortgatePayment.toFixed(1)
        })
    };

    calculateDownpaymentInterest(value) {

        if (value == '') { value = 0 }
        const { homePrice } = this.state
        const downpaymentvalue = parseInt(value)

        //console.log('homePrice', homePrice);
        //console.log('downpaymentvalue', downpaymentvalue);

        if (downpaymentvalue > parseInt(homePrice)) {
            Alert.alert('Not valid!', 'Downpayment value cannot be larger than home price.')
            return
        }

        const downpaymentInterest = (downpaymentvalue / homePrice) * 100

        this.setState({
            downpaymentInterest: parseFloat(downpaymentInterest).toFixed(2),
            downpaymentValue: value,
            sliderValue: parseInt(downpaymentInterest)
        }, () => this.calculateMortgagePayment())

    }

    calculateDownpaymentValue(value) {
        const { homePrice } = this.state
        const downpaymentValue = (homePrice * value) / 100

        this.setState({
            sliderValue: value,
            downpaymentInterest: value,
            downpaymentValue: parseInt(downpaymentValue)
        }, () => this.calculateMortgagePayment())
    }


    render() {
        const {
            homePrice,
            downpaymentValue,
            downpaymentInterest,
            sliderValue,
            lengthOfLoan,
            interestRate,
            mortgagePaymentAmount
        } = this.state;
        const { onLayout, mortgageCalculatorExpand, onPress } = this.props


        return (
            <View onLayout={(event) => onLayout(event)}>
                <TouchableOpacity
                    style={styles.expandItem}
                    onPress={onPress}>
                    <Text style={styles.expandText}>Mortgage Calculator</Text>
                    <Ionicons
                        name={mortgageCalculatorExpand ? 'chevron-down' : 'chevron-back'}
                        style={styles.chevronIcon}
                    />
                </TouchableOpacity>
                {mortgageCalculatorExpand ? (
                    <View style={{ marginTop: 10 }}>
                        <View style={styles.mortgageItem}>
                            <Text style={[styles.mortgageText, { fontWeight: 'bold' }]}>
                                Home Price
                            </Text>
                            <View style={styles.mortgageInputRow}>
                                <Text style={styles.moneyText}>$</Text>
                                <TextInput
                                    style={styles.mortageInput}
                                    value={(homePrice.toString())}
                                    onChangeText={(text) => {
                                        this.setState({
                                            homePrice: text
                                        }, () => this.calculateMortgagePayment())
                                    }}
                                    editable={true}
                                />
                            </View>
                        </View>
                        <View style={styles.mortgageItem}>
                            <Text style={[styles.mortgageText, { fontWeight: 'bold' }]}>
                                Down Payment
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styles.mortgageInputRow, { flex: 0.7 }]}>
                                    <Text style={styles.moneyText}>$</Text>
                                    <TextInput
                                        value={(downpaymentValue != 0) ? downpaymentValue.toString() : ''}
                                        editable={true}
                                        keyboardType="number-pad"
                                        onChangeText={(text) => this.calculateDownpaymentInterest(text)}
                                        style={styles.mortageInput}
                                    />
                                </View>
                                <View style={[styles.mortgageInputRow, { flex: 0.3 }]}>
                                    <TextInput
                                        style={styles.mortageInput}
                                        value={downpaymentInterest.toString()}
                                        editable={false}
                                    />
                                    <Text style={styles.moneyText}>%</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.mortgageItem, { alignItems: 'center' }]}>
                            {/*<SingleSlider
                                sliderValue={sliderValue}
                                min={0}
                                max={100}
                                onValuesChange={(value) => this.calculateDownpaymentValue(value)}
                                sliderLength={wp('90%')}
                            />*/}
                            <MortgageSingleSlider
                                min={0}
                                sliderValue={sliderValue}
                                max={100}
                                sliderLength={wp('90%')}
                                onValueChange={(value) => this.calculateDownpaymentValue(value)}
                            />
                        </View>
                        <View style={styles.mortgageItem}>
                            <Text style={[styles.mortgageText, { fontWeight: 'bold' }]}>
                                Length of Ioan
                            </Text>
                            <ModalDropDown
                                items={lengthOfLoan.data}
                                textStyle={{ fontSize: 14, textAlign: 'center', flex: 1 }}
                                style={styles.dropDownMainStyle}
                                dropdownStyle={styles.dropdownStyle}
                                dropdownTextStyle={styles.dropdownTextStyle}
                                selectedItem={lengthOfLoan.data[lengthOfLoan.activeIndex]}
                                onSelect={(index, value) => {
                                    const copyOfIron = { ...lengthOfLoan };
                                    copyOfIron.activeIndex = index;
                                    this.setState({
                                        lengthOfLoan: copyOfIron,
                                    }, () => this.calculateMortgagePayment());
                                }}
                            />
                        </View>
                        <View style={styles.mortgageItem}>
                            <Text style={[styles.mortgageText, { fontWeight: 'bold' }]}>
                                Interest Rate
                            </Text>
                            <View style={styles.mortgageInputRow}>
                                <TextInput
                                    style={styles.mortageInput}
                                    value={interestRate.toString()}
                                    keyboardType="number-pad"
                                    onChangeText={(text) => {
                                        if (parseInt(text) > 100) {
                                            this.setState({
                                                interestRate: 100,
                                            }, () => this.calculateMortgagePayment());
                                        } else {
                                            this.setState({
                                                interestRate: text,
                                            }, () => this.calculateMortgagePayment());
                                        }
                                    }}
                                    maxLength={3}
                                />
                                <Text style={styles.moneyText}>%</Text>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.mortgageItem,
                                {
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    //marginLeft: wp('10%'),
                                    //marginRight: wp('10%'),
                                },
                            ]}>
                            <Text style={[styles.mortgageText, { fontWeight: 'bold' }]}>
                                Mortgage Payment
                            </Text>
                            <Text
                                style={[
                                    styles.mortgageText,
                                    { fontWeight: 'bold', color: colors.mainBlue },
                                ]}>
                                $ {mortgagePaymentAmount}
                            </Text>
                        </View>
                    </View>
                ) : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({

    expandItem: {
        backgroundColor: colors.expandItemBackground,
        justifyContent: 'space-between',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    expandText: {
        fontWeight: 'bold',
        fontSize: wp('4.5%')
    },
    mortgageItem: {
        marginTop: 15,
    },
    mortgageText: {
        fontSize: 14,
    },
    mortageInput: {
        flex: 1,
        fontSize: 14,
        paddingLeft: 10,
        color: colors.black,
        paddingVertical: 0,
    },
    mortgageInputRow: {
        flexDirection: 'row',
        borderWidth: 0.3,
        borderColor: colors.grey,
        marginTop: 10,
        height: hp('6%'),
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
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
        marginTop: 10,
    },
    dropdownStyle: {
        width: wp('90%'),
        marginTop: hp('2%'),
        padding: 5,
    },
    dropdownTextStyle: {
        fontWeight: 'bold',
        fontSize: 12
    }
})