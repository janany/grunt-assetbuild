/**
 * grunt-assetbuild
 *
 * Reads the mortar.json and gets all the scripts and styles needed for the project and generate index.html
 *
 */
module.exports = function( grunt ) {
    "use strict";

    var scriptString = '';
    var cssString = '';

    function task() {
        var options = this.options();

        var modulePath = options.moduleBaseUrl + '/';
        var module = grunt.file.readJSON(modulePath + options.baseJson);

        // Get a list of all scripts and css in the module
        var scripts = module['lib'].js.concat(module['scripts']) || [],
            styles = module['lib'].css.concat(module['styles']) || [];

        // Process all scripts for this module
        scripts.forEach(function(script) {
            processScript(script);
        });

        // Process all styles for this module
        styles.forEach(function(style) {
            processCSS( style, options);
        });

        // read the _index.html file
        var indexFile = grunt.file.read(modulePath + options.baseFile).toString();

        indexFile = grunt.template.process(indexFile, {
            data: {
                includeScripts: scriptString,
                includeCss: cssString
            }
        });

        //re-write the index.html file
        grunt.file.write(modulePath+'index.html', indexFile);
    }
    grunt.registerMultiTask( "assetbuild", "Include scripts to html from the base json", task );

    /**
     * Process a script file
     *
     * @param {String} scriptPath
     */
    function processScript(scriptPath) {
        grunt.verbose.writeln('Processing script: ' + scriptPath);
        scriptString += grunt.template.process('<script src="<%= filePath %>"></script>\n', {'data': {filePath: scriptPath}});
    }

    /**
     * Process a css file for a module
     *
     * @param {String} filePath Path to the css file
     */
    function processCSS(cssPath) {
        grunt.verbose.writeln('Processing css file: ' + cssPath);
        cssString += grunt.template.process('  <link href="<%= filePath %>" rel="stylesheet" />\n', {'data': {filePath: cssPath}});
    }
};

