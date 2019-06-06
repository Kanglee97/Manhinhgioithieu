import {
    createStackNavigator,
    createMaterialTopTabNavigator,
    createAppContainer
} from 'react-navigation';

//Service
import StatisticalTab from '../../screens/Manager/NavScreen/StatisticalScreen/StatisticalTab';

//Discount
import OrderHistoryTab from '../../screens/Manager/NavScreen/StatisticalScreen/OrderHistoryTab';
import { Colors, FontStyle, Layout } from '../../components/react-native-teso/Magic';

const StatisticalTabStack = createStackNavigator({
    StatisticalTab: {
        screen: StatisticalTab
    },
}, {
        headerMode: 'none'
    });

StatisticalTabStack.navigationOptions = {
    tabBarLabel: 'Thống kê',
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

const OrderHistoryTabStack = createStackNavigator({
    OrderHistoryTab: {
        screen: OrderHistoryTab
    },
}, {
        headerMode: 'none'
    });

OrderHistoryTabStack.navigationOptions = {
    tabBarLabel: 'Lịch sử đơn hàng',
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
    StatisticalTab: StatisticalTabStack,
    OrderHistoryTab: OrderHistoryTabStack
}, {
        lazy: true
    })

export default createAppContainer(StoreTab);