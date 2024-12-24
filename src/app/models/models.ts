export interface HourlyData {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    visibility_10m?: number[]; 
  }
  
  export interface CurrentWeather {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
    weathercode: number;
  }
  
  export interface WeatherData {
    latitude: number;
    longitude: number;
    current: CurrentWeather;
    hourly: HourlyData;
  }
  