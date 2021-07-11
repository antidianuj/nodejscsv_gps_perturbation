var fs = require('fs'); 
var parse = require('csv-parse');
var { plot,stack, clear, Plot,Layout }=require('nodeplotlib');
var crypto = require('crypto');

var latitude_data = [];
var longitude_data=[];
var latitude_pert_data=[];
var longitude_pert_data=[];
var reference_data=[];

var indexer=0;

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
          var username=csvrow[0]
          var latty= csvrow[3]
          var longy= csvrow[4]


          latitude_data.push(latty);
          longitude_data.push(longy);
          reference_data.push(indexer);
          indexer=indexer+1;

          var lengther=username.length;
           

           //.................Concretness
          // var s1=username.substring(0);
          // var s2=username.substring(1);
          // var s3=username.substring(2);
          // var s4=username.substring(3);
          //..................Concreteness


          //...................Randomization
          var s1=username.substring(Math.floor(Math.random() * (lengther- 1 + 1) + 0));
          var s2=username.substring(Math.floor(Math.random() * (lengther- 1 + 1) + 0));
          var s3=username.substring(Math.floor(Math.random() * (lengther- 1 + 1) + 0));
          var s4=username.substring(Math.floor(Math.random() * (lengther- 1 + 1) + 0));
          //...................Randomization

          var r1=parseFloat(s1.charCodeAt(0));
          var r2=parseFloat(s2.charCodeAt(0));
          var r3=parseFloat(s3.charCodeAt(0));
          var r4=parseFloat(s4.charCodeAt(0));

          var Maxy=Math.max(r1,r2,r3,r4);

          var keta1=20;
          var keta2=30;

          var R1=r1/(keta1*Maxy);
          var R2=r2/(keta2*Maxy);
          var R3=r3/(keta1*Maxy);
          var R4=r4/(keta2*Maxy);

        //..........................^^^^^Linear Transformation
         latty=(1-R1)*parseFloat(latty)+R2;
         longy=(1-R3)*parseFloat(longy)+R4;
        //..........................^^^^Linear Transformation

         //........................... Simple Randomization
        //  latty=parseFloat(latty)+getRandom(-2,2);
        //  longy=parseFloat(longy)+getRandom(-2,2);
         //........................... Simple Randomization

        longitude_pert_data.push(longy);
        latitude_pert_data.push(latty);

         csvrow[3]=latty;
         csvrow[4]=longy;
         csvrow[0]=crypto.createHash('sha256').update(username).digest('hex');
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
      
      Plot1 = [{x: reference_data, y: longitude_data, type: 'line'}];
      Plot2= [{x: reference_data, y: longitude_pert_data, type: 'line'}];
      stack(Plot1);
      stack(Plot2);
      plot();

      Plot3 = [{x: reference_data, y: latitude_data, type: 'line'}];
      Plot4= [{x: reference_data, y: latitude_pert_data, type: 'line'}];
      stack(Plot3);
      stack(Plot4);
      plot();

      //***********************************csv manipulation*******************************
    });