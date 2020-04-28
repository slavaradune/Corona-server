var express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
var router = express.Router();

const creds = require('../client_secret');

function getDate(title) {
    return title.split(' ')[2];
}

function collect_details(r) {
    let details = [];
    for (let i = 8; i < Object.keys(r).length; i = i + 2){
        let key = Object.keys(r)[i];
        let next_key = Object.keys(r)[i + 1];
        let date = getDate(key);
        let exercise = r[key];
        let challenge = r[next_key];
        details.push({'date' : date,
                        'exercise': exercise != null && !isNaN(exercise) && exercise !== '' ? exercise : "--",
                        'challenge': challenge != null && !isNaN(challenge) && challenge !== '' ? challenge : "--"})
    }
    return details;
}

async function accessSpreadSheet() {
    const doc = new GoogleSpreadsheet('1bV6nmiP0r2PD3jQNg1WqXT2cBjI6uBDVZz-plSRkO_g');
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows({'limit': 150});
    return rows.map(r => ({
        name: r['שם'],
        age: r['גיל'],
        rank: beltToNumber[r['חגורה']],
        city: r['עיר'],
        total_points: r['ניקוד מצטבר'],
        standing_details: collect_details(r)
    })) || [];

}

const beltToNumber = {
    'לבנה': 0,
    'סגולה': 0,
    'קיו 10': 1,
    'קיו 9': 2,
    'קיו 8': 3,
    'קיו 7': 4,
    'קיו 6': 5,
    'קיו 5': 6,
    'קיו 4': 7,
    'קיו 3': 8,
};


router.get('/', function(req, res, next) {
    accessSpreadSheet().then((result) => {res.send({result: result});});
});

module.exports = router;
