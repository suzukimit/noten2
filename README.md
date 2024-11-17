# Noten

[ABC記譜法](https://ja.wikipedia.org/wiki/ABC%E8%A8%98%E8%AD%9C%E6%B3%95) で楽譜やフレーズのメモを記録するサービスです。

* Frontend: Angular
* Backend: Spring Boot
* Security: JWT (Spring Security)
* RDBMS: MySQL9.0 or SQLite

## Setup

### DB

DBはmysqlかsqliteを使用可能。
（本番環境では安価なSQLiteを使用するが、mysqlへの移行も考慮して両方での動作を担保）

#### mysql

```
cd docker
docker-compose up -d
```

初期起動時にパーミッションの問題でmysqlサーバーの起動に失敗する場合は以下のコマンドを実行。

```
sudo chmod -R 777 ./mysql_db
sudo chown -R 999:999 ./mysql_db
```

#### SQLite

特に初期設定は不要だが、bootRunする際にprofileを指定する必要がある（デフォルトはmysql）。

```
./gradlew bootRun --args='--spring.profiles.active=sqlite'
```

litestreamを使うとCloud Storageバケットにレプリケーションが可能。bootRunする前に以下のコマンドでリストアし、レプリケーションが自動で行われるようにする。

```
# restore from cloud storage
litestream restore -if-replica-exists -config litestream.yml noten.db

# start replication
litestream replicate -config litestream.yml
```

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


## デプロイ

```
gcloud builds submit --config cloudbuild.yaml .
```

cloud buildを使わずにデプロイする場合は以下の手順を実行する。

```
# buildしてjarファイルを生成
./gradlew build -x test

# Dockerfileからイメージをビルド（Cloud Run実行環境とアーキテクチャが一致しないとエラーになるため、multi-platform build）
docker buildx build --platform linux/amd64 -t noten/noten-backend .
docker tag noten/noten-backend asia-northeast2-docker.pkg.dev/noten2-dev/noten/noten-backend:latest

# Artifact Registryにpush
docker push asia-northeast2-docker.pkg.dev/noten2-dev/noten/noten-backend

# cloud runにデプロイ
gcloud run deploy noten \
  --image asia-northeast2-docker.pkg.dev/noten2-dev/noten/noten/noten-backend \
  --platform managed \
  --region asia-northeast2 \
  --update-env-vars SPRING_PROFILES_ACTIVE=sqlite
```
