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
- *simple:* Simple example
- *bootstrap:* For bootstrap theme
- *juno:* Using juno module

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

- ```views/*.html``` are templates. Templates are simple html. No template language is required.

index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>[Title]</title>
    <link rel="stylesheet" href="/stylesheets/style.css">
</head>
<body>
    <h1 class="title">[Title]</h1>
    <div class="content">
        [Content]
    </div>
    <p>
        <a href="/about">About</a>
    </p>
</body>
</html>
```

about.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>[Title]</title>
    <link rel="stylesheet" href="/stylesheets/style.css">
</head>
<body>
    <h1 class="title">[Title]</h1>
    <div class="content">
        [Content]
    </div>
    <p>
        <a href="/">Home</a>
    </p>
</body>
</html>
```

error.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>[Title]</title>
    <link rel="stylesheet" href="/stylesheets/style.css">
</head>
<body>
    <h1 class="title">[Title]</h1>
    <div class="content">
        <div class="message">[Message]</div>
        <div class="status">[Status]</div>
        <pre class="stack">[Stack]</pre>
    </div>
</body>
</html>
```


- ```routes/index.js``` implements actions for defined routes, as usual in Express.

```javascript
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
```

- ```replaces``` is a callback for the custom template engine. It uses cheerio to make replaces in an unobtrusive way.
