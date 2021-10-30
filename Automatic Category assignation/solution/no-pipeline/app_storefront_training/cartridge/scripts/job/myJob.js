"use strict";
 
var FileWriter = require("dw/io/FileWriter");
var File = require("dw/io/File");
//var XMLStreamWriter = require('dw/io/XMLStreamWriter');
var XMLStreamWriter  = require('dw/io/XMLIndentingStreamWriter');
 
function step(parameters) {
    // write category assignments to xml file
    var filePath = [dw.io.File.IMPEX, 'src', 'xmlFile.xml'].join(dw.io.File.SEPARATOR);
    var file = new File(filePath);
    var fileWriter = new FileWriter(file, "UTF-8");
    var xsw = new XMLStreamWriter(fileWriter);
   
    var brand = parameters.brand;
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    var brandSearchModel = new ProductSearchModel();
    brandSearchModel.addRefinementValues('brand', brand);
     
    brandSearchModel.search();
    //Write the xml
    xsw.writeStartDocument();
    xsw.writeStartElement("catalog");
        xsw.writeAttribute("xmlns", "http://www.demandware.com/xml/impex/catalog/2006-10-31");
        xsw.writeAttribute("catalog-id", "storefront-catalog-en");
 
        var brandHitsIterator = brandSearchModel.getProductSearchHits();
        while (brandHitsIterator.hasNext()) {
            var product = brandHitsIterator.next().getProduct();
            xsw.writeStartElement("category-assignment");
                xsw.writeAttribute("category-id", "special");
                xsw.writeAttribute("product-id", product.ID);
                xsw.writeStartElement("primary-flag");
                    xsw.writeCharacters("true");
                xsw.writeEndElement();
            xsw.writeEndElement();
        }
    xsw.writeEndElement();
    xsw.close();
}
 
module.exports = {
    step: step
};