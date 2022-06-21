import React, { useState, useEffect } from "react";
import {Dimensions, Alert} from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from "react-native"
import { Colors } from "react-native/Libraries/NewAppScreen";
import { TabRouter } from "@react-navigation/native";
import Card from "../resources/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { openDatabase } from "react-native-sqlite-storage";
const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');

var total = 0
var n2=""
const dbz = openDatabase({
    name:"rn_sqllite"
  })
  

const New_Products=({navigation, route})=>{
const [item, setItem] = useState("")
const [price, setPrice] = useState("")
//const [item, setItem] = useState("")

useEffect(() => {
  total = parseInt(route.params.total)+1
  getID()
getAll()
  
}, [])

const  getTotal= async ()=>{
    var hId = await AsyncStorage.getItem("uId")
    total = parseInt(hId) +1
}

//get highest price Id and use to inser new product
const getID=()=>{
    dbz.transaction(txn=>{
      txn.executeSql(`select * from Pricess order by id desc limit 1`,
      [], (sqlTxn , res)=>{
          console.log("Successful")
          let len = res.rows.length
          if(len>0){
            let tRes =[]
            for(var i=0; i<len; i++){
              var itemz = res.rows.item(i)
              tRes.push({id:itemz.id, price:itemz.price, 
                date:itemz.date})
            }
           var nn = parseInt(res.rows.item(0).id)+1
           total=nn
          
          }
      },error=>{
        console.log(error)
      })
    })
  }

const getAll=()=>{
    dbz.transaction(txn=>{
        txn.executeSql(`select * from Productss`,
        [], (sqlTxn , res)=>{
            console.log("Successful")
            let len = res.rows.length
        
            console.log(len+"mmmm")
            if(len>0){
              let tRes =[]
              for(var i=0; i<len; i++){
                var itemz = res.rows.item(i)
                tRes.push({id:itemz.id, name:itemz.name, amount:itemz.amount})
              }
              console.log(JSON.stringify(tRes))
              var nBod = {...nBod, products : tRes}
             
            //  showAll(nBod, 1)
            }else{
              console.log(len)
            //  getData()
            }
        },error=>{
          console.log(error)
        })
      })
}

//insert new product
const insertTable=(id, name, amount)=>{
    dbz.transaction(txn=>{
      txn.executeSql(`insert or replace into Productss (id, name, amount) values(?, ?, ?)`,
      [id, name, amount], (sqlTxn , res)=>{
          console.log("Products Inserted successfully")
          
      },error=>{
        console.log(error)
      })
    })
  }

  //insert new proct price
  const insertSubTable=(id, price, date, product_id)=>{
    dbz.transaction(txn=>{
      txn.executeSql(`insert or replace into Pricess (price_id, product_id,price, date) values(?, ?, ?, ?)`,
      [id, product_id,price, date], (sqlTxn , res)=>{
          console.log("Price Inserted successfully")
          
      },error=>{
        console.log(error)
      })
    })
  }
  const showAlert = () =>{
    Alert.alert(
      "Alert ",
      "You have successfully created "+item+".",
      [
        {
          text: "Ok",
          onPress: () => navigation.goBack(),
          style: "cancel",
        },
      ]
    );
    }
//add new product
  const addNew=()=>{
      insertTable(total, item, price)
      insertSubTable(total, price, curentDateTime(), total)
      var nId = total
      AsyncStorage.setItem("uId", nId+"")
     showAlert()
  }


    return(
        <ScrollView>
            <View>
                <Text style={styles.txtCenter}>Add New Product</Text>

                <TextInput placeholder="Product Name" value={item} style={styles.textInputUni} 
                onChangeText={(value)=>{setItem(value)}}
                ></TextInput>

                <TextInput placeholder="Price"  keyboardType="numeric" value={price} style={styles.textInputUni} 
                onChangeText={(value)=>{setPrice(value)}}
                ></TextInput>

                <TouchableOpacity style={styles.buttonUni}
                onPress={()=>{
                  if(item===""){
                    alert("Enter item name")
                  }else if (price===""){
                    alert("Enter price")
                  }else {
                    addNew()
                  }
                }}>
                    <Text style={styles.txtUni}>Add New</Text>
                </TouchableOpacity>


            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 16,
      alignItems: 'center', // Centered horizontally
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.white,
    },
    card: {
      height: 100,
      width: '100%',
      backgroundColor: 'white',
      justifyContent: 'center', //Centered vertically
      alignItems: 'center', // Centered horizontally
    },
    textInputUni: {
        width: WIDTH - 40,
        height: 40,
        paddingLeft: 5,
        paddingRight: 5,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 1.5,
        borderColor: 'black',
        color: 'black',
      },
      buttonUni: {
        width: WIDTH - 40,
        height: 40,
        backgroundColor: '#6fa6e6',
    
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        fontSize: 16,
        justifyContent: 'center',
        alignSelf: 'center',
      },

      txtUni: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
      },
      txtCenter: {
        margin:10,
        textAlign: 'center',
        fontSize: 16,
      },

  });

  function apiToAppDate(params) {

    var vDate = (params).split("T");
    
    vDate = vDate[0].split("-")
    
    var dDate = vDate[2] + "/" + vDate[1] + "/" + vDate[0]
    
    return dDate
}

function apiToAppTime(params) {

    var vTime = (params).split("T");
    
    vTime = vTime[1].split("+")
    
    var dDate = vTime[0]
    
    return dDate
}

function curentDateTime(){
    var currentdate = new Date();

    var nYear = currentdate.getFullYear()
    var nMonth = currentdate.getMonth()+1
    var nDay = currentdate.getDate()
    var min = currentdate.getMinutes()
    var hr = currentdate.getHours()
    var sec = currentdate.getSeconds()

    var vMonth =""
    var vDay=""
    var vMin =""
    var vSec=""
    var vHr =""

    if(nDay<10){
        vDay = "0"+nDay
    }
    if(nMonth<10){
        vMonth = "0"+nMonth
    }

    if(min<10){
        vMin = "0"+min
    }
    if(sec<10){
        vSec = "0"+sec
    }

    if(hr.length==1){
        vHr = "0"+hr
    }

    console.log(sec)
    
    var datetime = nYear + "-"+ vMonth
    + "-" + vDay + "T" 
    + hr+ ":" 
    + min+ ":" + sec+"+00:00";

    console.log(datetime)
    return datetime
}

export default New_Products