const home = require('./src/images/home.png');
const homeactive = require('./src/images/home-active.png');
const map = require('./src/images/map.png');
const mapactive = require('./src/images/map-active.png');
const watched = require('./src/images/watched.png');
const watchedactive = require('./src/images/watched-active.png');
const market = require('./src/images/market.png');
const marketactive = require('./src/images/market-active.png');
const account = require('./src/images/account.png');
const accountactive = require('./src/images/account-active.png');

export default class BottomTabHelper {
    static setTabIcon(focused, routeName) {
        if (focused) {
            if (routeName === 'HomeTab') {
                return homeactive;
            } else if (routeName === 'MapTab') {
                return mapactive;
            } else if (routeName === 'WatchedTab') {
                return watchedactive;
            } else if (routeName === 'MarketTab') {
                return marketactive;
            } else if (routeName === 'AccountTab') {
                return accountactive;
            }
        } else {
            if (routeName === 'HomeTab') {
                return home;
            } else if (routeName === 'MapTab') {
                return map;
            } else if (routeName === 'WatchedTab') {
                return watched;
            } else if (routeName === 'MarketTab') {
                return market;
            } else if (routeName === 'AccountTab') {
                return account;
            }
        }
    }

    static setTabName(routeName){
        if (routeName === 'HomeTab') {
            return 'Home';
        } else if (routeName === 'MapTab') {
            return "Map";
        } else if (routeName === 'WatchedTab') {
            return 'Watched';
        } else if (routeName === 'MarketTab') {
            return 'Market';
        } else if (routeName === 'AccountTab') {
            return 'Account';
        }
    }
}
