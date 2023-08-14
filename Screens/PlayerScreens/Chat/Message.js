import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import axios from 'axios';

import port from '../../Port/Port';
import CartProvider from '../../ContextApi/contextApi';
//import font and design
import {Font, Commonstyles} from '../../Font/Font';
import moment from 'moment';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from "react-native-modal";


const Message = ({message, own, otherUser}) => {  
  const {userdetails, setuserdetails, token, socket} = useContext(CartProvider);
  console.log('-------');
  const [openImage, setOpenImage] = useState(false);
  const [imageToShow, setImageToShow] = useState("");
  var image;
  if (message?.text.length > 3) {
    var extension = message?.text.substr(message?.text.length - 4);
    if (extension.charAt(0) === '.') {
      var extension = message?.text.substr(message?.text.length - 3);
      if (extension === 'jpg' || extension === 'png' || extension === 'gif') {
        image = true;
      }
    }
  }

  const closeModal = () => {
    setOpenImage(false);
  }

  const handleImagePress = () => {
    setOpenImage(true);
    setImageToShow(message?.text ?? "");
  }

  return (
    <View style={{marginTop: 10}}>
      {own ? (
        <View style={{marginRight: 50, marginLeft: 15, marginBottom: 5, marginTop: 5, alignItems: 'flex-end',}}>
            <View style={{marginLeft: 10, position: "absolute"}}>
              <Text style={Commonstyles?.TextGrey12}>
              {moment(message.createdAt).fromNow()}
                {'   '}
                <Text style={Commonstyles?.TextWhiteUserName}>
                Me
                </Text>
              </Text>
            </View>
            {image == true ? (
                <TouchableOpacity style={{marginTop: 27}} onPress={handleImagePress}>
                <Image
                  source={{
                    uri: message?.text,
                  }}
                  style={{
                    width: 146,
                    height: 146,
                    borderRadius: 10,
                  }}
                />
                </TouchableOpacity>

              ) : (
                <View
                  style={{
                    backgroundColor: Font.grey,
                    padding: 13,
                    borderTopLeftRadius: 40,
                    borderBottomRightRadius: 20,
                    borderTopRightRadius: 5,
                    borderBottomLeftRadius: 20,
                    marginTop: 27,
                  }}>
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white"
                    }}>
                    {message?.text}
                  </Text>
                </View>
              )}
        </View>
      ) : (
        <View
          style={{
            marginLeft: 15,
            marginVertical: 10
          }}>
          <View
            style={{
              flexDirection: 'row', 
            }}>
            <View>
              <Image
                source={{
                  uri: otherUser?.image,
                }}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 90 / 2,
                }}
              />
            </View>
            <View
              style={{
                marginRight: 10,
                marginLeft: 20
              }}>
              <Text style={Commonstyles?.TextGrey12}>
                <Text style={Commonstyles?.TextWhiteUserName}>
                {otherUser?.name}
                </Text>
                {'   '}
                {moment(message.createdAt).fromNow()}
              </Text>
              {image == true ? (
                <Image
                  source={{
                    uri: message?.text,
                  }}
                  style={{
                    width: 146,
                    height: 146,
                    marginTop: 10,
                    borderRadius: 10,
                  }}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: Font.white,
                    padding: 9,
                    width: '80%',
                    
                    borderTopRightRadius: 40,
                    borderBottomLeftRadius: 20,
                    borderTopLeftRadius: 5,
                    borderBottomRightRadius: 40,
                    marginTop: 7,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                    }}>
                    {message?.text}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      <Modal
       onBackdropPress={closeModal}
       visible={openImage}
       style={{alignSelf: 'center',
        width: "100%", 
        backgroundColor: "black", 
        borderRadius: 20,
        }}>
      <View
        style={{
        justifyContent: 'space-around',
        alignItems: 'center',
        height: "100%"
      }}>
      <Icon
        name= "cross"
        onPress={closeModal}
        size={40}
        color={"grey"}
        style= {{zIndex: 200, marginRight : 20, marginTop: 60, alignSelf: "flex-end"}}
      />

      <Image 
       style={{
        height: "110%",
        width: "100%", 
        resizeMode: "contain"
       }} 
       source={{uri: imageToShow}}
      />
        </View>
      </Modal>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({});
