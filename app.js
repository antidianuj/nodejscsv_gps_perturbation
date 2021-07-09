var fs = require('fs'); 
var parse = require('csv-parse');

function getRandom(min,max) {
  return Math.random() * (max - min + 1) + min;
}

var csvData=[];
fs.createReadStream('Sensor_Data1.csv')
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        console.log(csvrow[12]);

        //***********************************csvrow manipulation*******************************

        if (csvrow[3]!='lat' && csvrow[4]!='long')
        {
          var latty= csvrow[3]
          var longy= csvrow[4]

         latty=parseFloat(latty)+getRandom(-2,2);
         longy=parseFloat(longy)+getRandom(-2,2);

         csvrow[3]=latty;
         csvrow[4]=longy;
        }

        //***********************************csvrow manipulation*******************************

        csvData.push(csvrow);        
    })
    .on('end',function() {
      //***********************************csv manipulation*******************************
      console.log(csvData);
      reducedData = csvData.join("\n");
      fs.writeFile('Sensor_Data_Reduced.csv',reducedData, 'utf8', function (err) {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
        } else{
          console.log('It\'s saved!');
        }
      });
      //***********************************csv manipulation*******************************

    });