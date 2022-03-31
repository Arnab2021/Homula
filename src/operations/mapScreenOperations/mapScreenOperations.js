import callApi from '../../global/callApi'
import { getData, storeData } from '../../services/AsyncStorageServices'
import { showErrorAlertMessage } from '../../services/ShowAlertMessages'
import colors from '../../colors'
import axios from 'axios'

const userIsLogin = async () => {
    const userid = await getData('userid')
    if (userid != null) {
        return true
    }
    return false
}

const propertyNearMe = async (param) => {
    console.log('propertyNearMe', param);
    const response = await callApi('get_properties_near_me/', param);
    //console.log('propertyNearMe',response);

    //return
    if (response.status == 'Success') {

        if (response.status_message === 'No properties found!') {
            // showErrorAlertMessage('No Data!', 'No property found near you.')
            return false
        }
        const propertyData = await populateData(response.data, true, colors.mainBlue, false, true)

        return propertyData
    }
    return false
}

const populateData = async (data, setUserLocationAsOrigin = false, colorCode, showingSoldData = false, shouldRedirect = true) => {
    //console.log(data);
    let user_lat = await getData('user_lat')
    let user_lng = await getData('user_lng')
    let max_distance = 0
    let max_distance_coords = []

    let originLocation = [parseFloat(user_lng), parseFloat(user_lat)]

    let list = {
        type: 'FeatureCollection',
        features: [],
    };

    let count = 0

    data.map((x, i) => {

        let price = intToString(x.price)
      
        if (i == 0) { // && setUserLocationAsOrigin == false
           
            originLocation = [parseFloat(x.lng), parseFloat(x.lat)]
            user_lat = parseFloat(x.lat)
            user_lng = parseFloat(x.lng)
        }

        let pocket = {
            type: 'Feature',
            id: '9d10456e-bdda-4aa9-9269-04c1667d4552',
            properties: {
                icon: 'exampleIcon',
                itemLabel: (x.schoolName != undefined)? '' : price,
                itemId: x.id,
                itemType: x.type,
                showingSoldData: showingSoldData,
                colorCode: colorCode,
                shouldRedirect: shouldRedirect,
                schoolName: x.schoolName
            },
            geometry: {
                type: 'Point',
                coordinates: [parseFloat(x.lng), parseFloat(x.lat)],  // lng - lat
            },
        }
        list.features.push(pocket)
        count += 1
    })

    return {
        shapeSourceList: list,
        originLocation: originLocation,
        total_data_count: count
        //max_distance_coords: max_distance_coords
    }
}

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}

const intToString = (value) => {

    value = parseInt(value)
    var suffixes = ["", "k", "m", "b", "t"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(2));
    if (shortValue % 1 != 0) {
        shortValue = shortValue.toFixed(1);
    }

    return shortValue + suffixes[suffixNum];
}

const getSoldData = async (param) => {
    console.log('getSoldData', param);
    const response = await callApi('get_properties_map_sold/', param);
    // console.log('getSoldData ',response);
    if (response.status == 'Success') {

        if (response.status_message === '0 properties found') {
            showErrorAlertMessage('No Data!', 'No property found near you.')
            return false
        }
        const propertyData = await populateData(response.data, false, '#ff0000', true, true)

        return propertyData
    }
    return false
}

const getLeaseData = async (param) => {
    console.log('lease data', param);
    const response = await callApi('get_properties_map_lease/', param);
    // console.log(response.data.length);
    if (response.status == 'Success') {

        if (response.status_message === '0 properties found') {
            showErrorAlertMessage('No Data!', 'No property found.')
            return false
        }
        const propertyData = await populateData(response.data, false, '#AD8C07', false, true)

        return propertyData
    }
    return false
}

const getSchoolData2 = async (param) => {

    const API = 'https://api.mapbox.com/geocoding/v5/mapbox.places/school.json?proximity=' + param.lng + ',' + param.lat + '&access_token=pk.eyJ1Ijoic2FnYXIyMDIxIiwiYSI6ImNreXNiOTl0NjB3YjEybnBocTNnbWdkc3AifQ.uTGVk09YE9fX69u_eU2mKw&PreviousNnoteTableDataItems=10'
    console.log(API);
    await axios.get(API)
        .then(async function (response) {
            // handle success

            if (response.data.features.length > 0) {
                let data = []
                response.data.features.map((item, index) => {
                    data.push({
                        id: index,
                        lat: item.center[1],
                        lng: item.center[0],
                        type: '',
                        price: 0,
                    })
                })

                const propertyData = await populateData(data, false, '#000', false, false)
                return propertyData
            } else {
                showErrorAlertMessage('No Data!', 'No Schools found.')
                return false
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            return false
        })


    return
    const response = await callApi('get_properties_map_lease/', param);
    // console.log(response.data.length);
    if (response.status == 'Success') {

        if (response.status_message === '0 properties found') {
            showErrorAlertMessage('No Data!', 'No property found.')
            return false
        }
        const propertyData = await populateData(response.data, false, '#AD8C07')

        return propertyData
    }
    return false
}

const getSchoolData = async (param) => {

    const response = await callApi('get_schools_near_me/', param);
    console.log(response.data);
    if (response.data.length > 0) {
        let data = []
        response.data.map((item, index) => {
            data.push({
                id: index,
                lat: item.geometry.location.lat,
                lng: item.geometry.location.lng,
                type: '',
                price: '',
                schoolName: item.name
            })
        })
        const propertyData = await populateData(data, false, '#AD8C07', false, false)
        return propertyData
    }
    return false
}

const getFilterData = async (param) => {
    console.log('getFilterData param', param);
    const response = await callApi('get_properties_map_search_new/', param);
    // console.log('getFilterData',response);
    if (response.status == 'Success') {

        const propertyData = await populateData(response.data, false, colors.mainBlue, false, true)
        return propertyData

    } else if (response.status == 'Failure') {
        if (response.status_message === 'No properties found!') {
            showErrorAlertMessage('No Data!', 'No property found.')
            return false
        }
    }
    return false
}

export { userIsLogin, propertyNearMe, getSoldData, getLeaseData, getFilterData, getSchoolData }