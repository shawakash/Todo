mod models;
mod config;

use crate::models::Status;
use actix_web::{web, App, HttpServer, HttpResponse, Responder, middleware::Logger};
use std::io;
use dotenv::dotenv;

async fn slash() -> impl Responder  {
    HttpResponse::Ok()
        .json(Status {
            status: "Ok".to_string()
        })
} 

async fn create_todo() -> impl Responder {
    HttpResponse::Ok()
        .json(Status {
            status: "Ok".to_string()
        })
}

#[actix_web::main]
async fn main() -> io::Result<()> {

    dotenv().ok();

    let config = crate::config::Config::from_env().unwrap();
    let address = format!("{}:{}", config.server.host, config.server.port);
    
    println!("Starting Server at http://{}:{}", config.server.host, config.server.port);

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .route("/", web::get().to(slash))
            .route("/createTodo", web::get().to(create_todo))
    })
    .bind(address)?
    .run()
    .await
}
