var express = require('express');
var app = express();
var multiparty = require('multiparty');
var Phaxio = require('phaxio');
var phaxio = new Phaxio('0ddaed8b1ecda42b11986e59c436663bd13418e8', '997d08e5c97745cadc06f8087c51b39285dcd310');
app.set('port', (process.env.PORT || 5000));


app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {

    var  dataCallback = function(err,data) {
                   console.log('*********** Callback Entered *******************'+JSON.stringify(data));
     };
    phaxio.sendFax({
        to: '8778532070',
        string_data: 'Faxing from Node.js',
        string_data_type: 'text',
        batch:true,
        batch_delay:60,
        callback_url:'https://rocky-scrubland-69687.herokuapp.com/faxStatus'
    }, dataCallback);
    response.send('Sent Successfully!')
})

app.post('/faxStatus', function(request, response) {

  console.log('!!!Inside updateFaxStatus method !!!!');

  var form = new multiparty.Form();

  form.parse(request, function(err, fields, files) {
    console.log('~~~!!!!!!!!!!!!!!!!!!' + JSON.stringify(fields));
    console.log('!!!!!!!!!!!!!!!!!!' + fields.success);
    console.log('!!!!!!!!!!!!!!!!!!' + fields.is_test);
    console.log('!!!!!!!!!!!!!!!!!!' + fields.direction);
    var fax = JSON.parse(fields.fax);
    console.log('Fax id::::::::' + fax.id);
  });
    response.end('Recieved Successfully');
  })


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
