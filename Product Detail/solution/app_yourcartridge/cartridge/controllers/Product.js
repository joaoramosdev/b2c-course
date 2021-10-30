'use strict';
var server = require('server');
 
var page = require('app_storefront_base/cartridge/controllers/Product');
 
server.extend(page);
 
var ProductMgr = require('dw/catalog/ProductMgr');
var ProductFactory = require('app_storefront_base/cartridge/scripts/factories/product');
var CatalogMgr = require('dw/catalog/CatalogMgr');
var ProductSearch = require('app_storefront_base/cartridge/models/search/productSearch');
var ProductSearchModel = require('dw/catalog/ProductSearchModel');
 
server.get('GetProductCustomRecommendations', function(req, res, next) {
 
    var { productID } = req.querystring;
    var product = ProductMgr.getProduct(productID);
    var productSearchHit;
    var apiProductSearch = new ProductSearchModel();
 
    apiProductSearch.setCategoryID(product.primaryCategory.ID);
    apiProductSearch.search();
 
    var productSearch = new ProductSearch(
        apiProductSearch,
        req.querystring,
        req.querystring.srule,
        CatalogMgr.getSortingOptions(),
        CatalogMgr.getSiteCatalog().getRoot()
    );
 
    res.render('/product/components/recommendations',{
        productSearch: productSearch
    })
    next();
});
 
module.exports = server.exports();