import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { WeatherData } from '../models/models';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor() { }


  public getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    return invoke('get_current_weather', { lat, lon })
      .then((res: any) => {
        const weatherData: WeatherData = {
          latitude: res.latitude,
          longitude: res.longitude,
          current: {
            time: res.current.time,
            temperature_2m: res.current.temperature_2m,
            wind_speed_10m: res.current.wind_speed_10m,
            weathercode: res.current.weathercode
          },
          hourly: {
            time: res.hourly.time,
            temperature_2m: res.hourly.temperature_2m,
            relative_humidity_2m: res.hourly.relative_humidity_2m,
            wind_speed_10m: res.hourly.wind_speed_10m,
            visibility_10m: res.hourly.visibility_10m,
          },
        };

        return weatherData; 
      })
      .catch((error) => {
        throw new Error('Failed to fetch weather data: ' + error);
      });
  }
  

  public getCurrentLocation(lat: number, lon:number){
    return invoke('get_current_location', { lat, lon }).then((res) => {
      return res;
    })
  }
}




