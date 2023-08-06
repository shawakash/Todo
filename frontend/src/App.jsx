import { useEffect, useState } from 'react'
import './App.css'
import Todo from './components/Todo'

function App() {
  const baseUrl = 'http://localhost:3000';
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch(`${baseUrl}/todos`, {
      method: "GET",
      headers: {
        "Content-type": "application/json"
      }
    }).then(response => response.json())
    .then(data => setTodos(Object.keys(data).map(obj => data[obj])))
    .catch(err => console.error(err));
  }, [])

  return (
    <>
      <div className="todos flex gap-5 flex-wrap mt-7 ">  
      {todos.map((todo) => {
        return <Todo key={todo.id} todo={todo} />
      })}
    </div>
    </>
  )
}

export default App
