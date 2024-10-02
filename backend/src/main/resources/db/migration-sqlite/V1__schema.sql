PRAGMA foreign_keys = ON;

create table user
(
    created_at timestamp,
    id         integer primary key autoincrement,
    user_id    bigint,
    updated_at timestamp,
    version    bigint       not null,
    email      varchar(255) not null unique,
    name       varchar(255),
    password   varchar(255) not null,
    foreign key (user_id) references user (id)
);

create table notebook
(
    created_at timestamp,
    id         integer primary key autoincrement,
    updated_at timestamp,
    user_id    bigint,
    version    bigint       not null,
    name       varchar(255) not null,
    foreign key (user_id) references user (id)
);

create table phrase
(
    created_at  timestamp,
    id          integer primary key autoincrement,
    notebook_id bigint,
    updated_at  timestamp,
    user_id     bigint,
    version     bigint       not null,
    abc         varchar(255) not null,
    "key"       varchar(255) not null,
    length      varchar(255) not null,
    meter       varchar(255) not null,
    reference   varchar(255),
    title       varchar(255) not null,
    foreign key (notebook_id) references notebook (id),
    foreign key (user_id) references user (id)
);

create table tag
(
    created_at timestamp,
    id         integer primary key autoincrement,
    updated_at timestamp,
    user_id    bigint,
    version    bigint       not null,
    name       varchar(255) not null,
    foreign key (user_id) references user (id)
);

create table tag_phrases
(
    phrases_id bigint not null,
    tags_id    bigint not null,
    primary key (phrases_id, tags_id),
    foreign key (phrases_id) references phrase (id),
    foreign key (tags_id) references tag (id)
);
