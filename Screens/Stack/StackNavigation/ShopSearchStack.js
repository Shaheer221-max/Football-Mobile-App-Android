import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

//Stack navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

//Importing Screens
import ShopSearch from '../../PlayerScreens/Shop/ShopSearch/ShopSearch';
import PlayerNotification from '../../Components/PlayerNotification';
import SingleProduct from '../../PlayerScreens/Shop/ShopHome/SingleProduct';
import Checkout from '../../PlayerScreens/Shop/ShopHome/Checkout';

const ShopSearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ShopSearch" component={ShopSearch} />
      <Stack.Screen name="Checkout" component={Checkout}/>
      <Stack.Screen name="SingleProduct" component={SingleProduct} />
      <Stack.Screen name="PlayerNotification" component={PlayerNotification} />
    </Stack.Navigator>
  );
};

export default ShopSearchStack;

const styles = StyleSheet.create({});
