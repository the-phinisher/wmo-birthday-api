var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

api = "mongodb+srv://the_phinisher:ApXGIHpwdmVnYkr8@cluster0.rtbberh.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(api);

var bdaySchema = new mongoose.Schema({
    name:String,
    bday:Date
});

var BdayModel = mongoose.model("Bday", bdaySchema);

var findName = async function (name) {
    var resolved = await BdayModel.find({name:name});
    return resolved;
}

var bdayExists = async function (bday) {
    var matches = await findName(bday["name"]);
    return matches.length != 0;
}

var saveBDay = async function (bday) {
    if (await bdayExists(bday)) return false;
    var resolved = await bday.save();
    return (resolved === bday);
};

var sendJSON = function (req, res, obj) {
    res.setHeader("statusCode", 200);
    res.setHeader("Content-Type","application/json");
    res.send(JSON.stringify(obj));
}

var sendInvalid = function (req, res, text=null) {
    res.writeHead(400);
    if (text) res.end(text);
    else res.end("Invalid request");
}

var invalidDateString = function (datestring) {
    date = new Date(datestring+"UTC");
    return isNaN(date.getTime());
}

app.post("/", async function(req, res) {
    if (! (req.body["bday"] && req.body["name"])) {
        sendInvalid(req, res, "No name or bday field");
    } else if (invalidDateString(req.body["bday"])) {
        sendInvalid(req, res, "Cannot parse date string");
    }
    else {
        var newBDay = BdayModel({name:req.body["name"], bday:new Date(req.body["bday"]+"UTC")});
        var x = await saveBDay(newBDay);
        if (x) {
            console.log("Saved");
            console.log(newBDay);
            sendJSON(req, res, newBDay);
        } else {
            sendInvalid(req, res, "Name already exists; use update request");
        }
    }
});

app.patch("/", async function (req, res) {
    var names = await findName(req.body["name"]);
    console.log("Update init");
    console.log(names);
    if (! (req.body["name"] && req.body["bday"] && names.length > 0)) {
        sendInvalid(req, res);
    } else if (invalidDateString(req.body["bday"])) {
        sendInvalid(req, res, "Cannot parse bday string");
    } else {
        var id = names[0]["_id"];
        names[0]["bday"] = new Date(req.body["bday"]+"UTC");
        var result = await BdayModel.findByIdAndUpdate(names[0]["_id"], names[0]);
        if (result) {
            sendJSON(req, res, result);
        } else {
            sendInvalid(req, res, "Database error");
        }
    }
});

app.delete("/", async function (req, res) {
    var names = await findName(req.body["name"]);
    if (! (req.body["name"] && names.length > 0)) {
        if (names.length == 0) sendInvalid(req, res, "No entry found");
        else sendInvalid(req, res, "No name field");
    } else {
        var result = await BdayModel.findByIdAndDelete(names[0]["_id"]);
        if (result) {
            sendJSON(req, res, result);
        } else {
            sendInvalid(req, res);
        }
    }
});

app.post("/nearest", async function (req, res) {
    var all = await BdayModel.find({});
    console.log('Nearest init');
    console.log(all);
    if (!all.length > 0) {
        sendInvalid(req, res);
    } else {
        closest = null;
        closest_time = Infinity;
        var today = new Date();
        today.setUTCHours(0);
        today.setUTCMinutes(0);
        today.setUTCSeconds(0);
        today.setUTCMilliseconds(0);
        var year = today.getUTCFullYear();
        for(var i = 0; i < all.length; i++) {
            var bday = new Date(all[i]["bday"]);
            console.log(bday);
            console.log(typeof(bday));
            if (!bday) {
                findByIdAndDelete(all[i]["_id"]);
                continue;
            }
            bday.setUTCFullYear(year);
            if (bday.getTime() < today.getTime()) bday.setUTCFullYear(year + 1);
            console.log(bday);
            var delta = bday.getTime() - today.getTime();
            console.log(delta);
            if (delta < closest_time) {
                closest_time = delta;
                closest = all[i];
            }
        };
        sendJSON(req, res, closest);
    }
})

app.listen(3000, () => {
    console.log("Server started");
});
