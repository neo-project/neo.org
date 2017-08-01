module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - built on <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      views: 'resources/views/',
      styles: 'resources/styles/',
      scripts: 'resources/scripts/',
      assets: 'resources/assets/',
      public: 'public/',
      pug_cwd: 'resources/views/',
      pug_dest: 'public/',
      doc: 'doc/'
    },

    browserify: {
      general: {
        src: [
          '<%= meta.scripts %>src/*.js'
        ],
        dest: '<%= meta.scripts %>/dist/general.js'
      }
    },

    concat: {
      css_general: {
          src: [
              '<%= meta.styles %>vendors/*.css',
              './node_modules/slick-carousel/slick/slick.css',
              '<%= meta.styles %>dist/*.css'
          ],
          dest: '<%= meta.public %>css/styles.css',
      },
      js_libs: {
          src: [
              'node_modules/jquery/dist/jquery.js',
              'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
              'node_modules/moment/moment.js',
              'node_modules/slick-carousel/slick/slick.js'
          ],
          dest: '<%= meta.scripts %>/dist/libs.js',
      },
      js_basic: {
        src: [
          '<%= meta.scripts %>src/*.js'
        ],
        dest: '<%= meta.scripts %>/dist/general.js'
      },
      js_general: {
        src: [
          '<%= meta.scripts %>/dist/libs.js',
          '<%= meta.scripts %>/dist/ts.js',
          '<%= meta.scripts %>/dist/general.js',
          '<%= meta.scripts %>/vendors/owl.carousel.min.js',
          '<%= meta.scripts %>/vendors/jquery.easings.min.js',
          '<%= meta.scripts %>/vendors/scrolloverflow.min.js',
          '<%= meta.scripts %>/vendors/jquery.fullpage.js',
          '<%= meta.scripts %>/vendors/jquery.transit.js',
          '<%= meta.scripts %>/vendors/progressbar.js',
          '<%= meta.scripts %>/vendors/wow.js',
          '<%= meta.scripts %>/vendors/createjs.min.js',
          '<%= meta.scripts %>/vendors/anime-1.js',
          '<%= meta.scripts %>/vendors/call-anime-1.js',
          '<%= meta.scripts %>/vendors/anime-2.js',
          '<%= meta.scripts %>/vendors/call-anime-2.js',
          '<%= meta.scripts %>/vendors/anime-3.js',
          '<%= meta.scripts %>/vendors/call-anime-3.js',
          '<%= meta.scripts %>/vendors/anime-4.js',
          '<%= meta.scripts %>/vendors/call-anime-4.js',
          '<%= meta.scripts %>/vendors/anime-5.js',
          '<%= meta.scripts %>/vendors/call-anime-5.js',
          '<%= meta.scripts %>/vendors/anime-6.js',
          '<%= meta.scripts %>/vendors/call-anime-6.js',
          '<%= meta.scripts %>/vendors/anime-7.js',
          '<%= meta.scripts %>/vendors/call-anime-7.js',
          '<%= meta.scripts %>/vendors/anime-8.js',
          '<%= meta.scripts %>/vendors/call-anime-8.js',
          '<%= meta.scripts %>/vendors/anime-9.js',
          '<%= meta.scripts %>/vendors/call-anime-9.js',
          '<%= meta.scripts %>/vendors/anime-10.js',
          '<%= meta.scripts %>/vendors/call-anime-10.js',
          '<%= meta.scripts %>/vendors/smarteconomy.js',
          '<%= meta.scripts %>/vendors/call-smarteconomy.js',
          '<%= meta.scripts %>/vendors/flying.js',
          '<%= meta.scripts %>/vendors/call-flying.js',
          '<%= meta.scripts %>/vendors/hammer.js',

        ],
        dest: '<%= meta.public %>js/scripts.js',
      }
    },

    uglify: {
      general: {
        src: '<%= meta.public %>js/scripts.js',
        dest: '<%= meta.public %>js/scripts.min.js'
      }
    },

    postcss: {
      options: {
        processors: [
          require('postcss-short')(),
          require('postcss-fontpath')(),
          require('postcss-focus')(),
          require('autoprefixer')({
            browsers: ['last 2 versions', 'ie 6-8', 'Firefox > 20']
          })
        ]
      },
      dist: {
        src: '<%= meta.public %>css/*.css',
      }
    },

    sass: {
      basic: {
        options: {
          compass: true,
          sourcemap: 'none',
          style: 'expended'
        },
        files: [{
          expand: true,
          cwd: '<%= meta.styles %>src',
          src: ['*.sass', '*.scss'],
          dest: '<%= meta.styles %>dist',
          ext: '.css'
        }]
      }
    },

    cssnano: {
      options: {
        sourcemap: false
      },
      dist: {
        files: {
          '<%= meta.public %>css/styles.min.css': '<%= meta.public %>css/styles.css'
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['<%= meta.scripts %>*.js']
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      files: ['<%= meta.public %>css/main.css']
    },

    pug: {
      main: {
        options: {
          pretty: true,
          data: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: '<%= meta.pug_cwd %>',
          src: ['**/*.pug', '!blocks/**', '!layouts/**', '!mixins/**', '!materials/**'],
          dest: '<%= meta.pug_dest %>',
          ext: '.html'
        }]
      }
    },

    puglint: {
      files: ['<%= meta.views %>**/*.pug']
    },

    copy: {
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>fonts/',
          src: '**',
          dest: '<%= meta.public %>fonts/'
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>images/',
          src: '**',
          dest: '<%= meta.public %>images/'
        }]
      },
      media: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>media/',
          src: '**',
          dest: '<%= meta.public %>media/'
        }]
      }
    },

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: '<%= meta.public %>images/',
          src: '**/*.{png,jpg,gif}',
          dest: '<%= meta.public %>images/'
        }]
      }
    },

    watch: {
      options: {
        spawn: false,
        interrupt: false,
        livereload: true
      },
      style: {
        files: [
          '<%= meta.styles %>/**/*.sass',
          '<%= meta.styles %>/**/*.scss'
        ],
        tasks: ['sass','concat:css_general','postcss']
      },
      typescripts: {
        files: [
          '<%= meta.scripts %>/**/*.ts'
        ],
        tasks: ['browserify:typescripts','concat:js_general']
      },
      script: {
        files: [
          '<%= meta.scripts %>/**/*.js'
        ],
        tasks: ['browserify:general','concat:js_general']
      },
      html: {
        files: [
          '<%= meta.views %>/**/*.pug'
        ],
        tasks: ['puglint','pug']
      },
      fonts: {
        files: [
          '<%= meta.assets %>fonts/**'
        ],
        tasks: ['copy:fonts']
      },
      images: {
        files: [
          '<%= meta.assets %>images/**'
        ],
        tasks: ['copy:images']
      },
      media: {
        files: [
          '<%= meta.assets %>media/**'
        ],
        tasks: ['copy:media']
      }
    },

    clean: {
      options: {
        force: true
      },
      dev: ['<%= meta.public %>'],
      css: ['<%= meta.public %>css'],
      js: ['<%= meta.public %>js'],
      prod: ['<%= meta.public %>*.html']
    }

  });

  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-cssnano');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-puglint');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('build', [
    'clean:dev',
    'sass',
    'concat:css_general',
    'postcss',
    'pug',
    'puglint',
    'browserify:general',
    'concat:js_libs',
    'concat:js_general',
    'copy'
  ]);
  grunt.registerTask('build_adv', [
    'clean:dev',
    'sass',
    'concat:css_general',
    'postcss',
    'pug',
    'puglint',
    'browserify',
    'concat:js_libs',
    'concat:js_general',
    'copy'
  ]);
  grunt.registerTask('build_front', [
    'clean:css',
    'clean:js',
    'sass',
    'concat:css_general',
    'postcss',
    'concat:js_libs',
    'concat:js_basic',
    'concat:js_general'
  ]);
  grunt.registerTask('build_style', [
    'clean:css',
    'sass',
    'concat:css_general',
    'postcss'
  ]);
  grunt.registerTask('build_script', [
    'clean:js',
    'concat:js_libs',
    'concat:js_basic',
    'concat:js_general'
  ]);
  grunt.registerTask('build_html', [
    'clean:prod',
    'pug',
    'puglint'
  ]);

  grunt.registerTask('release', [
    'build',
    'clean:prod',
    'cssnano',
    'uglify',
    'imagemin'
  ]);

  grunt.registerTask('default',    ['build', 'watch']);
  grunt.registerTask('run_adv',    ['build_adv', 'watch']);
  grunt.registerTask('run_front',  ['build_front', 'watch']);
  grunt.registerTask('run_style',  ['build_style', 'watch']);
  grunt.registerTask('run_script', ['build_script', 'watch']);
  grunt.registerTask('run_html',   ['build_html', 'watch']);
};
