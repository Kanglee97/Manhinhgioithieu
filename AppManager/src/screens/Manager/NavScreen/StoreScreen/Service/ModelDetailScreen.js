import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, SafeAreaView, RefreshControl, StatusBar, } from 'react-native';
import { detailModalActions, serviceActions, serviceChildActions, accountPackageActions } from '../../../../../actions/index';
import { nameOfDetailModalReducers, nameOfLoadingReducers, nameOfProfileReducers, nameOfAuthReducers } from '../../../../../reducers'
import { PopUpConfirm, MainHeader, ImageProgress, Loading } from '../../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import NavigationService from '../../../../../navigation/NavigationService';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as storeService from '../../../../../sagas/storeService';
import { ScrollView } from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import numeral from 'numeral';
import { get } from 'lodash'

class ModelDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modals: []
    };
    this.loadData = this.loadData.bind(this);
    this.renderImageItem = this.renderImageItem.bind(this);
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    console.log('ModelDetailScreen ', this.props, this.state)
    this.loadData()
  }

  loadData = () => {
    const data = {
      'modalId': this.props.navigation.getParam('modalId'),
    }
    if (this.props.modalId != this.props.navigation.getParam('modalId'))
      this.props.actions.fetchDetailModalServiceRequest(data)
  }

  renderImageItem = ({ item, index }) => {
    return (
      <View style={{ width: Layout.window.width, height: Layout.window.height * 0.5 }}>
        {item ?
          <ImageProgress style={{ width: Layout.window.width, height: Layout.window.height * 0.5, }} source={{ uri: `${item}` }} />
          :
          <Image source={require('../../../../../assets/img/default-service-blue.png')} style={{ width: Layout.window.width, height: Layout.window.height * 0.5 }} />
        }
      </View>
    )
  }

  deleteModal() {
    const data = {
      'modalId': this.props.modalId,
      callback: () => {
        storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({
          'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
            get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
            get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
        }))
        this.props.navigation.state.params.onGoBack()
        NavigationService.goBack()
      }
    }
    this.props.actions.deleteDetailModalServiceRequest(data)
  }

  render() {
    const { modalId, displayName, price, description, thumbnail } = this.props
    console.log(this.props, this.state)
    if (this.props.isLoading)
      return (
        <Loading />
      )
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.loadData}
            />
          }>
          <MainHeader rounded
            darkBar
            backgroundColor={Colors.lightBg}
            leftPress={() => NavigationService.navigate('ServiceChilds')}
            rightComponent={<FontAwesome5
              name='edit'
              size={20}
              color={Colors.functionColorDark}
            />}
            rightPress={() => NavigationService.navigate('EditModal', {
              isEdit: true,
            })}
            containerStyle={{
              backgroundColor: Colors.transparent,
              position: 'absolute',
              top: 0, left: 0,
              width: Layout.window.width,
              zIndex: 1,
            }}
          />
          <Carousel
            autoplay
            autoplayDelay={750}
            loop
            ref={(c) => { this._carousel = c; }}
            data={thumbnail}
            renderItem={this.renderImageItem}
            sliderWidth={Layout.window.width}
            itemWidth={Layout.window.width}
            contentContainerStyle={styles.carousel} />
          <View style={[styles.informationBlock]}>
            <View style={[styles.displayInlineBlock, { width: '100%' }]}>
              <Text style={[styles.text, styles.title, { width: '50%' }]} numberOfLines={1} ellipsizeMode={'tail'}>{displayName}</Text>
              <Text style={[styles.text, styles.price, { width: '50%', textAlign: 'right', textDecorationColor: Colors.functionColorDark, textDecorationStyle: 'solid', textDecorationLine: "underline" }]}
                numberOfLines={1} ellipsizeMode={'tail'}>
                {numeral(price).format('0,0')} đ</Text>
            </View>
            {description != '' ?
              <View>
                <Text style={[styles.text, styles.title]}>Mô tả:</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={[styles.scrollDesc]}>
                  <Text style={[styles.desc]}>
                    {description}
                  </Text>
                </ScrollView>
              </View> : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  informationBlock: {
    flex: 1,
    width: Layout.window.width * 0.9,
    marginLeft: Layout.window.width * 0.05,
    backgroundColor: Colors.lightBg,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    marginTop: -25,
  },
  text: {
    fontWeight: 'bold',
    fontSize: FontStyle.mdText,
    fontFamily: FontStyle.mainFont,
    lineHeight: 40,
  },
  title: {
    color: Colors.darkText,
    fontSize: FontStyle.bigText,
  },
  price: {
    color: Colors.functionColorLight,
    fontSize: FontStyle.bigText,
    paddingBottom: -10,
  },
  scrollDesc: {
    width: '100%',
    flexWrap: 'wrap'
  },
  desc: {
    fontSize: FontStyle.mdText,
    fontFamily: FontStyle.mainFont,
    textAlign: Platform.OS == 'ios' ? 'justify' : 'left',
    lineHeight: 25
  },
  btnBlock: {
    marginTop: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  delBtn: {
    backgroundColor: Colors.dangerColor,
    height: 40,
    width: Layout.window.width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
  },
  displayInlineBlock: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfDetailModalReducers],
    ...state[nameOfLoadingReducers][detailModalActions.FETCH_DETAIL_MODAL_SERVICE]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ ...detailModalActions, ...serviceChildActions, ...serviceActions }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelDetailScreen)