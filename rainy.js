/* global Buffer */
module.exports = function(username, password, callback) {
	var http = require('http');
	var url  = require('url');
	var fs = require('fs');


	var lastImage;
	
	var parsedUrl = url.parse('http://www.flug-wetter.at/radar/all_inkl/images/files_4.dat');
	if(parsedUrl.host == null){
		callback(new Error('URL parsing error'));
	    return;
	}
	
	// http://www.flug-wetter.at/radar/all_inkl/images
	 
	var options = {
		host: parsedUrl.hostname,
		post: parsedUrl.port ? parsedUrl.port : 80,
		method: 'GET',
		auth: username + ':' + password,
		path: parsedUrl.pathname
	};
	
	var html = [];
	
	var request = http.request(options, function(res) {
	    res.setEncoding('utf8');
	    res.on('data', function(chunk){
	        html.push(chunk);
	    });
	    res.on('end', function(){
			var data = html.join('').split('\n');
			lastImage = data[data.length-2].split(' ')[0].trim();
			imageName(lastImage, callback);
			return;
	    });	
	});
	
	request.on('error', function(e) {
		callback(e);
	    return;
	});
	
	request.end();	
	
	var imageName = function(lastImage, callback) {
		//var file = fs.createWriteStream('images/'+lastImage);
		var parsedUrl = url.parse('http://www.flug-wetter.at/radar/all_inkl/images/'+ lastImage);
		if(parsedUrl.host == null){
			console.log(parsedUrl);
			callback(new Error('URL parsing error: ' + parsedUrl));
	    	return;
		}
		var options = {
			host: parsedUrl.hostname,
			post: parsedUrl.port ? parsedUrl.port : 80,
			method: 'GET',
			auth: username + ':' + password,
			path: parsedUrl.pathname
		};

		var str = '';
		var request = http.request(options, function(res) {
		    res.setEncoding('binary');
		    res.on('data', function(chunk){
				str = str + chunk;
		    });
		    res.on('end', function(){
			    var buffer = new Buffer(str, 'binary');
		//		file.write(buffer);
		//		file.end();
				callback(null, buffer);
				return;
		    });	
		});
		
		request.on('error', function(e) {
			callback(e);
		    return;
		});
		
		request.end();			
	};
};