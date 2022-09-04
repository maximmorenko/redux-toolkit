import { createStore } from "redux";
import { createAction, nanoid, createReducer } from "@reduxjs/toolkit";

// action creators

// export const addTodo = (title) => ({
//   type: "ADD_TODO",
//   title
// });

export const addTodo = createAction('@@todos/ADD_TODO', (title) => ({
  // принимает строку константу и функцию
  // на выходе формируем объект с ключем пэйлоад
  payload: {
    title,
    id: nanoid(),
    completed: false,
  },
})); 
console.log(addTodo); // func
console.log(addTodo()); //payload: undefined  //type: "@@todos/ADD_TODO"
console.log(addTodo('hello')); //payload: 'hello'  //type: "@@todos/ADD_TODO"
console.log(addTodo.toStping()); // @@todos/ADD_TODO 

export const removeTodo = createAction('@@todos/REMOVE_TODO');
export const toggleTodo = createAction('@@todos/TOGGLE_TODO');
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
const todos = createReducer([], {
  // ключи єто наши типы экшнов, помещаем их в квадратные скобки, этим получим строку (его тип)
  // а значения это такие же функции как в варианте с билдером
  [addTodo]: (state, action) => {state.push(action.payload)},
  [toggleTodo]: (state, action) => {
      const id = action.payload;
      const todo = state.find(todo => todo.id === id);
      todo.completed = !todo.completed;
    },
  [removeTodo]: (state, action) => {
      const id = action.payload;
      return state.filter(todo => todo.id !== id);
    },
});


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

export const store = createStore(todos);
