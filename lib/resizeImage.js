var sharp = require("sharp")
var fileType = require("file-type")
var resizeImage = (buffer, filename, resizeWidth, resizeHeight) => {
    return new Promise((resolve, reject) => {
        if (!buffer) {
            reject({ msg: "Please provide buffer" })
        } else {

            if (resizeWidth && ["png","jpg","jpeg"].indexOf(fileType(buffer).ext)!=-1) {
                sharp(buffer)
                .resize(resizeWidth, resizeHeight)
                .toBuffer()
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                });
            }
            else{
            	resolve(buffer)
            }
        }
    })
}
module.exports = resizeImage