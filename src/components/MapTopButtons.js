import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../colors';


const school_border = require('../images/school-border.png')
const school = require('../images/school.png')

export default class MapTopButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            satelliteBtnActive: false,
            schoolBtnActive: false,
            soldBtnAcive: false,
            leaseBtnActive: false
        };
    }

    _onPressSatelliteBtn() {
        const { satelliteBtnActive } = this.state
        const { onPressSatelliteBtn } = this.props
        this.setState({
            satelliteBtnActive: !satelliteBtnActive
        })
        onPressSatelliteBtn(!satelliteBtnActive)
    }

    _onPressSchoolBtn() {
        const { schoolBtnActive } = this.state
        const { onPressSchoolBtn } = this.props
        this.setState({
            schoolBtnActive: !schoolBtnActive,
            soldBtnAcive: false,
            leaseBtnActive: false
        })
        onPressSchoolBtn(!schoolBtnActive)
    }

    _onPressSoldBtn(){
        const { soldBtnAcive,leaseBtnActive } = this.state
        const { onPressSoldBtn } = this.props

        if(!soldBtnAcive){
            if(leaseBtnActive){
                this.setState({
                    leaseBtnActive: false
                })
            }
        }
        this.setState({
            soldBtnAcive: !soldBtnAcive,
            schoolBtnActive: false
        })
        onPressSoldBtn(!soldBtnAcive)
    }

    _onPressLeaseBtn(){
        const { leaseBtnActive,soldBtnAcive } = this.state
        const { onPressLeaseBtn } = this.props

        if(!leaseBtnActive){
            if(soldBtnAcive){
                this.setState({
                    soldBtnAcive: false
                })
            }
        }
        this.setState({
            leaseBtnActive: !leaseBtnActive,
            schoolBtnActive: false
        })
        onPressLeaseBtn(!leaseBtnActive)
    }

    render() {
        const{isSoldBtnAcive,isLeaseBtnActive} = this.props
        
        return (
            <View style={styles.buttonsView}>

                <TouchableOpacity style={[styles.button, (this.state.satelliteBtnActive) && { backgroundColor: colors.mainBlue }]} onPress={() => this._onPressSatelliteBtn()} >
                    <FontAwesome5
                        name={(this.state.satelliteBtnActive) ? 'street-view' : "satellite"}
                        style={{ fontSize: wp('4%'), color: (this.state.satelliteBtnActive) ? '#fff' : '#000' }}
                    />
                    <Text style={[styles.btnText, (this.state.satelliteBtnActive) && styles.activeBtnTextColor]}> { (this.state.satelliteBtnActive)?'Street View': 'Satellite' } </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, (this.state.schoolBtnActive)&& {backgroundColor: '#C0A321'} ]} onPress={() => this._onPressSchoolBtn()}>
                    <Image
                        style={styles.buttonImage}
                        source={ (this.state.schoolBtnActive)? school: school_border}
                        resizeMode="contain"
                    />
                    <Text style={[styles.btnText, (this.state.schoolBtnActive)&&{color: '#fff'} ]}> School </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button,(this.state.soldBtnAcive && isSoldBtnAcive)&&{backgroundColor: '#ff0000'}]} onPress={()=> this._onPressSoldBtn()} >
                    <Text style={[styles.btnText,(this.state.soldBtnAcive  && isSoldBtnAcive) && styles.activeBtnTextColor ]}> Sold </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button,(this.state.leaseBtnActive && isLeaseBtnActive)&&{backgroundColor:'#AD8C07'}]} onPress={()=> this._onPressLeaseBtn()}>
                    <Text style={[styles.btnText,(this.state.leaseBtnActive  && isLeaseBtnActive) && styles.activeBtnTextColor]}> Lease </Text>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonsView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 6,
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
        fontSize: wp('4%'),
        color: colors.mainBlue,
        fontWeight: 'bold'
    },
    buttonImage: {
        width: 20,
        height: 20
    },
    activeBtnTextColor: {
        color: '#fff'
    },
})