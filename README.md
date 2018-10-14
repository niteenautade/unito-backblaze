# unito-backblaze

Provides functionalities to compress and upload images to backblaze

```
var backblazeUpload = require("unito-backblaze");
backblazeUpload.uploader(applicationKeyId,applicationKey,bucketId,bucketName,source,fileName,resizeWidth, resizeHeight) //returns Promise
```

resizeWidth , resizeHeight are optional (take integers e.g 600)