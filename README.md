# Unobtrusive Template Engine
An example of unobtrusive templating using [cheerio](https://github.com/cheeriojs/cheerio).

## Idea
Using tipical template engines involves learning the template language and process html base in order to accomplish template engine requirements.

It's not an unobtrusive way to work with html base.

In frontend side, jQuery helps to work in an unobtrusive way. What if we could apply this idea in backend side?

[Cheerio](https://github.com/cheeriojs/cheerio) provides jQuery functionalities for Node.

This is an example of how to work with cheerio to provide unobtrusive templating.

## Install
- Clone the repository
- Change to the directory
- ```$ npm install````
- ```$ npm start````
- Open ```http://localhost:3000``` in a browser

## Branches
- simple: Simple example
- bootstrap: For bootstrap theme

## Templating
- In ```app.js```, usual templating block is replaced by a simple custom template engine, based in the example of Express documentation: ```http://expressjs.com/en/advanced/developing-template-engines.html```.

```javascript
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

app.use('/', routes);

app.use(express.static(path.join(__dirname, 'public')));

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

```

- ```public/*.html``` are templates. Templates are simple html. No template language is required. Note than middleware for static files in public appear *after* routes to allow public contains templates.

- ```routes/index.js``` implements actions for defined routes, as usual in Express.

```javascript
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

router.get('/', function(req, res, next) {
    res.render('index', {
        replaces: function($) {
            header($);
            footer($);

            $('.site-heading h1').text('Hello World!');
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
            $('.page-heading .subheading').text('An example of unobtrusive templating');
            $('body > .container .row div').text('Este ejemplo muestra cómo se puede hacer unobtrusive templating a un tema bootstrap.');
        }
    });
});
```

- ```replaces``` is a callback for the custom template engine. It uses cheerio to make replaces in an unobtrusive way.
