import { StyleSheet } from "react-native";
import colors from '../colors'
import { actuatedNormalize } from "./actuatedNormalizeFont";

const portraitStyles = StyleSheet.create({
    tabItem: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeTabItem: {
        backgroundColor: colors.mainBlue
    },
    imageView: {
        flex: 0.6,
    },
    titleView: {
        flex: 0.4,
        paddingBottom: 2
    },
    tabIcon: {
        width: 25,
        flex: 1
    },
    title: {
        textAlign: 'center',
        fontSize: actuatedNormalize(12),
        //fontWeight: 'bold',
        color: colors.mainBlue
    },
    titleActive: {
        color: '#fff'
    }
})


const landScapeStyles = StyleSheet.create({
    tabItem: {
        flex: 1,
        width: 100,
        justifyContent:'center',
        alignItems: 'center'
    },
    activeTabItem: {
        backgroundColor: colors.mainBlue
    },
    imageView: {
        flex: 0.6,
    },
    titleView: {
        flex: 0.4
    },
    tabIcon: {
        width: 25,
        flex: 1
    },
    title: {
        textAlign: 'center',
        fontSize: actuatedNormalize(12),
        //fontWeight: 'bold',
        color: colors.mainBlue
    },
    titleActive: {
        color: '#fff'
    }
})

export {landScapeStyles, portraitStyles}