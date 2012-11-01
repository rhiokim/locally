var connect = require('connect'),
    program = require('commander'),
    fs = require('fs'),
    path = require('path'),
    vhost = require('./vhost');

/**
 * process.argv pre process
 */
program
   .version('0.1.4')
   .usage('[options]')
   .option('-s, --static <directory>', 'directory for serving static files', 'static')
   .option('-w, --public <directory>', 'directory for serving public files', './')
   .option('-d, --debug', 'debug mode')
   .option('-p, --port <port>', 'public port', 8080)
   .option('-f, --file <configuration>', 'set configuration file')
   .option('-c, --vhost <virtual host>', 'set vhost information', 'localhost');

program.on('--help', function() {
    console.log(' Examples:');
    console.log('');
    console.log('    $ locally -w ./public -p 8080  start basic locally server');
    console.log('    $ locally -d                   debug mode, default <false>');
    console.log('    $ locally -f ./conf/.locally   force adjust locally configuration file');
    console.log('    $ locally -vhost vhost.com     virtual host');
    console.log('');
});

/**
 * load .locally file
 */
function loadConfiguration() {
   // locally.opt support
   try {
      var opts = fs.readFileSync(process.cwd() +'/.locally' , 'utf8')
         .trim()
         .split(/\s+/);

      process.argv = process.argv
         .slice(0,2)
         .concat(opts.concat(process.argv.slice(2)));

      program.parse(process.argv);
    
   } catch(err) {
   }
}

/**
 * create configuration file
 */
function createConfiguration() {
    var conf = [];
    program.prompt('public root: ', function(dir) {
        conf.push('-w '+ dir);

        program.prompt('port: ', function(port) {
            conf.push('-p '+ port);

            program.prompt('cname: ', function(vhost) {
                conf.push('-c '+ vhost);
                process.stdin.destory();

                fs.writeFileSync('.locally', conf.join('\n'), 'utf8');

                loadConfiguration();
            });
        });
    });    
}

if (!program.debug) {
    program.debug = false;
}
program.parse(process.argv);


/**
 * connect binding
 */
function createServer() {
    var _static = path.resolve(process.cwd(), program.public);
    var app = connect(
        connect.static(_static),
        connect.bodyParser()
        );

    //debug mode
    if (program.debug) {
        app.use(connect.logger());
    }

    if (program.vhost) {
        vhost[process.platform](program.vhost);
    }

    app.use(function(req, res, next) {

        if('GET' != req.method) {
            return next();
        }
        
        fs.readFile(process.cwd(), function(err){
        	if (err) {
        		if(err.errno === 28){
        			var uri = require('url').parse(req.url).pathname;
        			var path = process.cwd() + uri;
        		    fs.readdir(path, function(err1, files){
        	            res.writeHead(200, {"Content-Type": "text/html"});
        	            res.write('<ul>');
        	            if (uri != '/') {
        	            	res.write('<li><a href=\'../\'>../</a></li>');
        	            }
        	            for(var i in files) {
        	            	res.write('<li><a href='+files[i]+'>'+files[i]+'</a></li>');
        	            }
        	            res.write('</ul>');
        	            res.end();
        		    });
        		}
        	}
        });

    });

    app.listen(program.port);

    console.info('document root : ', _static);
    console.info('debug mode :', program.debug );
    console.info('Serving started at http://'+ program.vhost +':'+ program.port);
}

/**
 * 초기화
 */
loadConfiguration();
createServer();
