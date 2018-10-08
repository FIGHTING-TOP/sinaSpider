var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
const querystring = require('querystring');
// var url = "http://www.cnblogs.com/mingweiyard/";

// fetchPage(url);


// function fetchPage(x) {
//     //采用http模块向服务器发起一次get请求
//     http.get(x, function (res) {
//         console.log('get'+url+'ok');
//         var html = '';//用来存储请求网页的整个html内容
//         var urls = [];
//         res.setEncoding('utf-8'); //防止中文乱码
//         //监听data事件，每次取一块数据
//         res.on('data', function (chunk) {
//             html += chunk;
//         });

//         //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
//         res.on('end', function () {

//             function loo(){
//                 var $ = cheerio.load(html); //采用cheerio模块解析html
//                 for(var i = 0;i < $('.postTitle').length; i++){
//                     var href = $('.postTitle a').eq(i).attr('href');
//                     urls.push(href);
//                     // var len = href.split('/');
//                     if(i === $('.postTitle').length && $('.nav_next_page')){
//                         console.log('next_page');
//                         http.get($('.nav_next_page a'), function(r){
//                             var str = '';
//                             r.setEncoding('utf-8');
//                             r.on('data', function(chunk){
//                                 str += chunk;
//                             });
//                             r.on('end', function(){
//                                 loo();
//                             })
//                         })
//                     }
//                     // if(i>68)break;
//                 }
//             }
//             loo();

//             var s = 0;
//             urls.map(function(item, index){
              
//                 http.get(item, function (res) {
//                     var html = '';
//                     res.setEncoding('utf-8');
//                     res.on('data', function (chunk) {
//                         html += chunk;
//                     });
//                     res.on('end', function () {
//                         s++;
//                         //采用cheerio模块解析html
//                         var $ = cheerio.load(html);

//                         var str = $('#mainContent').html();
//                         var title = $('.postTitle2').text();



// const postData = querystring.stringify({
//     'do':'saveArticle'
//     'type':1
//     'title':title
//     'text':str
//     'weibo':0
//     'blogId':0
//     'id':1220000013584013
//     'articleId':''
//     'tags[]':''
//     'url':''
// });

// const options = {
//   hostname: 'segmentfault.com',
//   port: 80,
//   path: '/api/articles/add?_=060df4fbc2deba33594fffeff6a977d1',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Content-Length': Buffer.byteLength(postData)
//   }
// };

// const req = http.request(options, (res) => {
//   console.log(`状态码: ${res.statusCode}`);
//   console.log(`响应头: ${JSON.stringify(res.headers)}`);
//   res.setEncoding('utf8');
//   res.on('data', (chunk) => {
//     console.log(`响应主体: ${chunk}`);
//   });
//   res.on('end', (r) => {
//     console.log('响应中已无数据。'+r);
//   });
// });

// req.on('error', (e) => {
//   console.error(`请求遇到问题: ${e.message}`);
// });

// // 写入数据到请求主体
// req.write(postData);
// req.end();





//                     })
//                 }).on('error', function (err) {
//                     console.log(err);
//                 });
//             })

//         });

//     }).on('error', function (err) {
//         console.log(err);
//     });

// }

