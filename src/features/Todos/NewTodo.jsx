import { useDispatch } from "react-redux";

import {createTodo} from './todos-slice'; //подключим наш санк

export const NewTodo = () => {
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();

    // проверим что в ивент таргите что-то есть
    if (event.target.title.value) {
      dispatch(createTodo(event.target.title.value));
      event.target.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="new todo" />
      <input type="submit" value="Add Todo" />
    </form>
  );
};