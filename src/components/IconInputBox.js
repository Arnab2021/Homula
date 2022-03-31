import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import colors from '../colors';

const IconInputBox = (props) => {
  const {
    placeholder,
    iconSource,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType
  } = props;
  return (
    <View style={[styles.inputWithIconContainer]}>
      <View style={styles.inputBoxView}>
        <TextInput          
          placeholder={placeholder}
          value={value}
          placeholderTextColor="#85adad"
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry ? true : false}
          style={styles.input}
        />
      </View>
      <View style={styles.imageView}>
        <Image source={iconSource} resizeMode="contain" style={styles.image} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWithIconContainer: {
    borderWidth: 1,
    borderColor: colors.mainBlue,
    flexDirection: 'row',
    height: 50,
    marginVertical:6
  },
  inputBoxView:{
    flex: 0.85,
    justifyContent:'center'
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.15,
  },
  image: {
    width: '50%',
    height: '50%',
  },
  input:{
    paddingHorizontal:4
  }
});

export default IconInputBox;
