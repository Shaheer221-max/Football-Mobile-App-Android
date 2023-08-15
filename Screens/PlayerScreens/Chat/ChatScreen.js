import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Platform
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import axios from 'axios';
import Loader from '../../Loader/Loader';

import port from '../../Port/Port';
import CartProvider from '../../ContextApi/contextApi';
//import font and design
import {Font, Commonstyles} from '../../Font/Font';

//importing Image picker
import ImagePicker from 'react-native-image-crop-picker';

// importing Screen
import Message from './Message';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
const ChatScreen = ({navigation, route}) => {
  var currentChat = route.params?.currentChat;
  var From = route.params?.from;
  var OnlyView = route.params?.OnlyView;

  console.log('Check only view----------', OnlyView);
  const {userdetails, setuserdetails, token, socket} = useContext(CartProvider);
  const [messages, setMessages] = useState([]);
  const [singleMessage, setSingleMessage] = useState();
  const [receiverUser, setreceiverUser] = useState();
  const [receiverId, setreceiverId] = useState();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [lastMessage, setLastMessage] = useState('');
  const [condition, setcondition] = useState(true);
  const [condition2, setcondition2] = useState(true);
  const [image, setImage] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  
 useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  //Uploading Photo to cloudnary
  const handleUploadFront = async image => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'MuhammadTufailAli'),

    fetch('https://api.cloudinary.com/v1_1/vehiclebuddy/image/upload', {
      method: 'post',
      body: data,
    })
      .then(res => res.json())
      .then(data => {
        var newUrl = data.url.slice(0, 4) + 's' + data.url.slice(4);
        console.log(newUrl);
        setImage(newUrl);
      }).catch((err) => console.log("error in image upload api", err));
  };
  //Image picker to pickimage
  const openImagePicker = () => {
    ImagePicker.openPicker({
      multiple: false,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      maxFiles: 10,
      mediaType: 'photo',
    })
      .then(response => {
        let imageList = {
          filename: response.filename,
          path: response.path,
          data: response.data,
        };

        var prefix = Math.random();
        let newfile = {
          uri: imageList.path,
          type: `${prefix}/${imageList.path.split('.')[2]}`,
          name: `${prefix}.${imageList.path.split('.')[2]}`,
        };

        handleUploadFront(newfile);
      })
      .catch(e => console.log('error', e.message));
  };

  const scrollRef = useRef();

  useEffect(() => {
    console.log('Get message');
    //To recieve message which was send by user to server and server again send to receiver
    socket.current.on('getMessage', data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  //If there is change in arrival message then we will update our messages
  useEffect(() => {
    console.log('Display message');
    //currentChat?.members.includes(arrivalMessage.sender) is ka mtlb k jisa send kiya ha message sirf usa receive ho

    setLastMessage(arrivalMessage?.text);
    arrivalMessage &&
      currentChat?.members?.map(data => {
        if (data?.id === arrivalMessage.sender) {
          return true;
        }
      }) &&
      setMessages(prev => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  //Get All the messages and receiver user
  const getMessages = async () => {
    var otherUserId = '';
    if (From === 'newChat') {
      currentChat?.members?.map(data => {
        console.log(data);
        if (data != userdetails?._id) {
          otherUserId = data;
        }
      });
    } else {
      currentChat?.members?.map(data => {
        console.log(data);
        if (data?._id != userdetails?._id) {
          otherUserId = data?._id;
        }
      });
    }

    setreceiverId(otherUserId);

    try {
      const result = await axios.get(
        `${port.herokuPort}/message/${currentChat?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessages(result.data);
    } catch (err) {
      console.log(err.response.data);
      alert(err.response.data);
    }

    try {
      const result = await axios.get(
        `${port.herokuPort}/users/singleUser/${otherUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setreceiverUser(result.data.data.doc);
      setcondition(false);
    } catch (err) {
      console.log(err.response.data);
      alert(err.response.data);
    }
  };
  //Get All the messages and receiver user
  useEffect(() => {
    getMessages();
  }, []);
  if (condition) {
    return (
      <View
        style={{
          backgroundColor: Font.black,
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Font.black}}>
        {/* Top bar */}
        <View
          style={{
            height: 90,
            borderBottomWidth: 0.5,
            borderColor: Font.greyText,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: Font.grey,
          }}>
          {/* Drawer Button and heading */}
          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',
              marginLeft: 15,
            }}>
            <TouchableOpacity
              style={{marginRight: 5}}
              onPress={() => {
                navigation.openDrawer();
              }}>
              <Ionicons
                name={'reorder-three-sharp'}
                size={32}
                color={Font.green}
              />
            </TouchableOpacity>
            <Text style={Commonstyles.TextWhiteCalender}>
              {receiverUser?.name}
              {'\n'}
              <Text style={Commonstyles.TextGrey12Light}>
                {receiverUser?.email}
              </Text>
            </Text>
          </View>
          {/* Notification icon */}
          <View
            style={{
              justifyContent: 'center',
              marginRight: 15,
            }}>
          </View>
        </View>
        {/* Chat and send chat area */}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: 35,
          }}>
          <View style={{marginTop: 10, flex: 8}}>
            <ScrollView ref={scrollRef}>
              {messages.map(m => (
                <View>
                  <Message
                    message={m}
                    own={m.sender === userdetails._id}
                    otherUser={receiverUser}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        {OnlyView === 'No' ? (
            <KeyboardAvoidingView
              behavior='padding'
              style={{
                justifyContent: 'center',
                marginLeft: 15,
                marginRight: 15,
                marginBottom: 50,
              }}>
              {/* Sending Chat area */}
              <View style={{
               flexDirection: 'row',
               padding: 14,
               backgroundColor: '#212121',
               borderRadius: 10,
               marginBottom: isKeyboardVisible ? 20 : 0
              }}>
              <TextInput
                multiline= {Platform.OS == "ios" ? true : false}
                maxLength={300}
                style={{
                  backgroundColor: '#212121',
                  color: '#FFFFFF',
                  width: "80%" 
                  }}
                placeholder="Send Message"
                placeholderTextColor={Font.greyText}
                value={
                  image.length === 0
                    ? singleMessage
                    : 'Image selected Successfully'
                }
                onChangeText={setSingleMessage}
              />

               <View
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 15,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    openImagePicker();
                  }}
                  style={{marginRight: 10}}>
                  <Entypo name={'link'} size={20} color={'white'} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (image.length === 0) {
                      var message = {
                        sender: userdetails._id,
                        text: singleMessage,
                        conversationId: currentChat._id,
                      };

                      //sending message using socketio
                      socket.current.emit('sendMessage', {
                        senderId: userdetails._id,
                        receiverId,
                        text: singleMessage,
                      });
                    } else {
                      var message = {
                        sender: userdetails._id,
                        text: image,
                        conversationId: currentChat._id,
                      };
                      //sending message using socketio
                      socket.current.emit('sendMessage', {
                        senderId: userdetails._id,
                        receiverId,
                        text: image,
                      });
                    }

                    //Sending Message to data base
                    axios
                      .post(`${port.herokuPort}/message`, message, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      })
                      .then(res => {
                        setMessages([...messages, res.data]);
                        setSingleMessage('');
                        setImage('');
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }}>
                  <MaterialCommunityIcons
                    name={'send'}
                    size={20}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>

              </View>
 

            </KeyboardAvoidingView>
          ) : null}
      </SafeAreaView>
    );
  }
};

export default ChatScreen;

const styles = StyleSheet.create({});
