'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var ejs = require('ejs');
//var utils = require('../utils');
var interactionsHelper = require('../utils/interactionsHelper.js');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        this.argument('viewName', {
            type: String,
            required: false
        });
    },
    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        if (!this.options.isSubCall) {
            this.log(yosay(
                'Welcome to the solid ' + chalk.red('generator-ionic:view') +
                ' generator!'
            ));
        }

        var prompts = [];

        if (!this.viewName) {
            var prompt = {
                type: 'input',
                name: 'viewName',
                message: 'View name: '
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

//        if (!this.options.moduleType) {
//            prompts.push(interactionsHelper.promptModuleType());
//        }

//        if (!this.options.author) {
//            var prompt = {
//                type: 'input',
//                name: 'author',
//                message: 'Author name: ',
//                store: true
//            };
//            prompts.push(prompt);
//        }

        if (prompts.length) {
            this.prompt(prompts, function (answers) {
                this.viewName = this.viewName || answers.viewName;
                //Normalize view input name.
                this.viewName = _.kebabCase(this.viewName);
                this.options.moduleName = this.options.moduleName || answers.moduleName;
//                this.options.moduleType = this.options.moduleType || answers.moduleType;
                //Normalize module input name.
                this.options.moduleName = _.kebabCase(this.options.moduleName);
//                this.options.moduleType = _.kebabCase(this.options.moduleType);
//                this.options.author = this.options.author || answers.author;

                done();
            }.bind(this));
        } else {
            done();
        }
    },
    writing: {

        preprocessModule: function () {
            this.moduleName = (this.options.moduleName ? this.options.moduleName + '.' : '') + this.viewName;
            this.modulePath = 'www/app/';
            if (this.options.moduleName) {
                this.modulePath += this.options.moduleName + '/';
            }
        },

        createView: function () {
            this.log(chalk.yellow('### Creating view ###'));
            var destinationPath = this.modulePath + _.toLower(this.viewName) + '.html';
            this.fs.copyTpl(
                this.templatePath('_view.html'),
                this.destinationPath(destinationPath),
                {
                    viewName: _.capitalize(this.options.moduleName) + _.capitalize(this.viewName)
                }
            );
        },
        
        createController: function () {
            this.log(chalk.yellow('### Creating controller ###'));
            var destinationPath = this.modulePath + _.toLower(this.viewName) + '.ctrl.js';
            var appName = this.determineAppname();
            var controllerName = _.capitalize(this.options.moduleName) + _.capitalize(this.viewName) + 'Ctrl';
            this.fs.copyTpl(
                this.templatePath('_controller.js'),
                this.destinationPath(destinationPath),
                {
                    appName: _.toLower(appName),
                    moduleName: _.toLower(this.moduleName),
                    controllerName: controllerName
                }
            );
        },
        
        createRoutes: function () {
//            if (!this.fs.exists(this.modulePath + '/' + _.toLower(
//                        this.options.moduleName) + '.routes.js')) {
//                this.log(chalk.yellow('### Creating routes ###'));
//                var destinationPath = this.modulePath + '/' + _.toLower(this.options.moduleName) + '.routes.js';
//                var controllerName = _.capitalize(this.viewName) + 'Ctrl';
//                this.fs.copyTpl(
//                    this.templatePath('_routes.js'),
//                    this.destinationPath(destinationPath), {
//                        author: this.options.author,
//                        moduleName: _.toLower(this.options.moduleName),
//                        controllerName: controllerName,
//                        viewName: _.toLower(this.viewName),
//                        date: (new Date()).toDateString()
//                    }
//                );
//            } else {
                this.requiresEditRoutes = true;
//            }
        },
        
        modifyRoutes: function () {
            if (this.requiresEditRoutes) {
                this.log(chalk.yellow('### Modifying routes ###'));
                var destinationPath = 'www/app/app.js';
                var stateTemplate = this.fs.read(this.templatePath('_state.js'));
                var controllerName = _.capitalize(this.options.moduleName) + _.capitalize(this.viewName) + 'Ctrl';
                var templateUrl = _.toLower(this.viewName) + '.html';
                if (this.options.moduleName) {
                    templateUrl = _.toLower(this.options.moduleName) + '/' + templateUrl;
                }
                var processedState = ejs.render(stateTemplate, {
                    moduleName: this.options.moduleName + this.viewName,
                    controllerName: controllerName,
                    template: './app/' + templateUrl
                });
                this.fs.copy(
                    this.destinationPath(destinationPath),
                    this.destinationPath(destinationPath), {
                        process: function (content) {
                            var hook = '\/\/ Yeoman hook. States section. Do not remove this comment.';
                            var regEx = new RegExp(hook, 'g');
                            var newContent = content.toString().replace(regEx, '\n\n' + processedState + hook);
                            return newContent;
                        }
                    }
                );
            }
        },
        
        createStyles: function () {
//            this.log(chalk.yellow('### Creating styles ###'));
//            var self = this;
//            var destinationPath = this.modulePath + '/' + _.toLower(this.viewName) + '.scss';
//            this.fs.copyTpl(
//                this.templatePath('_styles.scss'),
//                this.destinationPath(destinationPath), {
//                    viewName: _.toLower(this.viewName),
//                }
//            );
//
//            var appName = _.last(_.split(this.destinationRoot(), '/'));
//            var viewName = _.toLower(this.viewName);
//            this.fs.copy(
//                'scss/' + appName + '.scss',
//                this.destinationPath('scss/' + appName + '.scss'), {
//                    process: function (content) {
//                        var hook = '\/\/ Yeoman hook. Do not remove this comment.';
//                        var regEx = new RegExp(hook, 'g');
//                        var newContent = content.toString().replace(regEx,
//                            '@import "' + '../' + self.modulePath + '/' + viewName + '";\n' + hook);
//                        return newContent;
//                    }
//                }
//            )
        },
        
        modifyMain: function () {
            this.log(chalk.yellow('### Adding sections to main ###'));
            var self = this;
            var destinationPath = 'www/app/app.js';
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
            var scPath = _.toLower(this.viewName) + '.ctrl.js';
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