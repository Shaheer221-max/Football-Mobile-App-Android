import {StyleSheet, Text, View} from 'react-native';
import React, { useEffect } from 'react';

//Importing Context api
import {CartProvider} from './Screens/ContextApi/contextApi';

//Checking if user is logged in or not
import Authentication from './Screens/Authentication/Authentication';
import FlashMessage from 'react-native-flash-message';

const App = () => {
  return (
    <>
   <FlashMessage position="top" /> 
      <CartProvider>
        <Authentication />
      </CartProvider>
    </>
  );
};

export default App;

const styles = StyleSheet.create();
