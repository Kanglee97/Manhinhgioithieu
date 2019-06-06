import React from 'react';
import {
    createStackNavigator,
    createBottomTabNavigator,
} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import { Colors, FontStyle, Layout } from '../../components/react-native-teso/Magic';
import { Text, StyleSheet } from 'react-native';
import { TabBarIconImage, TabBarIcon } from '../../components/react-native-teso';

import StoreScreen from '../../screens/Manager/NavScreen/StoreScreen/StoreScreen';
//Service
import OptionChildsScreen from '../../screens/Manager/NavScreen/StoreScreen/Service/OptionChildsScreen';
import ListOfServicesScreen from '../../screens/Manager/NavScreen/StoreScreen/Service/ListOfServicesScreen';
import CreateServiceScreen from '../../screens/Manager/NavScreen/StoreScreen/Service/CreateServiceScreen';
import ServiceChildsScreen from '../../screens/Manager/NavScreen/StoreScreen/Service/ServiceChildsScreen';
import ModelDetailScreen from '../../screens/Manager/NavScreen/StoreScreen/Service/ModelDetailScreen';
import EditModelScreen from '../../screens/Manager/NavScreen/StoreScreen/Service/EditModelScreen';
import EditOptionScreen from '../../screens/Manager/NavScreen/StoreScreen/Service/EditOptionScreen';
import YourServiceTab from '../../screens/Manager/NavScreen/StoreScreen/Service/YourServiceTab';
import EditYourServiceScreen from '../../screens/Manager/NavScreen/StoreScreen/Service/EditYourServiceScreen';

//Discount
import CreateDiscountScreen from '../../screens/Manager/NavScreen/StoreScreen/Discount/CreateDiscountScreen';
import AddServiceToDiscountScreen from '../../screens/Manager/NavScreen/StoreScreen/Discount/AddServiceToDiscountScreen';
import DiscountDetailScreen from '../../screens/Manager/NavScreen/StoreScreen/Discount/DiscountDetailScreen'

//Employee 
import EmployeeScreen from '../../screens/Manager/NavScreen/EmployeeScreen/EmployeeScreen';
import CreateEmployeeScreen from '../../screens/Manager/NavScreen/EmployeeScreen/CreateEmployeeScreen'
import CustomerReportScreen from '../../screens/Manager/NavScreen/EmployeeScreen/CustomerReportScreen'
import EmployeeDetailScreen from '../../screens/Manager/NavScreen/EmployeeScreen/EmployeeDetailScreen'
import EditEmployeeScreen from '../../screens/Manager/NavScreen/EmployeeScreen/EditEmployeeScreen'

//Customer
import CustomerScreen from '../../screens/Manager/NavScreen/CustomerScreen/CustomerScreen'
import CustomerDetailScreen from '../../screens/Manager/NavScreen/CustomerScreen/CustomerDetailScreen'
import CustomerChatScreen from '../../screens/Manager/NavScreen/CustomerScreen/CustomerChatScreen'
import AppointmentDetailScreen from '../../screens/Manager/NavScreen/CustomerScreen/AppointmentDetailScreen';
import SelectEmployeeScreen from '../../screens/Manager/NavScreen/CustomerScreen/SelectEmployeeScreen';
import CreateBookingScreen from '../../screens/Manager/NavScreen/CustomerScreen/CreateBookingScreen';

//Message
import MessageScreen from '../../screens/Manager/NavScreen/MessageScreen/MessageScreen';
import MessageDetailsScreen from '../../screens/Manager/NavScreen/MessageScreen/MessageDetailsScreen';
import SelectObjectScreen from '../../screens/Manager/NavScreen/MessageScreen/SelectObjectScreen';

//Statistical
import StatisticalScreen from '../../screens/Manager/NavScreen/StatisticalScreen/StatisticalScreen';

//Account
import AccountScreen from '../../screens/Manager/NavScreen/AccountScreen/AccountScreen';
import AccountInfoScreen from '../../screens/Manager/NavScreen/AccountScreen/AccountInfoScreen';
import NotificationScreen from '../../screens/Manager/NavScreen/AccountScreen/NotificationScreen';
import UpgradeAccountScreen from '../../screens/Manager/NavScreen/AccountScreen/UpgradeAccountScreen';
import RegisterPackageScreen from '../../screens/Manager/NavScreen/AccountScreen/RegisterPackageScreen';
import ActiveAccountScreen from '../../screens/Manager/NavScreen/AccountScreen/ActiveAccountScreen';

const StoreStack = createStackNavigator({
    Store: {
        screen: StoreScreen
    },
    CreateService: {
        screen: CreateServiceScreen
    },
    ListOfServices: {
        screen: ListOfServicesScreen
    },
    ServiceChilds: {
        screen: ServiceChildsScreen
    },
    ModalDetail: {
        screen: ModelDetailScreen
    },
    EditModal: {
        screen: EditModelScreen
    },
    EditOption: {
        screen: EditOptionScreen
    },
    OptionChilds: {
        screen: OptionChildsScreen
    },
    CreateDiscount: {
        screen: CreateDiscountScreen
    },
    AddServiceToDiscount: {
        screen: AddServiceToDiscountScreen
    },
    DiscountDetail: {
        screen: DiscountDetailScreen
    },
    YourServiceTab: {
        screen: YourServiceTab
    },
    EditYourService: {
        screen: EditYourServiceScreen
    }
}, {
        headerMode: 'none',
        initialRouteName: 'Store',
        transitionConfig,
    });
// nav cua hang
StoreStack.navigationOptions = ({ navigation }) => {

    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return ({
        labeled: true,
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
// nav nhan vien
const EmployeeStack = createStackNavigator({
    Employee: {
        screen: EmployeeScreen
    },
    CreateEmployee: {
        screen: CreateEmployeeScreen
    },
    CustomerReport: {
        screen: CustomerReportScreen
    },
    DetailEmployee: {
        screen: EmployeeDetailScreen
    },
    EditEmployee: {
        screen: EditEmployeeScreen
    }
}, {
        headerMode: 'none',
        initialRouteName: 'Employee',
        transitionConfig,
    });

EmployeeStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return ({
        headerTitle: 'nhan vien',
        tabBarLabel: ({ focused }) => focused ? <Text style={styles.text}>NHÂN VIÊN</Text> : null,
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
                paddingVertical: 0,
                borderTopWidth: 1,
                borderTopColor: 'rgba(242,242,242,.5)',
            }
        },
    })
};

const CustomerStack = createStackNavigator({
    Customer: {
        screen: CustomerScreen,
    },
    CustomerDetail: {
        screen: CustomerDetailScreen
    },
    CustomerChat: {
        screen: CustomerChatScreen
    },
    AppointmentDetail: {
        screen: AppointmentDetailScreen
    },
    SelectEmployee: {
        screen: SelectEmployeeScreen
    },
    CreateBooking: {
        screen: CreateBookingScreen
    }
}, {
        headerMode: 'none',
        initialRouteName: 'Customer',
        transitionConfig,
    });

CustomerStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return ({
        tabBarLabel: ({ focused }) => focused ? <Text style={styles.text}>KHÁCH HÀNG</Text> : null,
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                name='people'
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

const StatisticalStack = createStackNavigator({
    Statistical: {
        screen: StatisticalScreen
    }
}, {
        headerMode: 'none',
        initialRouteName: 'Statistical',
        transitionConfig,
    });

StatisticalStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return ({
        tabBarLabel: ({ focused }) => focused ? <Text style={styles.text}>BÁO CÁO</Text> : null,
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                name='poll'
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

const AccountStack = createStackNavigator({
    Account: {
        screen: AccountScreen
    },
    AccountInfo: {
        screen: AccountInfoScreen
    },
    Notification: {
        screen: NotificationScreen
    },
    Message: {
        screen: MessageScreen
    },
    MessageDetails: {
        screen: MessageDetailsScreen
    },
    SelectObject: {
        screen: SelectObjectScreen
    },
    UpgradeAccount: {
        screen: UpgradeAccountScreen
    },
    RegisterPackage: {
        screen: RegisterPackageScreen
    },
    ActiveAccount: {
        screen: ActiveAccountScreen
    }
}, {
        headerMode: 'none',
        initialRouteName: 'Account',
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
                name='account-circle'
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
            },
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
    Employee: EmployeeStack,
    Customer: CustomerStack,
    Statistical: StatisticalStack,
    Account: AccountStack
}, {
        lazy: true,
    });

// export default createMaterialBottomTabNavigator({
//     Store: { screen: StoreStack },
//     Employee: { screen: EmployeeStack },
//     Customer: { screen: CustomerStack },
//     Statistical: { screen: StatisticalStack },
//     Account: { screen: AccountStack },

//   }, {
//     initialRouteName: 'Store',
//     barStyle: {backgroundColor: Colors.lightBg},
//     labeled: true,
//     shifting: false,
//     activeColor: '#f0edf6',
//     inactiveColor: {backgroundColor: Colors.lightBg},
//     barStyle: { backgroundColor: 'white' },
//   }, {
//         lazy: true,
//         });
