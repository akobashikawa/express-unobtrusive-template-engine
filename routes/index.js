var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        replaces: function($) {
            $('title').text('Home');
            $('h1.title').text('Home');
            $('.content').text('¡Hola Mundo!');
        }
    });
});

router.get('/about', function(req, res, next) {
    res.render('about', {
        replaces: function($) {
            $('title').text('About');
            $('h1.title').text('About');
            $('.content').text('Acerca de esta app');
        }
    });
});

module.exports = router;