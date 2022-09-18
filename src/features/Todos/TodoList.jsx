import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import {selectVisibleTodos, toggleTodo, removeTodo, loadTodos} from './todos-slice';


export const TodoList = () => {
  const activeFilter = useSelector(state => state.filter)
  const todos = useSelector(state => selectVisibleTodos(state, activeFilter));
  const dispatch = useDispatch();

  // реализация прелоудера и мониторинг ошибок
  const {error, loading} = useSelector(state => state.todos)

  useEffect(() => {
    dispatch(loadTodos())
    // вызов метода unwrap позволит использовать и базовый зен и ловить кетчем ошибки
    // вместо unwrap можно использовать unwrapResult из toolkit
    .then(unwrapResult)
    //.unwrap()
    // по окончанию загрузки всех туду выведем уведомление (используем беблиотеку react-toastify)
    .then(() => {
      toast('Все туду были загружены All todo were fetch') // на загрузку поставили для примера, лучше ставить на добавление туду
    }) // если не использовать unwrap то не зависимо от того будет ошибка или нет, мы попадаем в этот зен 
    .catch(() => {
      toast('ERRRRRORRRRR')
    });
  }, [dispatch])

  return (
    <>
    <ToastContainer 
      position="top-center"
      autoClose={3000}
      theme="dark" 
    />
    <ul>
      {/* добавим условия*/}
      {/* если есть ошибка то отрисуем сообщение */}
      {error && <h2>Error!</h2>}
      {/* если есть загрузка т.е лоадин то отрисуем сообщение о загрузке, или паказываем прилоадер */}
      {loading === 'loading' && <h2>loading...</h2>}
      {/* если нет загрузки т.е айдл и если нет ошибки тогда отрисовуем туду */}
      {loading === 'idle' && !error && todos.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
          />{" "}
          {todo.title}{" "}
          <button onClick={() => dispatch(removeTodo(todo.id))}>delete</button>
        </li>
      ))}
    </ul>
    </>
  );
};
