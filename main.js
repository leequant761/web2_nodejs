var http = require('http');
var fs = require('fs');
var url = require('url'); // url 모듈 불러오기
var qs = require('querystring')
var path = require('path'); // 보안
var sanitizeHtml = require('sanitize-html');

var template = require('./lib/template.js');

var app = http.createServer(function(request, response){ // 웹서버 생성; 웹브라우저가 접속할 때 마다 createServer의 콜백함수를 호출; request 는 웹브라우저가 요청 시 보낸 정보; response는 웹서버가 응답시 보낼 정보
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    fs.readdir('./data', function(error, file_list){
        var list = template.list(file_list);
        // 만약 path를 입력을 안했다면
        if(pathname === '/'){
            if(queryData.id === undefined){
                    var title = 'Welcome';
                    var description = 'Hello, Node.js'
                    var html = template.html(title, list, 
                                                `<h2>${title}</h2>${description}`,
                                                `<a href="/create">create</a>`);
                    response.writeHead(200); // 서버가 브라우저에게 200이란 숫자 파일을 성공적으로 전송했다
                    response.end(html);


            } else{
                var filteredID = path.parse(queryData.id).base; // ..을 입력하든 말든 파일명만 끄집어냄
                fs.readFile(`data/${filteredID}`, 'utf-8', function(err, description){
                    var title = queryData.id;
                    var sanitize
                    var html = template.html(title, list, 
                                                `<h2>${sanitizeHtml(title)}</h2>${sanitizeHtml(description)}`,
                                                `<a href="/create">create</a> 
                                                 <a href="/update?id=${sanitizeHtml(title)}">update</a>
                                                 <form action="delete_process" method="post">
                                                    <input type='hidden' name='id' value="${sanitizeHtml(title)}">
                                                    <input type="submit" value="delete">
                                                 </form>`);

                    response.writeHead(200); // 서버가 브라우저에게 200이란 숫자 파일을 성공적으로 전송했다
                    response.end(html);
                });
            };
        } else if(pathname === '/create'){
            var title = 'WEB - create';
            var description = 'Hello, Node.js'
            var html = template.html(title, list, 
                                        `<form action="/create_process" method='post'>
                                        <p><input type="text" name='title' placeholder='title'></p> 

                                        <p>
                                            <textarea name='description' placeholder='description'></textarea>
                                        </p>

                                        <p>
                                            <input type="submit">
                                        </p>
                                        </form>`,
                                        ``
                                        );
            response.writeHead(200); // 서버가 브라우저에게 200이란 숫자 파일을 성공적으로 전송했다
            response.end(html)
        } else if(pathname ==='/create_process'){
            var body = '';
            request.on('data', function(data){ // 포스트 방식으로 데이터를 전송할 때 엄청나게 많으면 프로그램이 꺼진다거나... 그래서 조각들을 수신할 때 마다 콜백함수에 조각을 인자로 넣어서 쌓아놓는다
                body = body + data;
            });
            request.on('end', function(){ // 더 이상 들어올 정보가 없으면 end 뒤의 콜백 실행; 그러므로 다 받으면 할 일을 여기에 적어라
                var post = qs.parse(body); // post 방식의 데이터 네임을 키로 둬서 오브젝트화
                var title = post.title;
                var description = post.description;
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
        } else if(pathname === '/update'){
            var filteredID = path.parse(queryData.id).base; // 보안 : ..을 입력하든 말든 파일명만 끄집어냄
            fs.readFile(`data/${filteredID}`, 'utf-8', function(err, description){
                var title = queryData.id;
                var html = template.html(title, list, 
                                            `<form action="/update_process" method='post'>
                                            <input type="hidden" name="id" value="${title}">
                                            <p><input type="text" name="title" placeholder="title" value="${title}"></p>

                                            <p>
                                                <textarea name='description'>${description}</textarea>
                                            </p>

                                            <p>
                                                <input type="submit">
                                            </p>
                                            </form>`,
                                            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);

                response.writeHead(200); // 서버가 브라우저에게 200이란 숫자 파일을 성공적으로 전송했다
                response.end(html);
            });
        } else if(pathname === '/update_process'){
            var body = '';
            request.on('data', function(data){
                body = body + data;
            });
            request.on('end', function(){
                var post = qs.parse(body);
                var id = post.id;
                var title = post.title;
                var description = post.description;
                fs.rename(`data/${id}`, `data/${title}`, function(err){
                    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                        response.writeHead(302, {Location: `/?id=${title}`});//리다이렉션코드
                        response.end();
                    });
                });
            });
        } else if(pathname === '/delete_process'){
            var body = '';
            request.on('data', function(data){
                body = body + data;
            });
            request.on('end', function(){
                var post = qs.parse(body);
                var id = post.id;
                var filteredID = path.parse(id).base;
                fs.unlink(`data/${filteredID}`, function(error){
                    response.writeHead(302, {Location: `/`});
                    response.end();
                })
            });
        } else{ // path를 입력했다면
            response.writeHead(404); // 반대의 경우 서버가 404란 숫자를 줌
            response.end('Not found');
        }
    });
    // response.end(fs.readFileSync(__dirname + _url)); // _url에서 입력한 파일을 읽어서 사용자에게 준다

});
app.listen(3000); // 3000번 포트에 http 서버 구동 (node.js를 실행)