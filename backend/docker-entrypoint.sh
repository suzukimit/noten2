#!/bin/bash

# SQLiteデータベースをリストア（存在しない場合のみ復元）
litestream restore -if-replica-exists -config /etc/litestream.yml /app/noten.db

# Litestreamをバックグラウンドで起動してSQLiteデータベースをレプリケート
litestream replicate -config /etc/litestream.yml &

# Spring Bootアプリケーションの起動
exec java -jar /app/app.jar
