/// json-> Javascript Object Notation
/// iife-> Immediately invoked function expression



// // let myPromise = new Promise(function(resolve,reject){
// //    setInterval(()=>{
// //        reject("promise rejected")
// //    },3000)
// // })

// // myPromise.then(function(value){
// //     console.log(value);
// // }
// // ).catch(function(err){
// //     console.log(err)
// // })

// let x = 13;
// let y = 6;

// // let promise = new Promise(function(resolve,reject){

// //     setTimeout(()=>{
// //         if(x%y==0){
// //             resolve("Promise resolved")
// //         }
// //         else{
// //             reject("promise rejected")
// //         }
// //     },4000)

    
// // })

// // promise.then(function(val){
// //     console.log(val)
// // }).catch(function(err){
// //     console.log(err)
// // })

// function job(state) {
//     return new Promise(function(resolve, reject) {
//         if (state) {
//             resolve('success');
//         } else {
//             reject('error');
//         }
//     });
// }

// let promise = job(true);

// promise

// .then(function(data) {
//     console.log(data);

//     return job(true);
// })

// .then(function(data) {
//     if (data !== 'victory') {
//         throw 'Defeat';
//     }

//     return job(true);
// })

// .then(function(data) {
//     console.log(data);                                ///sucess defeat error errorCaught  Error:errortest
// })

// .catch(function(error) {
//     console.log(error);

//     return job(false);
// })

// .then(function(data) {
//     console.log(data);

//     return job(true);
// })

// .catch(function(error) {
//     console.log(error);

//     return 'Error caught';
// })

// .then(function(data) {
//     console.log(data);

//     return new Error('test');
// })

// .then(function(data) {
//     console.log('Success:', data.message);
// })

// .catch(function(data) {
//     console.log('Error:', data.message);
// });







// function fakeFunc(props){
//     console.log(arguments)
//     for(let i=0;i<props.length;i++){
//         console.log(props[i]+" ")
//     }
// }

// let arr = ["heelo","mello","yellow","fellow","brown","red","yellow","green"]
// let newarr = arr.splice(1,3,"hi","der","you")
// // console.log(arr);
// // console.log(newarr)

// const fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
// let array = fruits.slice(1,5)
// console.log(array)





// let arr= [1,2,3,4,5,6,7,8,9]
// let newArr = arr.map(function(el){
//     return el*999999;
// })
// console.log(newArr)


// (function fuc(){
//     console.log("immediately invoked function expression")
// })()


// function sayHello(pram){
//     console.log("hello!",pram)
//     pram()
//     return "rvgjk"
// }

// function smaller(){
//     console.log("smaller function")
// }
// let res = sayHello(smaller);
// console.log(res)

//undefined 10 undefined 10 30



// console.log("line 1",varName)  ;
//  var varName = 10;

//  function b(){
//      console.log("line 3",varName)
//      var varName = 35;
//  }

//  console.log("line 2",varName);

//  function fn(){
//      var varName
//     console.log("line 4",varName)
//     varName = 30;
//     b();
//     console.log("line 5",varName);

//  }
//  fn();


// var a= 11;
// console.log(a)
// function fn(){
//     console.log(a);
//     var a = 10;
//     console.log(a);

//     if(a==10){
//         var a = 15;
//         console.log(a)
//     }
//     console.log(a);
// }
// fn()
// console.log(a)



// undefined  undefined  Captain America  hello  hello  i am ex  i am ex

// console.log("varName",varName)
// var varName;
// console.log("varName",varName);
// varName = "Captain Amercia";
// console.log("varName",varName);
// fn();
// function fn(){
//     console.log("hello from fn")
// }
// fn();
// fnContainer();
// var fnContainer = function(){
//     console.log("I am an Expression")
// }
// fnContainer();




// function real(){

//     console.log("i am real,always run me")
// }

// real();
// function real(){

//     console.log("no,am the real one")
// }

// function real(){

//     console.log("you both wasted,me the real one")
// }




// Array.prototype.filter3 = function(){let array=[]
    
//     for(let key of this){
//         if(key%3==0){
//             array.push(key);
//         }
//     }
//     return array
// }

// let arr = [3,4,6,8,9,12,15,13,14,12,88,90]
// let newArr = arr.filter3()
// console.log(arr)
// console.log(newArr)
// 







// Object.prototype.forEach = function (cb){
//     //console.log(this)
//     for(let key in this){
//         cb(key)
//     }
// }


// let obj1 = {
//     1:"",2:"",3:"",4:"",5:"",6:""
// }

// function cb(el){
//     if(el%2==0){
//         console.log("value is->",el)
//     }
    
// }

// obj1.forEach(cb);





// let jsonContent = require("./file.json")

// console.log(jsonContent)

// let fs = require("fs")
// let buffer = fs.readFileSync("./file.json")
// let content = JSON.parse(buffer);
// console.log(content)
// content.push(content[0])

// fs.writeFileSync("./file.json",JSON.stringify(content))
// console.log(content);

