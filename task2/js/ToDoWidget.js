import UIComponent from './UIComponent.js';

// Глобальный объект для хранения всех виджетов
window.todoWidgets = window.todoWidgets || {};

export default class ToDoWidget extends UIComponent {
    constructor(config = {}) {
        super({
            title: config.title || 'Список дел',
            id: config.id
        });
        
        this.tasks = config.tasks || [];
        this.widgetId = this.id;
        
        // Регистрируем виджет глобально
        window.todoWidgets[this.widgetId] = this;
        
        this.init();
    }

    init() {
        this.render();
    }

    render() {
        const content = `
            <div class="todo-container">
                <div class="todo-input-container">
                    <input type="text" class="todo-input" placeholder="Добавить новую задачу..." 
                           onkeypress="if(event.key=='Enter') window.todoWidgets['${this.widgetId}'].addTask()">
                    <button class="todo-add-btn" type="button" 
                            onclick="window.todoWidgets['${this.widgetId}'].addTask()">
                        <i class="fas fa-plus"></i> Добавить
                    </button>
                </div>
                <ul class="todo-list">
                    ${this.tasks.map(task => `
                        <li class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                            <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}
                                   onchange="window.todoWidgets['${this.widgetId}'].toggleTask('${task.id}', this.checked)">
                            <span class="todo-text">${task.text}</span>
                            <button class="todo-delete-btn" type="button"
                                    onclick="window.todoWidgets['${this.widgetId}'].deleteTask('${task.id}')">
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

    addTask() {
        console.log('addTask вызван для виджета:', this.widgetId);
        
        const contentElement = this.getContentElement();
        const input = contentElement.querySelector('.todo-input');
        const text = input.value.trim();
        
        console.log('Текст задачи:', text);
        
        if (text) {
            const newTask = {
                id: Date.now(),
                text: text,
                completed: false
            };
            
            this.tasks.push(newTask);
            console.log('Задачи после добавления:', this.tasks);
            this.render();
            input.value = '';
        }
    }

    deleteTask(taskId) {
        console.log('deleteTask вызван для задачи:', taskId);
        this.tasks = this.tasks.filter(task => task.id !== parseInt(taskId));
        this.render();
    }

    toggleTask(taskId, completed) {
        console.log('toggleTask вызван для задачи:', taskId, completed);
        const task = this.tasks.find(task => task.id === parseInt(taskId));
        if (task) {
            task.completed = completed;
            this.render();
        }
    }
}