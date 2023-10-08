drop table if exists todo_item;
drop table if exists todo_list;

CREATE table todo_list (
    id serial primary key,
    title varchar(100)
);

CREATE table todo_item (
    id serial primary key,
    title varchar(100) not null,
    checked boolean not null default false,
    list_id integer not null,
    foreign key (list_id) references todo_list(id)
);

insert into todo_list (title) values ('List 1'), ('List 2');

insert into todo_item (title, list_id) values
    ('First Todo', 1),
    ('Second Todo', 1),
    ('First Todo' , 2);