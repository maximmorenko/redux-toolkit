import { createStore } from "redux";
import { createAction, nanoid } from "@reduxjs/toolkit";

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


const todos = (state = [], action) => {
  switch (action.type) {
    // вместо константы (тип экшна) теперь используем криэйтЭкшн 
    // приведенный к строке через метод toStping()
    case addTodo.toStping(): {
      return [
        ...state,
        {
          ...action.payload
        }
      ];
    }
    case removeTodo.toStping(): {
      return state.filter((todo) => todo.id !== action.payload);
    }
    case toggleTodo.toStping(): {
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    }
    default: {
      return state;
    }
  }
};

export const store = createStore(todos);
