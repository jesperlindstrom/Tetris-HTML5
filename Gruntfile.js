module.exports = function(grunt) {
	grunt.initConfig({
		clean: [ 'src/tetris/**/*.js', 'src/**/*.d.ts', 'src/**/*.js.map' ],

		typescript: {
			base: {
				src: ['src/**/*.ts'],
				dest: 'src/tetris/main.js',
				options: {
					module: 'amd',
					target: 'es5',
					basePath: '',
					sourceMap: true,
					declaration: false
				}
	  		}
	  	}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-typescript');

	grunt.registerTask('default', [ 'clean', 'typescript' ]);
};