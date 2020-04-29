const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

const getCalculations = require('./getCalculations.js');

exports.xmlForProductExport = functions.https.onRequest(async (req, res) => {
    try {
        console.log('start...');
        let test = await getCalculations.getXml();
        
        return res.set("Content-Type", "text/xml; charset=utf8").status(200).send(test);
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      } //end catch error

});


