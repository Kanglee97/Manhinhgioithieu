import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Platform } from 'react-native';
import { Colors, FontStyle, Layout } from '../Magic';
import { Dropdown } from 'react-native-material-dropdown';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

var FloatingLabel = require('react-native-floating-labels');
class FormInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            borderColor: Colors.bestBlur,
            borderWidth: 1,
        };
    }

    render() {
        const { borderColor } = this.state;
        return (
            <View style={[styles.form, this.props.formStyle]}>
                {this.props.label && <Text style={styles.formLabel}>
                    {this.props.label} {this.props.require && <Text style={{ color: 'red', fontSize: FontStyle.smallText }}>*</Text>}
                </Text>}
                {this.props.textBox &&
                    <View style={{ justifyContent: 'center' }}>
                        <TextInput
                            style={[styles.formInput,
                            { borderWidth: this.props.line ? 0 : 1, borderBottomWidth: 1, borderColor: borderColor },
                            this.props.line && { paddingBottom: -4, paddingLeft: 5, marginTop: -5 },
                            this.props.rightAlign && { textAlign: 'right' },
                            this.props.inputStyle]}
                            onFocus={() => {
                                this.setState({ borderColor: Colors.functionColorLight, borderWidth: 1 });
                            }}
                            onBlur={() => {
                                this.setState({ borderColor: Colors.bestBlur, borderWidth: 1 });
                            }}
                            {...this.props}
                        />
                        {this.props.errorMessage &&
                            <Text style={[{ color: Colors.errorText, fontStyle: 'italic', fontSize: FontStyle.miniText }, this.props.errorStyle]}>
                                {this.props.errorMessage || 'Lỗi định dạng!'}
                            </Text>
                        }
                        {this.props.notes &&
                            <Text style={[{ color: Colors.darkBlur, fontStyle: 'italic', fontSize: FontStyle.smallText }, this.props.notes]}>
                                {this.props.notes}
                            </Text>
                        }
                    </View>
                }
                {this.props.dropDown &&
                    <Dropdown
                        {...this.props}
                        fontSize={14}
                        dropdownOffset={{ top: 8, left: 10 }}
                        baseColor='rgba(0,0,0,0)'
                        containerStyle={[styles.containerDropdownStyle, this.props.containerDropdownStyle]}
                    />
                }
                {this.props.richText &&
                    <AutoGrowingTextInput
                        style={[styles.formInput, this.props.inputStyle, {
                            borderWidth: this.props.line ? 0 : 1,
                            borderBottomWidth: 1,
                            borderColor: borderColor,
                            paddingBottom: 25,
                            paddingTop: 5,
                            paddingRight: 5
                        }]}
                        maxLength={this.props.maxLength || 200}
                        onFocus={() => {
                            this.setState({ borderColor: Colors.functionColorLight, borderWidth: 1 });
                        }}
                        onBlur={() => {
                            this.setState({ borderColor: Colors.bestBlur, borderWidth: 1 });
                        }}
                        {...this.props} />
                }
                {this.props.children}
                {this.props.count &&
                    <View style={[styles.countComponent, this.props.countComponentStyle]}>
                        {this.props.count}
                    </View>
                }
                <View style={[styles.rightComponent, this.props.rightComponentStyle]}>
                    {this.props.rightComponent}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    form: {
        marginTop: 10,
    },
    formLabel: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText,
        paddingLeft: 2
    },
    formInput: {
        height: 40,
        borderWidth: 1,
        borderColor: Colors.darkBlur,
        paddingBottom: 10,
        paddingLeft: 10,
        color: Colors.darkText,
        borderRadius: 5,
        marginTop: 3,
        fontSize: FontStyle.mdText
    },
    rightComponent: {
        position: 'absolute',
        top: '50%',
        right: 8,
        height: '100%',
    },
    countComponent: {
        position: 'absolute',
        bottom: '5%',
        right: 8,
    },
    containerDropdownStyle: {
        zIndex: -1,
        height: 40,
        borderWidth: 1,
        borderColor: Colors.darkBlur,
        paddingLeft: 10,
        borderRadius: 5,
        marginTop: 6.2,
        position: 'relative'
    },
})

export default FormInput;