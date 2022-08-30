const taskForm = document.querySelector('#taskForm');

const taskInput = document.querySelector('#taskText');

const taskList = document.querySelector('#todoList');

const emptyList = document.querySelector('#emptyList');

const clearAllBtn = document.querySelector('#clearAll');

const saveAllBtn = document.querySelector('#saveAll');

// События отправки формы в которм есть данные о дабавляемой задаче
taskForm.addEventListener("submit", onTaskAdd);

// Событие клика по кнопке "Done"
taskList.addEventListener("click", onTaskComplete);

// Событие клика по кнопке "Delete"
taskList.addEventListener("click", onTaskDelete);

// Событие клика по кнопке c id="clearAll"
clearAllBtn.addEventListener("click", removeAllFromLS)

saveAllBtn.addEventListener("click", saveAlltoTxt)

// Создаём пустой массив в котором будем собирать добавленные задачи
const tasks = [];

// Проверяем есть ли данные в localStorage
if (localStorage.getItem("tasks")) {
  // Если есть парсим данные (преобразование JSON-строки в обычный JS формат данных)
  const tasksFromLS = JSON.parse(localStorage.getItem("tasks"));

  // Спарсенные данные (массив) добавляем по отдельности (извлекая из массива) в наш массив tasks
  tasks.push(...tasksFromLS);

  // Формируем элемент списка задач и добавляем в разметку каждый элемент полученный из localStorage
  tasks.forEach(task => renderTask(task))
}

// Проверяем нужно ли отображать/убирать "Список задач пуст"
checkEmpty();

// Функция добавления задачи
function onTaskAdd(evt) {
  // Предотвращаем дефолтное поведение браузера (перезагрузку) при срабатывании события submit
  evt.preventDefault();

  // Получаем текст поля ввода
  const taskText = taskInput.value;

  // Если значение поля ввода пустое (""), то функция прекратит дальнейшее выполнение
  if (!taskText.trim()) return;

  // Формируем данные для массива в виде объекта
  const task = {
    id: Date.now(),
    text: taskText,
    done: false,
  }

  // Добавляем объект в массив
  tasks.push(task);

  // Сохраняем изменения массива в localStorage
  saveToLS();

  // Формируем элемент списка задач и добавляем в разметку
  renderTask(task);

  // Очищаем текст поля ввода
  taskInput.value = "";

  // Ставим фокус в поле ввода для облегчения добавления следующих задач
  taskInput.focus();

  // Проверяем нужно ли отображать/убирать "Список задач пуст"
  checkEmpty();
}

function onTaskComplete(evt) {
  // Если значение атрибута data-action НЕ "done", то функция прекратит дальнейшее выполнение
  if (evt.target.dataset.action !== "done") return;

  // Находим элемент в котором находился нажатая кнопка с атрибутом data-action="done"
  const parentNode = evt.target.closest(".list-group-item");

  // Извлекаем значение атрибута id у найденного элемента и сохраняем его преобразовав в число
  const taskId = parseInt(parentNode.id);

  // Находим элемент массива, id которого равна значению атрибута id найденного элемента
  const task = tasks.find(function (task) {
    if (task.id === taskId) {
      return task;
    }
  });
  // Изменяем значение ключа done найденного элемента в его обратное
  task.done = !task.done;

  // Сохраняем изменения массива в localStorage
  saveToLS();

  // Удаляем/добавляем классы, которые нужны для понимания задача выполнена или нет
  parentNode.classList.toggle("bg-light");
  parentNode.classList.toggle("text-decoration-line-through");
  parentNode.classList.toggle("text-secondary");
}

function onTaskDelete(evt) {
  // Если значение атрибута data-action НЕ "delete", то функция прекратит дальнейшее выполнение
  if (evt.target.dataset.action !== "delete") return;

  // Находим элемент в котором находился нажатая кнопка с атрибутом data-action="delete"
  const parentNode = evt.target.closest(".list-group-item");

  // Извлекаем значение атрибута id у найденного элемента и сохраняем его преобразовав в число
  const taskId = parseInt(parentNode.id);

  // Находим индекс элемента массива, id которого равна значению атрибута id найденного элемента разметки
  const taskIndex = tasks.findIndex(function (task) {
    if (task.id === taskId) {
      return true;
    }
  });

  // Удаляем элемент массива по его индексу
  tasks.splice(taskIndex, 1);

  // Удаляем найденный элемент из разметки
  parentNode.remove();

  // Сохраняем изменения массива в localStorage
  saveToLS();
  // Проверяем нужно ли отображать "Список задач пуст"
  checkEmpty();
}

function saveToLS() {
  // Ключу "tasks" (новому или существующему) локального хранилища передаём текущее состояние массива
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeAllFromLS() {
  // Готовим сообщение диалогового окна подтверждения
  const alertMsg = "Данные приложения полностью очистится. Это действие нельзя будет отменить. Вы уверены?"
  // Проверяем был ли дано согласие
  if (confirm(alertMsg)) {
    // Если дан - удаляем из локального хранилища ключ "tasks", в котором хранится данные нашего приложения
    localStorage.removeItem("tasks");

    // Обновляем страницу чтобы из разметки также исчезли все задачи
    document.location.reload();
  }
}

function saveAlltoTxt() {
}

function checkEmpty() {
  // Формируем HTML разметку для "Список задач пуст"
  const emptyListHTML = `
        <li id="emptyList"
          class="list-group-item d-flex flex-column gap-2 align-items-center justify-content-center py-3">
          <img src="images/icons8_delete_document_480px_1.png" width="64">
          <span class="lead">Список задач пуст</span>
        </li>`;

  // Если массив пустой добавляем HTML-разметку "Список задач пуст"
  if (tasks.length === 0) {
    taskList.insertAdjacentHTML("afterbegin", emptyListHTML)
  }

  // Если массив не пустой
  if (tasks.length > 0) {
    // Попытаемся найти элемент c id="emptyList"
    const emptyListEl = taskList.querySelector("#emptyList");
    // Если найден - удаляем, если нет, то ничего не делаем
    if (emptyListEl) {
      // Удаляем найденный элемент
      emptyListEl 
      ?.remove();
    }
  }

}

function renderTask(task) {
  // Формируем класс для элемента задач исходя из того является ли задача завершенным или нет
  const taskStatusClass = task.done ? "bg-light text-decoration-line-through text-secondary" : "";

  // Готовим HTML-код с подставкой полученного текста, которую вставим в разметку
  const taskHTML = `<li id="${task.id}" class="list-group-item d-flex gap-2 align-items-center ${taskStatusClass}" >
          ${task.text}
          <button data-action="done" class="ms-auto btn btn-sm btn-outline-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-check2-square" viewBox="0 0 16 16">
              <path
                d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z" />
              <path
                d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
            </svg>
          </button>
          <button data-action="delete" class="btn btn-sm btn-outline-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3"
              viewBox="0 0 16 16">
              <path
                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
            </svg> </button>
        </li>`;
  // Передаём HTML-код списку, опеределив его позицию в разметке как перед закрывающим тегом списка
  taskList.insertAdjacentHTML("beforeend", taskHTML);
}