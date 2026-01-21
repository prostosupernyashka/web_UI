// Объединяем все классы в один файл

class UIComponent {
    constructor(config = {}) {
        this.id = config.id || `widget-${Date.now()}`;
        this.title = config.title || 'Виджет';
        this.isMinimized = false;
        this.isActive = true;
        
        this.element = this.createBaseElement();
        this.bindBaseEvents();
    }

    createBaseElement() {
        const element = document.createElement('div');
        element.className = 'widget';
        element.id = this.id;
        
        element.innerHTML = `
            <div class="widget-header">
                <h3 class="widget-title">${this.title}</h3>
                <div class="widget-controls">
                    <button class="widget-btn minimize-btn" title="Свернуть">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="widget-btn close-btn" title="Закрыть">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="widget-content"></div>
        `;
        
        return element;
    }

    bindBaseEvents() {
        const minimizeBtn = this.element.querySelector('.minimize-btn');
        const closeBtn = this.element.querySelector('.close-btn');

        minimizeBtn.onclick = (e) => {
            e.preventDefault();
            this.toggleMinimize();
        };

        closeBtn.onclick = (e) => {
            e.preventDefault();
            this.close();
        };
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        const content = this.element.querySelector('.widget-content');
        content.style.display = this.isMinimized ? 'none' : 'block';
    }

    close() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    render() {
        return this.element;
    }

    updateContent(html) {
        const contentElement = this.element.querySelector('.widget-content');
        if (contentElement) {
            contentElement.innerHTML = html;
        }
    }
}

class ToDoWidget extends UIComponent {
    constructor(config = {}) {
        super({
            title: config.title || 'Список дел',
            id: config.id
        });
        
        this.tasks = config.tasks || [];
        this.renderContent();
        this.bindEvents();
    }

    renderContent() {
        const content = `
            <div class="todo-container">
                <div class="todo-input-container">
                    <input type="text" class="todo-input" placeholder="Добавить новую задачу...">
                    <button class="todo-add-btn">
                        <i class="fas fa-plus"></i> Добавить
                    </button>
                </div>
                <ul class="todo-list">
                    ${this.tasks.map(task => `
                        <li class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                            <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}>
                            <span class="todo-text">${task.text}</span>
                            <button class="todo-delete-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                        </li>
                    `).join('')}
                </ul>
                <div class="todo-stats">
                    <span>Всего: ${this.tasks.length}</span>
                    <span>Выполнено: ${this.tasks.filter(task => task.completed).length}</span>
                </div>
            </div>
        `;
        
        this.updateContent(content);
    }

    bindEvents() {
        const contentElement = this.element.querySelector('.widget-content');
        
        const addButton = contentElement.querySelector('.todo-add-btn');
        const input = contentElement.querySelector('.todo-input');

        addButton.onclick = () => this.addTask();
        
        input.onkeypress = (e) => {
            if (e.key === 'Enter') this.addTask();
        };

        contentElement.onclick = (e) => {
            if (e.target.closest('.todo-delete-btn')) {
                const taskItem = e.target.closest('.todo-item');
                this.deleteTask(taskItem.dataset.id);
            }
        };

        contentElement.onchange = (e) => {
            if (e.target.classList.contains('todo-checkbox')) {
                const taskItem = e.target.closest('.todo-item');
                this.toggleTask(taskItem.dataset.id, e.target.checked);
            }
        };
    }

    addTask() {
        const input = this.element.querySelector('.todo-input');
        const text = input.value.trim();
        
        if (text) {
            this.tasks.push({
                id: Date.now(),
                text: text,
                completed: false
            });
            this.renderContent();
            this.bindEvents();
            input.value = '';
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== parseInt(taskId));
        this.renderContent();
        this.bindEvents();
    }

    toggleTask(taskId, completed) {
        const task = this.tasks.find(task => task.id === parseInt(taskId));
        if (task) {
            task.completed = completed;
            this.renderContent();
            this.bindEvents();
        }
    }
}

class QuoteWidget extends UIComponent {
    constructor(config = {}) {
        super({
            title: config.title || 'Цитата дня',
            id: config.id
        });
        
        this.quotes = [
            "Единственный способ сделать великую работу — любить то, что ты делаешь. - Стив Джобс",
            "Не оглядывайтесь назад — вас могут обогнать. - Коко Шанель",
            "Успех — это способность идти от одной неудачи к другой, не теряя энтузиазма. - Уинстон Черчилль"
        ];
        
        this.currentQuote = this.getRandomQuote();
        this.renderContent();
        this.bindEvents();
    }

    renderContent() {
        const content = `
            <div class="quote-container">
                <div class="quote-text">"${this.currentQuote}"</div>
                <button class="quote-refresh-btn">
                    <i class="fas fa-sync-alt"></i> Новая цитата
                </button>
            </div>
        `;
        
        this.updateContent(content);
    }

    bindEvents() {
        const refreshBtn = this.element.querySelector('.quote-refresh-btn');
        refreshBtn.onclick = () => this.refreshQuote();
    }

    getRandomQuote() {
        return this.quotes[Math.floor(Math.random() * this.quotes.length)];
    }

    refreshQuote() {
        this.currentQuote = this.getRandomQuote();
        this.renderContent();
        this.bindEvents();
    }
}

class WeatherWidget extends UIComponent {
    constructor(config = {}) {
        super({
            title: config.title || 'Погода',
            id: config.id
        });
        
        this.city = config.city || 'Москва';
        this.weatherData = null;
        
        // Создаем HTML сразу
        this.createHTML();
        // Ищем погоду
        this.searchWeather(this.city);
    }

    createHTML() {
        const html = `
            <div class="weather-container">
                <div class="weather-header">
                    <input type="text" class="city-input" placeholder="Введите город..." value="${this.city}">
                    <button class="search-btn"><i class="fas fa-search"></i></button>
                    <button class="refresh-btn"><i class="fas fa-sync-alt"></i></button>
                </div>
                <div class="weather-main">
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Загрузка...</p>
                    </div>
                </div>
            </div>
        `;
        
        this.updateContent(html);
        
        // Привязываем события сразу после создания HTML
        this.attachEvents();
    }

    attachEvents() {
        // Используем делегирование событий - более надежно
        const content = this.element.querySelector('.widget-content');
        if (!content) return;
        
        content.addEventListener('click', (e) => {
            if (e.target.closest('.search-btn')) {
                this.handleSearch();
            }
            if (e.target.closest('.refresh-btn')) {
                this.handleRefresh();
            }
        });
        
        content.addEventListener('keypress', (e) => {
            if (e.target.classList.contains('city-input') && e.key === 'Enter') {
                this.handleSearch();
            }
        });
    }

    handleSearch() {
        const input = this.element.querySelector('.city-input');
        if (input) {
            const city = input.value.trim();
            if (city) {
                this.searchWeather(city);
            }
        }
    }

    handleRefresh() {
        const input = this.element.querySelector('.city-input');
        const city = input ? input.value.trim() : this.city;
        this.searchWeather(city);
    }

    async searchWeather(cityName) {
        try {
            // Показываем загрузку
            const weatherMain = this.element.querySelector('.weather-main');
            if (weatherMain) {
                weatherMain.innerHTML = `
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Ищем "${cityName}"...</p>
                    </div>
                `;
            }
            
            // 1. Ищем координаты города
            const coords = await this.getCityCoords(cityName);
            if (!coords) {
                throw new Error('Город не найден');
            }
            
            // 2. Получаем погоду
            const weather = await this.getWeather(coords.lat, coords.lon);
            
            // 3. Обновляем отображение
            this.displayWeather(cityName, weather, coords);
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    async getCityCoords(cityName) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
            );
            
            const data = await response.json();
            if (data && data.length > 0) {
                return {
                    lat: data[0].lat,
                    lon: data[0].lon,
                    name: data[0].display_name.split(',')[0]
                };
            }
            return null;
        } catch (error) {
            console.error('Ошибка поиска города:', error);
            return null;
        }
    }

    async getWeather(lat, lon) {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`
            );
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка погоды:', error);
            throw error;
        }
    }

    displayWeather(cityName, weatherData, coords) {
        const weatherMain = this.element.querySelector('.weather-main');
        if (!weatherMain) return;
        
        if (!weatherData || !weatherData.current) {
            this.showError('Нет данных о погоде');
            return;
        }
        
        const current = weatherData.current;
        const temp = Math.round(current.temperature_2m);
        const code = current.weather_code;
        
        weatherMain.innerHTML = `
            <div class="city-display">
                <i class="fas fa-map-marker-alt"></i>
                <h3>${coords.name || cityName}</h3>
            </div>
            <div class="temp-display">${temp}°C</div>
            <div class="weather-icon">${this.getWeatherIcon(code)}</div>
            <div class="weather-desc">${this.getWeatherDesc(code)}</div>
            <div class="weather-details">
                <div><i class="fas fa-tint"></i> ${current.relative_humidity_2m}%</div>
                <div><i class="fas fa-wind"></i> ${current.wind_speed_10m} м/с</div>
            </div>
        `;
        
        // Обновляем поле ввода
        const input = this.element.querySelector('.city-input');
        if (input) {
            input.value = coords.name || cityName;
        }
        this.city = coords.name || cityName;
    }

    showError(message) {
        const weatherMain = this.element.querySelector('.weather-main');
        if (weatherMain) {
            weatherMain.innerHTML = `
                <div class="weather-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                    <button class="retry-btn">Попробовать снова</button>
                </div>
            `;
            
            // Привязываем кнопку повтора
            setTimeout(() => {
                const retryBtn = weatherMain.querySelector('.retry-btn');
                if (retryBtn) {
                    retryBtn.onclick = () => {
                        const input = this.element.querySelector('.city-input');
                        this.searchWeather(input.value || 'Москва');
                    };
                }
            }, 100);
        }
    }

    getWeatherIcon(code) {
        const icons = {
            0: '<i class="fas fa-sun"></i>',
            1: '<i class="fas fa-cloud-sun"></i>',
            2: '<i class="fas fa-cloud-sun"></i>',
            3: '<i class="fas fa-cloud"></i>',
            45: '<i class="fas fa-smog"></i>',
            48: '<i class="fas fa-smog"></i>',
            51: '<i class="fas fa-cloud-rain"></i>',
            61: '<i class="fas fa-cloud-rain"></i>',
            71: '<i class="fas fa-snowflake"></i>',
            80: '<i class="fas fa-cloud-showers-heavy"></i>',
            95: '<i class="fas fa-bolt"></i>'
        };
        return icons[code] || '<i class="fas fa-cloud"></i>';
    }

    getWeatherDesc(code) {
        const desc = {
            0: 'Ясно', 1: 'Преимущ. ясно', 2: 'Перем. облачно',
            3: 'Пасмурно', 45: 'Туман', 48: 'Туман',
            51: 'Морось', 61: 'Дождь', 71: 'Снег',
            80: 'Ливень', 95: 'Гроза'
        };
        return desc[code] || 'Облачно';
    }

    render() {
        return this.element;
    }
}

class NewsWidget extends UIComponent {
    constructor(config = {}) {
        super({
            title: config.title || 'Новости',
            id: config.id
        });
        
        this.news = [];
        this.currentCategory = 'technology';
        this.categories = [
            { id: 'technology', name: 'Технологии' },
            { id: 'business', name: 'Бизнес' },
            { id: 'sports', name: 'Спорт' },
            { id: 'science', name: 'Наука' },
            { id: 'entertainment', name: 'Развлечения' }
        ];
        
        this.createHTML();
        this.loadNews(true); // true = быстрая загрузка
    }

    createHTML() {
        const html = `
            <div class="news-container">
                <div class="news-header">
                    <div class="news-controls">
                        <div class="category-tabs">
                            ${this.categories.map(cat => `
                                <button class="category-tab ${cat.id === this.currentCategory ? 'active' : ''}" 
                                        data-category="${cat.id}">
                                    ${cat.name}
                                </button>
                            `).join('')}
                        </div>
                        <button class="refresh-news-btn" title="Обновить новости">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="news-content">
                    <div class="news-skeleton">
                        <div class="skeleton-item"></div>
                        <div class="skeleton-item"></div>
                        <div class="skeleton-item"></div>
                    </div>
                </div>
                
                <div class="news-status">
                    <span class="status-text">Загрузка...</span>
                    <span class="last-update"></span>
                </div>
            </div>
        `;
        
        this.updateContent(html);
        this.attachEvents();
    }

    attachEvents() {
        const content = this.element.querySelector('.widget-content');
        if (!content) return;
        
        // Переключение категорий
        content.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.switchCategory(category);
            });
        });
        
        // Кнопка обновления
        const refreshBtn = content.querySelector('.refresh-news-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadNews(false));
        }
    }

    switchCategory(category) {
        if (this.currentCategory === category) return;
        
        this.currentCategory = category;
        
        // Обновляем активную вкладку
        this.element.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
        
        // Загружаем новости для новой категории
        this.loadNews(true);
    }

    async loadNews(useCache = true) {
        // Показываем состояние загрузки
        this.updateStatus('Загрузка...');
        
        // Анимация кнопки
        const refreshBtn = this.element.querySelector('.refresh-news-btn i');
        if (refreshBtn) {
            refreshBtn.className = 'fas fa-sync-alt fa-spin';
        }
        
        try {
            let newsData;
            
            // Пробуем получить из localStorage (кэш на 5 минут)
            if (useCache) {
                const cached = this.getCachedNews();
                if (cached) {
                    newsData = cached;
                    this.updateStatus('Загружено из кэша');
                }
            }
            
            // Если нет в кэше, загружаем с API
            if (!newsData) {
                newsData = await this.fetchNewsFast();
                if (newsData) {
                    this.cacheNews(newsData);
                    this.updateStatus('Загружено с сервера');
                }
            }
            
            // Если API не сработал, показываем локальные новости
            if (!newsData || newsData.length === 0) {
                newsData = this.getLocalNews();
                this.updateStatus('Локальные новости');
            }
            
            this.news = newsData;
            this.displayNews();
            
        } catch (error) {
            console.error('Ошибка:', error);
            this.news = this.getLocalNews();
            this.displayNews();
            this.updateStatus('Ошибка загрузки');
        } finally {
            // Убираем анимацию
            if (refreshBtn) {
                refreshBtn.className = 'fas fa-sync-alt';
            }
            
            // Обновляем время
            const lastUpdate = this.element.querySelector('.last-update');
            if (lastUpdate) {
                lastUpdate.textContent = new Date().toLocaleTimeString('ru-RU', 
                    {hour: '2-digit', minute:'2-digit'});
            }
        }
    }

    async fetchNewsFast() {
        // Пробуем разные быстрые источники
        const sources = [
            this.fetchFromGuardian,    // The Guardian API (быстрый)
            this.fetchFromNewsAPI,     // NewsAPI
            this.fetchFromInshorts     // Inshorts API (очень быстрый)
        ];
        
        for (const source of sources) {
            try {
                const result = await Promise.race([
                    source(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Таймаут')), 3000)
                    )
                ]);
                
                if (result && result.length > 0) {
                    return result;
                }
            } catch (error) {
                console.log(`Источник ${source.name} не сработал:`, error.message);
                continue;
            }
        }
        
        return null;
    }

    async fetchFromGuardian() {
        try {
            const apiKey = 'test'; // Демо ключ
            const response = await fetch(
                `https://content.guardianapis.com/search?section=${this.currentCategory}&show-fields=thumbnail,trailText&api-key=${apiKey}&page-size=5`
            );
            
            if (response.ok) {
                const data = await response.json();
                return data.response.results.map(item => ({
                    title: item.webTitle,
                    description: item.fields?.trailText || 'Читать далее...',
                    source: 'The Guardian',
                    url: item.webUrl,
                    image: item.fields?.thumbnail,
                    date: 'Сегодня'
                }));
            }
        } catch (error) {
            throw error;
        }
    }

    async fetchFromNewsAPI() {
        try {
            const apiKey = '060a1c0b6d3649b3ad928fe6d5e5439a';
            const response = await fetch(
                `https://newsapi.org/v2/top-headlines?category=${this.currentCategory}&pageSize=5&apiKey=${apiKey}`
            );
            
            if (response.ok) {
                const data = await response.json();
                return data.articles.map(article => ({
                    title: article.title,
                    description: article.description || 'Без описания',
                    source: article.source.name,
                    url: article.url,
                    image: article.urlToImage,
                    date: new Date(article.publishedAt).toLocaleDateString('ru-RU')
                }));
            }
        } catch (error) {
            throw error;
        }
    }

    async fetchFromInshorts() {
        try {
            // Inshorts API - очень быстрый индийский источник
            const categoryMap = {
                'technology': 'technology',
                'business': 'business',
                'sports': 'sports',
                'science': 'science',
                'entertainment': 'entertainment'
            };
            
            const category = categoryMap[this.currentCategory] || 'all';
            const response = await fetch(
                `https://inshortsapi.vercel.app/news?category=${category}`
            );
            
            if (response.ok) {
                const data = await response.json();
                return data.data.slice(0, 5).map(item => ({
                    title: item.title,
                    description: item.content,
                    source: 'Inshorts',
                    url: item.readMoreUrl,
                    image: item.imageUrl,
                    date: 'Сегодня'
                }));
            }
        } catch (error) {
            throw error;
        }
    }

    getLocalNews() {
        // Локальные новости (всегда доступны мгновенно)
        const localNews = {
            technology: [
                {
                    title: "Новые технологии JavaScript 2024",
                    description: "ECMAScript 2024 приносит новые возможности для разработчиков.",
                    source: "TechNews",
                    url: "#",
                    date: "Сегодня"
                },
                {
                    title: "Искусственный интеллект в образовании",
                    description: "Как ИИ помогает студентам и преподавателям в учебном процессе.",
                    source: "EduTech",
                    url: "#",
                    date: "Сегодня"
                },
                {
                    title: "Тренды веб-дизайна этого года",
                    description: "Неоморфизм, стеклянный эффект и анимации - главные тренды.",
                    source: "Design Weekly",
                    url: "#",
                    date: "Вчера"
                }
            ],
            business: [
                {
                    title: "Цифровая трансформация бизнеса",
                    description: "Как компании адаптируются к цифровой эпохе.",
                    source: "Business Today",
                    url: "#",
                    date: "Сегодня"
                },
                {
                    title: "Новые стартапы 2024 года",
                    description: "Самые перспективные технологические стартапы.",
                    source: "Startup News",
                    url: "#",
                    date: "Сегодня"
                }
            ],
            sports: [
                {
                    title: "Спортивные события недели",
                    description: "Главные матчи и турниры в мире спорта.",
                    source: "Sports Daily",
                    url: "#",
                    date: "Сегодня"
                },
                {
                    title: "Новые рекорды атлетов",
                    description: "Спортсмены продолжают удивлять своими результатами.",
                    source: "Athletics World",
                    url: "#",
                    date: "Вчера"
                }
            ]
        };
        
        return localNews[this.currentCategory] || localNews.technology;
    }

    getCachedNews() {
        const cacheKey = `news_${this.currentCategory}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            // Кэш действителен 5 минут
            if (Date.now() - timestamp < 5 * 60 * 1000) {
                return data;
            }
        }
        
        return null;
    }

    cacheNews(newsData) {
        const cacheKey = `news_${this.currentCategory}`;
        const cacheData = {
            data: newsData,
            timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    }

    updateStatus(text) {
        const statusEl = this.element.querySelector('.status-text');
        if (statusEl) {
            statusEl.textContent = text;
        }
    }

    displayNews() {
        const newsContent = this.element.querySelector('.news-content');
        if (!newsContent) return;
        
        if (this.news.length === 0) {
            newsContent.innerHTML = `
                <div class="news-empty">
                    <i class="fas fa-newspaper"></i>
                    <p>Нет новостей для отображения</p>
                </div>
            `;
            return;
        }
        
        const newsHTML = this.news.map((item, index) => `
            <div class="news-item" data-index="${index}">
                <div class="news-card">
                    ${item.image ? `
                        <div class="news-image">
                            <img src="${item.image}" alt="${item.title}" 
                                 onerror="this.style.display='none'">
                        </div>
                    ` : ''}
                    <div class="news-info">
                        <h4 class="news-title">${item.title}</h4>
                        <p class="news-description">${item.description}</p>
                        <div class="news-meta">
                            <span class="news-source">
                                <i class="fas fa-newspaper"></i> ${item.source}
                            </span>
                            <span class="news-date">
                                <i class="fas fa-calendar-alt"></i> ${item.date}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        newsContent.innerHTML = `
            <div class="news-list">
                ${newsHTML}
            </div>
        `;
        
        // Клик по новости
        newsContent.querySelectorAll('.news-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.category-tab') && !e.target.closest('.refresh-news-btn')) {
                    const index = e.currentTarget.dataset.index;
                    const newsItem = this.news[index];
                    if (newsItem.url && newsItem.url !== '#') {
                        window.open(newsItem.url, '_blank');
                    }
                }
            });
        });
    }

    render() {
        return this.element;
    }
}

class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.widgets = [];
    }
    
    addWidget(type, config = {}) {
        let widget;
        
        switch (type) {
            case 'todo':
                widget = new ToDoWidget(config);
                break;
            case 'quote':
                widget = new QuoteWidget(config);
                break;
            case 'weather':
                widget = new WeatherWidget(config);
                break;
            case 'news':
                widget = new NewsWidget(config);
                break;
        }
        
        if (widget) {
            this.widgets.push(widget);
            this.container.appendChild(widget.render());
        }
        
        return widget;
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', function() {
    const dashboard = new Dashboard('dashboard');
    
    // Привязываем кнопки
    document.getElementById('add-todo').onclick = () => dashboard.addWidget('todo');
    document.getElementById('add-quote').onclick = () => dashboard.addWidget('quote');
    document.getElementById('add-weather').onclick = () => dashboard.addWidget('weather');
    document.getElementById('add-news').onclick = () => dashboard.addWidget('news');
    
    // Добавляем виджеты по умолчанию
    setTimeout(() => {
        dashboard.addWidget('todo');
        dashboard.addWidget('quote');
    }, 100);
});