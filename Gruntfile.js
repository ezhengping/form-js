module.exports = function(grunt) {
    "use strict";

    var banner = '/** \n' +
        '* FormJS - v<%= pkg.version %>.\n' +
        '* <%= pkg.repository.url %>\n' +
        '* Copyright <%= grunt.template.today("yyyy") %>. Licensed MIT.\n' +
        '*/\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: [
            'dist',
            'src/libs/element-kit',
            'src/libs/require',
            'src/libs/underscore',
            'tests/libs/qunit/qunit.css',
            'tests/libs/qunit/qunit.js',
            'tests/libs/sinon'
        ],
        copy: {
            all: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/sinonjs',
                        dest: 'tests/libs/sinon',
                        src: ['sinon.js']
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/qunit/qunit',
                        dest: 'tests/libs/qunit',
                        src: ['qunit.js', 'qunit.css']
                    },
                    {
                        expand: true,
                        cwd: 'src',
                        dest: 'dist',
                        src: [
                            '**/*'
                        ]
                    }
                ]
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src',
                    dir: "dist",
                    removeCombined: true,
                    optimize: 'none'
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    'dist/button-toggle.min.js': ['dist/button-toggle.js'],
                    'dist/checkbox.min.js': ['dist/checkbox.js'],
                    'dist/form.min.js': ['dist/form.js'],
                    'dist/form-element.min.js': ['dist/form-element.js'],
                    'dist/input-field.min.js': ['dist/input-field.js']
                }
            }
        },
        connect: {
            test: {
                options: {
                    hostname: 'localhost',
                    port: 7000
                }
            },
            local: {
                options: {
                    keepalive: true,
                    options: { livereload: true }
                }
            }
        },
        qunit: {
            local: {
                options: {
                    urls: [
                        'http://localhost:7000/tests/index.html'
                    ]
                }
            }
        },
        jsdoc : {
            dist : {
                src: ['src/**/*.js'],
                options: {
                    destination: '_site-docs',
                    private: false
                }
            }
        },
        githubPages: {
            target: {
                options: {
                    commitMessage: 'push'
                },
                src: '_site-docs'
            }
        },
        release: {
            options: {
                additionalFiles: ['bower.json'],
                tagName: 'v<%= version %>',
                commitMessage: 'release <%= version %>',
                npm: false
            }
        },
        usebanner: {
            all: {
                options: {
                    banner: banner,
                    linebreak: false
                },
                files: {
                    src: [
                        'dist/**/*'
                    ]
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                commit: false,
                createTag: false,
                push: false,
                updateConfigs: ['pkg']
            }
        }
    });

    // Load grunt tasks from node modules
    require( "load-grunt-tasks" )( grunt , {
        loadGruntTasks: {
            pattern: 'grunt-*'
        }
    });

    grunt.task.registerTask('release', 'A custom release.', function(type) {
        type = type || 'patch';
        grunt.task.run([
            'bump:' + type,
            'build'
        ]);
    });

    // Default grunt
    grunt.registerTask( "build", [
        "clean",
        "copy:all",
        "requirejs",
        "uglify",
        "usebanner:all",
        "test"
    ]);

    grunt.registerTask( "server", [
        "connect:local"
    ]);

    grunt.registerTask( "test", [
        "connect:test",
        "qunit"
    ]);

    grunt.registerTask("publish_docs", [
        "jsdoc",
        "githubPages:target"
    ]);
};