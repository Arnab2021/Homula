import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';

export default class ModalDropDown extends Component {
  constructor(props) {
    super(props);
    const {selectedItem} = this.props;
    
    this.state = {
      StateSelectedItem: (selectedItem == undefined)? 'Please select': selectedItem,
    };
  }

  resetSelectedItem = () => {
    const {selectedItem} = this.props;
    this.setState({
      StateSelectedItem,
    });
  };

  render() {
    const {
      items,
      style,
      dropdownStyle,
      dropdownTextStyle,
      dropdownTextHighlightStyle,
      textStyle,
      triggerSelect,
      onSelect,
      selectedItem,
      defaultIndex
    } = this.props;

    const {StateSelectedItem} = this.state;

    return (
      <ModalDropdown
        
        options={items}
        onSelect={onSelect}
        //defaultIndex={defaultIndex}
        //defaultValue="Please select"
        style={style}
        saveScrollPosition={false}
        dropdownStyle={dropdownStyle}
        dropdownTextStyle={dropdownTextStyle}
        dropdownTextHighlightStyle={dropdownTextHighlightStyle}>
        <View style={styles.dropdownView}>
          <Text style={textStyle}>
            { (selectedItem == undefined)? 'Please select': selectedItem }
          </Text>
          <Icon name="chevron-down" />
        </View>
      </ModalDropdown>
    );
  }
}

const styles = StyleSheet.create({
  dropdownView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
