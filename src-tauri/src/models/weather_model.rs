use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct CurrentWeather {
    pub temperature_2m: f32,
    pub wind_speed_10m: f32,
    pub weathercode: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HourlyWeather {
    pub time: Vec<String>,
    pub temperature_2m: Vec<f32>,
    pub relative_humidity_2m: Vec<f32>,
    pub wind_speed_10m: Vec<f32>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct WeatherModel {
    pub latitude: f32,
    pub longitude: f32,
    pub current: CurrentWeather,
    pub hourly: HourlyWeather,
}


#[derive(Deserialize)]
pub struct Address {
    pub city: Option<String>,
    pub town: Option<String>,
    pub village: Option<String>,
}

#[derive(Deserialize)]
pub struct LocationResponse {
    pub address: Address,
}
