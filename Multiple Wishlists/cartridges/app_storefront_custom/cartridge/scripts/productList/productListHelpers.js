'use strict';
var base = require('lib_productlist/cartridge/scripts/productList/productListHelpers');
 
/**
 * @typedef config
 * @type Object
 * @property {number} type - a number for what type of product list is being created
 */
/**
 * Creates a list, based on the type sent in
 * @param {dw.customer.Customer} customer - current customer
 * @param {Object} config - configuration object
 * @return {dw.customer.ProductList} list - target productList
 */
function createList(customer, config, listID) {
    var Transaction = require('dw/system/Transaction');
    var ProductListMgr = require('dw/customer/ProductListMgr');
    var list;
 
    if (config.type === 10) {
        Transaction.wrap(function () {
            list = ProductListMgr.createProductList(customer, config.type);
            if (!empty(listID)) {
                list.setName(listID);
            }
        });
    }
    return list;
}
 
/**
 * @typedef config
 * @type Object
 * @property {number} type - a number for what type of product list is being created
 */
/**
 * Returns the customer's current list based on type. Will return null if the list doesn't exist
 * @param {dw.customer.Customer} customer - current customer
 * @param {Object} config - configuration object
 * @return {dw.customer.ProductList} list - target productList
 */
function getList(customer, config, listID) {
    var productListMgr = require('dw/customer/ProductListMgr');
    var type = config.type;
    var list;
    if (type === 10) {
        var productLists = productListMgr.getProductLists(customer, type);
        // Get general list
        if (empty(listID)) {
            list = productLists.length > 0
                ? productLists[0]
                : null;
        // Get custom list
        } else {
            for (var i = 0; i < productLists.length; i++) {
                if (productLists[i].UUID == listID) {
                    list = productLists[i];
                    break;
                }
            }
        }
    } else if (type === 11) {
        list = productListMgr.getProductList(config.id);
    }
    return list || null;
}
 
/**
 * @typedef config
 * @type Object
 * @property {number} type - a number for what type of product list is being created
 */
/**
 * Returns the customer's current list based on type. If the customer is requesting a wishlist that doesn't exist, a new wishlist will be created
 * @param {dw.customer.Customer} customer - current customer
 * @param {Object} config - configuration object
 * @return {dw.customer.ProductList} list - target productList
 */
function getCurrentOrNewList(customer, config, listID) {
    var type = config.type;
    var list = getList(customer, config, listID);
    if (list === null && type === 10) {
        list = createList(customer, { type: type }, listID);
    }
    return list;
}
 
module.exports = {
    addShippingAddress: base.addShippingAddress,
    addEventInfo: base.addEventInfo,
    addRegistrantInfo: base.addRegistrantInfo,
    createList: createList,
    getList: getList,
    getCurrentOrNewList: getCurrentOrNewList,
    updateWishlistPrivacyCache: base.updateWishlistPrivacyCache,
    removeList: base.removeList,
    itemExists: base.itemExists,
    addItem: base.addItem,
    mergelists: base.mergelists,
    removeItem: base.removeItem,
    getItemFromList: base.getItemFromList,
    toggleStatus: base.toggleStatus
};