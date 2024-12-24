// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod services;
mod models;

use services::weather_service;

fn main() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![weather_service::get_current_weather, weather_service::get_current_location]) 
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}



