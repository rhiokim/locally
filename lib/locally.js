var connect = require('connect'),
    program = require('commander'),
    fs = require('fs');

/**
 * process.argv pre process
 */
program
   .version('0.0.1')
   .option('-s, --static <directory>', 'directory for serving static files', 'static')
   .option('-d, --public <directory>', 'directory for serving public files', 'public');

program.on('--static', function() {
   console.log('setting static directory');
   process.exit();
});


// locally.opt support
try {
   var opts = fs.readFileSync(__dirname +'/locally.opt', 'utf8')
      .trim()
      .split(/\s+/);

   process.argv = process.argv
      .slice(0,2)
      .concat(opts.concat(process.argv.slice(2)));
} catch(err) {

}

program.parse(process.argv);


/**
 * connect binding
 */

