var express = require('express');
var router = express.Router();

var posts = [
    {
        id: 0,
        title: 'Hola',
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
        body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit suscipit iste, quis minus incidunt repudiandae sequi modi, harum ex fugiat cum dolore amet ipsum distinctio consequuntur culpa architecto maiores! Minima!',
        date: 'December 29, 2015'
    },
    {
        id: 1,
        title: 'Hello',
        subtitle: 'Quo vel ipsum cupiditate porro iure nisi sunt voluptatum debitis ad laboriosam consectetur',
        body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo vel ipsum cupiditate porro iure nisi sunt voluptatum debitis ad laboriosam consectetur, distinctio voluptas sed, deleniti neque architecto corporis labore officia.',
        date: 'December 28, 2015'
    },
    {
        id: 2,
        title: 'Konnichi wa',
        subtitle: 'Aperiam animi excepturi, harum optio quod minima accusantium nostrum totam omnis obcaecati',
        body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod necessitatibus non tempore, magni veritatis optio dignissimos eveniet dolores. Aperiam animi excepturi, harum optio quod minima accusantium nostrum totam omnis obcaecati.',
        date: 'December 27, 2015'
    }
];

function header($) {
    $('head').prepend('<base href="/">');
    $('a.navbar-brand').attr('href', '/').text('Simple Blog');
    $('.navbar-nav a[href="index.html"]').attr('href', '/');
    $('.navbar-nav a[href="about.html"]').attr('href', '/about');
    $('.navbar-nav a[href="post.html"]').parent().remove();
    $('.navbar-nav a[href="contact.html"]').parent().remove();
}

function footer($) {
    $('.fa-twitter').parent().parent().attr('href', 'https://twitter.com/rulokoba').attr('target', '_blank');
    $('.fa-facebook').parent().parent().attr('href', 'https://www.facebook.com/akobashikawa').attr('target', '_blank');
    $('.fa-github').parent().parent().attr('href', 'https://github.com/akobashikawa').attr('target', '_blank');
    $('footer .copyright').text('Rulo Kobashikawa 2015');
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        replaces: function($) {
            header($);
            footer($);

            $('.site-heading h1').text('Hello Juno!');
            $('.site-heading .subheading').text('An example of unobtrusive templating');
            var $post_template = $('.container .post-preview:first-child');
            var $pager_template = $('.container .pager');
            var $posts_parent = $post_template.parent();
            $posts_parent.html('');
            for (var i = 0; i < posts.length; i++) {
                var post = posts[i];
                meta = 'Posted on ' + post.date;
                $post_template
                    .find('a').attr('href', '/post/' + post.id).end()
                    .find('.post-title').text(post.title).end()
                    .find('.post-subtitle').text(post.subtitle).end()
                    .find('.post-meta').text(meta).end();
                $posts_parent.append($post_template.clone());
            }
            //$posts_parent.append($pager_template);
        }
    });
});

router.get('/post/:id', function(req, res, next) {
    res.render('post', {
        replaces: function($) {
            header($);
            footer($);
            var id = req.params.id;
            var post = posts[id];
            meta = 'Posted on ' + post.date;
            $('.post-heading h1').text(post.title);
            $('.post-heading .subheading').text(post.subtitle);
            $('.post-heading .meta').text(meta);
            $('body article .container .row div').text(post.body);
        }
    });
});

router.get('/about', function(req, res, next) {
    res.render('about', {
        replaces: function($) {
            header($);
            footer($);
            $('.page-heading h1').text('About Juno');
            $('.page-heading .subheading').text('for unobtrusive templating');
            $('body > .container .row div').text('Juno is a simple module for unobstrusive templating.');
        }
    });
});

module.exports = router;