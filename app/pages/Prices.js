import React, { useState, useEffect } from "react";
import {Dimensions} from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from "react-native"
import { Colors } from "react-native/Libraries/NewAppScreen";
import { TabRouter } from "@react-navigation/native";
import Card from "../resources/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { openDatabase } from "react-native-sqlite-storage";

const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');
//enable issues
//enable wiki

var arr= ""
var uId =""
var n1 =0
var n2 = ""
const dbz = openDatabase({
  name:"rn_sqllite"
})



const Prices =({navigation, route})=>{
    const [show, setShow] =useState([])
    const [newAmount, setNewAmount] = useState("")
    const [db, setDb] = useState([])


    useEffect(() => {
      // arr = JSON.parse(route.params.body)
        uId = JSON.parse(route.params.id)
        getAll(uId)

      
    
    }, [])

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

      const updateTable=(amt)=>{
        var idf = parseInt(uId)
        console.log("update Productss set amount = "+amt+" where id ="+uId)
        dbz.transaction(txn=>{
          txn.executeSql(`update Productss set amount = ? where id = ?`,
          [amt, uId], (sqlTxn , res)=>{
              console.log("Price Updated successfully")
             // navigation.goBack()
             showAlert()
              
          },error=>{
            console.log(error +"nnnmmu")
          })
        })
      }

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
               n2 = res.rows.item(0).id
               console.log(n2+"llmmmmmm")
              }
          },error=>{
            console.log(error)
          })
        })
      }

      const getAll=(vVal)=>{
        getID()
        dbz.transaction(txn=>{
          txn.executeSql(`select * from Pricess where product_id=${vVal}`,
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
                arr = tRes
                
                
                showAll(tRes)
              }
          },error=>{
            console.log(error)
          })
        })
      }

   
    //show all prices
    async function  showAll  (arr){
      try {
        var vs = await AsyncStorage.getItem("go")
        var ns = await AsyncStorage.getItem("db")
        setDb(arr)
       
      } catch (error) {
          console.log(error)
      }
      arr.sort((a,b) => b.date.localeCompare(a.date));
      
        var mNew = arr.map((val, key)=>{
            var myId = JSON.stringify(val.prices)
            var nDate = apiToAppDate(val.date)
            var nTime = apiToAppTime(val.date)
            
            return(
                <TouchableOpacity key={key} style={{marginTop:10}}
                onPress={()=>{
                    AsyncStorage.setItem("newVal", newAmount)
                    navigation.navigate('Prices', { body: myId})}}>                    
                    <Card>
                    <Text>
                        Price : {val.price}
                    </Text>
                    <Text>
                       Date :  {nDate}
                    </Text>
                    <Text>
                        Time : {nTime}
                    </Text>

                </Card>
                </TouchableOpacity>

            )

        })
        setShow(mNew)
        
        const updatedOSArray = db.map(p =>
            p.id === route.params.id
              ? { ...p, prices: arr }
              : p
          );

        AsyncStorage.setItem("db", JSON.stringify(updatedOSArray))


    }

    const addNewPrice=()=>{
      var nDate = curentDateTime()
      var nNum = arr.length +1  
      var nNarr = {
            ...nNarr, "id": n2,
            "price":newAmount,
            "date": nDate
        }
        arr.push(nNarr)
        insertSubTable(n2, newAmount, nDate, uId)
        updateTable(newAmount)
        showAll(arr)
    }

    const showAlert = () =>{
      Alert.alert(
        "Alert ",
        "You have successfully updated your price list",
        [
          {
            text: "Ok",
            onPress: () => console.log(""),
            style: "cancel",
          },
        ]
      );
      }

    return(
        <ScrollView>
            <View>

                <TextInput placeholder="New Price" value={newAmount} style={styles.textInputUni} 
               keyboardType="numeric" onChangeText={(value)=>{setNewAmount(value)}}
                ></TextInput>

                <TouchableOpacity style={styles.buttonUni}
                onPress={()=>addNewPrice()}>
                    <Text style={styles.txtUni}>Add New</Text>
                </TouchableOpacity>

                <Text style={styles.txtCenter}>Price History</Text>
               
               <View style={{margin:10}}>
               {show}
               </View>



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
//convert api date to UI date
    var vDate = (params).split("T");
    
    vDate = vDate[0].split("-")
    
    var dDate = vDate[2] + "/" + vDate[1] + "/" + vDate[0]
    
    return dDate
}

function apiToAppTime(params) {
//convert api date to UI time
    var vTime = (params).split("T");
    
    vTime = vTime[1].split("+")
    
    var dDate = vTime[0]
    
    return dDate
}

//get current datetime
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

  export default Prices