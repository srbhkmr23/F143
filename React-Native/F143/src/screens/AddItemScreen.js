import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import VectorIcon from '../components/VectorIcon';
// import { Container, Header, Left, Body, Right, Title, Button, Icon, Segment, Content } from 'native-base';
import {Card, CardItem, Left, Right, Button, DatePicker, Picker, View, Container, Header, Content, Item, Input, Icon, Body, Title, Text } from 'native-base';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import axios from 'axios';
export default class AddItemScreen extends React.Component {
    static navigationOptions = ({navigation}) =>  {
      const {params = {}} = navigation.state;
      return {
        headerStyle: {
          backgroundColor: '#3F51B5'
        },
        headerLeft: (
          <TouchableOpacity onPress={() => params.goToBack()}>
          {
            params.id ?  (
            <View style={{ marginLeft:25}}>
              <VectorIcon name='close' color='white'  />
            </View>
            ) : null
          }
          
        </TouchableOpacity>),
        headerTitle: () => (
          <View style={styles.headerWrapper}>
            <Text
              adjustsFontSizeToFit
              style={styles.headerText}>
              {params.id ? 'Edit Item' : 'Add Item' } 
              </Text>
          </View>
        ),
        headerRight: (<TouchableOpacity onPress={() => params.onSave()}><View>
          <Text style={{ marginRight:25, color: 'white'}}
            adjustsFontSizeToFit
          >SAVE</Text>
        </View></TouchableOpacity>
        )
      }
  }

  //   static navigationOptions = {
  //     header: {
  //         right: <Button title={"Save"}  />
  //     }
  // };
    constructor(props) {
      super(props);
      this.state = {
        id: null,
        itemName: null,
        price: null,
        qty: '1',
        by: 'Saurabh',
        date: new Date()
      };
    }

    componentDidMount() {
      this.props.navigation.setParams({
        goToBack: this.goToBack,
        onSave: this.onSave,
        id: this.state.id
      });

      if(this.props.navigation.state.params && this.props.navigation.state.params.hasOwnProperty('id')) {
        this.setState({
          id: this.props.navigation.state.params.id
        },()=>{
          this.props.navigation.setParams({
            id: this.state.id
          });
        })
      }      

      // console.log('this.props.navigation.state',this.props.navigation.state.params.id);
    }


    goToBack = () => {
      this.props.navigation.pop()
    }

    onSelectUser = (user) => {
      this.setState({
        by: user
      })
    }

    onSelectDate = (newDate) => {
      this.setState({
        date: newDate
      })
    }

    onSave = () => {

      // this.state = {
      //   id: null,
      //   itemName: null,
      //   price: null,
      //   qty: '1',
      //   by: 'Saurabh',
      //   date: new Date()
      // };

      const state = this.state;
      const bodyData = {
        "itemName"    : state.itemName.trim(), 
        "Qty"         : state.qty,
        "Price"       : state.price,
        "purchaseDate": state.date,
        "purchasedBy" : state.by
        };

        axios.post('https://f143-backend.herokuapp.com/add_items', bodyData)
        .then( (response) => {
          console.log(response.data);
          this.resetForm();
        })
        .catch( (error) => {
          console.log(error);
        });


      
    }

    resetForm = () => {
      this.setState({
        itemName: null,
        price: null,
        qty: '1',
        by: 'Saurabh',
        date: new Date()
      });
    }
   


    render() {
      return (
        <Container>
         
          {/* <Header style={{paddingTop: getStatusBarHeight()}}>
            <Left/>
            <Body>
              <Title> <Text>Add Item</Text> </Title>
            </Body>
            <Right>
              <Button hasText transparent onPress={() => this.onSave()}>
                <Text>Save</Text>
              </Button>
            </Right>
          </Header> */}
          <Content>
          <Card>
            {/* <CardItem> */}
            
            <Item>
              <VectorIcon name='shopping-bag' color="black" size={15}  style={{ marginTop: 0 }}/>
              <Input 
              value={this.state.itemName}
              onChangeText={(itemName)=>this.setState({itemName})}
              placeholder='Item Name'/>
              
            </Item>

            <View style={styles.row}>
              {/* <Icon active name='home' /> */}
              <VectorIcon name='rupee' color="black" size={20}  style={{ marginTop: 15, marginLeft:2 }}/>
              <View style={styles.inputWrap}>
                <Input keyboardType="numeric"
                value={this.state.price}
                onChangeText={(price)=>this.setState({price})}
                placeholder='Price'/>
              </View>

              {/* <Icon active name='home' /> */}
              <VectorIcon name='shopping-bag' color="black" size={15}  style={{ marginTop: 15 }}/>
              <View style={styles.inputWrap}>
                <Input keyboardType="numeric" value={this.state.qty} onChangeText={(qty) => this.setState({qty})} placeholder='Quantity'/>
              </View>
            </View>

            <View style={styles.row}>
              {/* <Icon active name='home' /> */}
              <VectorIcon name='user-secret' color="black" size={18}  style={{ marginTop: 15, marginLeft:2 }}/>
              <View style={styles.inputWrap}>
                <Picker
                  mode="dropdown"
                  placeholder="By"
                  placeholderStyle={{ color: "gray", marginLeft: -12 }}
                  selectedValue={this.state.by}
                  onValueChange={this.onSelectUser}
                >
                  <Picker.Item label="Akshay" value="Akshay" />
                  <Picker.Item label="Ankit" value="Ankit" />
                  <Picker.Item label="Ravindra" value="Ravindra" />
                  <Picker.Item label="Saurabh" value="Saurabh" />
                </Picker>
              </View>

              {/* <Icon active name='home' /> */}
              <VectorIcon name='calendar' color="black" size={17}  style={{ marginTop: 15 }}/>
              <View style={styles.inputWrap}>
                {/* <Input placeholder='Date'/> */}
                <DatePicker
                  defaultDate={this.state.date}
                  // defaultDate={new Date(2018, 4, 4)}
                  locale={"en"}
                  modalTransparent={true}
                  androidMode={"default"}
                  placeHolderText="Select date"
                  placeHolderTextStyle={{ marginTop: 3 }}
                  textStyle={{ marginTop: 3 }}
                  onDateChange={this.setDate}
                  disabled={false}
                />


              </View>
            </View>
            {/* </CardItem> */}
          </Card>
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

