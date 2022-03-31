import React, { Component } from 'react';
import { View, Slider } from 'react-native'
import colors from '../colors';


export default class MortgageSingleSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { sliderValue, min, max, onValueChange, sliderLength } = this.props
        return (

            <Slider
                style={{ width: sliderLength, height: 50 }}
                minimumValue={min}
                value={sliderValue}
                step={1}
                maximumValue={max}
                minimumTrackTintColor="#000"
                maximumTrackTintColor="#008ee6"
                thumbTintColor="#008ee6"
                onValueChange={onValueChange}
            />

        );
    }
}

{/*<MultiSlider
                values={[sliderValue]}
                min={min}
                max={max}
                
                sliderLength={sliderLength}
                trackStyle={{
                    height: 4,
                    borderRadius: 10
                }}
                selectedStyle={{
                    backgroundColor: colors.mainBlue
                }}
                unselectedStyle={{
                    backgroundColor: colors.borderGrey
                }}
                pressedMarkerStyle={{
                    height: 30,
                    width: 30,
                    borderWidth: 3,
                    borderColor: colors.mainBlue,
                    backgroundColor: colors.white,
                }}              
                markerStyle={{
                    top:2,
                    height: 22,
                    width: 22,
                    borderWidth: 3,
                    borderColor: colors.mainBlue,
                    backgroundColor: colors.mainBlue,

                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 7,
                    },
                    shadowOpacity: 0.41,
                    shadowRadius: 9.11,
                    elevation: 14,

                }}
                touchDimensions={{
                    height: 60,
                    width: 60,
                    borderRadius: 20,
                    slipDisplacement: 40,
                }}
                onValuesChange={(value) => onValuesChange(value)}
            />*/}