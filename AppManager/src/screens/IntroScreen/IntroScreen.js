import React from 'react';
import { StyleSheet, View, Text, Image, I18nManager } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Layout } from '../../components/react-native-teso/Magic';




const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 22,
        color: 'white',
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginBottom: 16,
    },
    buttonCircle: {
        marginTop: 5,
        width: 24,
        height: 24,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const slides = [
    {
        key: 'somethun',
        title: 'MANAGE SALON SERVICES',
        text: 'You can manage your salon services and promotions; create, edit, remove services easily.',
        image: 'https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
        colors: ['#63E2FF', '#B066FE'],
    },
    {
        key: 'somethun1',
        title: 'CUSTOMER RELATIONSHIP MANAGEMENT',
        text: 'As a manager, you can manage your clients booking, promotion offers, see when the customer visited previously, all in one application. Pushing promotion notifications to your clients can be done easily by just few taps on your phone!.',
        image: 'https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
        colors: ['#A3A1FF', '#3A3897'],
    },
    {
        key: 'somethun2',
        title: 'CUSTOMER RELATIONSHIP MANAGEMENT',
        text: '',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoopCobPmE8jIUZcQG9Tu9wTLHy-ye4-dZJJIO6rI57mwPoUvmaQ',
        colors: ['#29ABE2', '#4F00BC'],
    },
    {
        key: 'somethun3',
        title: 'MANAGE REVENUE AND PAYMENT',
        text: 'All revenue, incomes of your salon, sales of each employee will be recorded and display visually on your dashboard. You can compare revenues by month, check income for specific date range. You will never miss an important financial detail!',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoopCobPmE8jIUZcQG9Tu9wTLHy-ye4-dZJJIO6rI57mwPoUvmaQ',
        colors: ['#29ABE2', '#4F00BC'],
    },
];

export default class App extends React.Component {
    static navigationOptions = {
        header: null
    };
    _renderItem = props => (
        <LinearGradient
            style={[styles.mainContent, {
                paddingTop: props.topSpacer,
                paddingBottom: props.bottomSpacer,
                width: props.width,
                height: props.height,
            }]}
            colors={props.colors}
            start={{ x: 0, y: .1 }} end={{ x: .1, y: 1 }}
        >
            <Image source={{ uri: props.image }}
                style={{ width: Layout.window.width * 0.9, height: Layout.window.width * 0.7 }} />


            <View>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.text}>{props.text}</Text>
                <Text></Text>
            </View>
        </LinearGradient>
    );
    _renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Image source={require('../../assets/img/next.png')} style={{ marginTop: 10, marginRight: 10 }} />
            </View>
        );
    }
    // _renderPrevButton = () => {
    //   return (
    //     <View style={styles.buttonCircle}>
    //      <Image source={require('../../assets/img/next.png')} style={{}} />
    //     </View>
    //   );
    // }
    _renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Image source={require('../../assets/img/done.png')} style={{ marginTop: 10, marginRight: 10 }} />
            </View>
        );
    }

    render() {
        return (
            <AppIntroSlider
                slides={slides}
                renderItem={this._renderItem}
                //bottomButton
                //renderPrevButton={this._renderPrevButton}
                renderDoneButton={this._renderDoneButton}

                renderNextButton={this._renderNextButton}

                showSkipButton
            // showNextButton



            />
        );
    }
}

