var axios = require('axios')
var authorize = function(applicationKeyId, applicationKey){

    var encodedBase64 = new Buffer.from(applicationKeyId + ':' + applicationKey).toString('base64');

    return axios.post(
    `https://api.backblazeb2.com/b2api/v1/b2_authorize_account`,
    {},
    {
        headers: { Authorization: 'Basic ' + encodedBase64 }
    })
    .then(function (response) {
        var data = response.data
        credentials = {
            accountId: applicationKeyId,
            applicationKey: applicationKey,
            apiUrl: data.apiUrl,
            authorizationToken: data.authorizationToken,
            downloadUrl: data.downloadUrl,
            recommendedPartSize: data.recommendedPartSize
        }
        return credentials
    })
    
}

module.exports = authorize