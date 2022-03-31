import React, { PureComponent } from 'react';
import { View, Text, Dimensions, StatusBar, Image } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SearchScreenFromHomeAndMap, SearchScreenFromWatched } from './src/screens';
import { landScapeStyles, portraitStyles } from './src/services/orientationStyles';
import BottomTabHelper from './BottomTabHelper';
import {
    HomeScreen,
    WatchedScreen,
    MarketScreen,
    AccountScreen,
    MapScreen,
    BlogDetailsScreen,
    PropertyDetailsViewScreen,
    FilterScreen,
    BookAppoinmentScreen,
    ContactAgentScreen,
    RegisterScreen,
    ForgotPasswordScreen,
    VerifyScreen
} from './src/screens'


const HomeStack = createStackNavigator();
function HomeStackScreen() {
    return (
        <HomeStack.Navigator headerMode="none">
            <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
            <HomeStack.Screen name="PropertyDetails" component={PropertyDetailsViewScreen} />
            <HomeStack.Screen name="Filter" component={FilterScreen} />
            <HomeStack.Screen name="BookAppoinment" component={BookAppoinmentScreen} />
        </HomeStack.Navigator>
    );
}

const MapStack = createStackNavigator();
function MapStackScreen() {
    return (
        <MapStack.Navigator headerMode="none">
            <MapStack.Screen name="MapScreen" component={MapScreen} />
            <MapStack.Screen name="Filter" component={FilterScreen} />
            <MapStack.Screen name="PropertyDetails" component={PropertyDetailsViewScreen} />
        </MapStack.Navigator>
    );
}

const WatchedStack = createStackNavigator();
function WatchedStackScreen() {
    return (
        <WatchedStack.Navigator headerMode="none">
            <WatchedStack.Screen name="WatchedScreen" component={WatchedScreen} />
            <WatchedStack.Screen name="PropertyDetails" component={PropertyDetailsViewScreen} />
            <WatchedStack.Screen name="ContactAgent" component={ContactAgentScreen} />
        </WatchedStack.Navigator>
    );
}

const MarketStack = createStackNavigator();
function MarketStackScreen() {
    return (
        <MarketStack.Navigator headerMode="none">
            <MarketStack.Screen name="MarketScreen" component={MarketScreen} />
            <MarketStack.Screen name="BlogDetailsScreen" component={BlogDetailsScreen} />
        </MarketStack.Navigator>
    );
}

const AccountStack = createStackNavigator();
function AccountStackScreen() {
    return (
        <AccountStack.Navigator headerMode="none">
            <AccountStack.Screen name="AccountScreen" component={AccountScreen} />
            <AccountStack.Screen name="Register" component={RegisterScreen} />
            <AccountStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <AccountStack.Screen name="Verify" component={VerifyScreen} />
        </AccountStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();

class BottomTabNavigator extends PureComponent {
    constructor(props) {
        super(props);
        const isPortrait = () => {
            const dim = Dimensions.get('screen');
            return dim.height >= dim.width;
        };

        this.state = {
            orientation: isPortrait() ? 'portrait' : 'landscape'
        };

        Dimensions.addEventListener('change', () => {
            this.setState({
                orientation: isPortrait() ? 'portrait' : 'landscape'
            });
        });
    }

    render() {
        const{orientation} = this.state

        console.log(orientation);
        return (
            <Tab.Navigator
                initialRouteName="HomeTab"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        
                        return (
                            <View style={[ (orientation == 'portrait')? portraitStyles.tabItem: landScapeStyles.tabItem, (focused)&& portraitStyles.activeTabItem]}>
                                <View style={ (orientation == 'portrait')? portraitStyles.imageView: landScapeStyles.imageView}>
                                    <Image
                                        source={BottomTabHelper.setTabIcon(focused, route.name)}
                                        style={ (orientation == 'portrait')? portraitStyles.tabIcon : landScapeStyles.tabIcon}
                                        resizeMode="contain"
                                    />
                                </View>
                                <View style={ (orientation == 'portrait')? portraitStyles.titleView: landScapeStyles.titleView}>
                                    <Text style={[ (orientation == 'portrait')? portraitStyles.title : landScapeStyles.title, (focused)?landScapeStyles.titleActive:null]}>{BottomTabHelper.setTabName(route.name)}</Text>
                                </View>
                            </View>
                        );
                    },
                })}
                tabBarOptions={{
                    showLabel: false,
                    style: {
                        ...Platform.select({
                            android: {
                                height: hp('7%'),
                            },
                            ios: {
                                height:  (orientation == 'landscape')? hp('9%') : hp('9%'),
                            }
                        }),
                    },
                    //keyboardHidesTabBar: true
                }}
            >
                <Tab.Screen name="HomeTab" component={HomeStackScreen} />
                <Tab.Screen name="MapTab" component={MapStackScreen} />
                <Tab.Screen name="WatchedTab" component={WatchedStackScreen} />
                <Tab.Screen name="MarketTab" component={MarketStackScreen} />
                <Tab.Screen name="AccountTab" component={AccountStackScreen} />
            </Tab.Navigator>
        );
    }
}

export default class App extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const RootStack = createStackNavigator();
        //if (orientation == 'portrait') {
        return (
            <SafeAreaProvider>
                <StatusBar hidden={false} barStyle="light-content" backgroundColor="#133A7A" />
                <NavigationContainer>

                    <RootStack.Navigator headerMode="none" >
                        <RootStack.Screen name="Root" component={BottomTabNavigator} />
                        <RootStack.Screen name="SearchScreenFromHomeAndMap" component={SearchScreenFromHomeAndMap} />
                        <RootStack.Screen name="SearchScreenFromWatched" component={SearchScreenFromWatched} />
                    </RootStack.Navigator>

                </NavigationContainer>
            </SafeAreaProvider>
        )
    
    }
}
