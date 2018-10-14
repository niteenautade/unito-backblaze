var axios = require('axios')
var crypto = require('crypto')
var authorize = require('./authorize')

var resizeImage = require("./resizeImage")
var awsUpload = require("./lib/s3Upload")var fs = require("fs")
var unitoS3Upload = (awsConfig,buffer, filename, resizeWidth, resizeHeight) => {
	return new Promise((resolve,reject)=>{
		resizeImage(buffer, filename,resizeWidth, resizeHeight)
		.then(compressedImage => {
            return awsUpload(awsConfig,filename,compressedImage)
        })
        .then(data=>{
        	resolve(data)
        })
        .catch(err => {
            reject(err)
        });	
	})
}


var uploader = function(applicationKeyId,applicationKey,bucketId,bucketName,source,fileName,resizeWidth, resizeHeight){
	if(!applicationKeyId){
		console.log("applicationKeyId is missing. Please provide applicationKeyId,applicationKey,bucketId,bucketName,source,fileName as parameters")
	}
	if(!applicationKey){
		console.log("applicationKey is missing. Please provide applicationKeyId,applicationKey,bucketId,bucketName,source,fileName as parameters")
	}
	if(!bucketId){
		console.log("bucketId is missing. Please provide applicationKeyId,applicationKey,bucketId,bucketName,source,fileName as parameters")
	}
	if(!bucketName){
		console.log("bucketName is missing. Please provide applicationKeyId,applicationKey,bucketId,bucketName,source,fileName as parameters")
	}
	if(!source){
		console.log("source is missing. Please provide applicationKeyId,applicationKey,bucketId,bucketName,source,fileName as parameters")
	}
	if(!fileName){
		console.log("fileName is missing. Please provide applicationKeyId,applicationKey,bucketId,bucketName,source,fileName as parameters")
	}

	return Promise.all([ authorize(applicationKeyId,applicationKey), resizeImage(source, fileName,resizeWidth, resizeHeight) ])
	.then(([credentials,compressedImage])=>{
		return axios.post(
		    credentials.apiUrl + '/b2api/v1/b2_get_upload_url',
		    {
		        bucketId: bucketId
		    },
		    { headers: { Authorization: credentials.authorizationToken }
		})
	    .then(function (response) {
	        var uploadUrl = response.data.uploadUrl;
	        var uploadAuthorizationToken = response.data.authorizationToken;
	        
	        var sha1 = crypto.createHash('sha1').update(compressedImage).digest("hex");
	    
	        return axios.post(
	            uploadUrl,
	            compressedImage,
	            {
	                headers: {
	                    Authorization: uploadAuthorizationToken,
	                    "X-Bz-File-Name": fileName,
	                    "Content-Type": "b2/x-auto",
	                    "X-Bz-Content-Sha1": sha1,
	                    "X-Bz-Info-Author": "unknown"
	                }
	            }
	        ).then(function (response) {
	            return credentials.downloadUrl+"/file/"+bucketName+"/"+fileName
	        })
	    })
	})
	
}
module.exports = uploader