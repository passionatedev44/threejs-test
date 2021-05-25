
// node.js modules
let path = require('path'),
klaw = require('klaw'),
through2 = require('through2'),

// from npm
express = require('express'),

// heroku/local friendly port variable
port = process.env.PORT || process.argv[2] || 3000,

// patterns
//pat_jsfile = /\/js\/[\s\S]+\.js/,

// create the express app instance
app = express();

// using ejs for a template engine
app.set('view engine', 'ejs');

// root path
app.get('/', function (req, res) {
    res.render('index', {
        page: 'main'
    });
});

// img path
app.get(/\/img\/[\s\S]+/, function (req, res) {
    // just send the file
    res.sendFile(path.join(__dirname, 'views', req.url));
});

app.get(/\/css\/[\s\S]+\.css/, function (req, res) {
    // just send the file
    res.sendFile(path.join(__dirname, 'views', req.url));
});

// javaScript file path
app.get(/\/js\/[\s\S]+\.js/, function (req, res) {
    res.sendFile(path.join(__dirname, 'views', req.url));
});

// dae
app.get(/\/dae\/[\s\S]+\.dae/, function (req, res) {
    res.sendFile(path.join(__dirname, 'views', req.url));
});

// json file path
app.get(/\/json\/[\s\S]+\.js/, function (req, res) {
    res.sendFile(path.join(__dirname, 'views', req.url));
});

// build an index of links to folders
let buildIndex = function (opt) {
    opt = opt || {};
    opt.source = opt.source || 'demos';
    let uri = path.join(__dirname, 'views/' + opt.source);
    opt.through2 = opt.through2 || through2.obj(function (item, enc, next) {
            if (item.path != uri) {
                if (item.stats.isDirectory()) {
                    this.push(item);
                }
            }
            next()
        });
    // return a promise
    return new Promise(function (resolve, reject) {
        let links = [];
        klaw(uri, {
            depthLimit: 0
        })
        .pipe(opt.through2)
        .on('data', function (item) {
            let folderName = path.basename(item.path);
            // folder follows r\d+ pattern
            //if (folderName.match(/r\d+/)) {
            links.push({
                href: path.join('/', opt.source, folderName),
                name: folderName
            });
            //}
        })
        .on('end', function () {
            resolve(links);
        });
    });
};

// demo index
app.get('/demos', function (req, res) {
    buildIndex().then(function (links) {
        res.render('index', {
            page: 'demo_index',
            links: links
        });
    });
});

// demos list for a given revision
// ( /demos/r[revisionNumber] )
app.get(/(\/demos\/r\d{1,3})$/, function (req, res) {
    let r = 91,
    m = req.url.match(/r\d{1,3}/);
    if (m) {
        r = m[0].split('r')[1];
    }
    buildIndex({
        source: 'demos/r' + r
    }).then(function (links) {
        res.render('index', {
            page: 'demo_index',
            links: links
        });
    });
});

// demos paths for a given demo
// ( /demos/r[revisionNumber]/[demoName] )
app.get(/\/demos\/r\d{1,3}/, function (req, res) {
    let r = 91,
    m = req.url.match(/r\d{1,3}/);
    if (m) {
        r = m[0].split('r')[1];
    }
    res.render('index', {
        page: 'demo',
        r: r,
        demoName: req.url.replace(/\/demos\/r\d{1,3}/, '').replace(/\//, '').split('/')[0]
    });
});

// VIDEOS PATH

// the main /videos index page
app.get('/videos', function (req, res) {
    buildIndex({
        source: 'videos'
    }).then(function (links) {
        res.render('index', {
            page: 'videos_index',
            links: links
        });
    });
});

app.get(/\/videos\/([\s\S]*?)/, function (req, res) {
    let r = 91,
    m = req.url.match(/r\d{1,3}/);
    if (m) {
        r = m[0].split('r')[1];
    }
    res.render('index', {
        page: 'video',
        r: r,
        videoName: req.url.replace(/\/videos\/([\s\S]*?)/, '').replace(/\//, '').split('/')[0]
    });
});

app.listen(port, function () {
    console.log('test_threejs demo site is up at port : ' + port);
});
