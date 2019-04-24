import React from 'react';
import { View, Text, Image, Container, Header, Left, Body, Right, Title, Button, Icon, Segment, Content, Card, CardItem, Thumbnail } from 'native-base';
import TabBarIcon from '../components/TabBarIcon';
import VectorIcon from '../components/VectorIcon';
import { Alert, TouchableOpacity } from 'react-native';
import { ScrollView, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import {StyleSheet} from 'react-native';
import axios from 'axios';

import {setAllItem} from '../redux/action/Action'
 
class ItemListScreen extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#3F51B5'
    },
    headerLeft: (<View/>),
    headerTitle: () => (
      <View style={styles.headerWrapper}>
        <Text
          adjustsFontSizeToFit
          style={styles.headerText}>Item List</Text>
      </View>
    ),
    headerRight: (<View/>)
  }

  constructor(props) {
    super(props);
    this.state = {
      allItems: []
    };
  }

  componentWillMount() {  
  //  this.getData();
   this.props.setAllItem();
  }

  getAllData = () => {
    this.props.allItemList()
    .then( (response) => {
          this.setState({refreshing: false});
          const bodyData = response.data;
          if (bodyData.errorCode.code == 200 || bodyData.errorCode.message == 'success') {
            this.setState({
              allItems: bodyData['items'] || []
            })   
          
          } else {
            // this.msg = this.errHandler.handleError(bodyData.errorCode.toString());
          }
        })
        .catch( (error) => {
          this.setState({refreshing: false});
          console.log(error);
      });
 
  }

 
  // componentDidUpdate(prevProps) {
  //   console.log('componentDidUpdate');
  //   console.log(prevProps);
  // }

  // componentDidMount(){
  //   console.log('componentDidMount',this.props)
  // }


  componentWillReceiveProps(props) {
    if(props && props.allItemList){
      this.props= props;
      this.getAllData();
    }
  }

  _onRefresh = () => {
    this.getAllData();
  }

  goToDetails=(item)=>{
    this.props.navigation.push('Details', { itemDetails: item });
  }

  render() {
    return (

      <Container>
          <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        <Content>
          {
            this.state.allItems.map((item,index) => {
              return(
                <Card key={index}>
                  <TouchableOpacity onPress={() => this.goToDetails(item)}>
                    <CardItem>
                      <VectorIcon name="money" color="black" />
                      <Left>
                        <Body>
                          <Text>{item.item_name}</Text>
                          <Text note>{item.purchased_by}</Text>
                        </Body>
                      </Left>
                      <Right>
                        <Body>
                          <View style={{flexDirection: 'row'}}>
                            <View style={{marginLeft:20}}>
                              <Text>you paid</Text>
                              <Text note>{'\u20B9'}  {item.price}</Text>
                            </View>
                            <View style={{marginLeft:40}}>
                            <Icon  name="arrow-forward" /> 
                            </View>
                          </View>
                        </Body>
                      </Right>
                    </CardItem>
                  </TouchableOpacity>
                </Card>
              )
            })
          }
          
        </Content>
        </ScrollView>
      </Container>
    );
  }
} 

const styles = StyleSheet.create({
  headerWrapper: {
    flex: 1
  },
  headerText: {
    textAlign: 'center', // ok
    alignSelf: 'center', // ok
  }
});

const mapStateToProps = (state) => {

  console.log('mapStateToProps', state);
  const { allItemList } = state.allItemList
  return { allItemList }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setAllItem,
  }, dispatch)
);

// export default connect(mapStateToProps)(ItemListScreen);

export default connect(mapStateToProps, mapDispatchToProps)(ItemListScreen);


  