'use strict';
 
var page = module.superModule;
var server = require('server');
server.extend(page);
 
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var PAGE_SIZE_ITEMS = 48;
 
server.append('Show', function (req, res, next) {
    var productListMgr = require('dw/customer/ProductListMgr');
    var lists = productListMgr.getProductLists(req.currentCustomer.raw, 10);
    if (!empty(lists)) {
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
    }
 
    var viewData = res.getViewData();
    viewData.wishlists = wishlists;
    res.setViewData(viewData);
    next();
});
 
server.replace('AddProduct', function (req, res, next) {
    var listID = req.form.lid || null;
    var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 10 }, listID);
    var pid = req.form.pid;
    var optionId = req.form.optionId || null;
    var optionVal = req.form.optionVal || null;
 
    var config = {
        qty: 1,
        optionId: optionId,
        optionValue: optionVal,
        req: req,
        type: 10
    };
    var errMsg = productListHelper.itemExists(list, pid, config) ? Resource.msg('wishlist.addtowishlist.exist.msg', 'wishlist', null) :
        Resource.msg('wishlist.addtowishlist.failure.msg', 'wishlist', null);
 
    var success = productListHelper.addItem(list, pid, config);
    if (success) {
        res.json({
            success: true,
            pid: pid,
            msg: Resource.msg('wishlist.addtowishlist.success.msg', 'wishlist', null)
        });
    } else {
        res.json({
            error: true,
            pid: pid,
            msg: errMsg
        });
    }
    next();
});
 
server.get('Remove', function (req, res, next) {
    var listUUID = req.querystring.UUID;
    var productListMgr = require('dw/customer/ProductListMgr');
    var list = productListMgr.getProductList(listUUID);
    if (!empty(list)) {
        productListHelper.removeList(customer, list);
    }
    res.redirect(URLUtils.url('Wishlist-Show'));
    next();
});
 
server.get('Rename', function (req, res, next) {
    var listUUID = req.querystring.UUID;
    var name = req.querystring.name;
    var productListMgr = require('dw/customer/ProductListMgr');
    var list = productListMgr.getProductList(listUUID);
    if (!empty(list) && name) {
        try {
            dw.system.Transaction.wrap(function() {
                list.setName(name);
            });
        } catch(e) {
            dw.system.Logger.error('[{0}] - [{1}] - [{2}] - {3} - at line {4}', e.fileName, arguments.callee.name, e.name, e.message, e.lineNumber);
        }
    }
    res.redirect(URLUtils.url('Wishlist-Show'));
    next();
});
 
server.get('New', function (req, res, next) {
    var name = req.querystring.name;
 
    if (!empty(name)) {
        var Transaction = require('dw/system/Transaction');
        var ProductListMgr = require('dw/customer/ProductListMgr');
        var list;
 
        var productLists = ProductListMgr.getProductLists(req.currentCustomer.raw, 10);
        if (productLists.length <= 3) {
            Transaction.wrap(function () {
                list = ProductListMgr.createProductList(req.currentCustomer.raw, 10);
                list.setName(name);
            });
        }
    }
 
    res.redirect(URLUtils.url('Wishlist-Show'));
    next();
});
 
server.get('MoveProduct', function (req, res, next) {
    var productListMgr = require('dw/customer/ProductListMgr');
    var ProductMgr = require('dw/catalog/ProductMgr');
 
    var oldListUUID = req.querystring.oldList;
    var newListUUID = req.querystring.newList;
    var pid = req.querystring.pid;
 
    var oldList = productListMgr.getProductList(oldListUUID);
    var newList = productListMgr.getProductList(newListUUID);
    var apiProduct = ProductMgr.getProduct(pid);
 
    if (!empty(oldList) && !empty(newList) && pid) {
        var listItems = oldList.items.toArray();
        var found;
        listItems.forEach(function (item) {
            if (item.productID === pid) {
                found = item;
            }
        });
 
        if (found) {
            try {
                dw.system.Transaction.wrap(function() {
                    newList.createProductItem(apiProduct);
                    oldList.removeItem(found);
                });
            } catch(e) {
                dw.system.Logger.error('[{0}] - [{1}] - [{2}] - {3} - at line {4}', e.fileName, arguments.callee.name, e.name, e.message, e.lineNumber);
            }
        }
    }
 
    res.redirect(URLUtils.url('Wishlist-Show'));
    next();
});
 
module.exports = server.exports();