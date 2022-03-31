import callApi from '../../global/callApi'
import { getData, storeData } from '../../services/AsyncStorageServices'
import { showErrorAlertMessage } from '../../services/ShowAlertMessages'

const no_image = require('../../images/no-image.jpg')

const userIsLogin = async () => {
    const userid = await getData('userid')
    if (userid != null) {
        return true
    }
    return false
}

const getAllProperties = async (param) => {


    const response = await callApi('get_properties/', param)
    //console.log('getAllProperties',response);
    if (response.status == 'Success') {
        const propertydata = await populateData(response.data)
        return {
            propertydata: propertydata,
            total_property: response.total_data
        }
    } else {
        if (response == false) {
            showErrorAlertMessage('Failure', "Something went wrong!")
            return false
        }
        showErrorAlertMessage('No data', response.status_message)
        return false
    }

}

const populateData = async (data, isSold = false) => {

    let Watchedproperty = await getData('watchedproperty');
    let watchedlist = JSON.parse(Watchedproperty);

    let list = []
    data.map((x, i) => {

        if (i == 0) {
            // console.log(x);
        }

        let imageArr = [];
        let watched = false;

        let watcharr = (watchedlist !== null) ? watchedlist.filter((e) => e.id == x.id) : [];
        if (watcharr.length > 0) {
            watched = true
        } else {
            watched = false
        }

        if (x.images != '') {
            const image = x.images.split(",");
            image.map((v, j) => {
                imageArr.push(v.trim());
            })
        } else {
            imageArr = ['https://forum.purestudy.com/assets/images/backgrounds/no-image.jpg']
        }

        let amount = (!isSold) ? parseInt(x.price) : parseInt(x.sold_price)
        amount = (amount && amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));

        const unit_num = (x.type == 'condo') ? 'Unit ' + x.unit_num + ' - ' : ''
        const address = unit_num + x.street_address + ', ' + x.city + ', ' + x.county + ', ' + x.zip

        let sold_date = ''
        if (x.sold_date != '' && x.sold_date != null && x.sold_date != '0000-00-00') {
            sold_date = x.sold_date.split(' ')
            sold_date = sold_date[0]
        }
        let sold_price = ''
        if (x.sold_price != '' && x.sold_price != null && x.sold_price != 0 ) {
            sold_price = parseInt(x.sold_price)
            sold_price = (sold_price && sold_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        }

        let pocket = {
            imgGallery: imageArr,
            address: address,
            bedrooms: (x.bedrooms == null) ? 0 : x.bedrooms,
            bathroom: (x.washroom == null) ? 0 : x.washroom,
            garage: (x.garage == null) ? 0 : x.garage,
            amount: '$' + amount,
            watched: watched,
            id: x.id,
            type: x.type,
            sold_date: sold_date,
            sold_price: sold_price
        }

        list.push(pocket)
    })

    // console.log(list);
    return list
}


const addOrRemoveFromWatched = async (item, reqSave) => {

    let propertyId = item.id;
    let list = [];
    let Watchedproperty = await getData('watchedproperty');
    // console.log('item ', item)

    if (Watchedproperty === null) {
        item.watched = reqSave;
        list.push(item)
        saveToWatchedCount(propertyId, item.type)
    } else {

        list = JSON.parse(Watchedproperty);

        if (reqSave) {
            let filteredList = list.filter(v => v.id === propertyId);
            if (filteredList == '' || filteredList == null || filteredList == undefined) {
                item.watched = reqSave;
                list.push(item)
                saveToWatchedCount(propertyId, item.type)
            }
        } else {
            let filteredList = list.filter(v => v.id !== propertyId);
            list = filteredList;
            saveToWatchedCount(propertyId, item.type)
        }
    }

    await storeData('watchedproperty', JSON.stringify(list));
}

const saveToWatchedCount = async (propertyid, type) => {
    const userid = await getData('userid')

    const param = {
        userid: userid,
        propertyid: propertyid,
        type: type
    }
    const response = await callApi('add_property_save/', param);
    console.log('response -> ', response)
}

const searchProperty = async (param) => {

    const response = await callApi('get_properties_search/', param)
    //console.log('searchProperty', response);
    if (response.status == 'Success') {

        const propertyData = await populateData(response.data)
        return {
            propertydata: propertyData,
            total_property: response.totat_data,
            searchingPropertyType: response.type
        }

    } else if (response.status == 'Failure') {
        showErrorAlertMessage('Sorry!', response.status_message)
        return false
    } else {
        showErrorAlertMessage('Error', 'Something Went Wrong!')
        return false
    }
}

const getSoldProperties = async (param) => {

    const response = await callApi('get_sold_properties/', param)
    //console.log(response);
    if (response.status == 'Success') {

        const propertyData = await populateData(response.data, true)

        return {
            propertydata: propertyData,
            total_property: response.total_data,
            searchingPropertyType: response.type
        }

    } else if (response.status == 'Failure') {
        showErrorAlertMessage('Sorry!', response.status_message)
        return false
    } else {
        showErrorAlertMessage('Error', 'Something Went Wrong!')
        return false
    }
}

export { userIsLogin, getAllProperties, addOrRemoveFromWatched, searchProperty, saveToWatchedCount, getSoldProperties }