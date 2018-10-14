var axios = require('axios')
var crypto = require('crypto')
var authorize = require('./authorize')
var uploader = function(applicationKeyId,applicationKey,bucketId,bucketName,source,fileName){
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

	authorize(applicationKeyId,applicationKey)
	.then(credentials=>{
		return axios.post(
	    credentials.apiUrl + '/b2api/v1/b2_get_upload_url',
	    {
	        bucketId: bucketId
	    },
	    { headers: { Authorization: credentials.authorizationToken } })
	    .then(function (response) {
	        var uploadUrl = response.data.uploadUrl;
	        var uploadAuthorizationToken = response.data.authorizationToken;
	        
	        var sha1 = crypto.createHash('sha1').update(source).digest("hex");
	    
	        return axios.post(
	            uploadUrl,
	            source,
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