let main = document.querySelector('.todo-app');
let list = document.querySelector('.todo-list');

let listItem = document.createElement('li');
listItem.innerHTML = `
<input type="checkbox" />
        <span>Example task JS</span>`;
list.appendChild(listItem);
main.append(list);

const newTodo = (text) => {
    preventDefault();
    console.log(text);
}