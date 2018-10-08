var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');

var keyword = '区块链';//搜索关键字

let url = {
    sina: "http://news.sina.com.cn/",
    sohu: "http://www.sohu.com/",
    ifeng: "http://www.ifeng.com/",
    // 163: "http://news.163.com/",
    // qq: "http://news.qq.com/",
    // people: "http://www.people.com.cn/",
    // xinhua: "http://www.xinhuanet.com/",
    // huanqiu: "http://www.huanqiu.com/",
    // gmw: "http://www.gmw.cn/",
}

for(var a in url){
    fetchIndex(a, url[a]);
}

function fetchIndex(x,y) {
    //采用http模块向服务器发起一次get请求
    http.get(y, function (res) {
        console.log('index ok');
        var html = '';//用来存储请求网页的整个html内容
        var urls = [];
        var titles = [];
        res.setEncoding('utf-8'); //防止中文乱码
        //监听data事件，每次取一块数据
        res.on('data', function (chunk) {
            html += chunk;
        });
        //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on('end', function () {
            savePageCode(x, html);

            var $ = cheerio.load(html); //采用cheerio模块解析html

            for(var i = 0; i < $('a[target="_blank"]').length; i++){
                var href = $('a[target="_blank"]').eq(i).attr('href');
                if(!href)break;
                // var len = href.split('/');
                if(x === 'sina' && href.indexOf('doc') > 0){//sina
                    console.log('condition match-' + i + x);
                    urls.push(href);
                }else if((x === 'sohu'||x === 'ifeng') && href.indexOf('/a/') > 0){//sohu\ifeng
                    console.log('condition match-' + i + x);
                    urls.push(href);
                }
                // if(i>68)break;
            }

            var s = 0;
            urls.map(function(item, index){
              
                http.get(item, function (res) {
                    var html = '';
                    res.setEncoding('utf-8');
                    res.on('data', function (chunk) {
                        html += chunk;
                    });
                    res.on('end', function () {
                        s++;
                        //采用cheerio模块解析html
                        var $ = cheerio.load(html);

                        if(x === 'sina'){
                            var aTitle = $('.main-title').text().trim();
                            var time = $('.date-source .date').text().trim();
                            var author = $('div.article p:first-child').text().trim();
                        }else if(x === 'sohu'){
                            var aTitle = $('.text-title h1').text().trim();
                            var time = $('#news-time').text().trim();
                            var author = $('.editor-name span').text().trim();
                        }else if(x === 'ifeng'){
                            var aTitle = $('.yc_tit h1').text().trim();
                            var time = $('.yc_tit p span').text().trim();
                            var author = $('.yc_zb').text().trim();
                        }
                        

                        var news_item = {
                          title: aTitle,
                          Time: time,
                          link: item,
                          author: author,
                          i: index,
                        };

                        //打印新闻信息
                        console.log(news_item);


                        if(!aTitle)return;
                        
                        if(aTitle.length > 0){
                            titles.push(aTitle);
                            //存储每篇文章的内容及文章标题
                            saveContent($,news_item);
                        }

                        if(s === urls.length){
                            //将所有新闻标题添加到一个文本文件里面
                            var x = titles.join('\r\n');
                            console.log(x);
                            fs.appendFile('./data/' + 'titles.txt', x, 'utf-8', function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }

                    })
                }).on('error', function (err) {
                    console.log(err);
                });
            })

        });

    }).on('error', function (err) {
        console.log(err);
    });

}

//该函数的作用：在本地存储所爬取的新闻内容资源
function saveContent($, news_item) {
    var x = '';

    if(x === 'sina'){
        var ps = $('#artibody p');
    }else if(x === 'sohu'){
        var ps = $('article p');
    }else if(x === 'ifeng'){
        var ps = $('#yc_con_txt p');
    }
    
    ps.each(function (index, item) {
        var pText = $(this).text();
        var y = pText.substring(0, 2).trim();
        if (y == '') {
            pText += '\r\n';
            x += pText;
        }
    })
    if(x.indexOf(keyword) > 0){
        x = x + '\r\n' + news_item.link;
        //将新闻文本内容一段一段添加到/data文件夹下，并用新闻的标题来命名文件
        fs.appendFile('./data/' + (news_item.title.replace(/[\ |\。|\，|\\|\/]/g,"")) + '.txt', x, 'utf-8', function (err) {
            if (err) {
                console.log(err);
            }
        });

        //存储每篇文章的图片及图片标题
        saveImg($,news_item);
    }
}

//该函数的作用：在本地存储所爬取到的图片资源
function saveImg($,news_item) {

    if(x === 'sina'){
        var imgs = $('.article img');
    }else if(x === 'sohu'){
        var imgs = $('article img');
    }else if(x === 'ifeng'){
        var imgs = $('#yc_con_txt img');
    }

    imgs.each(function (index, item) {
        // var img_title = $(this).parent().next().text().trim();  //获取图片的标题
        var img_title = $(this).next().text().trim();  //获取图片的标题
        
        if(img_title.length>35||img_title=="")img_title="Null"
        var img_filename = img_title.replace(/[\ |\。|\，|\\|\/]/g,"") + '.jpg';
        var img_src = ($(this).attr('src')).replace(/^[\/]+/);

        //采用request模块，向服务器发起一次请求，获取图片资源
        request.head(img_src,function(err,res,body){
            if(err){
                console.log(err);
            }
        });
        //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
        request(img_src).pipe(fs.createWriteStream('./image/'+ img_filename));
    })
}

//保存页面源代码
function savePageCode(name, html){
    fs.appendFile('./page/'+name+'.html', html, 'utf-8', function(err){console.log(err)});
}