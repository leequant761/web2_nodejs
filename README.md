# w2_nodejs

node.js를 활용하면 자바스크립트가 웹브라우저 고유의 언어에서 웹서버의 언어로 확장이 된다.

그러면 html 파일에서 직접 코딩하는 것에서 벗어나 js 파일에서 코딩을 해서 html을 띄우게 된다.

response, request

URL = 프로토콜 + 도메인 + 포트 + path + ?쿼리스트링

비동기, 콜백

프로세스 매니저(pm2) : 서버 자동 재부팅(꿀명령어) `pm2 start main.js --watch`

쿼리스트링 처리방식 Post

> request ==> Post ==> 파싱 ==> 저장 ==> 리다이렉션

성공 에러 리다이렉션 response.writeHead(200), response.writeHead(404), response.writeHead(301)

웹서버의 파일시스템 관련 API : fs

모듈, require

보안이슈 : path 파싱모듈, sanitize-html 태그 세탁모듈

## 확장

DB : 디렉토리/파일 을 대신하는 저장공간, 성능 보안 편리함

프레임워크 : 인증, 보안 같은 공통적인 것을 내가 세세히 안해도 됨

## 총평

다루는 범위가 너무 많고 코드도 길어져서 힘들었다.
