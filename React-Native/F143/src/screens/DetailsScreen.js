import React from 'react';
import {StyleSheet} from 'react-native';
import {List, ListItem, Card, CardItem, Container,Text, View, Header, Left, Body, Right, Title, Button, Icon, Segment, Content } from 'native-base';
import { Alert, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as moment from 'moment';

export default class DetailsScreen extends React.Component {
    // static navigationOptions = {
    //   header: null,
    //   headerTitleStyle :{textAlign: 'center',alignSelf:'center'},
    // };

    static navigationOptions = ({navigation}) =>  {
        const {params = {}} = navigation.state;
        return {
          headerStyle: {
            backgroundColor: '#3F51B5'
          },
          headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={{ marginLeft:25, color: 'white'}}>
            <Icon name='arrow-back' style={{color: '#fff'}} />
          </View>
        </TouchableOpacity>),
          headerTitle: () => (
            <View style={styles.headerWrapper}>
              <Text
                adjustsFontSizeToFit
                style={styles.headerText}>Details</Text>
            </View>
          ),
          headerRight: (<TouchableOpacity onPress={() => params.onEdit()}><View>
          <Text style={{ marginRight:25, color: 'white'}}
            adjustsFontSizeToFit
          >Edit</Text>
        </View></TouchableOpacity>
          )
        }
    }

    constructor(props) {
      super(props);
      this.props.navigation.setParams({
        goToBack: this.goToBack,
        onEdit: this.onEdit
      });

      this.state={
        itemDetails:null
      }
    }

    componentDidMount() {
      console.log('this.props.navigation.state.params.itemDetails',this.props.navigation.state.params.itemDetails);
      if(this.props.navigation.state.params && this.props.navigation.state.params.hasOwnProperty('itemDetails')) {
        this.setState({
          itemDetails: this.props.navigation.state.params.itemDetails
        })
        }    
    }

    onEdit = () => {
      this.props.navigation.push('EditItem',{ id: 2 })
    }

    returnFormatedDate=(d)=>{
      if(d){
        return moment(d).format('DD-MM-YYYY');
      } else {
        return '';
      }
    }

    goToBack=()=>{
        this.props.navigation.goBack();
        // Alert.alert('hey')
        // this.props.navigation.dispatch(NavigationActions.back())
        // this.props.navigation.goBack()
    }
  
    render() {
      const itemDetails = this.state.itemDetails || {};
      return (
        <Container>
            <Content>
            <List>
                <ListItem thumbnail>
                    <Left/>
                    <Body>
                        <Text>Item Name</Text>
                    </Body>
                    <Right>
                        <Button transparent>
                        <Text>{itemDetails.item_name}</Text>
                        </Button>
                    </Right>
                </ListItem>

                <ListItem thumbnail>
                    <Left/>
                    <Body>
                        <Text>Price</Text>
                    </Body>
                    <Right>
                        <Button transparent>
                        <Text>{itemDetails.price}</Text>
                        </Button>
                    </Right>
                </ListItem>

                <ListItem thumbnail>
                    <Left/>
                    <Body>
                        <Text>Quantity</Text>
                    </Body>
                    <Right>
                        <Button transparent>
                        <Text>{itemDetails.qty}</Text>
                        </Button>
                    </Right>
                </ListItem>

                <ListItem thumbnail>
                    <Left/>
                    <Body>
                        <Text>Item By</Text>
                    </Body>
                    <Right>
                        <Button transparent>
                        <Text>{itemDetails.purchased_by}</Text>
                        </Button>
                    </Right>
                </ListItem>

                <ListItem thumbnail>
                    <Left/>
                    <Body>
                        <Text>Purchased Date</Text>
                    </Body>
                    <Right>
                        <Button transparent>
                         <Text>{this.returnFormatedDate(itemDetails.purchase_date)}</Text>
                        </Button>
                    </Right>
                </ListItem>
            </List>
            </Content>
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
    },
    headerRightst: {
      marginRight:10,
      color: 'white'
    },
    row: {
      flex: 1,
      flexDirection: "row"
    },
    inputWrap: {
      flex: 1,
      borderColor: "#cccccc",
      borderBottomWidth: 1,
      marginBottom: 10
    },
    inputdate: {
      fontSize: 14,
      marginBottom: -12,
      color: "#6a4595"
    },
    inputcvv: {
      fontSize: 14,
      marginBottom: -12,
      color: "#6a4595"
    }
  });