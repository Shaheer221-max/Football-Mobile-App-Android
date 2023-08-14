const { Platform, ToastAndroid } = require("react-native");
const { showMessage } = require("react-native-flash-message");



export const displayNotification = (message) =>{
    if(Platform.OS === "android"){
        ToastAndroid.show(message);
    }
}