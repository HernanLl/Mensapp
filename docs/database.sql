create table users(
    id serial primary key,
    name varchar(128) not null,
    email varchar(512) not null,
    password varchar(512) not null,
    state varchar(512),
    location varchar(128),
    urlprofile varchar(512),
    urlbackground varchar(512),
    verified boolean,
    erased boolean
);

create table messages(
    "to" integer references users(id),
    "from" integer references users(id),
    message text,
    "datetime" timestamp,
    urlprofile varchar(512),
    viewed boolean,
    urlimage varchar(512)
);

create table pendings("url" varchar(512), "date" bigint);

create table tokens(token varchar(512), id integer);