import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';

import {resetToDefault} from '../Reset/reset-action';

// создаем адаптер
const todosAdapter = createEntityAdapter({
  // принимает две настройки в виде объекта
  // в первой (selectId) нужно указать какое поле указывае на нужный id
  selectId: (todo) => todo.id,
  // во второй () нужно указать поле по которому бубут сортироваться елементы, например по title (это поле необязательно)
  //sortComparer: (todo) => todo.title,
});

// создадим новый санк для получения всех туду с сервера
export const loadTodos = createAsyncThunk(
  '@@todos/load-all',
  // второй способ обработки ошибок
  async (_, {
    rejectWithValue,
    extra: api, //достанем екстра параметр и переименуем в апи
  }) => {
    // на входе два параметра, первый - строка из UI, в данном случае пропуск
    // второй - thankAPI объект, в котором одно из полей rejectWithValue (с помощью него можно генерировать ошибку)
    // чтобы воспользоваться rejectWithValue нужно использовать конструкцию трай кетч
    try {
      // попытайся (try) сделать это:
      return api.loadTodos();
    } catch (err) {
      // если не получится, то поймай (catch) ошибку и верни вызов хелпера передав в него конкретную ошибку rejectWithValue(err)
      return rejectWithValue('Failed to fetch all todos.');
    }
  },
  // createAsyncThunk можетпринимать третий параметр (опции)
  {
    // ctrl + пробел покажет весь список опций, нам нужен condition
    // значение у кондишн - это функция , которая также как и санк принимает два парамметра, первый - строка из UI, второй - объект с полями getState & extra
    condition: (_, {getState, extra}) => {
      // достанем из стейта туду ключ лоадинг и будем его проверять
      const {loading} = getState().todos;
      if (loading === 'loading') {
        // если лоадинг === лоадинг то запрос не нужно делать.
        // єто на тот случай если пользователь либо дважды кликнет, либо сделает другую операцию трубующую загрузки уже загружающегося стора
        return false;
      }
    },
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
  async (title, {extra: api}) => {
    return api.createTodo(title)
  }
);

// создадим новый санк для переключения туду на завершенные 
export const toggleTodo = createAsyncThunk(
  '@@todos/toggle-todo',
  async (id, {getState, extra: api}) => {
    const todo = getState().todos.entities.find(item => item.id === id);

    return api.toggleTodo(id, {completed: !todo.completed});
  }
);

// создадим санк удаления туду
export const removeTodo = createAsyncThunk(
  '@@todos/remove-todo',
  async (id, {extra: api}) => {
    return api.removeTodo(id);
  }
);

const todoSlice = createSlice({
  name: '@@todos',
  // на момент создания слайса мы будем по другому гененировать стейт
  // по умолчанию єто будет пустой массив entities: [], необходимые значения будет добавлять вручную в веде объекта
  initialState: todosAdapter.getInitialState({
    loading: 'idle',
    error: null,
  }),
  
  
  // {
  //   // чтобы воспользоваться ключами-экшнами из этого санка в экстра редюсере
  //   entities: [], // наши туду
  //   loading: 'idle', // поу молчанию бездействующий (idle), также может быть 'loading'
  //   error: null,
  // },
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
        // теперь загружаем все туду через адаптер с помощью метода addMany, вызываем его и передаем пейлоад в стейт
        todosAdapter.addMany(state, action.payload)
        // state.entities = action.payload;
        state.loading = 'idle'; // также укажем что загрузка закончилась
      })
      // если все норм и туду создано, то обрабатываем экшн фулфилд
      .addCase(createTodo.fulfilled, (state, action) => {
        // для создания одного туду используем метод addOne и передаем в него текущий стейт и пейлоад
        todosAdapter.addOne(state, action.payload)
        // state.entities.push(action.payload)
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
      // проверяем окончание action.type, если оно = pending, то для вех этих экшнов выполняется одно и то же действие
      .addMatcher((action) => action.type.endsWith('/pending'), (state, action) => {
        state.loading = 'loading';
        state.error = null;
      }) 
      // случай с ошибкой
      .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
        state.loading = 'idle';
        //state.error = action.error.message; // достанем текст ошибки из экшна
        // если мы используем подход с rejectWithValue(err), то текст ошибки должны доставать из пейлоада
        state.error = action.payload || action.error.message; // если в пейлоаде что-то есть, то берем ошибку от туда, если нет, то из экшна
      })
      // случай с fulfilled
      .addMatcher((action) => action.type.endsWith('/fulfilled'), (state, action) => {
        state.loading = 'idle';
      })
  }
});
//export const {removeTodo} = todoSlice.actions;

export const todoReducer = todoSlice.reducer;
// чтобы выбрать нужные значения из текущего стейта воспользуемся методом адаптера getSelectors
// и передаем в метод путь к ветке для нужных значений (в какой ветке стейта искать нужные значения)
export const todosSelectors = todosAdapter.getSelectors(state => state.todos);
// теперь todosSelectors имеет пять методов выборки
// todosSelectors.selectAll(); // выбрать всё
// todosSelectors.selectById(); // выбрать по id
// todosSelectors.selectEntities();
// todosSelectors.selectIds();
// todosSelectors.selectTotal(); // выбрать общее кол-во

export const selectVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'all': {
      return todos; // теперь туду достаем из todos
    }
    case 'active': {
      return todos.filter(todo => !todo.completed); // теперь туду достаем из todos
    }
    case 'completed': {
      return todos.filter(todo => todo.completed); // теперь туду достаем из todos
    }
    default: {
      return todos;
    }
  }
}
