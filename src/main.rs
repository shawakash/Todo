mod models;
mod config;
mod handlers;
mod crud;

use crate::models::Status;
use crate::handlers::*;
use actix_web::{web::{self, Data}, App, HttpServer, HttpResponse, Responder, middleware::Logger};
use tokio_postgres::NoTls;
use std::io;
use dotenv::dotenv;

async fn create_todo() -> impl Responder {
    HttpResponse::Ok()
        .json(Status {
            status: "Ok".to_string()
        })
}

#[actix_web::main]
async fn main() -> io::Result<()> {

    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    dotenv().ok();

    let config = crate::config::Config::from_env().unwrap();
    let pool = config.pg.create_pool(NoTls).unwrap();
     
    let address = format!("{}:{}", config.server.host, config.server.port);
    
    println!("Starting Server at http://{}:{}", config.server.host, config.server.port);

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(pool.clone()))
            .wrap(Logger::default())
            .route("/", web::get().to(slash))
            .route("/createTodo", web::get().to(create_todo))
            .route("/todos{_:/?}", web::get().to(get_todos))
    })
    .bind(address)?
    .run()
    .await
}
 