import {
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';

//import font and design
import {Font, Commonstyles} from '../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Importing FlatList for comments
import FlatListForChat from './FlatListForComments';
import CartProvider from '../ContextApi/contextApi';

import port from '../Port/Port';

const Comments = ({navigation, route}) => {
  const Nav = navigation;
  const IsGroup = route?.params.item?.refOfGroup;

  const [CommentArray, setCommentArray] = useState(route?.params?.Comment);
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [Comment, setComment] = useState();

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

  //Posting Comment
  const postComment = async () => {
    const CommentDetails = {
      refOfNewsfeed: route?.params?.refOfNewsfeed,
      refOfUser: userdetails?._id,
      comment: Comment,
    };

    try {
      const result = await axios.post(
        `${port.herokuPort}/comment/PostComment`,
        CommentDetails,
      );
      console.log('Ma na comment kiya');
      console.log(result.data.data.doc);
      const NewCommet = {comment: Comment, refOfUser: userdetails};
      setCommentArray(CommentArray => [result.data.data.doc, ...CommentArray]);

      // setCommentArray(CommentArray => [...CommentArray, result.data.data.doc]);
      setComment('');
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Font.black,
        marginBottom: IsGroup === null ? 30 : 0,
      }}>
      {/* Top bar */}
      <View
        style={{
          height: 120,
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
            paddingTop: 30,
            alignItems: 'center',
            marginLeft: 15,
          }}>
          <TouchableOpacity
            style={{marginRight: 5}}
            onPress={() => {
              navigation.goBack();
            }}>
            <AntDesign name={'left'} size={20} color={Font.white} />
          </TouchableOpacity>
          <Text style={Commonstyles.TextWhiteCalender}>
            Comments
            {'\n'}
            <Text style={Commonstyles.TextGrey}>On post</Text>
          </Text>
        </View>
        {/* Notification icon */}
        <View
          style={{
            justifyContent: 'center',
            marginRight: 15,
            paddingTop: 30,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (userdetails?.role === 'Player') {
                navigation.navigate('PlayerNotification');
              } else {
                navigation.navigate('ParentNotification');
              }
            }}>
            <Ionicons
              name={'notifications-outline'}
              size={28}
              color={Font.white}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 1,
        }}>
        <View style={{flex: 3}}>
          {/* FlatList to show the Comments */}
          <FlatListForChat
            CommentArray={CommentArray}
            setCommentArray={setCommentArray}
            navigation={Nav}
          />
        </View>
        </View>
        {/* Sending Chat area */}
        <KeyboardAvoidingView 
          behavior='padding'
        style={{
         justifyContent: 'center',
         marginLeft: 15,
         marginRight: 15,
        marginBottom: 50,
              }}
        >
          <View
            style={{
              flexDirection: 'row',
               padding: 14,
               backgroundColor: '#212121',
               borderRadius: 10,
               marginBottom: isKeyboardVisible ? 20 : 0
            }}>
            <TextInput
              multiline= {true}
              name="email"
              style={{
               backgroundColor: '#212121',
               color: '#FFFFFF',
               width: "90%" 
              }}
              placeholder="Write Comment"
              placeholderTextColor={Font.greyText}
              value={Comment}
              onChangeText={comment => {
                setComment(comment);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                postComment();
              }}
              style={{
                position: 'absolute',
                right: 10,
                top: 15
              }}>
              <MaterialCommunityIcons name={'send'} size={20} color={'white'} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
    </View>
  );
};

export default Comments;

const styles = StyleSheet.create({});
