mod models;

use crate::models::Status;
use actix_web::{web, App, HttpServer, HttpResponse, Responder};
use std::io;

async fn slash() -> impl Responder  {
    HttpResponse::Ok()
        .json(Status {
            status: "Ok".to_string()
        })
} 

#[actix_web::main]
async fn main() -> io::Result<()> {

    println!("Starting Server at http://localhost:3000");

    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(slash))
    })
    .bind("127.0.0.1:3000")?
    .run()
    .await
}
