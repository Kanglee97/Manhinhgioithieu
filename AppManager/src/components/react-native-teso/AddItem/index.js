import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, FontStyle, Layout } from '../Magic';
import { MaterialIcon } from '../index';

export default class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={[styles.serviceCard, this.props.style]}>
        <TouchableOpacity style={[styles.addService, styles.displayInlineBlock]}
          onPress={this.props.onPress}>
          <MaterialIcon name={'library-add'} size={FontStyle.largeText} color={Colors.functionColorDark} />
          <Text style={{ fontFamily: FontStyle.mainFont, color: Colors.functionColorDark, marginLeft: 10, fontSize: FontStyle.mdText }}>{this.props.label}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  serviceCard: {
    height: 50,
    width: Layout.window.width * 0.925,
    alignSelf: 'center',
    marginTop: 5,
  },
  addService: {
    borderColor: Colors.functionColorLight,
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: 'dashed',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.lightBg
  },
  displayInlineBlock: {
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'row',
  }
});