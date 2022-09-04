import { useSelector, useDispatch } from "react-redux";
import { addTodo, removeTodo, selectVisibleTodos, setFilter, toggleTodo, resetToDefault } from "./store";

export default function App() {
  return (
    <div className="App">
      <h1>Hello Redux Todo</h1>
      <NewTodo />
      <FilterTodo />
      <TodoList />
      <ResetApp />
    </div>
  );
}

const ResetApp = () => {
  const dispatch = useDispatch();
  return (
    <button onClick={()=>dispatch(resetToDefault())}>reset</button>
  )
}

const NewTodo = () => {
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addTodo(event.target.title.value));
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="new todo" />
      <input type="submit" value="Add Todo" />
    </form>
  );
};

const TodoList = () => {
  const activeFilter = useSelector(state => state.filter)
  const todos = useSelector(state => selectVisibleTodos(state, activeFilter));
  const dispatch = useDispatch();

  return (
    <ul>
      {todos.map((todo) => (
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
  );
};

const FilterTodo = () => {
  const dispatch = useDispatch();
  const activeFilter = useSelector(state => state.filter);

  const handleFilter = (val) => dispatch(setFilter(val));

  return (
    <div>
      <button 
        style={{
          backgroundColor: activeFilter === 'all' ? 'peru' : 'lightgray',
        }}
        onClick={() => handleFilter('all')}>all</button>
      <button 
        style={{
          backgroundColor: activeFilter === 'active' ? 'peru' : 'lightgray',
        }}
        onClick={() => handleFilter('active')}>active</button>
      <button 
        style={{
          backgroundColor: activeFilter === 'completed' ? 'peru' : 'lightgray',
        }}
        onClick={() => handleFilter('completed')}>completed</button>
    </div>
  );
}
