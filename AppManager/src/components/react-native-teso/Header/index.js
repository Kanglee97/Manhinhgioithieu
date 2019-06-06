import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Colors, FontStyle, Layout } from '../Magic';

class MainHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderLeftComponent() {
        return (
            <TouchableOpacity style={[{
                height: '100%', width: '100%',
                alignItems: 'flex-start', justifyContent: 'center',
                backgroundColor: this.props.backgroundColor,
                paddingHorizontal: 10,
                marginLeft: -10, paddingLeft: 20
            }, this.props.rounded && {
                backgroundColor: Colors.lightBg,
                borderRadius: 50,
                width: 45,
                height: 45,
                paddingLeft: 15
            }]} onPress={this.props.leftPress}>
                {this.props.leftComponent || <FontAwesome5 name='arrow-left' size={FontStyle.mdText} color={Colors.functionColorLight} />}
            </TouchableOpacity>
        );
    }

    renderCenterComponent() {
        return (
            <View style={[{ height: '100%', backgroundColor: this.props.rounded ? Colors.transparent : this.props.backgroundColor }]}>
                {this.props.centerPress ?
                    <TouchableOpacity style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }} onPress={this.props.centerPress}>
                        {this.props.centerComponent}
                    </TouchableOpacity>
                    :
                    <View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: FontStyle.bigText, textAlign: 'center', fontFamily: FontStyle.mainFont, color: this.props.textCenterColor || Colors.darkText, fontWeight: 'bold', maxWidth: '90%' }}
                            numberOfLines={1} ellipsizeMode={'tail'}>
                            {this.props.centerComponent}
                        </Text>
                    </View>
                }
            </View>
        )
    }

    renderRightComponent() {
        return (
            <TouchableOpacity
                style={[{
                    height: '100%', width: '100%',
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: this.props.backgroundColor,
                    marginRight: -10,
                    paddingHorizontal: 10,
                }, this.props.rounded && {
                    backgroundColor: Colors.lightBg,
                    borderRadius: 50,
                    width: 45,
                    height: 45,
                    paddingLeft: 10,
                }]}
                disabled={this.props.rightDisabled}
                onPress={this.props.rightPress}>
                {this.props.rightComponent || (< Text style={[{ fontSize: FontStyle.mdText, color: Colors.functionColorLight, fontFamily: FontStyle.mainFont }, this.props.rightDisabled && { color: Colors.blueBlur }]}>Lưu</Text>)}
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <Header
                {...this.props}
                backgroundColor={this.props.backgroundColor || Colors.lightBg}
                statusBarProps={ this.props.statusBarProps ||
                    { barStyle: this.props.darkBar ? 'light-content' : 'dark-content', backgroundColor: this.props.darkBar ? Colors.lightGreyColor : Colors.lightBg }
                }
                barStyle={this.props.barStyle || this.props.darkBar ? 'light-content' : 'dark-content'}
                placement={this.props.placement || 'center'}
                leftComponent={this.props.reRenderLeftComponent || (this.props.leftPress ? this.renderLeftComponent() : null)}
                centerComponent={this.props.reRenderCenterComponent || (this.props.centerComponent ? this.renderCenterComponent() : null)}
                rightComponent={this.props.reRenderRightComponent || (this.props.rightPress ? this.renderRightComponent() : null)}
                containerStyle={[styles.blockHeader, { backgroundColor: this.props.backgroundColor }, this.props.containerStyle]}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    blockHeader: {
        justifyContent: 'center',
        height: 70,
        marginTop: -24,
        borderBottomColor: Colors.transparent,
        borderBottomWidth: 1,
    },
})

export {
    MainHeader
};
