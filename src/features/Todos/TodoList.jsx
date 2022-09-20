import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import {selectVisibleTodos, toggleTodo, removeTodo, loadTodos, todosSelectors} from './todos-slice';


export const TodoList = () => {
  const activeFilter = useSelector(state => state.filter)
  const todos = useSelector(todosSelectors.selectAll); //выбираем все туду
  // теперь todos это две сущности, первая это массив с id тудушек, 
  // и вторая -  это объект entities где ключ - id туду, а значение - вся инфо о туду

  // чтобы мапить не по всем туду, а по фильтрованым нужно использовать метод selectVisibleTodos() и передать туда все туду и отфильтрованные
  const visibleTodos = selectVisibleTodos(todos, activeFilter); // теперь мапить по visibleTodos

  const dispatch = useDispatch();

  // реализация прелоудера и мониторинг ошибок
  const {error, loading} = useSelector(state => state.todos)

  useEffect(() => {
    const promise = dispatch(loadTodos())
    // вызов метода unwrap позволит использовать и базовый зен и ловить кетчем ошибки
    // вместо unwrap можно использовать unwrapResult из toolkit
    .then(unwrapResult)
    //.unwrap()
    // по окончанию загрузки всех туду выведем уведомление (используем беблиотеку react-toastify)
    .then(() => {
      toast('Все туду были загружены All todo were fetch') // на загрузку поставили для примера, лучше ставить на добавление туду
    }) // если не использовать unwrap то не зависимо от того будет ошибка или нет, мы попадаем в этот зен 
    .catch((err) => {
      // теперь, когда ошибка заходит в пейлоад, текст можно достать от туда
      toast(err)
    });

    // юзэффккт может возвращать функцию ретерн, которая отработает в момент розмантирования компонента
    // так мы можем отменить загрузку еще до того как мы получим ответ, тем сэкономим ресурсы пользователя, 
    // например когда он быстро переходит по страницам
    return () => {
      // если мы размонтируемся, то вызываем оборт у промиса
      promise.abort();
    }
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
      {/* если есть ошибка то отрисуем сообщение, которой появится в экшне*/}
      {error && <h2>{error}</h2>}
      {/* если есть загрузка т.е лоадин то отрисуем сообщение о загрузке, или паказываем прилоадер */}
      {loading === 'loading' && <h2>loading...</h2>}
      {/* если нет загрузки т.е айдл и если нет ошибки тогда отрисовуем туду */}
      {loading === 'idle' && !error && visibleTodos.map((todo) => (
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
