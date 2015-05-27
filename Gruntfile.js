	// Gruntfile.js
	module.exports = function(grunt){
	  grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),

	    // Mocha
	    mocha: {
	      all: {
	        src: ['test/testrunner.html'],
	      },
	      options: {
	        run: true
	      }
	    },

	    // Mocha Test
	    mochaTest: {
			  test: {
			    options: {
			      reporter: 'list',
			      timeout: 2000
			    },
			    src: ['all.js',
			    			'test/groups.js',
			    			'test/doctors.js',
			    			'test/patients.js']
			  }
			}
	  });

	  // Load grunt mocha task
	  grunt.loadNpmTasks('grunt-mocha');
	  grunt.loadNpmTasks('grunt-mocha-test');

	  grunt.registerTask('default', ['mochaTest']);	  
	};