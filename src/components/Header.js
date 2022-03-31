import React, { Component } from 'react';
import { Dimensions } from 'react-native';

import PotraitHeader from './PotraitHeader'
import LandscapeHeader from './LandscapeHeader';

export default class Header extends Component {
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
        const { headerContent, navigation, headerTitle, showBackBtn, backgroundColor } = this.props
        if (this.state.orientation == 'portrait') {
            return (
                <PotraitHeader
                    headerContent={headerContent}
                    navigation={navigation}
                    headerTitle={headerTitle}
                    showBackBtn={showBackBtn}
                    backgroundColor={backgroundColor}
                />
            )
        }else{
            return(
                <LandscapeHeader
                    headerContent={headerContent}
                    navigation={navigation}
                    headerTitle={headerTitle}
                    showBackBtn={showBackBtn}
                    backgroundColor={backgroundColor}
                />
            )
        }

    }
}

