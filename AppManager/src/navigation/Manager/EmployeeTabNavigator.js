import {
    createStackNavigator,
    createMaterialTopTabNavigator,
    createAppContainer
} from 'react-navigation';

//Service
import EmployeeListTab from '../../screens/Manager/NavScreen/EmployeeScreen/EmployeeListTab';
//BreakScheduleTab
import BreakScheduleTab from '../../screens/Manager/NavScreen/EmployeeScreen/BreakScheduleTab';
import { Colors, FontStyle, Layout } from '../../components/react-native-teso/Magic';

const EmployeeListTabStack = createStackNavigator({
    EmployeeListTab: {
        screen: EmployeeListTab,
    },
}, {
        headerMode: 'none'
    });

EmployeeListTabStack.navigationOptions = {
    tabBarLabel: 'Danh sách',
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

const BreakScheduleTabStack = createStackNavigator({
    BreakScheduleTab: {
        screen: BreakScheduleTab
    },
});

BreakScheduleTabStack.navigationOptions = {
    tabBarLabel: 'Lịch nghỉ phép',
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
    EmployeeListTab: EmployeeListTabStack,
    BreakScheduleTab: BreakScheduleTabStack
}, {
        lazy: true
    })

export default createAppContainer(StoreTab);