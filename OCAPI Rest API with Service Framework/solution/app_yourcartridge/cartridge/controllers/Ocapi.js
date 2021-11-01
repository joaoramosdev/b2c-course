'use strict';
 
var server = require('server');
 
var URLUtils = require('dw/web/URLUtils');
var Resource = require('dw/web/Resource');
 
server.get('Show', function (req, res, next) {
 
    var httpClient = new dw.net.HTTPClient();
 
    //URL here as example. But should use Services Framework
    var url = "https://osfglobal24-alliance-prtnr-eu06-dw.demandware.net/s/MobileFirst/dw/shop/v18_3/product_search?client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&amp;start=1&amp;count=20&amp;refine=cgid=electronics&amp;q=Sony"
 
    httpClient.open('GET', url);
    httpClient.send();
 
    var jsonData = JSON.parse(httpClient.getText());
    res.render('ocapi/ocapi',{
        ocapiData:jsonData
    })
 
    next();
});
module.exports = server.exports();