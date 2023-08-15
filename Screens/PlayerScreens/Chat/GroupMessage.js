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


const GroupMessage = ({message}) => {
  const {userdetails, setuserdetails, token, socket} = useContext(CartProvider);
  var image;
  const [openImage, setOpenImage] = useState(false);
  const [imageToShow, setImageToShow] = useState("");

  if (message?.content?.length > 3) {
    var extension = message?.content.substr(message?.content?.length - 4);
    if (extension.charAt(0) === '.') {
      var extension = message?.content.substr(message?.content?.length - 3);
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
    setImageToShow(message?.content ?? "");
  }
  
  return (
    <View style={{marginTop: 10}}>
      {message?.sender.id == userdetails?._id ? (
        <View
          style={{
            alignItems: 'flex-end',
            marginRight: 15,
            marginBottom: 5,
            marginRight: 10,
            marginTop: 5,
          }}>
          <View
            style={{
              flexDirection: 'row-reverse',
            }}>
            <View>
              <Image
                source={{
                  uri: userdetails?.image,
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
                marginLeft: 10,
                marginRight: 10,

                alignItems: 'flex-end',
              }}>
              <Text style={Commonstyles?.TextWhiteUserName}>
                <Text style={Commonstyles?.TextGrey12}>
                  {moment(message.timestamp).fromNow()}
                </Text>
                {'   '}
                Me
              </Text>
              {image == true ? (
                <TouchableOpacity style={{marginTop: 27}} onPress={handleImagePress}>
                <Image
                  source={{
                    uri: message?.content,
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
                    padding: 9,
                    width: '80%',

                    borderTopLeftRadius: 30,
                    borderBottomRightRadius: 30,
                    borderTopRightRadius: 5,
                    borderBottomLeftRadius: 20,
                    marginTop: 7,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lexend-Regular',
                      fontSize: 13,
                      fontWeight: '300',

                      color: 'white',
                    }}>
                    {message?.content}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      ) : (
        <View style={{marginLeft: 15, marginBottom: 5, marginTop: 5}}>
          <View style={{flexDirection: 'row'}}>
          <View>

              <Image
              
                source={{
                  uri: message?.sender?.image,
                }}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 90 / 2,
                }}
              />
            </View>
            <View style={{marginLeft: 10, marginRight: 10}}>
              <Text style={Commonstyles?.TextWhiteUserName}>
                {message?.sender?.name}
                {'   '}
                <Text style={Commonstyles?.TextGrey12}>
                  {moment(message.timestamp).fromNow()}
                </Text>
              </Text>
              {image == true  ? (
                <TouchableOpacity style={{marginTop: 27}} onPress={handleImagePress}>
                <Image
                  source={{
                    uri: message?.content,
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
                    backgroundColor: '#EDEDED',
                    padding: 9,
                    width: '80%',

                    borderTopRightRadius: 30,
                    borderBottomRightRadius: 30,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 20,
                    marginTop: 7,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lexend-Regular',
                      fontSize: 13,
                      fontWeight: '300',

                      color: '#000000',
                      opacity: 0.72,
                    }}>
                    {message?.content}
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

export default GroupMessage;

const styles = StyleSheet.create({});
