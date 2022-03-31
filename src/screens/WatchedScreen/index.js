import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';
import colors from '../../colors'
import { SearchBar, PropertyBlock, SortByModal, Header } from '../../components';
import { getAllWatchedProperties, addOrRemoveFromWatched } from '../../operations/watchedScreenOperations/watchedScreenOperations';

export default class WatchedScreen extends PureComponent {
  constructor(props) {
    super(props);
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };
    this.state = {
      loader: false,
      orientation: isPortrait() ? 'portrait' : 'landscape',
      watchedPropertyLists: [],
      isOpenSortByModal: false,
      selectedSortValue: '',
      copyWatchedPropertiesList: [],
      isSearched: false,
      searchingProperty: '',
      totalPropertyFound: 'No',
      sliderImageWidth: Dimensions.get('screen').width
    };
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape',
        sliderImageWidth: Dimensions.get('screen').width
      });
    });
  }

  async componentDidMount() {

    await this._getWatchedProperties()

    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      async () => {

        // searching property        
        if (this.props.route.params !== undefined) {
          // console.log(this.props.route.params);
          if (this.props.route.params.searchedPorperties != null) {
            this.setState({
              copyWatchedPropertiesList: [this.props.route.params.searchedPorperties],
              searchingProperty: this.props.route.params.searchingPropertyName,
              isSearched: true,
              totalPropertyFound: '1'
            })
          }

        }

      }
    );

  }

  async _getWatchedProperties() {

    this.setState({ loader: true })
    const response = await getAllWatchedProperties()
    this.setState({ loader: false })
    console.log(response);
    if (response != false) {
      const data = JSON.parse(response)

      this.setState({
        watchedPropertyLists: data,
        copyWatchedPropertiesList: data,
        totalPropertyFound: data.length
      })
    }
  }

  _clearSearch() {
    this.setState({
      copyWatchedPropertiesList: this.state.watchedPropertyLists,
      isSearched: false,
      searchingProperty: '',
      totalPropertyFound: this.state.watchedPropertyLists.length
    })

    this.props.navigation.setParams({ searchedPorperties: null, searchingPropertyName: '' })
  }

  _renderProperties = ({ item, index }) => {
    return (
      <PropertyBlock
        item={item}
        navigation={this.props.navigation}
        fromScreen="Watched"
        sliderImageWidth={this.state.sliderImageWidth}
        addOrRemoveFromWatched={() => this._updatePropertyData(item, index)}
        onPressItem={() => this._navigateTotPropertyDetails(item)}
      />
    )
  }

  _navigateTotPropertyDetails(item) {

    const param = {
      type: item.type,
      id: item.id,
      showingSoldData: (item.sold_price != '' && item.sold_date != '') ? true: false
    }
   
    this.props.navigation.navigate('PropertyDetails', param)
  }

  _updatePropertyData = async (item, index) => {
    const { watchedPropertyLists } = this.state;
    const updatedData = watchedPropertyLists.slice();
    updatedData[index].watched = !updatedData[index].watched;

    await addOrRemoveFromWatched(item, updatedData[index].watched)
    await this._getWatchedProperties()
  }

  applySorting(){
    const { selectedSortValue } = this.state
    console.log(selectedSortValue);
  }

  _navigateToSearch = () => {
    this.props.navigation.navigate('SearchScreenFromWatched', { watchedProperties: this.state.watchedPropertyLists, searchingProperty: this.state.searchingProperty })
  }

  render() {
    const { orientation, watchedPropertyLists } = this.state
    const headerContent = (
      <SearchBar onPressSearch={() => this._navigateToSearch()} searchingProperty={this.state.searchingProperty} />
    )
    return (
      <View style={[styles.container,  { paddingLeft: (orientation == 'landscape' && Platform.OS === 'ios' ) ? getStatusBarHeight() : 0 }]}>

        <Header headerContent={headerContent} navigation={this.props.navigation} />

        <View style={[styles.propertyCountContainer, (orientation == 'landscape') && { marginVertical: 4 }]}>
          <View style={styles.row}>
            <View style={styles.propertyCountTextView}>
              <Text>{this.state.totalPropertyFound}</Text>
              <Text> Proprety found.</Text>
            </View>
            <View style={styles.btnViewContainer}>
              {
                (this.state.isSearched) &&
                <TouchableOpacity onPress={() => this._clearSearch()} >
                  <Text style={{ color: colors.mainBlue, fontWeight: 'bold' }}>Clear Search</Text>
                </TouchableOpacity>
              }
              <TouchableOpacity style={styles.sortByBtn} onPress={() => this.setState({ isOpenSortByModal: true })}>
                <Text style={{ color: '#fff' }}>Sort By</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <FlatList           
            data={this.state.copyWatchedPropertiesList}
            renderItem={this._renderProperties}
            refreshing={this.state.loader}
            onRefresh={async () => await this._getWatchedProperties()}
            keyExtractor={(item, index) => item.id}

          />
          <SortByModal
            isVisible={this.state.isOpenSortByModal}
            closeModal={() => { this.setState({ isOpenSortByModal: false }) }}
            selectAndCloseSortByModal={(value) => {
              this.setState({
                selectedSortValue: value,
                isOpenSortByModal: false
              },  () => this.applySorting())
            }}
            selectedSortValue={this.state.selectedSortValue} />
        </View>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },
  propertyCountContainer: {
    paddingHorizontal: 8,
    marginVertical: 15,
    //justifyContent:'center',
  },
  row: {
    flexDirection: 'row'
  },
  propertyCountTextView: {
    flex: 0.45,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnViewContainer: {
    flex: 0.55,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sortByBtn: {
    backgroundColor: colors.mainBlue,
    padding: 5,
    alignItems: 'center',
    width: wp('22%'),
    marginLeft: wp('4%')
  },
  content: {
    flex: 1,
  }
})