/* global process */
var rainy = require('./rainy.js');
var http = require("http");
var server = http.createServer(function(request, response) {

 	rainy(process.argv[2], process.argv[3], function(err, image) {
		if(err) {
			console.log(err);
			return;
		}
		response.writeHead(200, {"Content-Type": "image/gif"});
		response.end(image);
	}); 
});
 
server.listen(process.env.PORT || 5000);
console.log("Server is listening");