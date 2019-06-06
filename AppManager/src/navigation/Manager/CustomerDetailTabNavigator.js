import {
    createStackNavigator,
    createMaterialTopTabNavigator,
    createAppContainer
} from 'react-navigation';
import React from 'react'

import CustomerContactTab from '../../screens/Manager/NavScreen/CustomerScreen/CustomerContactTab';
import CutomerHistoryTab from '../../screens/Manager/NavScreen/CustomerScreen/CutomerHistoryTab';
import CustomerServiceTab from '../../screens/Manager/NavScreen/CustomerScreen/CustomerServiceTab';
import CustomerPictureTab from '../../screens/Manager/NavScreen/CustomerScreen/CustomerPictureTab';
import CustomerNoteTab from '../../screens/Manager/NavScreen/CustomerScreen/CustomerNoteTab';
import { Colors, FontStyle, Layout } from '../../components/react-native-teso/Magic';

const CustomerTab = createMaterialTopTabNavigator({
    CustomerContactTab: {
        screen: CustomerContactTab,
        navigationOptions: {
            tabBarLabel: 'Liên hệ',
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
                    color: Colors.darkText,
                    fontSize: FontStyle.mdText,
                },
                style: {
                    justifyContent: 'flex-start',
                    height: 40,
                    backgroundColor: Colors.lightBg,
                }
            },
        }
    },
    CutomerHistoryTab: {
        screen: CutomerHistoryTab,
        navigationOptions: {
            tabBarLabel: 'Lịch sử',
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
                    color: Colors.darkText,
                    fontSize: FontStyle.mdText,
                },
                style: {
                    justifyContent: 'flex-start',
                    height: 40,
                    backgroundColor: Colors.lightBg,
                }
            },
        }
    },
    // CustomerServiceTab: {
    //     screen: CustomerServiceTab,
    //     navigationOptions: {
    //         tabBarLabel: 'Dịch vụ',
    //         tabBarOptions: {
    //             showLabel: true,
    //             upperCaseLabel: false,
    //             inactiveTintcolor: Colors.darkText,
    //             activeTintcolor: Colors.darkText,
    //             indicatorStyle: {
    //                 backgroundColor: Colors.functionColorLight,
    //                 height: 5
    //             },
    //             labelStyle: {
    //                 color: Colors.darkText,
    //                 fontSize: FontStyle.miniText,
    //                 fontWeight: 'bold',
    //             },
    //             style: {
    //                 marginTop: -10,
    //                 borderTopLeftRadius: 15,
    //                 borderTopRightRadius: 15,
    //                 justifyContent: 'flex-start',
    //                 height: 35,
    //                 backgroundColor: Colors.lightBg,
    //             }
    //         },
    //     }
    // },
    // CustomerPictureTab: {
    //     screen: CustomerPictureTab,
    //     navigationOptions: {
    //         tabBarLabel: 'Ảnh',
    //         tabBarOptions: {
    //             showLabel: true,
    //             upperCaseLabel: false,
    //             inactiveTintcolor: Colors.darkText,
    //             activeTintcolor: Colors.darkText,
    //             indicatorStyle: {
    //                 backgroundColor: Colors.functionColorLight,
    //                 height: 5
    //             },
    //             labelStyle: {
    //                 color: Colors.darkText,
    //                 fontSize: FontStyle.miniText,
    //             },
    //             style: {
    //                 marginTop: -10,
    //                 borderTopLeftRadius: 15,
    //                 borderTopRightRadius: 15,
    //                 justifyContent: 'flex-start',
    //                 height: 35,
    //                 backgroundColor: Colors.lightBg,
    //             }
    //         },
    //     }
    // },
    // CustomerNoteTab: {
    //     screen: CustomerNoteTab,
    //     navigationOptions: {
    //         tabBarLabel: 'Ghi chú',
    //         tabBarOptions: {
    //             showLabel: true,
    //             upperCaseLabel: false,
    //             inactiveTintcolor: Colors.darkText,
    //             activeTintcolor: Colors.darkText,
    //             indicatorStyle: {
    //                 backgroundColor: Colors.functionColorLight,
    //                 height: 5
    //             },
    //             labelStyle: {
    //                 fontSize: FontStyle.miniText,
    //             },
    //             style: {
    //                 marginTop: -10,
    //                 borderTopLeftRadius: 15,
    //                 borderTopRightRadius: 15,
    //                 justifyContent: 'flex-start',
    //                 height: 35,
    //                 backgroundColor: Colors.lightBg,
    //             }
    //         },
    //     }
    // },

}, {
        lazy: true
    })

export default createAppContainer(CustomerTab)