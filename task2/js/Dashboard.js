import ToDoWidget from './ToDoWidget.js';
import QuoteWidget from './QuoteWidget.js';
import WeatherWidget from './WeatherWidget.js';
import NewsWidget from './NewsWidget.js';

export default class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.widgets = [];
        
        if (!this.container) {
            console.error('Контейнер не найден:', containerId);
            return;
        }
        
        this.init();
    }
    
    init() {
        this.container.className = 'dashboard';
        console.log('Dashboard инициализирован');
    }
    
    addWidget(type, config = {}) {
        console.log('Добавляем виджет типа:', type);
        
        let widget;
        
        try {
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
                default:
                    console.error('Неизвестный тип виджета:', type);
                    return null;
            }
            
            this.widgets.push(widget);
            this.container.appendChild(widget.render());
            console.log('Виджет успешно добавлен:', type);
            
            return widget;
            
        } catch (error) {
            console.error('Ошибка при создании виджета:', error);
            return null;
        }
    }
    
    removeWidget(widgetId) {
        const widgetIndex = this.widgets.findIndex(widget => widget.id === widgetId);
        
        if (widgetIndex !== -1) {
            const widget = this.widgets[widgetIndex];
            widget.destroy();
            this.widgets.splice(widgetIndex, 1);
            return true;
        }
        
        return false;
    }
    
    getWidgets() {
        return this.widgets;
    }
}