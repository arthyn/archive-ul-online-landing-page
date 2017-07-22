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
	var to_who = 'hmiller@bbrcreative.com';
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

	/*if (type === 'checking') {
		data.to = email;
		data.subject = name + ': Your Reward Checking Bonus Code is Here';
		data.from = '"First Federal Bank" <firstfederal@ffbla.com>';
		data['h:Reply-To'] = 'firstfederal@ffbla.com';
		console.log()
		data.html = '<div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Get ready to get rewarded</div><p>You’re one step closer to checking that’s really rewarding. Bring this code to any First Federal Bank and, after registering your new VISA Bonus Check card at UChooseRewards.com, you’ll receive 500 free* points as our way of saying thanks.</p><p><h2 style="font-size:24px;color: #0d5fb6;margin-bottom:.5em;">Your Bonus Code:</h2><h2 style="font-size:24px;color:#0d5fb6;margin:.5em 0 .5em 0;">FFB500</h2></p><p><strong>Simply bring this code to your <a href="http://ffbla.com/locations.aspx">nearest branch</a> and...</strong></p><ol><li>Open any new First Federal checking account</li><li>Register your VISA Bonus Check card at <a href="https://UChooseRewards.com">UChooseRewards.com</a></li><li>Start earning points with every purchase</li></ol><br><br><p>*Offer ends July 31, 2017. Bonus points will only added to any newly opened First Federal checking account once VISA Bonus Check card is registered at <a href="https://www.uchooserewards.com">UChooseRewards.com</a></p>';

		
		mailgun = new Mailgun({apiKey: api_key, domain: goDomain});

		mailgun.messages().send(data, function (err, body) {
			//If there is an error, render the error page
			if (err) {
				console.log("got an error: ", err);
			}
			//Else we can greet    and leave
			else {
				//Here "submitted.jade" is the view file for this landing page 
				//We pass the variable "email" from the url parameter in an object rendered by Jade
				console.log(body);
			}
		});
	}*/

});

app.listen(3040);