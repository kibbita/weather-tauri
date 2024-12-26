import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  title = 'weather-tauri';
  backgroundColor: string = '';
  currentWeather: any;
  lat: number = 0;
  lon: number = 0;
  loading: boolean = true; 
  cityName: any;
  clothingSuggestions: string[] = [];
  isDayTime: boolean = true;

  constructor(private weatherService: WeatherService){}
  ngOnInit(): void {
    this.getGeolocation();
    const currentHour = new Date().getHours();

    if (currentHour >= 20){
      this.isDayTime = false;
    }
  }
  
  getGeolocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude; 
          this.lon = position.coords.longitude; 
          
          this.weatherService
            .getCurrentWeather(this.lat, this.lon)
            .then((weatherData) => {
              this.currentWeather = weatherData;
              this.calculateClothingSuggestions();
              this.getCityName();

            }).catch((err) => {
              console.log('Error occurred:', err);
            });

        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  getCityName(){
    this.weatherService.getCurrentLocation(this.lat,this.lon).then((res) => {
      this.cityName = res;
      this.loading = false;
    });
  }


  private calculateClothingSuggestions() {
    const currentWeather = this.currentWeather?.current;
    const temperature = currentWeather?.temperature_2m;
    const windSpeed = currentWeather?.wind_speed_10m;
    const weatherCode = currentWeather?.weathercode;
    const humidity = this.currentWeather?.hourly?.relative_humidity_2m[0];
  
    let clothing: string[] = [];
  
    if (temperature && windSpeed !== undefined && weatherCode !== undefined && humidity !== undefined) {
      
      // **Muy frío (< 0°C)**
      if (temperature < 0) {
        clothing = ['sueter', 'pantalones', 'par-de-guantes', 'gorro-de-invierno'];
        if (windSpeed > 15) {
          clothing.push('par-de-guantes');  // Agregar guantes si hace viento
        }
      } 
      
      // **Frío extremo (0°C - 10°C)**
      else if (temperature >= 0 && temperature < 10) {
        clothing = ['sueter', 'pantalones', 'botas', 'gorro-de-invierno'];
      }
  
      // **Frío moderado (10°C - 15°C)**
      else if (temperature >= 10 && temperature < 15) {
        clothing = ['sueter', 'pantalones', 'botines', 'chaqueta-con-bolsillos'];
      }
  
      // **Templado frío (15°C - 20°C)**
      else if (temperature >= 15 && temperature < 20) {
        clothing = ['camiseta', 'pantalones', 'chaqueta-con-bolsillos', 'botines'];
      }
  
      // **Templado (20°C - 25°C)**
      else if (temperature >= 20 && temperature < 25) {
        clothing = ['camiseta', 'pantalones', 'sandals-pair', 'gorro'];
      }
  
      // **Caluroso (25°C - 30°C)**
      else if (temperature >= 25 && temperature < 30) {
        clothing = ['camiseta', 'pantalones-cortos', 'sandals-pair', 'gafas-de-sol'];
      }
  
      // **Muy caluroso (30°C - 35°C)**
      else if (temperature >= 30 && temperature < 35) {
        clothing = ['camisa-sin-mangas', 'pantalones-cortos', 'sandals-pair', 'sombrero'];
      }
  
      else if (temperature > 35) {
        clothing = ['camisa-sin-mangas', 'pantalones-cortos', 'sandals-pair', 'sombrero'];
      }
  
      if (weatherCode >= 5 && weatherCode <= 6) {
        clothing.push('umbrella');
      }
  
      while (clothing.length < 4) {
        clothing.push('cloud'); 
      }
  
      this.clothingSuggestions = clothing;
      console.log('Clothing Suggestions:', this.clothingSuggestions);
    }
  }
}
