express = require('express');
logger = require('morgan');
bodyParser = require('body-parser');

data = require('./canstarLoans');

app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false}));


requiredData = []

data.forEach( function(item) {
	keyItems = {};
	keyItems.CO_CODE = item.SUPP.CO_CODE;
	keyItems.CO_NAME = item.SUPP.COMPANY_NAME;
	keyItems.PROD_NAME = item.SUPP.TYPE_PROD_NAME
	keyItems.RATE = parseFloat(item.SUPP.AAPR150K); 
	keyItems.IMAGE = "https://snapshots.canstar.com.au/widgets/assets/image/company/large_"+item.SUPP.CO_CODE.toLowerCase()+"_logo.png"	

	requiredData.push(keyItems);
});

requiredData.sort(function (a,b) {
	return a.RATE - b.RATE;
});

message = {
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
}

function makeCard(item) {
	card = {
		"title": ""+item.RATE.toFixed(2)+"%",
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
	}
	
	message["data"]["facebook"]["attachment"]["payload"]["elements"].push(card);
}

app.use(function(req, res, next) {
	for (i = 0; i < 3; i++) {
		makeCard(requiredData[i])	
	}
	next();
});

app.post("/", function(req, res) {
	res.json(message);
});

//console.log(requiredData[0], requiredData[1], requiredData[2]);

app.listen(3000, function() {
	console.log("App started on 3000");
});
