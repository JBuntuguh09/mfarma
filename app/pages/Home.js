
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Dimensions, Image, Alert} from "react-native"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
//import { TouchableOpacity } from "react-native-gesture-handler"
import { ScrollView } from "react-native-gesture-handler"
import { Colors } from "react-native/Libraries/NewAppScreen"
import Card from "../resources/Card"
import { openDatabase } from "react-native-sqlite-storage";
import eye from '../images/eye.png'
import close from '../images/close-2.png'
import edit from '../images/pencil-2.png'


const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');

const db = openDatabase({
  name:"rn_sqllite"
})


var n1=""
var n2=""
var vtotal = 0

const Home=({navigation, route})=>{
    const [showMe, setShowMe] = useState([])
    const [met, setMet] = useState([])
    const [sPrices, setPrices] = useState([])
    
    useEffect(() => {
      

       checker()
        createTable()
    
    
    }, [])

    //ctreate product and price tables
    const createTable=()=>{
      db.transaction(txn=>{
        txn.executeSql(`CREATE TABLE IF NOT EXISTS Productss (id INTEGER PRIMARY KEY, name VARCHAR(20), amount VARCHAR(20))`,
        [], (sqlTxn , res)=>{
            console.log("Products Table successful")
        },error=>{
          console.log(error)
        })
      })

      db.transaction(txn=>{
        txn.executeSql(`CREATE TABLE IF NOT EXISTS Pricess (id INTEGER PRIMARY KEY AUTOINCREMENT, price_id INTEGER , product_id INTEGER , price VARCHAR(20), date varChar(20))`,
        [], (sqlTxn , res)=>{
            console.log("Prices Table successful")
        },error=>{
          console.log(error)
        })
      })
    }

    const getAll=()=>{
      db.transaction(txn=>{
        txn.executeSql(`select * from Pricess`,
        [], (sqlTxn , res)=>{
            console.log("Successful")
            let len = res.rows.length
            if(len>0){
              let tRes =[]
              for(var i=0; i<len; i++){
                var itemz = res.rows.item(i)
                tRes.push({id:itemz.id, name:itemz.price})
              }
              console.log(JSON.stringify(tRes))
            }
        },error=>{
          console.log(error)
        })
      })
    }

    //Check if data is loaded or retrieve from api
    const runAll=()=>{
      db.transaction(txn=>{
        txn.executeSql(`select * from Productss`,
        [], (sqlTxn , res)=>{
            console.log("Successful")
            let len = res.rows.length
            vtotal = len
            if(len>0){
              let tRes =[]
              for(var i=0; i<len; i++){
                var itemz = res.rows.item(i)
                tRes.push({id:itemz.id, name:itemz.name, amount:itemz.amount})
              }
              console.log(JSON.stringify(tRes))
              var nBod = {...nBod, products : tRes}
              console.log(JSON.stringify(nBod))
              showAll(nBod, 1)
            }else{
              console.log(len)
              getData()
            }
        },error=>{
          console.log(error)
        })
      })
    }

    //insert into product table
    const insertTable=(id, name, amount)=>{
      db.transaction(txn=>{
        txn.executeSql(`insert or REPLACE into Productss (id, name, amount) values(?, ?, ?)`,
        [id, name, amount], (sqlTxn , res)=>{
            console.log("Products Inserted successfully")
            
        },error=>{
          console.log(error)
        })
      })
    }

    //insert into price table
    const insertSubTable=(id, price, date, product_id)=>{
      db.transaction(txn=>{
        txn.executeSql(`insert OR REPLACE into Pricess (price_id, product_id,price, date) values(?, ?, ?, ?)`,
        [id, product_id,price, date], (sqlTxn , res)=>{
            console.log("Price Inserted successfully")
            
        },error=>{
          console.log(error)
        })
      })
    }

    const getPrices=(vVal)=>{
      var nNum =[]
      db.transaction(txn=>{
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
              console.log(vVal+"///"+JSON.stringify(tRes))
              setPrices(tRes)
             
            }else{
              console.log("Error")
            }
        },error=>{
          console.log(error)
        })
      })
      
    }

    async function checker(){
        

        navigation.addListener('focus', () => {
            
         
            runAll()
         

          });
          

    }

    //delete from product table
    const deleteRow=(uIdz)=>{
      var idf = parseInt(uIdz)
      
      db.transaction(txn=>{
        txn.executeSql(`DELETE FROM Productss WHERE id = ?`,
        [uIdz], (sqlTxn , res)=>{
            console.log("Product Deleted successfully")
            runAll()
            
        },error=>{
          console.log(error +"nnnmmu")
        })
      })
    }

    const showAlert = (item, itemId) =>{
    Alert.alert(
      "Alert ",
      "Are you sure you want to delete "+item+"?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => deleteRow(itemId) }
      ]
    );
    }
    
//get data from api
   const getData=()=>{
      

        return fetch("http://www.mocky.io/v2/5c3e15e63500006e003e9795", 
        {
            method:"GET",
            headers:{
               
                'Content-Type': 'application/json'
                
            }
        }).then(response=>response.json())
        .then(responseJson=>{
          var jId = responseJson.length+""
          AsyncStorage.setItem("uId", jId)
            showAll(responseJson, 0)
           
        }).catch(err=>{
            alert(err)
        }).then(()=>{
            
        })
    }
    

   // Display products
    function showAll(arr, vVal){
      var mc = []
      var mNew = arr.products.map((val, key)=>{
            var amt = 0
            var arrn = []
            try {
              if(vVal==0){
                //insert from api
                arrn = val.prices
                arrn.sort((a,b) => b.date.localeCompare(a.date));

                arrn.map((vals, keys)=>{
                  if(keys === 0){
                    amt = vals.price
                  }
                  insertSubTable(vals.id,vals.price, vals.date, val.id)
              })
              insertTable(val.id, val.name, amt)
              }else{
             //read from db
                db.transaction(txn=>{
                  txn.executeSql(`select * from Pricess where product_id=${val.id}`,
                  [], (sqlTxn , res)=>{
                      console.log("Successful done")
                      
                      let len = res.rows.length
                      if(len>0){
                        let tRes =[]
                        
                        for(var i=0; i<len; i++){
                          var itemz = res.rows.item(i)
                          tRes.push({id:itemz.id, price:itemz.price, 
                            date:itemz.date})
                           
                        }
                      
                        arrn = tRes
                       
                        arrn.sort((a,b) => b.date.localeCompare(a.date));
             
                          arrn.map((vals, keys)=>{
                          
                            if(keys === 0){
                              amt = vals.price
                              mc.push(amt)
                            }
                           
                          
                        })
                      }else{
                        console.log("Error")
                      }
                  },error=>{
                    console.log(error)
                  })
                })
              
              }
             
            } catch (error) {
              
            }

            return(
              //show items
              <View style={{marginTop:10}}
              onPress={()=>{AsyncStorage.setItem("go", "hello")
        
                  
                }}>                    
                  <Card>
                    <View style={{flexDirection:'row'}}>
                      <View style={{flex:8}}>
                          <Text>
                            Name : {val.name} 
                          </Text>
                          <Text>
                            Price : {val.amount} 
                          </Text>
                      </View>
                      <View style={{flexDirection:'row'}} >
                        <TouchableOpacity 
                        onPress={()=>navigation.navigate('Prices', { body: arrn, id : val.id, total:vtotal})}
                        >
                        <Image source={eye} style={{width:20, height:20, tintColor:'green'}}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>navigation.navigate('Edit', { body: arrn, id : val.id, item:val.name, price:val.amount})}
                        >
                        <Image source={edit} style={{width:20, height:20, tintColor:'blue'}}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>showAlert(val.name, val.id)}
                        >
                        <Image source={close} style={{width:20, height:20, tintColor:'red'}}/>
                        </TouchableOpacity>
                      </View>
                    </View>
                  

              </Card>
              </View>

          )
  
        })


        setShowMe(mNew)
      //  getAll()
        
    }

    return(
        <ScrollView >
            <View style={{margin:10}}>
               
               
                {showMe}

                <TouchableOpacity style={styles.buttonUni}
                onPress={()=>  navigation.navigate('Add', {  total:vtotal})}>
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
      marginTop:10,
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

export default Home