var express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
var router = express.Router();

const creds = require('../client_secret');

async function accessSpreadSheet() {
    const doc = new GoogleSpreadsheet('1bV6nmiP0r2PD3jQNg1WqXT2cBjI6uBDVZz-plSRkO_g');
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows({'limit': 150});
    return rows.map(r => ({
        name: r['שם'],
        age: r['גיל'],
        kyu: r['חגורה'],
        city: r['עיר'],
        total_points: r['ניקוד מצטבר'],
    })) || [];

}


router.get('/', function(req, res, next) {
    accessSpreadSheet().then((result) => {res.send({result: result});});
});

module.exports = router;
