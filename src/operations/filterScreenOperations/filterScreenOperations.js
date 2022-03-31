import callApi from '../../global/callApi'
import { getData, storeData } from '../../services/AsyncStorageServices'
import { showErrorAlertMessage } from '../../services/ShowAlertMessages'

const userIsLogin = async () => {
    const userid = await getData('userid')
    if (userid != null) {
        return true
    }
    return false
}

const getPropertyTypeOptions = async (houseDropdown) => {

    let type = ''
    houseDropdown.activeIndexes.forEach(element => {
        let title = houseDropdown.data[element]
        if (title == 'House') {
            title = 'residential'
        }
        if (title == 'Condo') {
            title = 'condo'
        }
        if (title == 'Commercial') {
            title = 'commercial'
        }
        type += title + ','
    });

    type = type.substr(0, type.length - 1)

    const param = {
        type: type
    };
  
    const response = await callApi('get_property_types/', param);
   
    if (response.status == 'Success') {
        return response.data
    }else{
        showErrorAlertMessage('No Type Found', 'No Type Found...')
        return false
    }

}

export { getPropertyTypeOptions, userIsLogin }