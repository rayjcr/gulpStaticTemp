//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),  
    uglify = require('gulp-uglify'),  
    changed = require('gulp-changed'),
    debug = require('gulp-debug'),
    tiny = require('gulp-tinypng-nokey'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    jade = require('gulp-jade');
var pump = require('pump');
var base64 = require('gulp-base64');

var cssBaseUrl='./src/css/';     //样式根目录
var jsBaseUrl='./src/js/';       //JS根目录
var imgBaseUrl='./src/images/';  //图片根目录
var JadeBaseUrl='./src/views/';  //页面根目录
var DestCss='./dest/css';        //输出样式根目录
var DestJS='./dest/js';          //输出JS根目录
var DestImages='./dest/images';  //输出图片根目录
var DestJade='./dest/views';     //输出页面根目录


//把小于规定尺寸的图片base64化
gulp.task('base64',function(){
	gulp.src(cssBaseUrl + '*.css')
        .pipe(changed(DestCss,{extension:'.css'}))  //是否发生了改变，只运行改变了的css
		.pipe(base64({
            baseDir:imgBaseUrl,  //图片的基本目录
            extensions: ['png'], //这里指定了png的图片的base64化
            maxImageSize: 20*1024, //设置最大图片大小 btye
            debug: true  //是否在控制台输出log
        }))
        .pipe(debug({title: '编译:'}))  //执行后的提示
        .pipe(gulp.dest(DestCss));    //输出到指定目录
});

//把css给min化
gulp.task('tCleanCss', function () {
    gulp.src(cssBaseUrl + '*.css') //该任务针对的文件
        //该任务调用的模块
        //.pipe(changed(cssBaseUrl,{extension:'.css'}))
        .pipe(debug({title: '编译:'}))
        .pipe(cleancss())
        .pipe(gulp.dest(DestCss)); //将会在输出路径下生成css
});

//tinyImg 把图片Tiny压缩 保存到 images/min 然后在覆盖回去
gulp.task('tinyImg', function (cb) {
    gulp.src(imgBaseUrl + '*') //该任务针对的文件
       .pipe(changed(DestImages))
       .pipe(tiny())
       .pipe(debug({title: '编译:'}))
       .pipe(gulp.dest(DestImages)); //将会在src/css下生成index.css
});

//css 兼容前缀自动添加
gulp.task('cssHack', function () {
    gulp.src(cssBaseUrl + '*.css') //该任务针对的文件
       .pipe(changed(DestCss,{extension:'.css'}))
       .pipe(autoprefixer())
       .pipe(debug({title: '编译:'}))
       .pipe(gulp.dest(DestCss));
});

//js 压缩处理
gulp.task('uglifyJS', function (cb) {
	pump([
        gulp.src(jsBaseUrl + '*-compiled.js'),  //目前只能转es5的js代码，‘uglify-js-harmony’ for ES6 support
        uglify(),
        gulp.dest(DestJS)
    ],
    cb
  );
});

//下面是ES6的JS压缩写法...

// var uglifyjs = require('uglify-js'); // can be a git checkout
//                                      // or another module (such as `uglify-js-harmony` for ES6 support)
// var minifier = require('gulp-uglify/minifier');
// var pump = require('pump');
//
// gulp.task('compress', function (cb) {
//     // the same options as described above
//     var options = {
//         preserveComments: 'license'
//     };
//
//     pump([
//             gulp.src('lib/*.js'),
//             minifier(options, uglifyjs),
//             gulp.dest('dist')
//         ],
//         cb
//     );
// });

//jade模版输出
gulp.task('jade',function(){
    gulp.src(JadeBaseUrl + '*.jade')
        .pipe(changed(DestJade,{extension : '.html'}))
        .pipe(jade({
            pretty: true
        }))
        .pipe(debug({title: '编译:'}))  //执行后的提示
        .pipe(gulp.dest(DestJade))
});


// 默认任务
gulp.task('default', function(){
    //gulp.run('tCleanCss');
    //gulp.run('tinyImg');
    //gulp.run('uglifyJS');
    //gulp.run('base64');
    //gulp.run('cssHack');
    gulp.run('jade');
    // 监听文件变化
    //gulp.watch('styles/*.css', ['testCleanCss']);
    //gulp.watch('images/*/*', ['tinyImg']);
});

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组) 
//gulp.dest(path[, options]) 处理完后文件生成路径pt Document













