import {
    createStackNavigator,
    createMaterialTopTabNavigator,
    createAppContainer
} from 'react-navigation';

import SampleServiceTab from '../../screens/Manager/NavScreen/StoreScreen/Service/SampleServiceTab';
import YourServiceTab from '../../screens/Manager/NavScreen/StoreScreen/Service/YourServiceTab';
import { Colors, FontStyle, Layout } from '../../components/react-native-teso/Magic';

const SampleServiceTabStack = createStackNavigator({
    SampleServiceTab: SampleServiceTab
});

SampleServiceTabStack.navigationOptions = {
    tabBarLabel: 'Dịch vụ mẫu',
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
            fontSize: FontStyle.smallText,
            fontWeight: 'bold',
            color: Colors.darkText,
        },
        style: {
            backgroundColor: Colors.lightBg,
        }
    },
};

const YourServiceTabStack = createStackNavigator({
    YourServiceTab: YourServiceTab
});

YourServiceTabStack.navigationOptions = {
    tabBarLabel: 'Tự tạo dịch vụ',
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
            fontSize: FontStyle.smallText,
            fontWeight: 'bold',
            color: Colors.darkText,
        },
        style: {
            backgroundColor: Colors.lightBg,
        }
    },
};

const CreateServiceTab = createMaterialTopTabNavigator({
    SampleServiceTab: SampleServiceTabStack,
    YourServiceTab: YourServiceTabStack
}, {
        lazy: true
    })

export default createAppContainer(CreateServiceTab);