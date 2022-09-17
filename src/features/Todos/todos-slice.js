import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import {resetToDefault} from '../Reset/reset-action';

// создадим новый санк для получения всех туду с сервера
export const loadTodos = createAsyncThunk(
  '@@todos/load-all',
  async () => {
    const res = await fetch('http://localhost:3001/todos');
    // так как это гет запрос то доп параметров не нужно
    const data = await res.json();
    console.log(data);

    return data;
  }
);

// раньше создавали санк так:
//на первом уровне ждеди параметр из UI (title)
//на втором уровне на входе диспач, гетСтейт и экстра параметр
// export const createTodo = (title) => (dispatch, getState, _) => {
//   // асинхронная логика
// };

// теперь строим таким образом:
// вызываем функцию createAsyncThunk() и передаем ей два параметра
// первый параметр эно название екшна
// вторым параметром идет асинхронная функция, 
// которая на входе получает параметр из UI (title) 
//и thankAPI - объект из которокго можно достать dispatch, getState, экстра параметр
export const createTodo = createAsyncThunk(
  '@@todos/create-todo',
  async (title) => {
    // теперь нам диспатч не нужен
    const res = await fetch('http://localhost:3001/todos', {
      // так как это пост запрос то нужно передать дополнительные параметры
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title, completed: false})
    })
    const data = await res.json();
    //console.log(data);
    return data;
  }
);

// создадим новый санк для переключения туду на завершенные 
export const toggleTodo = createAsyncThunk(
  '@@todos/toggle-todo',
  async (id, {getState}) => {
    // на входе ждем id из UI и стейт,
    // в стейте найдем туду с id равным полученому id из вне
    const todo = getState().todos.entities.find(item => item.id === id);

    // фечем делаем запрос на сервер, ссылка динамическая с добавлением id, также добавим настройки
    const res = await fetch('http://localhost:3001/todos/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({completed: !todo.completed}), // в боди должно поменяться поле completed, поэтому передеем только его, 
      // остальные пропускаем. Оно должно поменяться на противоположное
    })
    const data = await res.json();
    //console.log(data);
    return data;
  }
)

// создадим санк удаления туду
export const removeTodo = createAsyncThunk(
  '@@todos/remove-todo',
  async (id) => {
    // на входе ждем id из UI
    // фечем делаем запрос на сервер, ссылка динамическая с добавлением id
    const res = await fetch('http://localhost:3001/todos/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    await res.json();
  
    return id;
  }
)

const todoSlice = createSlice({
  name: '@@todos',
  initialState: {
    // чтобы воспользоваться ключами-экшнами из этого санка в экстра редюсере
    entities: [], // наши туду
    loading: 'idle', // поу молчанию бездействующий (idle), также может быть 'loading'
    error: null,

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetToDefault, () => {
        return []
      })
      // санк, как объект, помимо вех его свойств, имеет ключи-события: (pending, rejected, fulfilled)
      // это три разных экшина, которые мы можем добавить и обработать
      // при событие пендинг (т.е инициирование запроса) обновляем стейт
      // так как прелоадер бульше нужен при загрузке всех туду, по этому заменим санк создания туду на загрузки всех туду
      .addCase(loadTodos.pending, (state, action) => {
        state.loading = 'loading';
        state.error = null;
      })
      // если санк вызвал ошибку, то обралатываем событие rejected
      .addCase(loadTodos.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = 'something went wrong'; // выводим сообщение
      })
      // добавим кейс при событи удачной загрузки всех туду
      .addCase(loadTodos.fulfilled, (state, action) => {
        state.entities = action.payload;
        state.loading = 'idle'; // также укажем что загрузка закончилась
      })
      // если все норм и туду создано, то обрабатываем экшн фулфилд, пушим пэйлоад в стейт
      .addCase(createTodo.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      // добавим кейс на событие тугл
      .addCase(toggleTodo.fulfilled, (state, action) => {
        // достанем из пецлоад обновленный туду
        const updatedTodo = action.payload;

        const index = state.entities.findIndex(todo => todo.id === updatedTodo.id);
        state.entities[index] = updatedTodo;
      })
      // кейс на удаление туду
      .addCase(removeTodo.fulfilled, (state, action) => {
        // перезапишим ентитис в стейте
        // и отфильтруем, проверим айди каждого елемената на равенство с удаленным в action.payload
        state.entities = state.entities.filter(todo => todo.id !== action.payload)
      })
  }
});
//export const {removeTodo} = todoSlice.actions;

export const todoReducer = todoSlice.reducer;


export const selectVisibleTodos = (state, filter) => {
  switch (filter) {
    case 'all': {
      return state.todos.entities; // теперь туду достаем из энтитис
    }
    case 'active': {
      return state.todos.entities.filter(todo => !todo.completed); // теперь туду достаем из энтитис
    }
    case 'completed': {
      return state.todos.entities.filter(todo => todo.completed); // теперь туду достаем из энтитис
    }
    default: {
      return state.todos;
    }
  }
}
