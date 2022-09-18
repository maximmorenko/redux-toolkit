# [Redux Toolkit на примере todo list DEMO](https://maximmorenko.github.io/redux-toolkit/)

## Сущности Redux Toolkit

### Метод createAction()
- консттанты встроены в метод
- принимает строку константу
- все данные передаются через пэйлоуд
- чтобы достать тип экшна (константу) из криэйтЭкшна, нужно добавить метод toStping()

- вторым параметром криэйтора является функция подготовки объекта криейтора
- на входе функция принимает наш пэйлоад (строку) а на выходе формируем объект с ключем пэйлоад и значением ключа будет объект со строкой на входе и id. значение id берем из метода nanoid(), который импортируем из toolkit

### Метод createReducer()
- без использования switch
- в метод встроенная библиотека immer (позвобяет писать имутабельный код как мутабельный)
- т.е мы копировали стейт (массив) и после этого добавлели в него елементы, оставляя стейт нетронутым, с бибилиотекой иммер этого можно не делать
- основной принцип это мутирование стейта, если используем методы (мап, фильтр) то делем return для мутации стейта.
- есть два способа реализации createReducer:
- первый это использование функции builder и addCase.
- второй - с объектом

### Метод createSlice() 
- содержит в себе методы криейтЭкшн и криейтРедюсер

### Метод configureStore()
- вместо метода криейт стор

### Добавляем Мидлвейр (логер)
- npm i redux-logger

### Dependencies
- immer
- redux
- redux-thank
- reselect

### Синхронизация Redux и localStorage с redux-persist
- npm i redux-persist

# RTK Async Thunk

- Метод createAsyncThunk
- Использование extraReducers для обработки асинхронной логики
- Дополнительные возможности для UI
- Обработка ошибок
- Отмена запросов
- Метод createEntityAdapter

### Локальный сервер
чтобы работать без ограничений с https://jsonplaceholder.typicode.com/ воспользуемся локальным сервером 
- установим некоторые зависимости разработчика devDependencies
- это позволит после запуска npm start запустить json-server на порту 3001
## установка и запуск локалльного сервера
## [Локальный сервер для проектов и тестирования](https://www.youtube.com/watch?v=odwOkxkmVH8)
- npm i -D json-server
- в корне src создаем файл с даннми db.json и копируем в него нужные данные с jsonplaceholder
- в данном случае это todos
- в поле script файла package.json добавлеем директорию "server": "json-server -w server/db.json -p 3001" (путь на наш созданый файл с данными, и указываем порт 3001)
- npm i -D concurrently@7.0.0
## Экстра редюсер
- создаем санк (в нем делаем запрос возвращаем результат)
- обработка полученых данных и ошибок происходит в єкстра редюсере

## Библиотека ract-toastify
- npm i react-toastify
- предназначена для всплывающих подсказок UI
- вложеные стили 'react-toastify/dist/ReactToastify.css'