import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { MaterialIcon } from '../index';
import { Colors, FontStyle, Layout } from '../Magic';

class TimeRange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isStartTimeVisible: false,
            isEndTimeVisible: false,
            startTime: null,
            endTime: null
        };
    }

    _toggleStartTimePicker = () => this.setState({ isStartTimeVisible: !this.state.isStartTimeVisible });

    _handleStartTimePicked = (time) => {
        console.log('A date has been picked: ', time);
        this.setState({ startTime: Moment(time).format('HH:mm') });
        this._toggleStartTimePicker();
    };

    _toggleEndTimePicker = () => this.setState({ isEndTimeVisible: !this.state.isEndTimeVisible });

    _handleEndTimePicked = (time) => {
        console.log('A date has been picked: ', time);
        this.setState({ endTime: Moment(time).format('HH:mm') });
        this._toggleEndTimePicker();
    };

    render() {
        const { isStartTimeVisible, isEndTimeVisible, startTime, endTime } = this.state;
        return (
            <View>
                <View style={[styles.form, styles.displayInlineBlock]}>
                    <View style={{ width: '45%', marginRight: '10%' }}>
                        <Text style={styles.formLabel}>{this.props.startLabel}</Text>
                        <TextInput style={styles.formInput}
                            onFocus={() => this._toggleStartTimePicker()}
                            onChangeText={this.props.onChangeStartTime}
                            value={this.props.startTime}

                        />
                        <TouchableOpacity style={styles.timepicker} onPress={() => this._toggleStartTimePicker()}>
                            <MaterialIcon name={'schedule'} size={20} color={Colors.functionColorDark} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '45%' }}>
                        <Text style={styles.formLabel}>{this.props.endLabel}</Text>
                        <TextInput style={styles.formInput}
                            onFocus={() => this._toggleEndTimePicker()}
                            onChangeText={this.props.onChangeEndTime}
                            value={this.props.endTime}

                        />
                        <TouchableOpacity style={styles.timepicker} onPress={() => this._toggleEndTimePicker()}>
                            <MaterialIcon name={'schedule'} size={20} color={Colors.functionColorDark} />
                        </TouchableOpacity>
                    </View>
                </View>
                <DateTimePicker
                    mode={'time'}
                    isVisible={isStartTimeVisible}
                    onConfirm={this._handleStartTimePicked}
                    onCancel={this._toggleStartTimePicker}
                />
                <DateTimePicker
                    mode={'time'}
                    isVisible={isEndTimeVisible}
                    onConfirm={this._handleEndTimePicked}
                    onCancel={this._toggleEndTimePicker}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    form: {
        marginTop: 20,
    },
    formLabel: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText,
    },
    formInput: {
        height: 40,
        borderWidth: 1,
        borderColor: Colors.darkBlur,
        paddingBottom: 10,
        paddingLeft: 10,
        color: Colors.darkText,
        borderRadius: 5,
        marginTop: 6.2,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    timepicker: {
        position: 'absolute',
        top: '55%',
        right: 8,
        height: 20,
        width: 20
    }
})

export {
    TimeRange
}