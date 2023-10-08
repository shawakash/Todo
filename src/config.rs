use serde::Deserialize;
use config::ConfigError;

#[derive(Deserialize)]
pub struct ServerConfig {
    pub host: String,
    pub port: i32
} 

#[derive(Deserialize)]
pub struct UrlConfig {
    pub db: String
}

#[derive(Deserialize)]
pub struct Config {
    pub server: ServerConfig,
    pub url: UrlConfig
}

impl Config {
    pub fn from_env() -> Result<Self, ConfigError> {
        let mut cfg = config::Config::new();
        cfg.merge(config::Environment::new())?;
        cfg.try_into()
    }
}