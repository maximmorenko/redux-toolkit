import { createStore } from "redux";
import { nanoid, createSlice, configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger';

// action creators

// export const addTodo = (title) => ({
//   type: "ADD_TODO",
//   title
// });

// export const addTodo = createAction('@@todos/ADD_TODO', (title) => ({
//   // принимает строку константу и функцию
//   // на выходе формируем объект с ключем пэйлоад
//   payload: {
//     title,
//     id: nanoid(),
//     completed: false,
//   },
// })); 
// console.log(addTodo); // func
// console.log(addTodo()); //payload: undefined  //type: "@@todos/ADD_TODO"
// console.log(addTodo('hello')); //payload: 'hello'  //type: "@@todos/ADD_TODO"
// console.log(addTodo.toStping()); // @@todos/ADD_TODO 

// export const removeTodo = createAction('@@todos/REMOVE_TODO');
// export const toggleTodo = createAction('@@todos/TOGGLE_TODO');

// export const removeTodo = (id) => ({
//   type: "REMOVE_TODO",
//   id
// });
// export const toggleTodo = (id) => ({
//   type: "TOGGLE_TODO",
//   id
// });


// - есть два способа реализации createReducer:
// - первый это использование функции builder и addCase.
// - второй - без функции

// способ с использованием builder и addCase:

// createReducer принимает два параметара: 
// первый это дефолтное значение стора []
// второй - объект, либо билдер builderCallback

// const todos = createReducer([], (builder) => {
//   // на входе билдерКолбєк принимает билдер от редакса
//   // и на базе это билдера создаем конкретные случаи
//   // addCase() добавляет єкшн, с двумя параметрами: 
//   // первый - текущий экшн
//   // второй - анонимная функция, с параметрами state & action
//   builder
//     .addCase(addTodo, (state, action) => {
//       // раньше мы создавали новый массив, копировали в него текущий стейт и добавляли или правили какой-то елемент
//       // теперь этого не нужно делать, теперь этот процесс мутабельный
//       // берем стейт, который зашел в редюсер и пушим в него пэйлоад экшна
//       // можно предварительно поместить action.payload в константу, и передавать уже ее
//       state.push(action.payload)
//     })
//     .addCase(toggleTodo, (state, action) => {
//       // нам нужен id выбраного туду для переключения completed, достанем его из пєйлоад
//       const id = action.payload;
//       // тепреь найдем туду в стейте(массив туду), у которой id равен id из єкшна
//       const todo = state.find(todo => todo.id === id);
//       // делаем инверсию комплитед
//       todo.completed = !todo.completed;
//     })
//     .addCase(removeTodo, (state, action) => {
//       // нам нужно отфильтровать стейт, оставить в нем только те туду, в которых id не равен id из єкшна
//       // достанем id из пєйлоад
//       const id = action.payload;
//       // при исмолььзовании методов filter, map стейт не будет мутироваться, 
//       // для мутирования стейта нужно выполнить return
//       return state.filter(todo => todo.id !== id);
//     })
// });


// второй способ без функции, с использованием объекта
// const todos = createReducer([], {
//   // ключи єто наши типы экшнов, помещаем их в квадратные скобки, этим получим строку (его тип)
//   // а значения это такие же функции как в варианте с билдером
//   [addTodo]: (state, action) => {state.push(action.payload)},
//   [toggleTodo]: (state, action) => {
//       const id = action.payload;
//       const todo = state.find(todo => todo.id === id);
//       todo.completed = !todo.completed;
//     },
//   [removeTodo]: (state, action) => {
//       const id = action.payload;
//       return state.filter(todo => todo.id !== id);
//     },
// });


// вариант редюсера без toolkit
// const todos = (state = [], action) => {
//   switch (action.type) {
//     // вместо константы (тип экшна) теперь используем криэйтЭкшн 
//     // приведенный к строке через метод toStping()
//     case addTodo.toStping(): {
//       return [
//         ...state,
//         {
//           ...action.payload
//         }
//       ];
//     }
//     case removeTodo.toStping(): {
//       return state.filter((todo) => todo.id !== action.payload);
//     }
//     case toggleTodo.toStping(): {
//       return state.map((todo) =>
//         todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
//       );
//     }
//     default: {
//       return state;
//     }
//   }
// };


// метод createSlice
// подразумевает создание редюсера без использования методов криэйтЭкшн и криэйт Редюсер

// const todoSlice = createSlice({
//   // содержит объект настроек (три обязательных поля и одно необязательное)
//   // обязательное поле name, это наш домен по которому мы определяем путь экшнов @@todos
//   name: '@@todos',
//   // обязательное поле initialState 
//   initialState: [],
//   // обязательное поле редьюсеры
//   // каждый редюсер это функция, которая знает что такое стейт и экшн. и манипулирует ими
//   reducers: {
//     // редюсер может быть функцией, а может быть объектом, в котором редюсер и функция подготовки редюсера.
//     // например:
//     // редюсер - объект:
//     addTodo: {
//       reducer: () => (state, action) => {
//         state.push(action.payload)
//       },
//       // функция подготовки
//       prepare: (title) => ({
//         payload: {
//           title,
//           id: nanoid(),
//           completed: false,
//         },
//       }),
//     },
//     // редюсер функция:
//     removeTodo: (state, action) => {
//       const id = action.payload;
//       return state.filter(todo => todo.id !== id);
//     },
//     toggleTodo: (state, action) => {
//       const id = action.payload;
//       const todo = state.find(todo => todo.id === id);
//       todo.completed = !todo.completed;
//     },
//   },
//   // четвертое поле это экстраРедюсер (необязательный) здесь набор редюсеров вне домена '@@todos' (если такие есть)
//   // работает как с билдером, первый способ createReducer
//   // так и с объектом экшнов, второй способ createReducer
//   // extraReducers: (builder) => {
//   //   builder
//   //    .addCase()
//   // },
//   // либо 
//   // extraReducers: {
//     // [addTodo]: (state, action) => {state.push(action.payload)},
//   // },
// });



const todoSlice = createSlice({
  name: '@@todos',
  initialState: [],
  reducers: {
    addTodo: {
      reducer: (state, action) => {
        state.push(action.payload)
      },
      prepare: (title) => ({
        payload: {
          title,
          id: nanoid(),
          completed: false
        }
      })
    },
    removeTodo: (state, action) => {
      const id = action.payload;
      return state.filter((todo) => todo.id !== id);
    },
    toggleTodo: (state, action) => {
      const id = action.payload;
      const todo = state.find((todo) => todo.id === id);
      todo.completed = !todo.completed;
    },
  },
});
// во внешнем мире могут понадобиться  єкшны, достанем их из слайса
export const {addTodo, removeTodo, toggleTodo} = todoSlice.actions;

// в стор передаем редюсер из слайса
// export const store = createStore(todoSlice.reducer);

// Метод configureStore()
// основное отличие от createStore то, что не нужно передавать три параметра, передаем объект настроек
// с обязательным ключем редюсер
export const store = configureStore({
  reducer: todoSlice.reducer,
  // также можно передать комбаин или сделать его самостоятельно:
  // reducer: {
  //   todos: todoSlice.reducer,
  //   users,
  // }

  // также можно передать (включить девтулс) указав true
  devTools: true,

  // Подключение милдвейр
  // для подключение мидл вейра нужно сделать конкэт к дефолтному массиву мыдлверов
  // по умолчанию они хранятся в getDefaultMiddlware
  // подключим логер:
  middleware: (getDeafaultMiddlware) => getDeafaultMiddlware().concat(logger),
  // также можно загрузить стейт по умолчанию:
  preloadedState: [], // оставим пока пустой
  enhancers: [], // для внешних дополнительных библиотек есть ключ енхенсер
})
