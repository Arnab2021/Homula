import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, Platform,ActivityIndicator, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  ifIphoneX,
  getBottomSpace,
  getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import moment from 'moment';
import colors from '../../colors';
import { showErrorAlertMessage } from '../../services/ShowAlertMessages';
import { getBlogDetails } from '../../operations/marketScreenOperations/marketScreenOperations';

const arrowBack = require('../../images/arrow-white.png');

export default class BlogDetailsScreen extends Component {
  constructor(props) {
    super(props);
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };
    this.state = {
      orientation: isPortrait() ? 'portrait' : 'landscape',
      loader:false,
      otherblogImages: [],
      bannerImageUrl: '',
      blogTitle: '',
      blogDate: '',
      blogContent: ''
    };
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });
  }

  async componentDidMount() {
    await this._getBlogDetails()
  }

  async _getBlogDetails() {
    const { blogItemid } = this.props.route.params

    this.setState({ loader: true })
    const response = await getBlogDetails(blogItemid)
    this.setState({ loader: false })

    console.log(response);
    if (response.length > 0) {
      this.populateData(response)
    } else {
      showErrorAlertMessage('Error', 'No data found!')
    }
  }

  populateData(data) {

    const imageArr = data[0].images.split(",");
    let bannerImgUrl = imageArr[0];
    if (bannerImgUrl == '') {
      bannerImgUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
    }

    let list = [];
    imageArr.map((img, i) => {
      list.push({
        id: i,
        img: img
      })
    })

    this.setState({
      blogTitle: data[0].title,
      blogContent: data[0].description,
      blogDate: data[0].insert_timestamp,
      bannerImageUrl: bannerImgUrl,
      otherblogImages: list
    })

  }

  renderItem = ({ item, index }) => {
    console.log(item);
    return (
      <TouchableOpacity style={styles.imageView} onPress={() => this.setState({ bannerImageUrl: item.img })}  >
        <Image style={styles.blogImage} source={{ uri: `${item.img}` }} />
      </TouchableOpacity>
    )
  }

  render() {
    const { orientation } = this.state
    return (
      <View style={[styles.container,  { paddingLeft: (orientation == 'landscape' && Platform.OS === 'ios') ? getStatusBarHeight() : null }]}>

        <View style={[styles.bannerImageView, (orientation == 'landscape')&& { height: 150 }  ]}>
          <TouchableOpacity style={styles.backBtnContainer} onPress={() => this.props.navigation.goBack()}>
            <Image source={arrowBack} style={{ width: 30, height: 30 }} resizeMode="contain" />
          </TouchableOpacity>
          {
            (this.state.bannerImageUrl != '') &&
            <Image source={{ uri: `${this.state.bannerImageUrl}` }} style={styles.image} resizeMode="cover" />
          }
          {
            (this.state.loader)&&
            <View style={{flex: 1, justifyContent: 'center'}} >
            <ActivityIndicator size="small" color={colors.mainBlue} />
            </View>
          }
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
          <View style={styles.content}>

            <View style={styles.blogOtherImagesView}>
              <Text style={{ fontSize: wp('5%'), marginBottom: 5 }}>Other Images:</Text>
              <FlatList
                horizontal
                data={this.state.otherblogImages}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index}
                contentContainerStyle={{flex:1, alignItems: 'center'}}
              />
            </View>

            <View style={styles.blogDetailsContainer}>

              <View style={{ marginVertical: 3 }}>
                <Text style={styles.blogTitle}>{this.state.blogTitle}</Text>
              </View>
              <View style={{ marginVertical: 3 }}>
                <Text style={styles.blogDate}>{this.state.blogDate}</Text>
              </View>
              <View style={{ marginVertical: 3 }}>
                <Text style={styles.blogContent}> {this.state.blogContent} </Text>
              </View>

            </View>

          </View>
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  bannerImageView: {
    height: hp('30%'),
  },
  image: {
    flex: 1,
  },
  backBtnContainer: {
    position: 'absolute',
    zIndex: 9,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    left: 10,
    ...Platform.select({
      ios: {
        top: 10 + getStatusBarHeight()
      },
      android: {
        top: 15
      }
    })
  },
  content: {
    flex: 1,
  },
  blogOtherImagesView: {
    marginTop: 10,
    paddingHorizontal: 10,
    height: wp('30%'),   
  },
  imageView: {
    marginHorizontal: 4,
    width: wp('30%'),
    height: 50,
    borderColor: '#ccc',
    backgroundColor:'#fff',
    borderWidth: 1.5,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.41,
    shadowRadius: 8.11,
  },
  blogImage: {
    flex: 1,
  },
  blogDetailsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 10
  },
  blogTitle: {
    fontSize: wp('6%'),
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 2,
    textDecorationLine: 'underline',
  },
  blogContent: {
    fontSize: wp('4%'),
    textAlign: 'justify'
  },
  blogDate: {
    fontSize: wp('3.5%'),
    textAlign: 'center',
    color: colors.grey,
  }
})