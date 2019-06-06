import {
    createStackNavigator,
    createMaterialTopTabNavigator,
    createAppContainer
} from 'react-navigation';

import OrderProccessingTab from '../../screens/Staff/NavScreen/OrderScreen/OrderProccessingTab';
import OrderDoneTab from '../../screens/Staff/NavScreen/OrderScreen/OrderDoneTab';
import { Colors, FontStyle, Layout } from '../../components/react-native-teso/Magic';

const OrderTabStaff = createMaterialTopTabNavigator(
    {
        OrderProccessing: {
            screen: OrderProccessingTab,
            navigationOptions: {
                tabBarLabel: 'Đang thực hiện',
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
            }
        },
        OrderDone: {
            screen: OrderDoneTab,
            navigationOptions: {
                tabBarLabel: 'Đã thực hiện',
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
            }
        }
    }, {
        lazy: true
    }
)


export default createAppContainer(OrderTabStaff);