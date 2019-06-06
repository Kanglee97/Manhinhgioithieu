import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontStyle, Layout } from '../Magic';
import LinearGradient from 'react-native-linear-gradient';

const ButtonGradient = (props) => {
  const {
    disabled = false,
    onPress,
    content,
    width
  } = props;
  return (
    <LinearGradient start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={[Colors.functionColorDark, '#2F87AB', Colors.functionColorLight]}
      style={[styles.btnLinear, width ? { width: width } : null, props.style]}>
      <TouchableOpacity
        style={[{ height: 40, width: '100%', justifyContent: 'center', alignItems: 'center' },
        disabled ? { backgroundColor: Colors.lightBlur, borderRadius: 20 } : null]}
        onPress={onPress}
        disabled={disabled}
        {...props} >
        <Text style={[styles.btnLinearText, props.labelStyle]}>
          {content}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const CustomButtonGradient = (props) => {
  const {
    disabled = false,
    onPress,
    content,
    width
  } = props
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={[Colors.functionColorDark, '#2F87AB', Colors.functionColorLight]}
      style={[styles.btnLinearCustom, props.style, { width: width || Layout.window.width * 0.2 }]}>
      <TouchableOpacity
        style={[
          { height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' },
          disabled ? { backgroundColor: Colors.lightBlur, borderRadius: 20 } : null
        ]}
        onPress={onPress}
        disabled={disabled}
        {...props}>
        <Text style={[styles.btnLinearText, props.labelStyle]}>
          {content}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

export default ButtonGradient

const ButtonSolid = (props) => {
  const {
    style,
    onPress,
    labelStyle,
    label,
    width,
    backgroundColor,
    disable
  } = props
  return (
    <TouchableOpacity style={[styles.btnSolid,
    {
      backgroundColor: disable ? Colors.secondaryColor : (backgroundColor || Colors.dangerColor),
      width: width || '100%',
    }, style]} onPress={onPress} disabled={disable} >
      <Text style={[{
        fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont,
        color: Colors.lightText, fontWeight: 'bold'
      }, labelStyle]}>{String(label).toUpperCase() || 'XÓA'}</Text>
    </TouchableOpacity >
  );
}

const ButtonOutline = (props) => {
  const {
    style,
    onPress,
    labelStyle,
    label,
    width,
    backgroundColor,
  } = props
  return (
    <TouchableOpacity style={[styles.btnOutline,
    {
      backgroundColor: backgroundColor || Colors.transparent,
      width: width || '100%',
    }, style]} onPress={onPress}>
      <Text style={[{
        fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont,
        color: Colors.functionColorLight, fontWeight: 'bold'
      },
        labelStyle]}>{String(label).toUpperCase() || 'HỦY BỎ'}</Text>
    </TouchableOpacity>
  );
}

const ButtonText = (props) => {
  const {
    style,
    onPress,
    labelStyle,
    label,
    width,
    backgroundColor,
  } = props
  return (
    <TouchableOpacity style={[styles.btnText, {
      backgroundColor: backgroundColor || Colors.transparent,
      width: width,
    }, style]} onPress={onPress}>
      <Text style={[{
        fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont,
        color: Colors.functionColorLight, fontWeight: 'bold'
      }, labelStyle]}>{String(label).toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

export {
  ButtonSolid,
  ButtonOutline,
  CustomButtonGradient,
  ButtonText
}

const styles = StyleSheet.create({
  btnLinear: {
    width: Layout.window.width * 0.6,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
  },
  btnLinearText: {
    fontWeight: 'bold',
    fontSize: FontStyle.mdText,
    fontFamily: FontStyle.mainFont,
    color: Colors.lightText,
    textAlign: 'center',
    backgroundColor: Colors.transparent,
  },
  btnSolid: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  btnOutline: {
    height: 40,
    borderColor: Colors.functionColorLight,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    fontWeight: 'bold'
  },
  btnText: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold'
  },
  btnLinearCustom: {
    height: 40,
    borderRadius: 20,
  },
})