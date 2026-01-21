import UIComponent from './UIComponent.js';

export default class NewsWidget extends UIComponent {
    constructor(config = {}) {
        super({
            title: config.title || 'Последние новости',
            id: config.id
        });
        
        this.news = [];
        this.apiKey = 'pub_372576e6c9b4b1b39d4a5c5d1e3e79a1bf4b4'; // Бесплатный ключ от NewsData
        this.init();
    }

    async init() {
        this.renderLoading();
        await this.fetchNews();
        this.bindEvents();
    }

    async fetchNews() {
        try {
            const response = await fetch(
                `https://newsdata.io/api/1/news?apikey=${this.apiKey}&country=ru&language=ru&category=technology&size=3`
            );
            
            if (!response.ok) {
                throw new Error('Ошибка получения новостей');
            }
            
            const data = await response.json();
            this.news = data.results || [];
            this.renderContent();
            
        } catch (error) {
            console.error('Ошибка при загрузке новостей:', error);
            this.renderError();
        }
    }

    renderContent() {
        if (!this.news || this.news.length === 0) {
            this.renderError();
            return;
        }
        
        const content = `
            <div class="news-container">
                <div class="news-header">
                    <button class="news-refresh-btn" type="button" id="${this.id}-refresh">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
                <div class="news-list">
                    ${this.news.map(item => this.renderNewsItem(item)).join('')}
                </div>
            </div>
        `;
        
        this.updateContent(content);
    }

    renderNewsItem(item) {
        const date = new Date(item.pubDate).toLocaleDateString('ru-RU');
        const description = item.description || 'Описание отсутствует';
        const source = item.source_id || 'Неизвестный источник';
        
        return `
            <div class="news-item">
                <h4 class="news-title">${item.title}</h4>
                <p class="news-description">${description}</p>
                <div class="news-meta">
                    <span class="news-source">${source}</span>
                    <span class="news-date">${date}</span>
                </div>
            </div>
        `;
    }

    renderLoading() {
        const content = `
            <div class="news-container loading">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <p>Загрузка новостей...</p>
            </div>
        `;
        
        this.updateContent(content);
    }

    renderError() {
        const content = `
            <div class="news-container error">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p>Не удалось загрузить новости</p>
                <button class="news-retry-btn" type="button" onclick="document.getElementById('${this.id}').widget.refreshNews()">
                    Попробовать снова
                </button>
            </div>
        `;
        
        this.updateContent(content);
    }

    bindEvents() {
        // Сохраняем ссылку на виджет в DOM
        this.element.widget = this;
        
        const refreshBtn = this.element.querySelector(`#${this.id}-refresh`);
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshNews();
            });
        }
    }

    async refreshNews() {
        this.renderLoading();
        await this.fetchNews();
    }
}