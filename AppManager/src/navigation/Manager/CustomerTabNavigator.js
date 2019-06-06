import {
    createStackNavigator,
    createMaterialTopTabNavigator,
    createAppContainer
} from 'react-navigation';

//Service
import AppointmentTab from '../../screens/Manager/NavScreen/CustomerScreen/AppointmentTab';
//CustomerTab
import CustomerTab from '../../screens/Manager/NavScreen/CustomerScreen/CustomerTab';
import { Colors, FontStyle, Layout } from '../../components/react-native-teso/Magic';

const AppointmentTabStack = createStackNavigator({
    AppointmentTab: {
        screen: AppointmentTab,
    },
}, {
        headerMode: 'none'
    });

AppointmentTabStack.navigationOptions = {
    tabBarLabel: 'Lịch hẹn',
    tabBarOptions: {
        showLabel: true,
        upperCaseLabel: false,
        inactiveTintcolor: Colors.darkText,
        activeTintcolor: Colors.darkText,
        indicatorStyle: {
            backgroundColor: Colors.functionColorLight,
            height: 3
        },
        labelStyle: {
            fontSize: FontStyle.mdText,
            fontWeight: 'bold',
            color: Colors.darkText,
        },
        style: {
            backgroundColor: Colors.lightBg,
        }
    },
};

const CustomerTabStack = createStackNavigator({
    CustomerTab: {
        screen: CustomerTab
    },
});

CustomerTabStack.navigationOptions = {
    tabBarLabel: 'Khách hàng',
    tabBarOptions: {
        showLabel: true,
        upperCaseLabel: false,
        inactiveTintcolor: Colors.darkText,
        activeTintcolor: Colors.darkText,
        indicatorStyle: {
            backgroundColor: Colors.functionColorLight,
            height: 3
        },
        labelStyle: {
            fontSize: FontStyle.mdText,
            fontWeight: 'bold',
            color: Colors.darkText,
        },
        style: {
            backgroundColor: Colors.lightBg,
        }
    },
};

const StoreTab = createMaterialTopTabNavigator({
    AppointmentTab: AppointmentTabStack,
    CustomerTab: CustomerTabStack
}, {
        lazy: true
    })

export default createAppContainer(StoreTab);