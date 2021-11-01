'use strict';
var run = function () {
    var File = require("dw/io/File");
    var FileWriter = require("dw/io/FileWriter");
    var CSVStreamReader = require("dw/io/CSVStreamReader");
    var xmlStreamWriter = require("dw/io/XMLStreamWriter");
    var FileReader = require("dw/io/FileReader");
    var fileCSV = new File("/IMPEX/products.csv");
    var fileXML = new File("/IMPEX/products.xml");
    var fileReader = new FileReader(fileCSV);
    var fileWriter = new FileWriter(fileXML, "UTF-8");
    var xsw = new xmlStreamWriter(fileWriter);
    var csvStreamReader = new CSVStreamReader(fileReader, ',');
    var csv = csvStreamReader.readAll();
 
    xsw.writeStartDocument();
    xsw.writeStartElement("products");
    for (var i = 1; i < csv.length; i++) {
        xsw.writeStartElement('product');
        for (var j = 0; j < csv[i].length; j++) {
            xsw.writeStartElement(csv[0][j]);
            xsw.writeCharacters(csv[i][j]);
            xsw.writeEndElement();
        }
        xsw.writeEndElement();
    }
    xsw.writeEndElement();
    xsw.writeEndDocument();
    xsw.close();
    fileWriter.close();
}
 
exports.Run = run;