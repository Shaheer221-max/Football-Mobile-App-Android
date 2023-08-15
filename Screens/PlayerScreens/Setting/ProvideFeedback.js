import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Modal,
    Pressable,
    KeyboardAvoidingView,
    Keyboard,
  } from 'react-native';
  import React, {useState, useContext, useEffect} from 'react';
  import axios from 'axios';
  import CartProvider from '../../ContextApi/contextApi';
  import port from '../../Port/Port';
  
  //importing Validation labiries
  import {Formik} from 'formik';
  import * as Yup from 'yup';
  
  //import font and design
  import {Font, Commonstyles} from '../../Font/Font';
  
  //importing icons
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import Entypo from 'react-native-vector-icons/Entypo';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
  
  const ProvideFeedBackScreen = ({navigation}) => {
    const {userdetails, setuserdetails} = useContext(CartProvider);
    const [cartmodalVisible, setcartModalVisible] = useState(false);
    const [CurrentEmail, setCurrentEmail] = useState();
    const [textToShow, setTextToShow] = useState();
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
  
    var validationSchema = Yup.object().shape({
        name: Yup.string()
        .required('Name is Required'),
        email: Yup.string()
        .required('Email Address is Required')
        .email('Please enter valid email'),
      number: Yup.number()
        .required('Contact Number is Required'),
    });


    const sendFeedback = async obj => {
        const userData = {
          content: JSON.stringify(obj),
          status: "pending",
          refOfUser: userdetails?.id
        }

        try {
          const result = await axios.post(
            `${port.herokuPort}/feedback`,
            userData,
          );
          alert('Feedback sent');
          navigation.goBack();
        } catch (err) {
          console.log(err.response.data.message);
          alert('Error');
        }
      }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Font.black}}>
        {/* Model to ask for review */}
        {/* Top bar */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
            <Text style={Commonstyles.LogoWhite}>Settings</Text>
          </View>
          {/* Notification icon */}
          <View
            style={{
              justifyContent: 'center',
              marginRight: 15,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PlayerNotification');
              }}>
              <Ionicons
                name={'notifications-outline'}
                size={28}
                color={Font.white}
              />
            </TouchableOpacity>
          </View>
        </View>
  
        <View style={styles.headingStyle}>
          <Text style={Commonstyles?.TextWhiteFeatured}>Provide Feedback</Text>
        </View>
        <Formik
          validationSchema={validationSchema}
          initialValues={{email: '', name: '', number: "", feedback: ""}}
          onSubmit={values => {
            const obj = {
              email: values.email,
              name: values.name,
              number: values.number,
              feedback: values.feedback
            };
            sendFeedback(obj);
          }}>
          {({handleChange, handleSubmit, values, errors, isValid}) => (
            <>

            <View
                style={{
                  justifyContent: 'center',
                  margin: 15,
                  marginBottom: 0,
                }}>
                <TextInput
                  name="name"
                  style={Commonstyles.inputText}
                  placeholder="Name"
                  placeholderTextColor={Font.greyText}
                  onChangeText={handleChange('name')}
                  keyboardType="email-address"
                />
                <MaterialCommunityIcons
                  name={'face-man'}
                  size={26}
                  color={'white'}
                  style={{
                    position: 'absolute',
                    right: 10,
                  }}
                />
              </View>
              {errors.name && (
                <Text style={Commonstyles.warningText}>{errors.name}</Text>
              )}
              <View
                style={{
                  justifyContent: 'center',
                  margin: 15,
                  marginBottom: 0,
                }}>
                <TextInput
                  name="email"
                  style={Commonstyles.inputText}
                  placeholder="Email"
                  placeholderTextColor={Font.greyText}
                  onChangeText={handleChange('email')}
                  keyboardType="email-address"
                  autoCapitalize= "none"
                />
                <MaterialCommunityIcons
                  name={'email'}
                  size={26}
                  color={'white'}
                  style={{
                    position: 'absolute',
                    right: 10,
                  }}
                />
              </View>
              {errors.email && (
                <Text style={Commonstyles.warningText}>{errors.email}</Text>
              )}
  
              {/* Confirm Email */}
  
              <View
                style={{
                  justifyContent: 'center',
                  margin: 15,
                }}>
                <TextInput
                  name="number"
                  style={Commonstyles.inputText}
                  placeholder="Contact Number"
                  placeholderTextColor={Font.greyText}
                  onChangeText={handleChange('number')}
                  keyboardType="numeric"
                />
                <MaterialCommunityIcons
                  name={'cellphone'}
                  size={26}
                  color={'white'}
                  style={{
                    position: 'absolute',
                    right: 10,
                  }}
                />
              </View>
              {errors.number && (
                <Text style={Commonstyles.warningText}>
                  {errors.number}
                </Text>
              )}
                <View
                style={{
                justifyContent: 'center',
                marginLeft: 15,
                marginRight: 15,
                marginBottom: 50,
              }}
                >
                <TextInput
                  name="feedback"
                  style={Commonstyles.inputTextMultiline}
                  placeholder="Feedback"
                  placeholderTextColor={Font.greyText}
                  onChangeText={handleChange('feedback')}
                  multiline={true}
                />
         
              {errors.feedback && (
                <Text style={Commonstyles.warningText}>{errors.feedback}</Text>
              )}
                </View>

              {/* Buttons */}
              <KeyboardAvoidingView
              behavior='padding'
              style={{
                justifyContent: 'center',
                marginLeft: 15,
                marginRight: 15,
                marginBottom: 50,
              }}
                >
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    padding: 23,
                    backgroundColor: '#1DB954',
                    borderRadius: 10,
                  }}
                  onPress={handleSubmit}>
                  <Text style={Commonstyles.TextWhite}>Provide Feedback</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </>
          )}
        </Formik>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  };
  
  export default ProvideFeedBackScreen;
  
  const styles = StyleSheet.create({
    headingStyle: {
      paddingLeft: 15,
      paddingBottom: 5,
      marginTop: 15,
      borderBottomWidth: 0.5,
      borderColor: Font.greyText,
    },
  
    centeredView2: {
      alignItems: 'center',
    },
    centeredView: {},
  
    modalView3: {
      marginTop: '50%',
      marginBottom: 10,
      backgroundColor: '#333333',
      borderRadius: 26,
      height: 270,
      width: '90%',
  
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  
    modalText3: {
      color: 'black',
      fontSize: 18,
      fontWeight: 'bold',
    },
    TextColor: {
      color: Font.TextBackground,
    },
    ButtonGreen: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 122,
      height: 37.22,
      backgroundColor: '#1DB954',
      borderRadius: 10,
    },
  });
  