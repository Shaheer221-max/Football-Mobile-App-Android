import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';

const Loader = () => {
  return (
    <View style={{position: "absolute", top: "50%", left: "50%"}}>
    <ActivityIndicator size="large" />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({});
