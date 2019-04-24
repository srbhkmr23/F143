import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';

import ItemListScreen from '../screens/ItemListScreen';
import AddItemScreen from '../screens/AddItemScreen';
import DetailsScreen from '../screens/DetailsScreen';


const ItemListStack = createStackNavigator({
    ItemList: ItemListScreen,
    Details: DetailsScreen,
    EditItem: AddItemScreen,
});

ItemListStack.navigationOptions = {
    tabBarLabel: 'Items',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={
          Platform.OS === 'ios'
            ? `ios-information-circle${focused ? '' : '-outline'}`
            : 'md-information-circle'
        }
      />
    )
};

export const AddItemStack = createStackNavigator({
    AddItem: AddItemScreen,
});

AddItemStack.navigationOptions = {
    tabBarLabel: 'Add',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={
          Platform.OS === 'ios'
            ? `ios-information-circle${focused ? '' : '-outline'}`
            : 'md-information-circle'
        }
      />
    )
};


export default createBottomTabNavigator({
    
    ItemListStack,
    AddItemStack
});

