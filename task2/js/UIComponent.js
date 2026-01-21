export default class UIComponent {
    constructor(config = {}) {
        this._id = config.id || `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this._title = config.title || 'Виджет';
        this._isMinimized = false;
        this._isActive = true;
        
        this._element = this._createBaseElement();
        this._bindBaseEvents();
    }

    _createBaseElement() {
        const element = document.createElement('div');
        element.className = 'widget';
        element.id = this._id;
        
        element.innerHTML = `
            <div class="widget-header">
                <h3 class="widget-title">${this._title}</h3>
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

    _bindBaseEvents() {
        const minimizeBtn = this._element.querySelector('.minimize-btn');
        const closeBtn = this._element.querySelector('.close-btn');

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
        this._isMinimized = !this._isMinimized;
        const content = this._element.querySelector('.widget-content');
        content.style.display = this._isMinimized ? 'none' : 'block';
        const icon = this._element.querySelector('.minimize-btn i');
        icon.className = this._isMinimized ? 'fas fa-plus' : 'fas fa-minus';
    }

    close() {
        if (this._element && this._element.parentNode) {
            this._element.parentNode.removeChild(this._element);
        }
    }

    render() {
        return this._element; // Возвращаем DOM элемент
    }

    updateContent(html) {
        const contentElement = this._element.querySelector('.widget-content');
        if (contentElement) {
            contentElement.innerHTML = html;
        }
    }

    getContentElement() {
        return this._element.querySelector('.widget-content');
    }

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get element() {
        return this._element;
    }

    render() {
    return this._element;
}
}