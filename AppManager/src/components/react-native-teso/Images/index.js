import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import { MaterialIcon } from '../../react-native-teso';
import { Colors, FontStyle, Layout } from '../Magic';
import { Image as RNImage } from 'react-native';
import { ImageProgress } from '../index';
import { DefaultImages } from '../../../assets/styles/Constant';

const Logo = props => {
    const {
        width,
        height,
        style,
        containerStyle
    } = props;
    return (
        <View style={[{ width: Layout.window.width, justifyContent: 'center', alignItems: 'center', }, containerStyle]}>
            <RNImage source={require('../../../assets/img/blueLogo.png')}
                style={[{ width: width || 250, height: height || 147.07 }, style]}
            />
        </View>
    )
}

const UserAvatar = props => {
    const {
        style,
        size,
        source
    } = props;
    return (
        <ImageProgress
            source={source || { uri: DefaultImages.AVATAR }}
            style={[styles.image, {
                height: size || Layout.window.width * 0.3,
                width: size || Layout.window.width * 0.3
            }, style]}
            borderRadius={size / 2 || Layout.window.width * 0.15}
        />
    )
}

const CoverImage = props => {
    const {
        thumbnail,
        onPress
    } = props;
    return (
        <TouchableOpacity style={styles.thumbnailBg} onPress={onPress}>
            <ImageProgress source={{ uri: thumbnail }} style={{ width: Layout.window.width, height: Layout.window.width * 0.6 }} />
            <View style={[
                styles.buttonUpload,
                styles.displayInlineBlock]}>
                <MaterialIcon name={'camera-alt'} size={16} color={Colors.lightGreyColor} />
                <Text style={{ color: Colors.lightText }}>  Cập nhật ảnh bìa</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    thumbnailBg: {
        width: Layout.window.width,
        height: Layout.window.width * 0.6,
    },
    buttonUpload: {
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.darkBlur,
        borderWidth: 1,
        borderColor: Colors.lightGreyColor,
        position: 'absolute',
        top: 10,
        left: 10
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row',
    },
})

export {
    Logo,
    UserAvatar,
    CoverImage
}

// from https://flatuicolors.com/
const defaultColors = [
    // '#2ecc71', // emerald
    // '#3498db', // peter river
    // '#8e44ad', // wisteria
    // '#e67e22', // carrot
    // '#e74c3c', // alizarin
    // '#1abc9c', // turquoise
    '#2c3e50', // midnight blue
];

function sumChars(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i);
    }

    return sum;
}

//   class UserAvatar extends React.PureComponent {
//     render() {
//       console.log('UserAvatar ', this.props)
//       let {
//         src,
//         name,
//         color,
//         textColor = '#fff',
//         colors = defaultColors,
//         fontDecrease,
//         size,
//         style,
//         imageStyle,
//         defaultName,
//         radius = 0.5
//       } = this.props;

//       // if (!fontDecrease) fontDecrease = 2.5;

//       // //if (!name) throw new Error('Avatar requires a name');

//       // if (typeof size !== 'number') size = parseInt(size);

//       // let abbr = name

//       // if (isNaN(radius)) radius = 0.5

//       // const borderRadius = size * radius;

//       // const imageLocalStyle = {
//       //   borderRadius
//       // };

//       // const innerStyle = {
//       //   borderRadius,
//       //   borderWidth: 1,
//       //   borderColor: 'transparent',
//       //   justifyContent: 'center',
//       //   alignItems: 'center'
//       // };

//       // if (size) {
//       //   imageLocalStyle.width = innerStyle.width = size;
//       //   imageLocalStyle.height = innerStyle.height = size;
//       // }

//       // let inner;
//       // if (src) {

//       //   const props = {
//       //     style: [imageLocalStyle, imageStyle],
//       //     source: { uri: src }
//       //   }

//       //   inner = React.createElement(this.props.component || Image, props)

//       // } else {
//       //   let background;
//       //   if (color) {
//       //     background = color;
//       //   } else {
//       //     // pick a deterministic color from the list
//       //     let i = sumChars(name) % colors.length;
//       //     background = colors[i];
//       //   }

//       //   innerStyle.backgroundColor = background;

//       //   inner = <Text style={{ fontSize: size / fontDecrease, color: textColor }}>{abbr}</Text>
//       // }
//       // console.log('UserAvatar ', this.props)
//       return (
//         <View style={[{ justifyContent: 'center', alignItems: 'center' }, styles.avatar, style]}>
//           <Image source={require('../../../assets/img/default-avatar-blue.png')} style={[styles.avatar, style]} />
//         </View>
//       )
//     }
//   }

//   const styles = StyleSheet.create({
//     avatar: {
//       height: Layout.window.width * 0.3,
//       width: Layout.window.width * 0.3,
//       borderRadius: Layout.window.width * 0.15,
//       borderWidth: 1,
//       borderColor: Colors.functionColorLight,
//     }
//   })

//   export {
//     UserAvatar
//   }