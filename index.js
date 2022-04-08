const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const config = require('./config.js');
const routes = require('./routes.js');
const escape = require('escape-html');
const cors = require('cors');

var pool = require('./mysqlConnector');

var jsonParser = bodyParser.json()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');

pool.getConnection(function(err) {
    if (err) throw err;
    console.error("You are connected!");
});

// GET(ters)
var indexRouter = express.Router();
indexRouter.get('/', function(req, res) {
    getAll(res);
});


var getNormalRouter = express.Router();
getNormalRouter.get('/', function(req, res) {
    getNormal(res);
});
indexRouter.use('/normal', getNormalRouter);

var getHardRouter = express.Router();
getHardRouter.get('/', function(req, res) {
    getHard(res);
});
indexRouter.use('/hard', getHardRouter);

var getEasyRouter = express.Router();
getEasyRouter.get('/', function(req, res) {
    getEasy(res);
});
indexRouter.use('/easy', getEasyRouter);

// POST


app.use(config.baseUrl, indexRouter);



process.on('SIGTERM', () => {
    server.close(() => { pool.end() })
})


function getAll(res) {
    pool.query('SELECT * FROM Player ORDER BY lastScore DESC LIMIT 100', (err, rows, fields) => {
        if (!err)
            res.status(200).send(rows);

        else
            console.log(err);
    });
}

function getNormal(res) {
    pool.query('SELECT * FROM Player WHERE gameModeState = "NORMAL" ORDER BY lastScore DESC LIMIT 10', (err, rows, fields) => {
        if (!err)
            res.status(200).send(rows);

        else
            console.log(err);
    });
}

function getHard(res) {
    pool.query('SELECT * FROM Player WHERE gameModeState = "HARD" ORDER BY lastScore DESC LIMIT 10', (err, rows, fields) => {
        if (!err)
            res.status(200).send(rows);

        else
            console.log(err);
    });
}

function getEasy(res) {
    pool.query('SELECT * FROM Player WHERE gameModeState = "EASY" ORDER BY lastScore DESC LIMIT 10', (err, rows, fields) => {
        if (!err)
            res.status(200).send(rows);

        else
            console.log(err);
    });
}

var postRouter = express.Router();
postRouter.post('/', function(req, res) {
    postToDB(req, res);
});
indexRouter.use('/post', postRouter);

function postToDB(req, res) {
    let highScore = req.body.highScore;
    let lastScore = req.body.lastScore;
    let gameModeState = escape(req.body.gameModeState);
    let rounds = req.body.rounds;
    let userName = escape(req.body.userName).substring(0, 30);
    if (req.headers['user-agent'] === "jumpy-duke") {
        pool.query("INSERT INTO Player (userName, lastScore, gameModeState, highScore, rounds) VALUES (?,?,?,?,?)", [userName, lastScore, gameModeState, highScore, rounds], function(error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'New player has been added successfully.' });
        });
    }
}

app.listen(port, () =>
    console.log(`Listening on port ${port}..`));