var testFolder = './data';
var fs = require('fs');

fs.readdir(testFolder, function(err, file_list){
    console.log(file_list)
    }
)
