var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var fs = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', function(filePath, options, callback) {
    fs.readFile(filePath, function(err, content) {
        if (err) return callback(new Error(err));
        var html = content.toString();
        $ = cheerio.load(html);
        if (typeof options.replaces === 'function') {
            options.replaces($);
        }
        var rendered = $.html();
        return callback(null, rendered);
    });
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);console.log(err.status);
        res.render('error', {
            replaces: function($) {
                $('title').text('Error');
                $('h1.title').text('Error');
                $('.content .message').text(err.message);
                $('.content .status').text(err.status.toString());
                $('.content .stack').text(err.stack);
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        replaces: function($) {
            $('title').text('Error');
            $('h1.title').text('Error');
            $('.content .message').text(err.message);
            $('.content .status').text(err.status.toString());
            $('.content .stack').text('');
        }
    });
});


module.exports = app;