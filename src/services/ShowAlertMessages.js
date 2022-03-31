import { ToastAndroid, Alert } from "react-native";

const showToastMessage = (message, toastposition) => {
    ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.SHORT,
        (toastposition == 'bottom')? ToastAndroid.BOTTOM : ToastAndroid.CENTER,
        0,
        40
    );
};

const showErrorAlertMessage = (title, message) => {
    Alert.alert(title, message,
        [
            { text: "OK", onPress: () => console.log("OK Pressed") }
        ])
};

export { showToastMessage,showErrorAlertMessage }