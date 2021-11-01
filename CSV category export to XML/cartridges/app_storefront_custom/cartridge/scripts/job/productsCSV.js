'use strict';
var run = function () {
    var args = arguments[0];
    var CatalogMgr = require("dw/catalog/CatalogMgr");
    var FileWriter = require("dw/io/FileWriter");
    var CSVStreamWriter = require("dw/io/CSVStreamWriter");
    var File = require("dw/io/File");
    var file = new File("/IMPEX/products.csv");
    var fileWriter = new FileWriter(file, "UTF-8");
    var categoryID = args.categoryID;
    var category = CatalogMgr.getCategory(categoryID);
    var products = category.products;
    var line = ['name', 'ID', 'shortDescription'];
 
    var csvwriter = new CSVStreamWriter(fileWriter, ',');
    csvwriter.writeNext(line);
 
    for (var i = 0; i < products.length; i++) {
        line = [];
        line.push(products[i].name);
        line.push(products[i].ID);
        line.push(products[i].shortDescription.source);
        csvwriter.writeNext(line);
    }
 
    csvwriter.close(); 
}
 
exports.Run = run;