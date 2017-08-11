//We're using the express framework and the mailgun-js wrapper
var express = require('express');
var Mailgun = require('mailgun-js');
var shortid = require('shortid');
var bodyParser = require('body-parser');
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'data.db', autoload: true });
//var pug = require('pug');
var path = require('path');
var escape = require('lodash.escape');
//init express
var app = express();
var debug = process.argv[2];
debug = debug == '-d';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//Your api key, from Mailgun’s Control Panel
var api_key = '***REMOVED***';

//Your domain, from the Mailgun Control Panel
var domain = 'mg.bbrcreative.com';

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/public'));

//Do something when you're landing on the first page
app.get('/', function(req, res) {
	//render the index.jade file - input forms for humans
	res.sendFile(path.join(__dirname, '/dist/', 'index.html'));
});

// Send a message to the specified email address when you navigate to /submit/someaddr@email.com
// The index redirects here
app.post('/submit', function(req,res) {
	//Your receiving email address
	var to_who = 'online@louisiana.edu';
	var bcc_list = '';

	var type = req.body.type;

	//We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
	var mailgun = new Mailgun({apiKey: api_key, domain: domain});
	var email = escape(req.body.email);
	var firstName = escape(req.body.first_name);
	var lastName = escape(req.body.last_name);
	var phone = escape(req.body.phone);
	var state = escape(req.body.state);
	var name = firstName + ' ' + lastName;
	var id = shortid.generate();
	
	db.insert({
		_id: id,
		firstName: firstName,
		lastName: lastName,
		email: email,
		phone: phone,
		state: state
	});

	var data = {
	//Specify email data
	  from: req.body.email,
	//The email to contact
	  to: to_who,
	  //'h:Reply-To': req.body.email,
	//Subject and text data  
	  subject: 'Landing Page Info Request from: ' + name,
	  html: '<p>This person has requested more information about graduating online in general studies.</p>' +
	  		'<p>Name: ' + name + '</p>' +
	  		'<p>Email: ' + email + '</p>' +
	  		'<p>Phone: ' + phone + '</p>' +
	  		'<p>State: ' + state + '</p>'
	  //'Please send me more information about ' + inText[type] + '.\n' + '<p><a href="mailto:' + email + '">' + email + '</a></p><p>' + name + '</p>'
	}

	if(bcc_list) {
		data.bcc = bcc_list;
	}

	if (debug) {
		data.to = 'hmiller@bbrcreative.com';
	}

	//Invokes the method to send emails given the above data with the helper library
	mailgun.messages().send(data, function (err, body) {
		//If there is an error, render the error page
		if (err) {
			res.send('error ' + err);
			console.log("got an error: ", err);
		}
		//Else we can greet    and leave
		else {
			//Here "submitted.jade" is the view file for this landing page 
			//We pass the variable "email" from the url parameter in an object rendered by Jade
			res.send('submitted' + req.body.email);
			console.log(body);
		}
	});

});

app.listen(3040);