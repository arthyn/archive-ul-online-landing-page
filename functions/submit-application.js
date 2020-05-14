if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load();
}

const mailjet = require('node-mailjet').connect(process.env.MAILJET_API, process.env.MAILJET_SECRET);
const escape = require('lodash.escape');

let debug = process.argv[2];
debug = debug == '-d';

if(debug) {
	console.log('Running in debug mode...');
}

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
	var email = escape(body.email);
	var firstName = escape(body.first_name);
	var lastName = escape(body.last_name);
	const name = firstName + ' ' + lastName;
    const html = `<p>Hey ${name}, I see you checked out one of my projects. I'm so glad!</p>`;
    const to = debug ? 'hunter@hmiller.dev' : email;
    
    try {
        const response = await mailjet
            .post("send", {'version': 'v3.1'})
            .request({
                "Messages":[
                    {
                        "From": {
                            "Email": "hunter@hmiller.dev",
                            "Name": "Hunter"
                        },
                        "To": [{ "Email": to }],
                        "Subject": "Hello from Hunter @ hmiller.dev",
                        "HTMLPart": html
                    }
                ]
            });

        const responseData = response.body;
        console.log(responseData);
        if (responseData.Messages[0].Status === 'error') {
            throw new Error(responseData.Messages[0].Errors.map(error => error.ErrorMessage).join());
        }
        
        return {
            statusCode: 200,
            body: 'success'
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: error
        };
    }
}