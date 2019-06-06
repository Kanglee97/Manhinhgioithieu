import {
    createStackNavigator,
    createMaterialTopTabNavigator,
    createAppContainer
} from 'react-navigation';
import React from 'react'

import ModelTab from '../../screens/Manager/NavScreen/StoreScreen/Service/ModelTab';
import OptionTab from '../../screens/Manager/NavScreen/StoreScreen/Service/OptionTab';
import { Colors, FontStyle, Layout } from '../../components/react-native-teso/Magic';

const ServiceChildsTab = createMaterialTopTabNavigator({
    ModelTab: {
        screen: ModelTab,
        navigationOptions: {
            tabBarLabel: 'Kiểu dáng',
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
    OptionTab: {
        screen: OptionTab,
        navigationOptions: {
            tabBarLabel: 'Tùy chọn',
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
    })

export default createAppContainer(ServiceChildsTab)