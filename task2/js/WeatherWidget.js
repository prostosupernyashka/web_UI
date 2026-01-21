import UIComponent from './UIComponent.js';

export default class WeatherWidget extends UIComponent {
    constructor(config = {}) {
        super({
            title: config.title || 'Погода',
            id: config.id
        });
        
        this.city = config.city || 'Москва';
        this.weatherData = null;
        this.coordinates = { lat: 55.7558, lon: 37.6173 };
        
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        this.searchWeather(this.city);
    }

    render() {
        const content = `
            <div class="weather-container">
                <div class="weather-header">
                    <div class="city-search-box">
                        <input type="text" class="city-input" placeholder="Введите город..." value="${this.city}">
                        <button class="search-btn">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                    <button class="refresh-btn">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
                
                <div class="weather-main">
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Ищем погоду для ${this.city}...</p>
                    </div>
                </div>
                
                <div class="weather-details"></div>
                
                <div class="quick-cities">
                    <span>Быстрый выбор: </span>
                    <button class="city-btn" data-city="Москва">Москва</button>
                    <button class="city-btn" data-city="Санкт-Петербург">СПб</button>
                    <button class="city-btn" data-city="Лондон">Лондон</button>
                    <button class="city-btn" data-city="Париж">Париж</button>
                    <button class="city-btn" data-city="Нью-Йорк">Нью-Йорк</button>
                </div>
            </div>
        `;
        
        this.updateContent(content);
    }

    async getCityCoordinates(cityName) {
        try {
            // Используем OpenStreetMap Nominatim API для поиска координат
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
            );
            
            if (!response.ok) throw new Error('API error');
            
            const data = await response.json();
            
            if (data.length === 0) {
                throw new Error('Город не найден');
            }
            
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
                name: data[0].display_name.split(',')[0]
            };
            
        } catch (error) {
            console.error('Ошибка поиска города:', error);
            throw error;
        }
    }

    async getWeatherData(lat, lon) {
        try {
            // Используем Open-Meteo API для погоды
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`
            );
            
            if (!response.ok) throw new Error('Weather API error');
            
            return await response.json();
            
        } catch (error) {
            console.error('Ошибка погоды:', error);
            throw error;
        }
    }

    async searchWeather(cityName) {
        try {
            this.showLoading();
            
            // 1. Получаем координаты города
            const location = await this.getCityCoordinates(cityName);
            this.city = location.name;
            this.coordinates = { lat: location.lat, lon: location.lon };
            
            // 2. Получаем погоду
            this.weatherData = await this.getWeatherData(location.lat, location.lon);
            
            // 3. Показываем результат
            this.showWeather();
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    showWeather() {
        if (!this.weatherData || !this.weatherData.current) {
            this.showError('Нет данных о погоде');
            return;
        }
        
        const current = this.weatherData.current;
        const temp = Math.round(current.temperature_2m);
        const weatherCode = current.weather_code;
        
        const weatherMain = this.element.querySelector('.weather-main');
        weatherMain.innerHTML = `
            <div class="city-name">
                <i class="fas fa-map-marker-alt"></i>
                <h3>${this.city}</h3>
            </div>
            <div class="temperature">${temp}°C</div>
            <div class="weather-icon">${this.getWeatherIcon(weatherCode)}</div>
            <div class="weather-description">${this.getWeatherDescription(weatherCode)}</div>
        `;
        
        const weatherDetails = this.element.querySelector('.weather-details');
        weatherDetails.innerHTML = `
            <div class="detail-item">
                <i class="fas fa-tint"></i>
                <span>Влажность: ${current.relative_humidity_2m}%</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-wind"></i>
                <span>Ветер: ${current.wind_speed_10m} м/с</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-thermometer-half"></i>
                <span>Ощущается: ${Math.round(temp)}°C</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>Обновлено: ${new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        `;
    }

    showLoading() {
        const weatherMain = this.element.querySelector('.weather-main');
        if (weatherMain) {
            weatherMain.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Загрузка погоды...</p>
                </div>
            `;
        }
    }

    showError(message) {
        const weatherMain = this.element.querySelector('.weather-main');
        weatherMain.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message || 'Ошибка загрузки'}</p>
                <button class="retry-btn">Попробовать снова</button>
            </div>
        `;
        
        this.element.querySelector('.retry-btn')?.addEventListener('click', () => {
            const input = this.element.querySelector('.city-input');
            this.searchWeather(input.value || 'Москва');
        });
    }

    getWeatherIcon(code) {
        const icons = {
            0: '<i class="fas fa-sun"></i>',      // Ясно
            1: '<i class="fas fa-cloud-sun"></i>', // Преимущ. ясно
            2: '<i class="fas fa-cloud-sun"></i>', // Перем. облачно
            3: '<i class="fas fa-cloud"></i>',     // Пасмурно
            45: '<i class="fas fa-smog"></i>',     // Туман
            48: '<i class="fas fa-smog"></i>',     // Туман
            51: '<i class="fas fa-cloud-rain"></i>', // Морось
            61: '<i class="fas fa-cloud-rain"></i>', // Дождь
            71: '<i class="fas fa-snowflake"></i>', // Снег
            80: '<i class="fas fa-cloud-showers-heavy"></i>', // Ливень
            95: '<i class="fas fa-bolt"></i>'      // Гроза
        };
        return icons[code] || '<i class="fas fa-cloud"></i>';
    }

    getWeatherDescription(code) {
        const descriptions = {
            0: 'Ясно',
            1: 'Преимущественно ясно', 
            2: 'Переменная облачность',
            3: 'Пасмурно',
            45: 'Туман',
            48: 'Туман',
            51: 'Морось',
            61: 'Дождь',
            71: 'Снег',
            80: 'Ливень',
            95: 'Гроза'
        };
        return descriptions[code] || 'Облачно';
    }

    bindEvents() {
        // Поиск при нажатии Enter
        this.element.querySelector('.city-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const city = e.target.value.trim();
                if (city) this.searchWeather(city);
            }
        });
        
        // Кнопка поиска
        this.element.querySelector('.search-btn').addEventListener('click', () => {
            const input = this.element.querySelector('.city-input');
            const city = input.value.trim();
            if (city) this.searchWeather(city);
        });
        
        // Кнопка обновления
        this.element.querySelector('.refresh-btn').addEventListener('click', () => {
            this.searchWeather(this.city);
        });
        
        // Быстрые города
        this.element.querySelectorAll('.city-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const city = e.target.dataset.city;
                this.element.querySelector('.city-input').value = city;
                this.searchWeather(city);
            });
        });
    }
}