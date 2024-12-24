
use reqwest::header::USER_AGENT;
use tauri::command;
use reqwest::blocking::{get, Client};
use crate::models::weather_model::WeatherModel;
use crate::models::weather_model::LocationResponse;

#[command]
pub fn get_current_weather(lat: f32, lon: f32) -> Result<WeatherModel, String> {

    let url = format!(
        "https://api.open-meteo.com/v1/forecast?latitude={}&longitude={}&current=temperature_2m,wind_speed_10m,weathercode&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=America/Argentina/Cordoba",
        lat, lon
    );

    match get(url) {
        Ok(response) => {
            match response.json::<WeatherModel>() {
                Ok(weather_data) => {
                    Ok(weather_data)
                },
                Err(_) => Err("Failed to parse JSON response.".to_string()), 
            }
        },
        Err(_) => Err("Failed to fetch data.".to_string()),
    }
}

#[command]
pub fn get_current_location(lat: f32, lon: f32) -> Result<String, String> {

    println!("Lat= {}, long= {}",lat,lon);
    let url = format!(
        "https://nominatim.openstreetmap.org/reverse?lat={}&lon={}&format=json",
        lat, lon
    );

    let client = Client::new();
    
    let response = client
        .get(&url)
        .header(USER_AGENT, "MiAplicacion/1.0 (contacto@miaplicacion.com)")
        .send(); 
    match response {
        Ok(response) => {
            if response.status().is_success() {
                let body = response.text().unwrap_or_else(|_| "Failed to read response body".to_string());
                
                let json_response: Result<LocationResponse, _> = serde_json::from_str(&body);

                match json_response {
                    Ok(data) => {
                        let city = data.address.city.or(data.address.town).or(data.address.village);
                        match city {
                            Some(name) => Ok(name),
                            None => Err("City not found".to_string()),
                        }
                    }
                    Err(_) => Err("Failed to parse response".to_string()),
                }
            } else {
                Err(format!("Failed to fetch data: {}", response.status()))
            }
        }
        Err(_) => Err("Request error".to_string()),
    }
}

