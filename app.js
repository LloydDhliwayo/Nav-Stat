const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 30001
const request = require('request')
const publicDirectoryPath = path.join(__dirname, '../public')
var bodyParser = require("body-parser")
const { stringify } = require('querystring')
const { Console } = require('console')
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yy = today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var currentdate = new Date(`${yy}-${mm}-${dd} ${time}`);
app.use(bodyParser.urlencoded({ extended: true }))
    //app.use(express.static(publicDirectoryPath))
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs')

console.log(__dirname)
const downloadlink = "https://json-csv.com/?u="
const idurl = 'https://api.navixy.com/v2/tracker/list?hash='
const detailedurl = "https://api.navixy.com/v2/tracker/get_states?hash="
var customerunits = "";

const trackerIds = [];
var online = [];
var offline = [];
var justregistered = [];
var user = "";
var idresult = "";
console.log(currentdate)

app.get("/results", function(req, res) {

    user = req.query.userid;

    request(idurl + user, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            trackerIds.splice(0, trackerIds.length)
            const trackers = response.body.list;

            idresult = JSON.parse(body);

            idresult["list"].forEach(function(tracker) {

                trackerIds.push(tracker["id"]);
            })
            customerunits = idresult["list"].length;
            var currentstatsurl = downloadlink + detailedurl + user;
            res.render('idresults', { data: idresult, url: downloadlink + idurl + user, numberofunits: customerunits, currentstats: currentstatsurl })

            // console.log(trackerIds)

        }

    });

});

app.get('/search', (req, res) => {
    res.render('search')
})





app.get('/detailed', (req, res) => {


    //console.log(trackerIds)
    //console.log(trackerIds[2])
    var query = detailedurl + user + "&trackers=" + "[" + trackerIds + "]"
        //var mytrackers = "[" + trackerIds + "]";
    var mytrackers = trackerIds
    request(query, function(error, response, body) {

        var query = detailedurl + user + "&trackers=" + "[" + trackerIds + "]"
        if (!error && response.statusCode == 200) {
            //const detailed = JSON.parse(response.body);
            const detailed = JSON.parse(response.body);

            // console.log(detailed["states"]["716041"])
            // console.log(mytrackers.length

            res.render('detailed', { bodydata: detailed["states"], trackers: mytrackers, numberofunits: customerunits, idresult: idresult, currentdate: currentdate, online: online, offline: offline, justregistered: justregistered })
                // res.send(detailed)



        }

    });

    /*  async function getDetails() {
        const data = await fetch(query)
        const returndata = await response.json()
        console.log(returndata)
        res.render('detailed', { data: returndata })
    }
 */








})









app.get('/table', (req, res) => {
    res.render('table')
})













app.listen(port, () => {
    console.log('Server is up on ' + port)
})