import UIComponent from './UIComponent.js';

export default class QuoteWidget extends UIComponent {
    constructor(config = {}) {
        super({
            title: config.title || 'Цитата дня',
            id: config.id
        });
        
        this.quotes = [
            "Единственный способ сделать великую работу — любить то, что ты делаешь. - Стив Джобс",
            "Не оглядывайтесь назад — вас могут обогнать. - Коко Шанель",
            "Успех — это способность идти от одной неудачи к другой, не теряя энтузиазма. - Уинстон Черчилль",
            "Лучше сделать и пожалеть, чем не сделать и пожалеть вдвойне. - Народная мудрость",
            "Ваше время ограничено, не тратьте его, живя чужой жизнью. - Стив Джобс"
        ];
        
        this.currentQuote = this.getRandomQuote();
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        const content = `
            <div class="quote-container">
                <div class="quote-text">"${this.currentQuote}"</div>
                <button class="quote-refresh-btn" type="button">
                    <i class="fas fa-sync-alt"></i> Новая цитата
                </button>
            </div>
        `;
        
        this.updateContent(content);
    }

    bindEvents() {
        const refreshBtn = this.getContentElement().querySelector('.quote-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshQuote();
            });
        }
    }

    getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        return this.quotes[randomIndex];
    }

    refreshQuote() {
        this.currentQuote = this.getRandomQuote();
        this.render();
        this.bindEvents();
    }
}