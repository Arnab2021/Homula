import React from "react";
import { PermissionsAndroid,Linking,Alert } from "react-native"
import Geolocation from 'react-native-geolocation-service';
import appConfig from '../../app.json'

class LocationServices {
    static async openSetting() {
        Linking.openSettings().catch(() => {
            Alert.alert('Unable to open settings');
        });
    };
    static async hasPermissionIOS() {
       
        const status = await Geolocation.requestAuthorization('whenInUse');

        if (status === 'granted') {
            return true;
        }

        if (status === 'denied') {
            Alert.alert('Location permission denied');
        }

        if (status === 'disabled') {
            Alert.alert(
                `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
                '',
                [
                    { text: 'Go to Settings', onPress: LocationServices.openSetting() },
                    { text: "Don't Use Location", onPress: () => { } },
                ],
            );
        }

        return false;
    };

    static async CheckAndroidLocationPermission() {
        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

            if (granted) {
                //console.log("You can use the ACCESS_FINE_LOCATION")
                return true
            }
            else {
                console.log("ACCESS_FINE_LOCATION permission denied")
                await LocationServices.requestAndroidLocationPermission()
                return true
            }

        } catch (err) {
            return false
        }
    }

    static async requestAndroidLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This App needs access to your location ' +
                        'so we can know where you are.',
                    buttonPositive: "OK"
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use locations ")
            } else {
                console.log("Location permission denied")
                await LocationServices.requestAndroidLocationPermission()
            }
        } catch (err) {
            console.warn(err)
        }
    }

}


export default LocationServices