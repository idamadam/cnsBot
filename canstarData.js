var rp = require("request-promise") 

// Function to create the Query URL
function makeQueryURL(baseUrl, parameters) {
	url = baseUrl
	lengthOfParameters = Object.keys(parameters).length
	
	for (let param in parameters) {
		var index = Object.keys(parameters).indexOf(param)
		
		query = param+"="+parameters[param]
		
		if (index < lengthOfParameters-1) {
		 query = query+"&"	
		}
		
		url = url + query
	}
	
	return url;
}

// Function to sort the raw data by Comparison Rate
function sortByRate(data) {
	data.sort(function (a,b) {
		aRate = parseFloat(a.SUPP.AAPR150K);
		bRate = parseFloat(b.SUPP.AAPR150K);
		
		return aRate - bRate;
	});	
}

// Return the tags that we require for the messenger cards
function etlTags(element) {
	loan = {}
	loan.CO_NAME = element.SUPP.COMPANY_NAME
	loan.PROD_NAME = element.SUPP.TYPE_PROD_NAME
	loan.COMP_RATE = parseFloat(element.SUPP.AAPR150K).toFixed(2)+"%"
	loan.IMAGE = "https://snapshots.canstar.com.au/widgets/assets/image/company/large_" + element.SUPP.CO_CODE.toLowerCase() + "_logo.png"
	 
	return loan
}

// Get the Cheapest Loans
function getCheapestLoans(query) {
	return new Promise((resolve, reject) => {
		
		rp(query)
		.then(function (jsonString) {
			
			rawData = JSON.parse(jsonString)
			sortByRate(rawData);
			slicedData = rawData.slice(0, 3)
			processedData = []
			
			slicedData.forEach(function(element) {
				processedData.push(etlTags(element))
			});
			
			resolve(processedData)
		})
		.catch((err) => {console.log(err); })
	
	});
}

module.exports = {
	makeQuery: makeQueryURL,
	getCheapestLoans: getCheapestLoans
}