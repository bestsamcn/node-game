module.exports = function(grunt) {
    var globalConfig = require('./config');
    //任务配置 
    grunt.initConfig({
        watch: {
            template: {
                files: ['views/**', 'public/**'],
                options: {
                    livereload: 35731,
                    delay: 1000
                }
            }
        },
        open: {
            all: {
                path: 'http://'+globalConfig.host+':'+globalConfig.port+'/sign/signin'
            },
            file: {
                path: '/etc/hosts'
            }
        },
        nodemon: {
            dev: {
                script: 'bin/www',
                options: {
                    env: {
                        port: globalConfig.port
                    }
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch', 'open'],
            options: {
                logConcurrentOutput: true
            }
        }
    });
    //载入任务 
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-open');
    //注册任务 
    grunt.registerTask('default', ['concurrent']);
}