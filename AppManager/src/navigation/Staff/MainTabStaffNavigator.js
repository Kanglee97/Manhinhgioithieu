import React from 'react';
import {
    createStackNavigator,
    createBottomTabNavigator
} from 'react-navigation';

import { Colors, FontStyle, Layout } from '../../components/react-native-teso/Magic';
import { Text, StyleSheet } from 'react-native';
import { TabBarIconImage, TabBarIcon } from '../../components/react-native-teso';

//StoreScreen
import StoreScreen from '../../screens/Staff/NavScreen/StoreScreen/StoreScreen';
import ServiceChildsScreen from '../../screens/Staff/NavScreen/StoreScreen/Service/ServiceChildsScreen';
import ModelDetailScreen from '../../screens/Staff/NavScreen/StoreScreen/Service/ModelDetailScreen';
import OrderingScreen from '../../screens/Staff/NavScreen/StoreScreen/Service/OrderingScreen'
import DiscountDetailScreen from '../../screens/Staff/NavScreen/StoreScreen/Discount/DiscountDetailScreen'
//Order Screen
import OrderScreen from '../../screens/Staff/NavScreen/OrderScreen/OrderScreen';

//Message Screen
import MessageScreen from '../../screens/Staff/NavScreen/MessageScreen/MessageScreen';
import MessageDetailsScreen from '../../screens/Staff/NavScreen/MessageScreen/MessageDetailsScreen';

//AppointmentScreen
import AppointmentScreen from '../../screens/Staff/NavScreen/AppointmentScreen/AppointmentScreen';
import AppointmentDetailScreen from '../../screens/Staff/NavScreen/AppointmentScreen/AppointmentDetailScreen';
import CreateBookingScreen from '../../screens/Staff/NavScreen/AppointmentScreen/CreateBookingScreen';

//Account Screen
import AccountScreen from '../../screens/Staff/NavScreen/AccountScreen/AccountScreen';
import AccountInfoScreen from '../../screens/Staff/NavScreen/AccountScreen/AccountInfoScreen'
import NotificationScreen from '../../screens/Staff/NavScreen/AccountScreen/NotificationScreen'
import AccountBreakScheduleScreen from '../../screens/Staff/NavScreen/AccountScreen/AccountBreakScheduleScreen'
import AccountStatiticScreen from '../../screens/Staff/NavScreen/AccountScreen/AccountStatiticScreen'

const StoreStack = createStackNavigator({
    StoreStaff: {
        screen: StoreScreen
    },
    ServiceChilds: {
        screen: ServiceChildsScreen,
    },
    ModalDetail: {
        screen: ModelDetailScreen
    },
    AccountBreakSchedule: {
        screen: AccountBreakScheduleScreen
    },
    DiscountDetail: {
        screen: DiscountDetailScreen
    }
},
    {
        headerMode: 'none',
        initialRouteName: 'StoreStaff',
        transitionConfig,
    });

StoreStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return ({
        tabBarLabel: ({ focused }) => focused ? <Text style={styles.text}>CỬA HÀNG</Text> : null,
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                name='store'
                focused={focused}
            />
        ),
        tabBarVisible,
        tabBarOptions: {
            showLabel: true,
            upperCaseLabel: true,
            inactiveTintColor: Colors.tabIconDefault,
            activeTintColor: Colors.tabIconSelected,
            inactiveBackgroundColor: Colors.lightText,
            activeBackgroundColor: Colors.lightText,
            style: {
                paddingVertical: 0,
                borderTopWidth: 1,
                borderTopColor: 'rgba(242,242,242,.5)',
            }
        },
    })
};

const OrderStack = createStackNavigator({
    OrderStaff: {
        screen: OrderScreen
    },
    Ordering: {
        screen: OrderingScreen
    },
},
    {
        headerMode: 'none',
        initialRouteName: 'OrderStaff',
        transitionConfig,
    });

OrderStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return ({
        tabBarLabel: ({ focused }) => focused ? <Text style={styles.text}>ĐƠN HÀNG</Text> : null,
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                name='style'
                focused={focused}
            />
        ),
        tabBarVisible,
        tabBarOptions: {
            showLabel: true,
            upperCaseLabel: true,
            inactiveTintColor: Colors.tabIconDefault,
            activeTintColor: Colors.tabIconSelected,
            inactiveBackgroundColor: Colors.lightText,
            activeBackgroundColor: Colors.lightText,
            style: {
                paddingVertical: 0,
                borderTopWidth: 1,
                borderTopColor: 'rgba(242,242,242,.5)',
            }
        },
    })
};

const AppointmentStack = createStackNavigator({
    Appointment: {
        screen: AppointmentScreen
    },
    AppointmentDetail: {
        screen: AppointmentDetailScreen
    },
    CreateBooking: {
        screen: CreateBookingScreen
    }
},
    {
        headerMode: 'none',
        initialRouteName: 'Appointment',
        transitionConfig,
    });

AppointmentStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return ({
        tabBarLabel: ({ focused }) => focused ? <Text style={styles.text}>ĐƠN HÀNG</Text> : null,
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                name='event-note'
                focused={focused}
            />
        ),
        tabBarVisible,
        tabBarOptions: {
            showLabel: true,
            upperCaseLabel: true,
            inactiveTintColor: Colors.tabIconDefault,
            activeTintColor: Colors.tabIconSelected,
            inactiveBackgroundColor: Colors.lightText,
            activeBackgroundColor: Colors.lightText,
            style: {
                paddingVertical: 0,
                borderTopWidth: 1,
                borderTopColor: 'rgba(242,242,242,.5)',
            }
        },
    })
};

const MessageStack = createStackNavigator({
    MessageStaff: {
        screen: MessageScreen
    },
    MessageDetails: {
        screen: MessageDetailsScreen
    },
},
    {
        headerMode: 'none',
        initialRouteName: 'MessageStaff',
        transitionConfig,
    });

MessageStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return ({
        tabBarLabel: ({ focused }) => focused ? <Text style={styles.text}>TIN NHẮN</Text> : null,
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                name='email'
                focused={focused}
            />
        ),
        tabBarVisible,
        tabBarOptions: {
            showLabel: true,
            upperCaseLabel: true,
            inactiveTintColor: Colors.tabIconDefault,
            activeTintColor: Colors.tabIconSelected,
            inactiveBackgroundColor: Colors.lightText,
            activeBackgroundColor: Colors.lightText,
            style: {
                height: 50,
                borderTopWidth: 1,
                borderTopColor: 'rgba(242,242,242,.5)',
            }
        },
    })
};


const AccountStack = createStackNavigator({
    AccountStaff: {
        screen: AccountScreen,
    },
    AccountInfo: {
        screen: AccountInfoScreen
    },
    Notification: {
        screen: NotificationScreen
    },
    AccountStatitic: {
        screen: AccountStatiticScreen
    },
},
    {
        headerMode: 'none',
        initialRouteName: 'AccountStaff',
        transitionConfig,
    });

AccountStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return ({
        tabBarLabel: ({ focused }) => focused ? <Text style={styles.text}>TÀI KHOẢN</Text> : null,
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                name='person'
                focused={focused}
            />
        ),
        tabBarVisible,
        tabBarOptions: {
            showLabel: true,
            upperCaseLabel: true,
            inactiveTintColor: Colors.tabIconDefault,
            activeTintColor: Colors.tabIconSelected,
            inactiveBackgroundColor: Colors.lightText,
            activeBackgroundColor: Colors.lightText,
            style: {
                height: 50,
                borderTopWidth: 1,
                borderTopColor: 'rgba(242,242,242,.5)',
            }
        },
    })
};

const styles = StyleSheet.create({
    text: {
        width: '100%',
        textAlign: 'center',
        fontSize: FontStyle.smallText,
        fontFamily: FontStyle.mainFont,
        color: Colors.functionColorDark
    }
})

const transitionConfig = () => {
    return {
        transitionSpec: {
            duration: 750,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps

            const thisSceneIndex = scene.index
            const width = layout.initWidth

            const translateX = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex],
                outputRange: [width, 0],
            })

            return { transform: [{ translateX }] }
        },
    }
}

export default createBottomTabNavigator({
    Store: StoreStack,
    Order: OrderStack,
    Appointment: AppointmentStack,
    Message: MessageStack,
    Account: AccountStack
}, {
        lazy: true,
    });
