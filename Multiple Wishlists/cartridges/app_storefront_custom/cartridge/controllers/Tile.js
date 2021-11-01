'use strict';
 
var page = module.superModule;
var server = require('server');
server.extend(page);
 
server.append('Show', function (req, res, next) {
    var PAGE_SIZE_ITEMS = 48;
    var productListMgr = require('dw/customer/ProductListMgr');
    var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
 
    var lists = productListMgr.getProductLists(req.currentCustomer.raw, 10);
    if (empty(lists)) {
        productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 10 }, null);
        lists = productListMgr.getProductLists(req.currentCustomer.raw, 10);
    }
 
    var wishlists = [];
    var WishlistModel = require('*/cartridge/models/productList');
    for (var i = 0; i < lists.length; i++) {
        var wishlistModel = new WishlistModel(
            lists[i],
            {
                type: 'wishlist',
                publicView: false,
                pageSize: PAGE_SIZE_ITEMS,
                pageNumber: 1
            }
        ).productList;
        wishlists.push(wishlistModel);
    }
 
    var viewData = res.getViewData();
    viewData.wishlists = wishlists;
    res.setViewData(viewData);
    next();
});
 
module.exports = server.exports();