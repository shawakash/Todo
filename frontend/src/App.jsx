import { useEffect, useRef, useState } from 'react'
import './App.css'
import Todo from './components/Todo'
const baseUrl = 'http://localhost:3000';

// Custom Hooks
const useTodo = () => {
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
    
    setInterval(() => {
      fetch(`${baseUrl}/todos`, {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      }).then(response => response.json())
        .then(data => setTodos(Object.keys(data).map(obj => data[obj])))
        .catch(err => console.error(err));
    }, 1000);
  }, []);

  return todos;
}


function App() {
  // const [todos, setTodos] = useState([]);
  const todos = useTodo();
  const [disabled, setDisable] = useState(0);
  // useEffect(() => {
  //   fetch(`${baseUrl}/todos`, {
  //     method: "GET",
  //     headers: {
  //       "Content-type": "application/json"
  //     }
  //   }).then(response => response.json())
  //     .then(data => setTodos(Object.keys(data).map(obj => data[obj])))
  //     .catch(err => console.error(err));
  // }, [])
  const titleRef = useRef(null);
  const desRef = useRef(null);

  const handleCreate = (e) => {
    e.preventDefault();
    const title = titleRef.current.value;
    const description = desRef.current.value;
    setDisable(1);
    fetch(`${baseUrl}/todos`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({ title, description })
    }).then(response => response.json() )
      .then(data => {
        // setTodos((pretodos) => [...pretodos, data]);
        setDisable(0);
      })
  }

  const handleDelete = (id) => {
    setDisable(1);
    fetch(`${baseUrl}/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json"
      }
    }).then(response => {
      if(response.status == 404) {
        alert("Internal Sever Error");
        window.location.reload();
        return;
      }
      if(response.status == 200) {
        // setTodos((preTodos) => {
        //   const update = preTodos.filter(pretodo => pretodo.id != id);
        //   return update;
        // })
        alert("Delete Successfully");
        setDisable(0);
        return;
      }
    })
  }
  return (
    <>
      <div className="flex flex-col items-center m-0">
        <div className="flex flex-col gap-y-6 bg-black bg-opacity-95 rounded-2xl w-fit h-fit p-10 shadow-sm drop-shadow-xl hover:shadow-white transition-shadow ease-in-out delay-100">
          <h1 className='font-mono text-4xl font-bold tracking-wide'>Create a New Todo</h1>
          <div id="postForm" className='flex flex-col gap-y-4 px-4'>
            <input ref={titleRef} type="text" id="title" className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500" name="title" placeholder='Title' required maxLength="50" />
            <textarea ref={desRef} id="description" className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500" name="description" rows="3" placeholder='Description' required></textarea>
            <button type="submit" onClick={handleCreate} className='transition ease-in-out delay-100 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300' disabled={disabled}>Create</button>
          </div>
        </div>
        <div className="todos flex gap-5 flex-wrap mt-7 items-end justify-center">
          {todos.map((todo) => {
            return <Todo key={todo.id} todo={todo} delete={handleDelete} />
          })}
        </div>
      </div>
    </>
  )
}

export default App
