import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator,Dimensions, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';
import colors from '../../colors';
import { Header } from '../../components'
import { getAllBlog } from '../../operations/marketScreenOperations/marketScreenOperations';

const noimage = require('../../images/noimage.png')

export default class MarketScreen extends Component {
  constructor(props) {
    super(props);
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };
    this.state = {
      orientation: isPortrait() ? 'portrait' : 'landscape',
      blogCategories: ['All', 'Detached', 'Condo', 'Commercial'],
      blogs: [],
      loader: false
    };
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });
  }

  async componentDidMount() {
    await this._getAllBlog()
  }

  async _getAllBlog(category = '') {
    this.setState({ loader: true })
    const response = await getAllBlog(category)
    this.setState({ loader: false })
    if (response.length > 0) {
      this.populateDate(response)
    }
  }

  populateDate(data) {

    let list = [];
    data.map((x, i) => {
      let img = '';
      let image = x.images.split(",");
      if (x.images == '') {
        image = [noimage];
      } else {
        img = image[0]
      }

      let pocket = {
        id: x.id,
        title: x.title,
        date: x.insert_timestamp,
        image: img,
        details: x.description,
        blog_images: image,
        category: x.category
      }
      list.push(pocket)
    })

    this.setState({
      blogs: list
    })
  }

  _renderBlogCategories = ({ item, index }) => {
    return (
      <TouchableOpacity style={[styles.categoryButton]} onPress={() => this._getAllBlog(item)}  >
        <Text style={styles.categoryText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  _renderBlogs = ({ item, index }) => {

    let content = '';
    let title = '';

    if (item.details.length > 28) {
      content = item.details.slice(0, 28) + '...';
    } else {
      content = item.details;
    }

    if (item.title.length > 20) {
      title = item.title.slice(0, 20) + '...';
    } else {
      title = item.title;
    }

    return (
      <TouchableOpacity style={styles.blogContainer} onPress={() => this.props.navigation.navigate('BlogDetailsScreen', { blogItemid: item.id })}>
        <View style={styles.row}>
          <View style={styles.blogDetailsContainer}>
            <View style={styles.blogTitleView}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.blogDetailsView}>
              <Text style={styles.blogDetailsText} adjustsFontSizeToFit={true} numberOfLines={1}>{content}</Text>
            </View>
            <View style={styles.blogDateView}>
              <Text style={styles.blogDate} >{item.date}</Text>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: `${item.image}` }} style={styles.blogImage} resizeMode="cover" />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { orientation } = this.state
    return (
      <View style={[styles.container, { paddingLeft: (orientation == 'landscape' && Platform.OS === 'ios') ? getStatusBarHeight() : null }]}>

        <Header navigation={this.props.navigation} headerTitle="Market" />

        <View style={styles.categoriesView}>
          <FlatList
            data={this.state.blogCategories}
            renderItem={this._renderBlogCategories}
            keyExtractor={(item, index) => index}
            horizontal={true}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.announcementText}>Announcement</Text>
          {/*
            (this.state.loader)&&
            <ActivityIndicator size="small" color={colors.mainBlue} />
          */}
          <FlatList
            data={this.state.blogs}
            renderItem={this._renderBlogs}
            keyExtractor={(item, index) => index}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshing={this.state.loader}
            onRefresh={ async() => await this._getAllBlog()}
          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  categoriesView: {
    padding: 10,
  },
  categoryButton: {
    borderColor: colors.mainBlue,
    borderWidth: 2,
    paddingVertical: 4,
    marginHorizontal: 5,
    paddingHorizontal: 10
  },
  content: {
    flex: 1,
    backgroundColor: '#fff'
  },
  announcementText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: 'bold',
    marginVertical: 8
  },
  blogContainer: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
    marginVertical: 6,
    backgroundColor: colors.softGrey,
    paddingVertical: 5,
    elevation: 6,
    shadowColor: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.41,
    shadowRadius: 4.11,
  },
  row: {
    flexDirection: 'row'
  },
  blogDetailsContainer: {
    flex: 0.6,
  },
  imageContainer: {
    flex: 0.4,
  },
  blogTitleView: {
    marginBottom: 2
  },
  title: {
    fontSize: 17,
    textTransform: 'capitalize',
    fontWeight: 'bold'
  },
  blogDetailsView: {
    marginBottom: 2
  },
  blogDetailsText: {
    fontSize: 13,
    textTransform: 'capitalize',
  },
  blogDateView: {

  },
  blogDate: {
    fontSize: 12,
    color: colors.grey,
  },
  blogImage: {
    flex: 1,
  }
})