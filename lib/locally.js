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

program
   .command('init')
   .description('locally setup webserver configuration')
   .action(function() {
      program.prompt('static directory :', function(dir) {
         console.log('static -> %s', dir);
      });

      program.prompt('public directory :', function(dir) {
         console.log('public -> %s', dir);
      });
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

