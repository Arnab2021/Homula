import React, { Component } from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {
    Platform,
    StyleSheet
} from 'react-native'
import colors from '../colors';

export default class ShapeSource extends React.Component {

    constructor(props) {
        super(props);
    }

    GoPressed(param) {
        const { navigation } = this.props;      
        navigation.navigate('PropertyDetails', param)
    }
  

    render() {
        const { dataSourceSave, onPressToShowSchool } = this.props;
        
        const colorCode = dataSourceSave.features[0].properties.colorCode
        const shouldRedirect = dataSourceSave.features[0].properties.shouldRedirect
      
        //console.log(dataSourceSave);
        let marker = {
            iconOptional: true,
            textIgnorePlacement: true,
            textField: '{itemLabel}',
            textSize: 18,
            textMaxWidth: 15,
            textLetterSpacing: 0.19,
            textColor: colors.mainBlue,
            textAnchor: 'center',
            textTranslate:  (shouldRedirect == false)? [0, -40] : [0,-18],  // if true, from property details screen
            textHaloColor: '#fff',
            textHaloWidth: 5,
            textAllowOverlap: false,
                       
        }

        return (
            <MapboxGL.ShapeSource
                id="shapesourcebox"
                hitbox={{ width: 20, height: 20 }}
                onPress={(e) => {
                  
                    let param = {
                        type: e.features[0].properties.itemType,
                        id: e.features[0].properties.itemId,
                        showingSoldData: e.features[0].properties.showingSoldData
                    }

                    if( e.features[0].properties.shouldRedirect === false && e.features[0].properties.schoolName != undefined ){
                        console.log(e.features[0].properties.schoolName);
                        onPressToShowSchool(e.features[0].properties.schoolName)
                        return
                    }

                    if( e.features[0].properties.shouldRedirect === false ){
                        return
                    }
                    this.GoPressed(param)
                }}
                shape={dataSourceSave}
            >

                <MapboxGL.CircleLayer
                    id="pointCircles"
                    style={{ circleStrokeColor: '#fff', circleStrokeWidth: 3, circleRadius: 7, circleColor: colorCode }}
                    
                >
                </MapboxGL.CircleLayer>

                <MapboxGL.SymbolLayer
                    id="shapesourcesymbol"
                    //aboveLayerID="shapesourcebox"
                    style={marker}
                >
                </MapboxGL.SymbolLayer>

            </MapboxGL.ShapeSource>
        )
    }

}

const styles = StyleSheet.create({
    textHaloColor: {
        // textHaloColor: 'rgb(249, 250, 252)',
    }
})