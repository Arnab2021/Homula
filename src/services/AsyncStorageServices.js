import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        console.log('asyncstorage store err - ', e);
    }
}

const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value
        }else{
            return null
        }
    } catch (e) {
        console.log('asyncstorage read err - ', e);
    }
}

const removeData = async(key) => {
    try {
        const value = await AsyncStorage.removeItem(key)        
    } catch (e) {
        console.log('asyncstorage remove err - ', e);
    }
}

export { storeData,getData,removeData }