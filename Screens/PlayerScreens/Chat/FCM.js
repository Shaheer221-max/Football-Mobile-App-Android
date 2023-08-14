
import { useEffect, useState, useRef, useContext } from 'react';
import messaging from '@react-native-firebase/messaging';
import { AppState, Platform } from 'react-native';
import port from '../../Port/Port';
import { CartProvider } from '../../ContextApi/contextApi';
import { displayNotification } from '../../Components/DisplayNotification';

// args for if we need to send some data to the hook !
const useFCM = (args) => {
    const {userdetails, isFCM, setIsFCM} = args;
    // const {userdetails, setsocket, isFCM, setIsFCM} = useContext(CartProvider);

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    // Data States
    const [fcmToken, setFCMToken] = useState(null);
    const [subscribedTopic, setSubscribedTopic] = useState({
        userId: null
    });
    const [isSubscribed, setIsSubscribed] = useState(false);

    // Loading State
    const [fcmLoading, setFcmLoading] = useState(true);
    const [routeLoading, setRouteLoading] = useState(false);

    const getUserInfo = async () => {
        let userInfo = userdetails;
        // console.log('Userinfo in FCM Services', userInfo);       Use your function to store global user id here 
        if (userInfo && userInfo._id) {
            // console.log('userInfo', userInfo.user.id)
            return setSubscribedTopic({
                userId: userInfo._id.toString()
            });
        }
        return;
    };

    const getNotificationData = async () => {
        let data = await getNotification();
        // console.log('Notification Data From Firebase', data);
        return data;
    };

    const getNotification = async () => {
        try {
          const result = await axios.get(
            `${port.herokuPort}/generalnotification/GetPlayerGeneralNotifications/${userdetails?._id}`,
          );
    
        return result.data.data.reverse();
        } catch (err) {
          console.log(err);
          alert(err.response.data);
        }
      };

      useEffect(() => {
        getUserInfo();
        requestUserPermission();
      }, [userdetails]);
    
      useEffect(() => {
        requestUserPermission();
      }, [subscribedTopic]);
    
      useEffect(() => {
        if (isSubscribed) {
          setFcmLoading(false);
          onMessageRecieve();
          onNotificationOpenedApp();
        }
      }, [isSubscribed]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // console.log('App has come to the foreground!');
            }
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            // console.log('AppState', appState.current);
        });
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);


    const requestUserPermission = async () => {
        try {
          const authStatus = await messaging().requestPermission({
            // criticalAlert: true,
            // sound: true,
          });
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
          if (enabled) {
            console.log('Authorization status:', authStatus);
            getFcmToken();
          }
        } catch (e) {
          console.log('Error in request user permission', e);
        }
      };
    
      const getFcmToken = async () => {
        try {
          const fcmToken = await messaging().getToken();
          if(isFCM == true){
            return
          }
          if (fcmToken) {
            console.log('My Firebase Token is:', fcmToken);
            if (subscribedTopic.userId != null) {
              subscribeToTopic(subscribedTopic.userId);
            }
            setFCMToken(fcmToken);
          } else {
            console.log('Failed', 'No token received');
          }
        } catch (e) {
          console.log('Error in get fcm Token', e);
        }
      };

    const deleteFcmToken = async () => {
        try {
            await messaging().deleteToken();
        } catch (e) { }
    };

    const subscribeToTopic = async topic => {
        try {
            // console.log('TOPIC IN SUB', topic);
            await messaging().subscribeToTopic(topic);
            setIsSubscribed(true);
            setIsFCM(true);
        } catch (e) {
            console.log('Error Subscribing to Topic', e);
        }
    };

    const unSubscribeToTopic = async topic => {
        try {
            // console.log('TOPIC IN UNSUB', topic);
            await messaging().unsubscribeFromTopic(topic);
            setIsSubscribed(false);
        } catch (e) {
            console.log('Error unsubscribing to Topic', e);
        }
    };

    const onMessageRecieve = async () => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            // console.log('FCM Message Data:', remoteMessage);
            const newRemoteMessage = remoteMessage.notification.body;

            displayNotification(newRemoteMessage);
        });
    };

    const onNotificationOpenedApp = () => {
        messaging().onNotificationOpenedApp(remoteMessage => {
            // console.log(
            //     'Notification caused app to open from background state:',
            //     remoteMessage,
            // );
            // readingNotification(remoteMessage.data.id)
            //   navigation.navigate(remoteMessage.data.type);
        });
        // Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    alert("Notification alert")
                }
            });

        messaging().setBackgroundMessageHandler(async remoteMessage => {
            if (remoteMessage) {
                alert("Notification alert")
            }
        });
    };

    return {
        onMessageRecieve,
        requestUserPermission,
        getFcmToken,
        getUserInfo,
        unSubscribeToTopic,
        subscribeToTopic,
        deleteFcmToken,
        setFcmLoading,
        setRouteLoading,
    };
};
export default useFCM;