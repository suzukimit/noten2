# Noten

[ABC記譜法](https://ja.wikipedia.org/wiki/ABC%E8%A8%98%E8%AD%9C%E6%B3%95) で楽譜やフレーズのメモを記録するサービスです。

* Frontend: Angular
* Backend: Spring Boot
* Security: JWT (Spring Security)
* RDBMS: MySQL8.0

## Setup

### DB

* MySQL8.0
* 接続情報は `application.yml` を参考に
* DDLはRest APIサーバーの起動時に実行 (flyway)

### Backend

```
cd api
./gradlew bootRun
```

* 8080ポートを使用
* JDKは11以上

### Frontend

```
cd front
ng serve
```

* http://localhost:4200
* 初期ユーザーでのログイン: `test@noten.com / test`
