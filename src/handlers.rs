use crate::models::Status;
use crate::crud;
use actix_web::{HttpResponse, Responder, web};
use deadpool_postgres::{Pool, Client};

pub async fn slash() -> impl Responder  {
    HttpResponse::Ok()
        .json(Status {
            status: "Ok".to_string()
        })
} 

pub async fn get_todos(db_pool: web::Data<Pool>) -> impl Responder {
    let client: Client = 
        db_pool.get().await.expect("Error Connecting to Database");
    
    let result = crud::get_todos(&client).await;
    match result {
        Ok(todos) => HttpResponse::Ok().json(todos),
        Err(..) => HttpResponse::InternalServerError().into()
    }
}