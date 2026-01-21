import Dashboard from './Dashboard.js';

class App {
    constructor() {
        this.dashboard = new Dashboard('dashboard');
        this.init();
    }

   init() {
    this.bindEvents();
    this.addDefaultWidgets();
}


    bindEvents() {
        const addTodoBtn = document.getElementById('add-todo');
        const addQuoteBtn = document.getElementById('add-quote');
        const addWeatherBtn = document.getElementById('add-weather');
        const addNewsBtn = document.getElementById('add-news');

        if (addTodoBtn) {
            addTodoBtn.addEventListener('click', () => {
                console.log('Добавляем ToDo виджет');
                this.dashboard.addWidget('todo');
            });
        }

        if (addQuoteBtn) {
            addQuoteBtn.addEventListener('click', () => {
                console.log('Добавляем Quote виджет');
                this.dashboard.addWidget('quote');
            });
        }

        if (addWeatherBtn) {
            addWeatherBtn.addEventListener('click', () => {
                console.log('Добавляем Weather виджет');
                this.dashboard.addWidget('weather');
            });
        }

        if (addNewsBtn) {
            addNewsBtn.addEventListener('click', () => {
                console.log('Добавляем News виджет');
                this.dashboard.addWidget('news');
            });
        }
    }

    addDefaultWidgets() {
        // Добавляем виджеты по умолчанию с небольшой задержкой
        setTimeout(() => {
            this.dashboard.addWidget('todo');
            this.dashboard.addWidget('quote');
        }, 100);
    }
}

// Запускаем приложение
new App();