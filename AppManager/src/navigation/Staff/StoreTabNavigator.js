import {
    createStackNavigator,
    createMaterialTopTabNavigator,
    createAppContainer
} from 'react-navigation';

//Service
import ServiceTab from '../../screens/Staff/NavScreen/StoreScreen/Service/ServiceTab';

//Discount
import DiscountTab from '../../screens/Staff/NavScreen/StoreScreen/Discount/DiscountTab';
import { Colors, FontStyle, Layout } from '../../components/react-native-teso/Magic';

const ServiceTabStack = createStackNavigator({
    ServiceTab: {
        screen: ServiceTab
    },
},
    {
        headerMode: 'none'
    });

ServiceTabStack.navigationOptions = {
    tabBarLabel: 'Dịch vụ',
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

const DiscountTabStack = createStackNavigator({
    DiscountTab: {
        screen: DiscountTab
    },
},
    {
        headerMode: 'none'
    });

DiscountTabStack.navigationOptions = {
    tabBarLabel: 'Khuyến mãi',
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
    ServiceTab: ServiceTabStack,
    DiscountTab: DiscountTabStack
}, {
        lazy: true
    })

export default createAppContainer(StoreTab);