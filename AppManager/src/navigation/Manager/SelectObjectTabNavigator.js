import {
    createStackNavigator,
    createMaterialTopTabNavigator,
    createAppContainer
} from 'react-navigation';

import { Colors, FontStyle, Layout } from '../../components/react-native-teso/Magic';
import StoreTab from '../../screens/Manager/NavScreen/MessageScreen/StoreTab';
import EmployeeTab from '../../screens/Manager/NavScreen/MessageScreen/EmployeeTab';

const StoreTabStack = createStackNavigator({
    StoreTab: StoreTab
});

StoreTabStack.navigationOptions = {
    tabBarLabel: 'Cửa hàng',
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

const EmployeeTabStack = createStackNavigator({
    EmployeeTab: EmployeeTab
});

EmployeeTabStack.navigationOptions = {
    tabBarLabel: 'Nhân viên',
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

const SelectObjectTab = createMaterialTopTabNavigator({
    StoreTab: StoreTabStack,
    EmployeeTab: EmployeeTabStack
}, {
        lazy: true
    })

export default createAppContainer(SelectObjectTab);