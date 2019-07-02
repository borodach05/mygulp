
   'use strict';

    var gulp = require('gulp'),
	    mainBowerFiles = require('main-bower-files'),
	    watch = require('gulp-watch'),
	    prefixer = require('gulp-autoprefixer'),
	    uglify = require('gulp-uglify'),
	    sourcemaps = require('gulp-sourcemaps'),
	    less = require('gulp-less'),
	    cleanCSS = require('gulp-clean-css'),
	    imagemin = require('gulp-imagemin'),
	    pngquant = require('imagemin-pngquant'),
	    rimraf = require('rimraf'),
	    browserSync = require("browser-sync"),
	    reload = browserSync.reload,
	    smartgrid = require('smart-grid'),
	    cache = require('gulp-cache'),
        rename = require('gulp-rename'),
        group = require('gulp-group-css-media-queries');

// smartgrid

/* It's principal settings in smart grid project */
var smartgridSettings = {
    outputStyle: 'less', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '30px',
    filename: '_smart-grid', /* gutter width px || % || rem */
    mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1200px', /* max-width оn very large screen */
        fields: '15px' /* side fields */
    },
    breakPoints: {
        xlg: {
		    width: '1600px',
		    fields: '15px'
    	},
    	lg: {
            width: '1200px',
            fields: '15px'
        },
        md: {
            width: '992px',
            fields: '15px'
        },
        sm: {
            width: '768px',
            fields: '15px' /* set fields only if you want to change container.fields */
        },
        xs: {
            width: '544px',
            fields: '15px'
        },
        xxs: {
            width: '420px',
            fields: '15px'
        /* 
        We can create any quantity of break points.
 
        some_name: {
            width: 'Npx',
            fields: 'N(px|%|rem)',
            offset: 'N(px|%|rem)'
        }
        */
    }
}};

var path = {
    vendor: {
        js: 'app/js/vendor/',
        css: 'app/css/vendor/'
    },
    dist: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        less: 'dist/css/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    app: { //Пути откуда брать исходники
        html: 'app/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'app/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
        less: 'app/css/main.less',
        css: 'app/css/*.css',
        img: 'app/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'app/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        less: 'app/css/**/*.less',
        css: 'app/css/**/*.css',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './dist'
};

var config = {
    server: {
        baseDir: "dist"
    },
    tunnel: false,
    host: 'localhost',
    port: 8585,
    logPrefix: "Ahmad ibn Halim"
};

gulp.task('webserver', function (done) {
    browserSync(config);
    done();
});

gulp.task('vendorJs:build', function (done) {
    gulp.src( mainBowerFiles('**/*.js') ) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.vendor.js)) //Выплюнем готовый файл в app
        .pipe(gulp.dest(path.dist.js));
        done(); //Выплюнем готовый файл в dist
});

gulp.task('vendorCss:build', function (done) {
    gulp.src( mainBowerFiles('**/*.css') ) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.vendor.css)) //И в app
        .pipe(gulp.dest(path.dist.css));
        done(); //И в dist
});

gulp.task('html:build', function (done) {
    return gulp.src(path.app.html) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.dist.html)) //Выплюнем их в папку build
        .pipe(browserSync.reload({ stream: true }));
        done(); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', function (done) {
    return gulp.src(path.app.js) //Найдем наш main файл
        // .pipe(sourcemaps.init()) //Инициализируем sourcemap
        // .pipe(uglify()) //Сожмем наш js
        // .pipe(sourcemaps.write('./')) //Пропишем карты
        .pipe(gulp.dest(path.dist.js)) //Выплюнем готовый файл в build
        .pipe(browserSync.reload({ stream: true }));
        done(); //И перезагрузим сервер
});
gulp.task('smartgrid', function (done) {
		smartgrid('app/css/', smartgridSettings);
		done();
});

gulp.task('less:build', function (done) {
    return gulp.src(path.app.less) //Выберем наш main.less
        // .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(less()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(group())  // Сгрупируем наши Media
        // .pipe(cleanCSS()) //Сожмем
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.less)) //И в build
        .pipe(cleanCSS({
        	level: 2
        }))
        .pipe(rename({
            basename: 'main',
            prefix: 'min-'
        }))
        .pipe(gulp.dest(path.dist.less))
        .pipe(browserSync.reload({ stream: true }));
        done();
});


gulp.task('image:build', function (done) {
    gulp.src(path.app.img) //Выберем наши картинки
        .pipe(cache(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        })))
        .pipe(gulp.dest(path.dist.img)) //И бросим в build
        .pipe(browserSync.reload({stream: true}));
        done();
});

gulp.task('fonts:build', function(done) {
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts));
        done();
});




gulp.task('build', gulp.parallel(
	'smartgrid',
    'vendorCss:build',
    'vendorJs:build',
    'html:build',
    'js:build',
    'less:build',
    'fonts:build',
    'image:build'
));


gulp.task('watch', function(){
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.less, gulp.series('less:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});



gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


gulp.task('default', gulp.series('build', 'webserver', 'watch'));

