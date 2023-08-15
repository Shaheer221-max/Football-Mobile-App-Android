import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import CartProvider from '../ContextApi/contextApi';

import port from '../Port/Port';
import axios from 'axios';

//importing icons
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/FontAwesome';

import moment from 'moment';

//import font and design
import {Font, Commonstyles} from '../Font/Font';

const FlatListForComments = ({navigation, CommentArray, setCommentArray}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [isopen, setIsOpen] = useState(false);
  const [Index, setIndex] = useState();
  const [Comment, setComment] = useState();
  // const [AllComment, setAllComment] = useState(CommentArray);

  const postComment = async (id, index) => {
    const CommentDetails = {
      refOfUser: userdetails?._id,
      text: Comment,
    };

    try {
      const result = await axios.post(
        `${port.herokuPort}/comment/AddReplyToComment/${id}`,
        CommentDetails,
      );
      var objOfObjs = result.data.data;
      setIsOpen(!isopen);

      CommentArray.splice(index, 1, objOfObjs);

      setCommentArray(CommentArray);
      // CommentArray = [...CommentArray, result.data.data];

      setComment('');
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }
  };
  return (
    <View>
      <FlatList
        contentContainerStyle={{paddingBottom: 10}}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
        data={CommentArray}
        renderItem={({item, index}) => {
          var postDate = moment(item?.createdDate).utc().format('YYYY-MM-DD');

          return (
            <View
              style={{
                margin: 15,
                marginBottom: 0,
                paddingBottom: 15,
                borderBottomWidth: 0.5,
                borderColor: 'grey',

                overflow: 'hidden',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  // justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row', flex: 0.75}}>
                  {/* Image */}
                  <View>
                    <Image
                      source={{
                        uri: item?.refOfUser?.image
                          ? item?.refOfUser?.image
                          : userdetails?.image,
                      }}
                      style={{
                        width: 34,
                        height: 34,

                        borderRadius: 90 / 2,
                      }}
                    />
                  </View>
                  {/* Name and Comment area */}
                  <View style={{marginLeft: 8}}>
                    <View style={{alignSelf: 'flex-start'}}>
                      {item?.refOfUser?.name ? (
                        <Text style={Commonstyles.UploadText}>
                          {item?.refOfUser?.name}
                        </Text>
                      ) : (
                        <Text style={Commonstyles.UploadText}>
                          {userdetails?.name}
                        </Text>
                      )}
                    </View>

                    <View style={{marginTop: 10 }}>
                      <Text style={Commonstyles?.TextGreysmall300}>
                        {item?.comment}
                      </Text>
                    </View>
                      <View
                        style={{
                          marginRight: 15,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity style={{
                          marginRight: 15,
                          flexDirection: "row",
                          paddingVertical: 5,
                        
                        }}>
                          <AntDesign
                           style={{marginRight: 5, alignItems: 'center'}}
                            name={'hearto'}
                            size={12}
                            color={Font.white}
                          />
                        <Text style={Commonstyles?.TextWhite12}>Like</Text>
                        </TouchableOpacity>


                      <View
                        style={{
                          marginRight: 15,
                        }}>
                        <View 
                        style={{flexDirection: 'row', alignItems: 'center'}}
                        >
                        <TouchableOpacity
                          style={{ flexDirection: "row", paddingVertical: 5}}
                          onPress={() => {
                            setIndex(index);
                            setIsOpen(!isopen);
                          }}
                        >
                        <Entypo
                          style={{marginRight: 5, alignItems: 'center'}}
                            name={'reply'}
                            size={12}
                            color={Font.white}
                          />
                          <Text style={Commonstyles?.TextWhite12}>Reply</Text>
                        </TouchableOpacity>

                          </View>
                      </View>
                      <View
                        style={{
                          marginRight: 60,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity style={{marginRight: 5}}>
                          <Entypo
                            name={'reply-all'}
                            size={12}
                            color={Font.white}
                          />
                        </TouchableOpacity>
                        <Text style={Commonstyles?.TextWhite12}>
                          {item?.replies?.length} Replies
                        </Text>
                      </View>
                    </View>
                    {Index === index && isopen === true ? (
                      <View style={{marginTop: 10, width: 240}}>
                        <View
                          style={{
                            justifyContent: 'center',
                          }}>
                          <TextInput
                            name="email"
                            multiline={true}
                            style={Commonstyles.inputTextReply}
                            placeholder="Write Comment"
                            placeholderTextColor={Font.greyText}
                            value={Comment}
                            onChangeText={comment => {
                              setComment(comment);
                            }}
                          />
                            <MaterialCommunityIcons
                             style={{
                              position: 'absolute',
                              right: 10,
                            }}
                            onPress={() => {
                              postComment(item?._id, index);
                            }}
                              name={'send'}
                              size={20}
                              color={'white'}
                            />
                        </View>
                      </View>
                    ) : null}

                    {item?.replies?.map(item => {
                      return (
                        <View
                          style={{
                            marginTop: 10,
                            paddingBottom: 10,
                            borderBottomWidth: 0.5,
                            borderColor: 'grey',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                          }}>
                          {/* Image */}
                          <View>
                            <Image
                              source={{
                                uri: item?.refOfUser?.image
                                  ? item?.refOfUser?.image
                                  : userdetails?.image,
                              }}
                              style={{
                                width: 34,
                                height: 34,

                                borderRadius: 90 / 2,
                              }}
                            />
                          </View>

                          <View style={{marginLeft: 5}}>
                            <View style={{alignSelf: 'flex-start'}}>
                              {item?.refOfUser?.name ? (
                                <Text style={Commonstyles.UploadText}>
                                  {item?.refOfUser?.name}
                                </Text>
                              ) : (
                                <Text style={Commonstyles.UploadText}>
                                  {userdetails?.name}
                                </Text>
                              )}
                            </View>

                            <View style={{marginTop: 10}}>
                              <Text style={Commonstyles?.TextGreysmall300}>
                                {item?.text}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Date Area */}
                <View
                  style={{
                    flex: 0.25,
                    alignItems: 'flex-end',
                  }}>
                  <Text style={Commonstyles?.TextGreysmall300}>{postDate}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default FlatListForComments;

const styles = StyleSheet.create({});
