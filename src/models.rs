use serde::{Serialize, Deserialize};
use tokio_pg_mapper_derive::PostgresMapper;

#[derive(Serialize)]
pub struct Status {
    pub status: String,
}

#[derive(Deserialize, Serialize, PostgresMapper)]
#[pg_mapper(table="todo_item")]
pub struct TodoItem {
   pub id: i32,
   pub title: String,
   pub checked: bool,
   pub list_id: i32 
}

#[derive(Deserialize, Serialize, PostgresMapper)]
#[pg_mapper(table="todo_list")]
pub struct TodoList {
   pub id: i32,
   pub title: String
}