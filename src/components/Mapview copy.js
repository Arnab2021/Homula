import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
import { ShapeSource } from './'

Logger.setLogCallback(log => {
    if (
        log.level == 'warning'
    ) {
        return true;
    }
    return false;
});

MapboxGL.setAccessToken(
    'pk.eyJ1IjoicmVkYm9uZSIsImEiOiJja2ViZnI4cTAwN3UxMnJydjEwZTMzM3E2In0.ZzpdGXLpEPIZVNxKAwgZPA',
);


export default class Mapview extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    setCameraZoom() {
        const { originLocation, max_distance_coords, zoomLevel, applyFitBoundOnMAP, fitBoundCoords } = this.props
        
        //console.log('zoomLevel',zoomLevel);
        if(applyFitBoundOnMAP){
            this.camera.fitBounds(fitBoundCoords[0], fitBoundCoords[1], [90, 50, 50, 50], 3000)
            return
        }

        this.camera.setCamera({
            centerCoordinate: originLocation,
            zoomLevel: zoomLevel,
            animationDuration: 2000,
        })
        return

        if (max_distance_coords.length != 2 && isNaN(max_distance_coords[0])) {
            this.camera.setCamera({
                centerCoordinate: originLocation,
                zoomLevel: zoomLevel,
                animationDuration: 2000,
            })
            return
        }

        const neBound = max_distance_coords
        const swBound = originLocation
        console.log('flying');
       // this.camera.flyTo(originLocation, 12000)
        this.camera.fitBounds(neBound, swBound, [90, 50, 50, 50], 3000) // ([lng, lat], [lng, lat], [top, right, bottom, left], 1000)
        return
        this.camera.setCamera({
            centerCoordinate: originLocation,
            zoomLevel: (Platform.OS === 'ios' ? 14 : 14),
            animationDuration: 2000,
        })

    }

    render() {
        const { originLocation, satelliteIsOn, shapeSourceList, navigation, max_distance_coords, setCameraToUserLocation, onRegionDidChange,zoomLevel } = this.props
        //console.log('originLocation',originLocation);
        if(setCameraToUserLocation){
            this.setCameraZoom()
        }

        if (originLocation.length != 2 || isNaN(originLocation[0])) {
            return (
                <View st>
                    <Text style={{ textAlign: 'center' }}>Location not available.</Text>
                </View>
            )
        }
        return (
            <MapboxGL.MapView
                key='mainmap'
                textureMode={true}
                style = {styles.map}
                showUserLocation = {true}
                centerCoordinate = {originLocation}
                styleURL = {
                    (satelliteIsOn === false) ?
                        MapboxGL.StyleURL.Street
                        :
                        MapboxGL.StyleURL.SatelliteStreet
                }
                onDidFinishRenderingMapFully = {() => this.setCameraZoom()}
                onRegionDidChange = {  (onRegionDidChange)? (e) => onRegionDidChange(e)  : console.log('onRegionDidChange') }
                regionDidChangeDebounceTime={1000}
            >
                <MapboxGL.Camera
                    ref={ref => this.camera = ref}
                    zoomLevel={zoomLevel}
                    animationMode='flyTo'
                    animationDuration={1}
                    centerCoordinate={originLocation}
                ></MapboxGL.Camera>
                <MapboxGL.UserLocation />

                {
                    (shapeSourceList.features.length > 0) ?
                        <ShapeSource dataSourceSave={shapeSourceList} navigation={navigation}  >                      
                        </ShapeSource>
                        :
                        null
                }


            </MapboxGL.MapView>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
})