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


  constructor(private weatherService: WeatherService){}
  ngOnInit(): void {
    this.getGeolocation();
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
      
      if (temperature < 10) { // Frío
        clothing = ['winter', 'pants', 'boots', 'scarf'];  // Ropa más abrigada
        if (windSpeed > 15) {
          clothing = ['winter', 'pants', 'boots', 'scarf', 'gloves']; // Agregar guantes si hace viento
        }
      } else if (temperature >= 10 && temperature <= 20) { // Templado/Frío moderado
        clothing = ['sweater', 'pants', 'boots', 'scarf'];
        if (windSpeed > 10) {
          clothing.push('jacket');  // Si hay viento, agregar chaqueta
        }
      } else if (temperature > 20 && temperature <= 30) { // Templado/Cálido
        clothing = ['shirt', 'pants', 'sandals', 'sunny'];
        if (humidity > 70) {
          clothing = ['shirt', 'shorts', 'sandals', 'sunny']; // Si está muy húmedo, ropa ligera
        }
      } else if (temperature > 30) { // Calor
        clothing = ['tank_top', 'shorts', 'sandals', 'sunny'];
        if (windSpeed > 15) {
          clothing.push('hat'); // Agregar sombrero si hay mucho viento
        }
      }

      if (humidity > 70) {
        clothing.push('light_clothing');  // Ropa ligera para alta humedad
      }

      // Añadir capa si hay lluvias ligeras
      if (weatherCode >= 5 && weatherCode <= 6) {
        clothing.push('umbrella');  // Lluvia ligera, agregar paraguas
      }

      // Si las condiciones no cubren, añadir íconos básicos
      while (clothing.length < 4) {
        clothing.push('cloud'); // Agregar "cloud" si no hay suficientes sugerencias
      }

      this.clothingSuggestions = clothing;
    }
  }

}
