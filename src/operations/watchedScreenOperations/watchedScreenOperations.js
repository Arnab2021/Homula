import callApi from '../../global/callApi'
import { getData, storeData } from '../../services/AsyncStorageServices'



const getAllWatchedProperties = async () => {
    let list = [];

    let Watchedproperty = await getData('watchedproperty');
    //console.log('Watchedproperty ', Watchedproperty)

    if (Watchedproperty !== null) {
        return Watchedproperty
    } else {
        return false
    }

}

const addOrRemoveFromWatched = async (item, reqSave) => {

    let propertyId = item.id;
    let list = [];
    let Watchedproperty = await getData('watchedproperty');
    console.log('item ', item)

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

export { getAllWatchedProperties, addOrRemoveFromWatched }