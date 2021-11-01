'use strict'
 
var server = require('server');
 
server.get('UploadForm', function(req, res, next) {
    res.render('uploadImage')
    return next();
})
 
server.post('Upload', function(req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var Transaction = require('dw/system/Transaction');
    var UUIDUtils = require('dw/util/UUIDUtils');
    var uuid = UUIDUtils.createUUID();
    var LinkedHashMap = require('dw/util/LinkedHashMap');
    var File = require('dw/io/File');
    var filename;
    var params = request.httpParameterMap;
    var files  = new LinkedHashMap();
 
    var closure  = function(field, ct, oname) {
        filename = uuid + '-' + oname;
        return new File(File.IMPEX + "/" + filename);
    };
 
    files = params.processMultipart(closure);
    var fileSrc = "/on/demandware.servlet/webdav/Sites/Impex/" + filename;
 
    Transaction.begin();
    customer.profile.custom.avatar = fileSrc;
    Transaction.commit();
 
    res.redirect(URLUtils.url('Account-Show'))
    return next();
})
 
module.exports = server.exports();