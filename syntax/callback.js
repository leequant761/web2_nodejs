// function a(){
//     console.log('A')
// }

var a = function(){
    console.log('A')
}

// a();

function slow_func(callback){
    callback();
}

slow_func(a)