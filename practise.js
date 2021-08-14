
// let myPromise = new Promise(function(resolve,reject){
//    setInterval(()=>{
//        reject("promise rejected")
//    },3000)
// })

// myPromise.then(function(value){
//     console.log(value);
// }
// ).catch(function(err){
//     console.log(err)
// })

let x = 13;
let y = 6;

// let promise = new Promise(function(resolve,reject){

//     setTimeout(()=>{
//         if(x%y==0){
//             resolve("Promise resolved")
//         }
//         else{
//             reject("promise rejected")
//         }
//     },4000)

    
// })

// promise.then(function(val){
//     console.log(val)
// }).catch(function(err){
//     console.log(err)
// })

function job(state) {
    return new Promise(function(resolve, reject) {
        if (state) {
            resolve('success');
        } else {
            reject('error');
        }
    });
}

let promise = job(true);

promise

.then(function(data) {
    console.log(data);

    return job(true);
})

.then(function(data) {
    if (data !== 'victory') {
        throw 'Defeat';
    }

    return job(true);
})

.then(function(data) {
    console.log(data);                                ///sucess defeat error errorCaught  Error:errortest
})

.catch(function(error) {
    console.log(error);

    return job(false);
})

.then(function(data) {
    console.log(data);

    return job(true);
})

.catch(function(error) {
    console.log(error);

    return 'Error caught';
})

.then(function(data) {
    console.log(data);

    return new Error('test');
})

.then(function(data) {
    console.log('Success:', data.message);
})

.catch(function(data) {
    console.log('Error:', data.message);
});