import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Platform, Button } from 'react-native';
import { Colors, FontStyle, Layout } from '../Magic';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { ButtonGradient, Card8, MaterialIcon, CustomButtonGradient } from '../index';
import NavigationService from '../../../navigation/NavigationService';
import { ButtonOutline, ButtonSolid } from '../ButtonGradient';

class PopUpConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <Modal isVisible={this.props.isVisible}
                backdropColor={this.props.backdropColor || Colors.darkBlur}
                animationIn='fadeIn'
                animationOut='fadeOut'
                onBackdropPress={this.props.onBackdropPress || this.props.confirmCancelPress}
                style={[styles.modalStyle, { top: '25%', left: '7.5%' }, this.props.style]}
                {...this.props}>
                <Text style={styles.modalText}>
                    {this.props.modalText}
                </Text>
                <View style={[styles.displayInlineBlock]}>
                    {!this.props.approve &&
                        <ButtonSolid
                            width={'50%'}
                            onPress={this.props.confirmPress}
                            label={this.props.confirmText} />
                    }
                    <ButtonOutline label={this.props.confirmCancel} width={'50%'} onPress={this.props.confirmCancelPress} />
                    {this.props.approve &&
                        <ButtonSolid
                            onPress={this.props.confirmPress}
                            label={this.props.confirmText}
                            width={'50%'}
                            backgroundColor={Colors.primaryButton} />
                    }
                </View>
            </Modal>
        );
    }
}

class PopUpInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Modal isVisible={this.props.isVisible}
                backdropColor={this.props.backdropColor || Colors.darkBlur}
                animationIn='slideInUp'
                animationOut='slideOutDown'
                onBackdropPress={this.props.onBackdropPress || this.props.pressCancel}
                style={[styles.modalStyle, { top: '25%', left: '7.5%' }, this.props.style]}
                {...this.props}>
                {this.props.children ||
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.modalTitle}>
                            {this.props.title}
                        </Text>
                        <TextInput style={[styles.formInput, { marginTop: Layout.window.height * 0.02 }]}
                            onChangeText={this.props.onChangeText}
                            value={this.props.value}
                            placeholder={this.props.placeholder}
                            secureTextEntry={this.props.secureTextEntry}
                            autoFocus />
                        <View style={[styles.displayInlineBlock, { marginTop: 20 }]}>
                            <ButtonOutline width={'50%'}
                                label={'HỦY BỎ'}
                                onPress={this.props.pressCancel} />
                            <ButtonSolid disable={this.props.submitDisabled}
                                backgroundColor={Colors.primaryButton}
                                width={'50%'}
                                label={String(this.props.content).toUpperCase()}
                                onPress={this.props.pressSubmit} />
                        </View>
                    </View>
                }
            </Modal>
        );
    }
}

class PopUpDownToTop extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Modal style={[styles.modalStyleDownToTop, this.props.containerStyle]}
                isVisible={this.props.isVisible}
                backdropColor={this.props.backdropColor || Colors.darkBlur}
                animationIn='fadeIn'
                animationOut='fadeOut'
                onBackdropPress={this.props.onBackdropPress || this.props.onClose}
                {...this.props}>
                <View style={{ alignItems: 'center' }}>
                    {this.props.children}
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={this.props.onClose}>
                    <FontAwesome5 name={'times'} size={20} color={Colors.dark9} />
                </TouchableOpacity>
            </Modal>
        );
    }
}

class PopUpUploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Modal
                animationInTiming={100}
                animationOutTiming={100}
                style={[styles.modalImageStyle, this.props.style]}
                isVisible={this.props.isVisible}
                backdropColor={this.props.backdropColor || Colors.darkBlur}
                animationIn='slideInUp'
                animationOut='slideOutDown'
                onBackdropPress={this.props.onBackdropPress || this.props.pressCancel}
                {...this.props}>
                <TouchableOpacity style={[styles.recordRow, { borderBottomColor: Colors.functionColorLight, borderBottomWidth: 1 }]} onPress={this.props.takeImage}>
                    <View style={[styles.displayInlineBlock, { alignItems: 'center' }]}>
                        <MaterialIcon name={Platform.OS == 'ios' ? 'camera' : 'photo-camera'} size={25} color={Colors.functionColorDark} />
                        <Text style={[styles.textBold, { textAlign: 'center', fontWeight: 'normal', marginLeft: 5 }]}>Chụp ảnh</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.recordRow} onPress={this.props.selectImage}>
                    <View style={[styles.displayInlineBlock, { alignItems: 'center' }]}>
                        <MaterialIcon name={'photo-library'} size={25} color={Colors.functionColorDark} />
                        <Text style={[styles.textBold, { textAlign: 'center', fontWeight: 'normal', marginLeft: 5 }]}>Chọn ảnh từ thư viện</Text>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}

class PopUpSelectService extends Component {


    render() {
        return (
            <Modal style={[styles.modalStyleDownToTopNoneRadius, this.props.style]}
                isVisible={this.props.isVisible}
                backdropColor={this.props.backdropColor || Colors.darkBlur}
                animationIn='slideInUp'
                animationOut='slideOutDown'
                onBackdropPress={this.props.onBackdropPress || this.props.onClose}
                {...this.props}>
                <LinearGradient start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#2D5C81', '#2F87AB', '#32B4D8']}
                    style={[styles.headerGradient]}>
                    <View style={[styles.headerGradient]}>
                        <Text style={{ color: Colors.lightBg, fontSize: FontStyle.mdText }}>Dịch vụ</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={this.props.onClose}>
                            <FontAwesome5 name={'times'} size={20} color={Colors.lightBg} />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                {!this.props.onlyList &&
                    <View>
                        <Card8 modelStyle={styles.modelStyle}
                            isPopup
                            {...this.props} />
                        <View style={styles.optionTitle}>
                            <Text style={{ fontSize: FontStyle.mdText, color: Colors.darkText }}>Tùy chọn</Text>
                        </View>
                    </View>
                }
                <View style={{ width: Layout.window.width }}>
                    {this.props.children}
                </View>
                {this.props.bottomBlock}
            </Modal>
        );
    }
}

class PopUpRemind extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customBackgroundDialog: false,
            defaultAnimationDialog: false,
        };
    }

    render() {
        return (
            <Modal isVisible={this.props.isVisibleUpgradeStore}
                backdropColor={Colors.darkBlur}
                animationIn='slideInUp'
                animationOut='slideOutDown'
                onBackdropPress={this.props.onBackdropPress}
                style={styles.dropdownBlock}>
                <View style={{ padding: 10, marginBottom: 10 }}>
                    <Text style={[styles.text, { alignSelf: 'flex-start', fontWeight: 'bold', fontSize: FontStyle.mdText }]}>{this.props.title || 'Nhắc nhở!'}</Text>
                </View>
                <Text style={{ padding: 10, marginBottom: 10, color: '#000000' }}>{this.props.limitContent}</Text>
                <View style={styles.hairline} />
                <View style={[styles.displayInlineBlock, { justifyContent: 'space-around', alignItems: 'center' }]}>
                    {this.props.onPressNo &&
                        <TouchableOpacity onPress={this.props.onPressNo}>
                            <Text style={[styles.text, { padding: 5, color: Colors.darkGreyColor, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>Không, cảm ơn.</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={this.props.onPressOk}>
                        <Text style={[styles.text, { padding: 5, color: Colors.functionColorLight, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>{this.props.okLabel || 'Tìm hiểu ngay'}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        position: 'absolute',
        backgroundColor: Colors.lightBg,
        width: Layout.window.width * 0.75,
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    hairline: {
        backgroundColor: '#EAEAEA',
        marginBottom: 10,
        height: 1,
        width: Layout.window.width * 0.80
    },
    modalText: {
        textAlign: 'center',
        fontFamily: FontStyle.mainFont,
        fontSize: FontStyle.mdText,
        color: Colors.darkText,
        marginTop: 30,
        marginBottom: 30,
        width: Layout.window.width * 0.5
    },
    cancelBtn: {
        backgroundColor: Colors.transparent,
        height: 40,
        width: Layout.window.width * 0.6,
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    delBtn: {
        backgroundColor: Colors.dangerColor,
        height: 40,
        width: Layout.window.width * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 20,
    },
    formInput: {
        height: 40,
        width: Layout.window.width * 0.65,
        borderWidth: 1,
        borderColor: Colors.darkBlur,
        paddingBottom: 10,
        paddingLeft: 10,
        color: Colors.darkText,
        borderRadius: 5,
        marginTop: 6.2,
    },
    modalTitle: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText,
        fontFamily: FontStyle.mainFont
    },
    modalStyleDownToTop: {
        position: 'absolute',
        top: '20%',
        left: '7.5%',
        backgroundColor: Colors.lightBg,
        width: Layout.window.width * 0.75,
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    closeBtn: {
        position: 'absolute',
        top: 10,
        right: 0,
        width: 30,
        height: 50
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    textBold: {
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        color: Colors.functionColorLight,
        fontWeight: 'bold',
    },
    modalStyleDownToTopNoneRadius: {
        position: 'absolute',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: Layout.window.width,
        bottom: Layout.window.width * -0.05,
        left: Layout.window.width * -0.05,
        backgroundColor: Colors.lightBg,
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    headerGradient: {
        width: Layout.window.width,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    modelStyle: {
        height: 93.11,
        width: Layout.window.width,
        marginBottom: 0,
        borderRadius: 0,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: Colors.functionColorLight,
        borderRightColor: Colors.functionColorLight,
        backgroundColor: Colors.lightBg,
        shadowColor: Colors.lightBg,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    optionTitle: {
        height: 40,
        width: Layout.window.width,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.functionColorLight,
        borderBottomWidth: 1,
        borderBottomColor: Colors.functionColorLight,
    },
    modalImageStyle: {
        position: 'absolute',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: Layout.window.width,
        bottom: Layout.window.width * -0.05,
        left: Layout.window.width * -0.05,
        backgroundColor: Colors.lightBg,
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    recordRow: {
        height: 50,
        width: Layout.window.width,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    dropdownBlock: {
        position: 'absolute',
        top: '30%',
        backgroundColor: Colors.lightBg,
        width: Layout.window.width * 0.9,
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        borderRadius: 5,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    text: {
        color: Colors.darkText,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
    },
});

export {
    PopUpConfirm,
    PopUpInput,
    PopUpDownToTop,
    PopUpUploadImage,
    PopUpSelectService,
    PopUpRemind
} 
