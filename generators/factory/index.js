'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var interactionsHelper = require('../utils/interactionsHelper.js');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        this.argument('factoryName', {
            type: String,
            required: false
        });
    },
    
    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        if (!this.options.isSubCall) {
            this.log(yosay(
                'Welcome to the solid ' + chalk.red(
                    'generator-ionic:factory') + ' generator!'
            ));
        }

        var prompts = [];

//        if (!this.options.moduleType) {
//            prompts.push(interactionsHelper.promptModuleType());
//        }

        if (!this.factoryName) {
            var prompt = {
                type: 'input',
                name: 'factoryName',
                message: 'Factory name: '
            };
            prompts.push(prompt);
        }

        if (!this.options.moduleName) {
            var prompt = {
                type: 'input',
                name: 'moduleName',
                message: 'Module name: '
            };
            prompts.push(prompt);
        }

//        if (!this.options.author) {
//            var prompt = {
//                type: 'input',
//                name: 'author',
//                message: 'Author name: '
//            }
//        }

        if (prompts.length) {
            this.prompt(prompts, function (answers) {
//                this.options.moduleType = this.options.moduleType || answers.moduleType;

                this.factoryName = this.factoryName || answers.factoryName;
                //Normalize application input name.
                this.factoryName = _.kebabCase(this.factoryName);

                this.options.moduleName = this.options.moduleName || answers.moduleName;
                //Normalize module input name.
                this.options.moduleName = _.kebabCase(this.options.moduleName);

//                this.options.author = this.options.author || answers.author;

                done();
            }.bind(this));
        } else {
            done();
        }
    },
    writing: {

        preprocessModule: function () {
            this.moduleName = (this.options.moduleName ? this.options.moduleName + '.' : '') + this.factoryName;
            this.modulePath = 'www/app/';
            if (this.options.moduleName) {
                this.modulePath += this.options.moduleName + '/';
            }
        },

        createFactory: function () {
            this.log(chalk.yellow('### Creating factory ###'));
            var destinationPath = this.modulePath + _.toLower(this.factoryName) + '.fact.js';
            var appName = this.determineAppname();
            var factoryName = _.capitalize(this.options.moduleName) + _.capitalize(this.factoryName) + 'Fact';
            this.fs.copyTpl(
                this.templatePath('_factory.js'),
                this.destinationPath(destinationPath),
                {
                    appName: appName,
                    moduleName: _.toLower(this.moduleName),
                    factoryName: factoryName
                }
            )
        },
        
        modifyMain: function () {
            this.log(chalk.yellow('### Adding sections to main ###'));
            var self = this;
            var destinationPath = 'www/js/app.js';
            var appName = this.determineAppname();
            this.fs.copy(
                this.destinationPath(destinationPath),
                this.destinationPath(destinationPath),
                {
                    process: function (content) {
                        var hook = '\/\/ Yeoman hook. Define section. Do not remove this comment.';
                        var regEx = new RegExp(hook, 'g');
                        var substitutionString = ",\n\t'" + appName + "." + _.toLower(self.moduleName) + "'";
                        if (!self.requiresEditRoutes) {
                            substitutionString = substitutionString + "'./" + _.toLower(moduleName) + ".routes',\n";
                        }
                        return content.toString().replace(regEx, substitutionString + hook);
                    }
                }
            );
        },
        
        modifyIndexHtml: function() {
            this.log(chalk.yellow('### Modifying index.html ###'));
            var destinationPath = 'www/index.html';
            var scPath = _.toLower(this.factoryName) + '.fact.js';
            if (this.options.moduleName) {
                scPath = _.toLower(this.options.moduleName) + '/' + scPath;
            }
            this.fs.copy(
                this.destinationPath(destinationPath),
                this.destinationPath(destinationPath),
                {
                    process: function (content) {
                        var hook = '<!-- Yeoman hook. Scripts section. Do not remove this comment. -->';
                        var regEx = new RegExp(hook, 'g');
                        var substitutionString = '<script src="app/' + scPath.toLowerCase().replace(/\\/g, '/') + '"></script>\n\t';
                        return content.toString().replace(regEx, substitutionString + hook);
                    }
                }
            );
        }
    },
    
    install: function () {
        // this.installDependencies();
    }
});