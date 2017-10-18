/*jshint esversion: 6*/

var express = require("express");
var logger = require('morgan');
var bodyParser = require('body-parser');

var data = require('./canstarData');

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

let apiUrl = 'https://widgets-api.global.ssl.fastly.net/widgets/api_v2/facets/data/?';

let queryParams = {
	"distributor": "canstar",
	"table": "mortgages",
	"profile": "Buying+Next+Home+350k",
	"amount": "350000",
	"state": "QLD",
	"repayment_type": "P%2BI",
	"collection": "canstar_mortgages"
};

const message = {
	"speech": "Getting data from Canstar",
	"displayText": "Getting data from Canstar",
	"data": {
		"facebook": {
			"attachment": {
				"type": "template",
				"payload": {
					"template_type":"generic",
					"elements": []
				}			
			}
		}
	}
};

function makeCard(item) {
	card = {
		"title": item.COMP_RATE,
		"image_url": item.IMAGE,
		"subtitle": item.PROD_NAME,
		"default_action": {
			"type": "web_url",
			"url": "https://www.canstar.com.au/compare/home-loans",
		},
		"buttons": [
			{
				"type": "web_url",
				"url": "https://www.canstar.com.au/compare/home-loans",
				"title": "Compare Home Loans"
			}
		]
	};
	
	message.data.facebook.attachment.payload.elements.push(card);
}

query = data.makeQuery(apiUrl, queryParams);

app.post("/", function(req, res) {
	data.getCheapestLoans(query)
	.then(function(loans) {
		loans.forEach(function(element) {
			makeCard(element);
		});
		
		res.json(message);
	})
	.catch((err) => console.log(err));
});

// Verify Facebook Callback
app.get("/", function(req,res) {
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];

	if (token == 'rihakula') {
		res.send(challenge);
	} else { 
		res.status(500).send("Something broke!");
	}

});

app.listen(process.env.PORT, function() {
	console.log("Server started on port " + process.env.PORT);
});
