import React from 'react';
import {
  StyleSheet,
  Platform,
  View,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import colors from '../colors';

const Checkbox = (props) => {
  const {boxType, style, value, onValueChange, checkedText,checboxStyle} = props;

  const squareButton = (
    <TouchableWithoutFeedback onPress={onValueChange}>
      <View style={[styles.checkboxPress]}>
        <View
          style={[
            value ? styles.squareButtonBox : styles.disableSquareButtonBox,
            style,
            checboxStyle
          ]}>
          {value ? (
            <Text style={[styles.checkedMarkText, checkedText]}>✓</Text>
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return squareButton;
};

const styles = StyleSheet.create({
  checkboxPress: {},
  disableSquareButtonBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.mainBlue,
  },
  squareButtonBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
    borderWidth: 1,
    borderColor: colors.mainBlue,
  },
  checkedMarkText: {
    color: colors.white,
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
});

export default Checkbox;
