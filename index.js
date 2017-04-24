var express = require('express');
var app = express();
var multiparty = require('multiparty');
var Phaxio = require('phaxio');

var phaxio = new Phaxio('0ddaed8b1ecda42b11986e59c436663bd13418e8', '997d08e5c97745cadc06f8087c51b39285dcd310');
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("./serviceAccountKey.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sizzling-fire-2546.firebaseio.com"
});


// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("/");
ref.once("value", function(snapshot) {
    console.log(snapshot.val());
});

app.get('/', function(request, response) {

    var  dataCallback = function(err,data) {
        var ordersRef = ref.child("faxes/"+data.faxId);
        console.log('*********** Callback Entered *******************' + JSON.stringify(data));
        var fireBaseReference=ordersRef.set(data);
             console.log('fireBaseReference'+JSON.stringify(fireBaseReference))
      }

    phaxio.sendFax({
        to: '8778532070',
        string_data: 'Faxing from Node.js',
        string_data_type: 'text',
        batch:true,
        batch_delay:60,
        callback_url:'https://global-test-app.herokuapp.com/faxStatus'
    }, dataCallback);
    response.send('Sent Successfully!')
})

app.post('/faxStatus', function(request, response) {

  console.log('!!!Inside updateFaxStatus method !!!!');

  var form = new multiparty.Form();

  form.parse(request, function(err, fields, files) {

    console.log('Fax id::::::::' + fields.fax.id);

      console.log('~~~!!!!!!!!!!!!!!!!!!' + JSON.stringify(fields));
      console.log('!!!!!!!!!!!!!!!!!!' + fields.success);
      console.log('!!!!!!!!!!!!!!!!!!' + fields.is_test);
      console.log('!!!!!!!!!!!!!!!!!!' + fields.direction);
      var fax = JSON.parse(fields.fax);
      console.log('Fax id::::::::' + fax.id);

      var ordersRef = ref.child("faxes/"+fax.id);

      var fireBaseReference=ordersRef.update(fields.fax);
      console.log('fireBaseReference'+JSON.stringify(fireBaseReference))
      response.sendStatus(200);
      response.end('Received callback');
  });

  })


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
