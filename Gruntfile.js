/*global module:false*/
module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        paths: {
            src: {
                example: "example",
                dynamicform: "source"
            },
            dist: {
                dynamicform: "www/forms"
            }
        },
        buildTime: grunt.template.today('dddd, mmmm dS, yyyy, h:MM:ss TT'),
        banner: {
            text: "DynamicForm v <%= pkg.version %>",
            js: "/**\n" + "  ----------------------------------------------------------\n" + "   DynamicForm <%= banner.text %>\n" + "  ----------------------------------------------------------\n" + "   Built <%= buildTime %>\n" + "  ----------------------------------------------------------\n" + "   https://mojo.redhat.com/docs/DOC-188933\n" + "  ----------------------------------------------------------\n" + "**/\n",
            html: "<!--\n" + "  ----------------------------------------------------------\n" + "   DynamicForm <%= banner.text %>\n" + "  ----------------------------------------------------------\n" + "   Built <%= buildTime %>\n" + "  ----------------------------------------------------------\n" + "   https://mojo.redhat.com/docs/DOC-188933\n" + "  ----------------------------------------------------------\n" + "  -->\n"
        },
        preprocess: {
            options: {
                context: {
                    TARGET: "sandbox",
                    VERSION: "<%= pkg.version %>",
                    BANNER_JS: "<%= banner.js %>",
                    BANNER_HTML: "<%= banner.html %>",
                    EXAMPLE_CSS: '<link id="style" rel="stylesheet" type="text/css" href="css/rh-main.css" /><link id="style" rel="stylesheet" type="text/css" href="css/webfonts.css" /><link id="style" rel="stylesheet" type="text/css" href="css/custom.css" /><link id="style" rel="stylesheet" type="text/css" href="css/jquery.gatedform.css" />',
                    APP_CSS: '<link type="text/css" rel="stylesheet" href="/forms/css/redhat/bootstrap.css" media="all" /><link type="text/css" rel="stylesheet" href="/forms/css/redhat/editorial.css" media="all" /><link type="text/css" rel="stylesheet" href="/forms/css/redhat/overpass.css" media="all" /><link type="text/css" rel="stylesheet" href="/forms/css/redhat/print.css" media="all" /><link type="text/css" rel="stylesheet" href="/forms/css/redhat/style.css" media="all" /><link type="text/css" rel="stylesheet" href="/forms/css/redhat/forms.css" media="all" />',
                    APP_JS: '<script src="scripts/lib/jquery/1.10/jquery.min.js"></script><script src="//www.redhat.com/j/s_code.js"></script><script src="scripts/jquery.gatedform.js"></script>'
                }
            },
            dynamicform_html: {
                files: [{
                    options: {
                        banner: "<%= banner.html %>"
                    },
                    expand: true,
                    cwd: "<%= paths.dist.dynamicform %>",
                    src: ["**.html"],
                    dest: "<%= paths.dist.dynamicform %>"
                }]
            },
            dynamicform_js: {
                files: [{
                    options: {
                        banner: "<%= banner.js %>"
                    },
                    expand: true,
                    cwd: "<%= paths.src.dynamicform %>/scripts",
                    src: ["**.js"],
                    dest: "<%= paths.dist.dynamicform %>/scripts"
                }]
            },
            plugins: {
                options: {
                    banner: "<%= banner.js %>"
                },
                files: [{
                    expand: true,
                    cwd: "<%= paths.src.dynamicform %>",
                    src: ["lib/**.js", "vendor/**.js"],
                    dest: "<%= paths.dist.dynamicform %>"
                }]
            },
            example: {
                options: {
                    banner: "<%= banner.html %>"
                },
                files: [{
                    expand: true,
                    cwd: "<%= paths.dist.dynamicform %>",
                    src: ["example/**.html"],
                    dest: "<%= paths.dist.dynamicform %>"
                }]
            }
        },
        concat: {
            "<%= paths.dist.dynamicform %>/scripts/jquery.gatedform.plugins.js": [
                //"<%= paths.dist.dynamicform %>/scripts/lib/debug/debug.js",
                //"<%= paths.dist.dynamicform %>/scripts/lib/fast/fast.js",
                "<%= paths.dist.dynamicform %>/scripts/lib/handlebars/1.3.0/handlebars.js", "<%= paths.dist.dynamicform %>/scripts/lib/purl/purl.js", "<%= paths.dist.dynamicform %>/scripts/lib/jquery/jquery.cookie.js", "<%= paths.dist.dynamicform %>/scripts/lib/jquery/jquery.postmessage.js", "<%= paths.dist.dynamicform %>/scripts/lib/jquery/jquery.validate.js", "<%= paths.dist.dynamicform %>/scripts/lib/bootstrap.datepicker.js", "<%= paths.dist.dynamicform %>/scripts/lib/jquery/jquery.autosize.js", "<%= paths.dist.dynamicform %>/scripts/lib/jquery/jquery.colorbox.js"
            ]
        },
        copy: {
            dynamicform: {
                files: [
                    // includes files within path and its sub-directories
                    {
                        expand: true,
                        cwd: "<%= paths.src.dynamicform %>",
                        src: ["**"],
                        dest: "<%= paths.dist.dynamicform %>"
                    }
                ]
            },
            plugins: {
                files: [{
                    expand: true,
                    cwd: "<%= paths.src.dynamicform %>/scripts/lib",
                    src: ["**"],
                    dest: "<%= paths.dist.dynamicform %>/scripts/lib"
                }, {
                    expand: true,
                    cwd: "<%= paths.src.dynamicform %>/scripts/vendor",
                    src: ["**"],
                    dest: "<%= paths.dist.dynamicform %>/scripts/vendor"
                }]
            },
            example: {
                files: [
                    // includes files within path and its sub-directories
                    {
                        expand: true,
                        cwd: "<%= paths.src.example %>",
                        src: ["**"],
                        dest: "<%= paths.dist.dynamicform %>/example"
                    }
                ]
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: "<%= banner.js %>",
                },
                files: {
                    '<%= paths.dist.dynamicform %>/css/jquery.gatedform.css': ['<%= paths.dist.dynamicform %>/css/jquery.gatedform.css']
                }
            }
        },
        uglify: {
            options: {
                banner: "<%= banner.js %>",
                //sourceMap: "<%= paths.dist.dynamicform %>/scripts/sourcemap.map",
                mangle: {
                    except: ["s", "dynamicForm", "GatedFormConfig", "DynamicFormConfig", "jQuery", "$", "elq", "elqTrack", "DemandbaseForm", "Demandbase"]
                },
                sourceMap: true
            },
            dynamicform: {
                files: [{
                    expand: true,
                    cwd: "<%= paths.dist.dynamicform %>/scripts",
                    src: ['jquery.gatedform.js', 'jquery.gatedform.plugins.js'],
                    filter: 'isFile',
                    dest: "<%= paths.dist.dynamicform %>/scripts",
                    extDot: "last",
                    ext: ".min.js"
                }]
            },
            plugins: {
                files: [{
                    expand: true,
                    cwd: "<%= paths.src.dynamicform %>/scripts/lib",
                    src: ['**/*.js', '!**/*.min.js'],
                    filter: 'isFile',
                    dest: "<%= paths.dist.dynamicform %>/scripts/lib",
                    extDot: "last",
                    ext: ".min.js"
                }, {
                    expand: true,
                    cwd: "<%= paths.src.dynamicform %>/scripts/vendor",
                    src: ['**/*.js', '!**/*.min.js'],
                    filter: 'isFile',
                    dest: "<%= paths.dist.dynamicform %>/scripts/vendor",
                    extDot: "last",
                    ext: ".min.js"
                }]
            }
        },
        jshint: {
            options: {
                "asi": true,
                "boss": true,
                "browser": true,
                "camelcase": false,
                "debug": true,
                "devel": false,
                "eqeqeq": false,
                "eqnull": true,
                "expr": true,
                "jquery": true,
                "laxbreak": true,
                "newcap": false,
                "sub": true,
                "undef": false,
                "unused": false,
                "validthis": true
            },
            dynamicform: ["<%= paths.dist.dynamicform %>/scripts/jquery.gatedform.js"]
        },
        clean: {
            dynamicform: ["<%= paths.dist.dynamicform %>"]
        },
        watch: {
            dynamicform: {
                files: {
                    expand: true,
                    cwd: "<%= paths.src.dynamicform %>",
                    src: ["**.js", "**.html"]
                },
                tasks: ["notify:watch", "dynamicform"]
            }
        },
        notify: {
            watch: {
                options: {
                    message: "Watching for changes in DynamicForm <%= pkg.version %>"
                }
            },
            start: {
                options: {
                    message: "Building v<%= pkg.version %>..."
                }
            },
            dynamicform: {
                options: {
                    message: "Building /forms for <%= pkg.version %>..."
                }
            },
            plugins: {
                options: {
                    message: "Building /forms/scripts/jquery.gatedforms.plugins[.min].js for <%= pkg.version %>..."
                }
            },
            example: {
                options: {
                    message: "Building /forms/example/ <%= pkg.version %>..."
                }
            },
            done: {
                options: {
                    message: "DynamicForm <%= pkg.version %> build complete"
                }
            }
        },
        compress: {
            dynamicform: {
                options: {
                    archive: "zip/dynamicform/forms-<%= pkg.version %>_<%= grunt.template.today('dd-mm-yyyy') %>_<%= grunt.template.today('HHMMss') %>.zip"
                },
                files: [{
                    expand: true,
                    cwd: "<%= paths.dist.dynamicform %>",
                    src: ["**"],
                    dest: ""
                }]
            }
        }
    });
    // Available tasks.
    grunt.registerTask("cssmin", ["cssmin"]);
    grunt.registerTask("default", ["example", "dynamicform"]);
    grunt.registerTask("dynamicform", ["notify:start",
        "clean",
        "copy", "concat", "preprocess",
        "jshint",
        "copy:plugins", "uglify", "compress:dynamicform",
        "notify:done", "watch:dynamicform"
    ]);
    grunt.registerTask("example", ["notify:example", "copy:example", "preprocess:example"]);
    grunt.registerTask("plugins", ["notify:plugins", "copy:plugins", "preprocess:plugins", "concat"]);
};
