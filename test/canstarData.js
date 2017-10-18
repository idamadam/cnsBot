var canstarData = require("../canstarData");

var chai = require("chai");
var should = chai.should();

let baseUrl = 'https://widgets-api.global.ssl.fastly.net/widgets/api_v2/facets/data/?'
	
let queryParams = {
	"distributor": "canstar",
	"table": "mortgages",
	"profile": "Buying+Next+Home+350k",
	"amount": "350000",
	"state": "QLD",
	"repayment_type": "P%2BI",
	"collection": "canstar_mortgages"
}

describe("Make URL for API call", function() {
	
	let query = canstarData.makeQuery(baseUrl, queryParams);

	it("Returns a URL that starts with the baseUrl", function(){
		let apiBase = query.slice(0, baseUrl.length);
		
		apiBase.should.equal(baseUrl);
		
	});
	
	it("Returns a URL with all of the queryParams attached", function() {
		let apiParamSlice = query.slice(baseUrl.length, query.length).split("&"); 
		let returnedParams = {};
		
		apiParamSlice.forEach(function(param) {
			slicedParam = param.split("=");
			returnedParams[slicedParam[0]] = slicedParam[1];
		});
		
		returnedParams.should.eql(queryParams);
	});
	
});

describe("Call the Canstar API", function() {
		
	beforeEach(function() {
		query = canstarData.makeQuery(baseUrl, queryParams);
		return canstarData.getCheapestLoans(query)
			.then(function(response) {
				return data = response;
			})
	});
	
	it("Returns some data", function() {
		data.should.be.a('array');
	});
	
});