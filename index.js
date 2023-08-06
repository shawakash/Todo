/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());
// to allow fetch request from any url or else only same url as of backend 
// would be able to fetch the request


// const readFile = () => {
//   fs.readFile("todo.json", "utf-8", (err, data) => {
//     if(!err) {
      
//     }
//   })
// }

const fileUpdate = (files) => {
  fs.writeFileSync("todos.json", files, (err) => {
    if(err) {
      console.log(err);
      return;
    }
  })
}

function findIndex(obj, id) {
  for (let i of Object.keys(obj)) {
    if (obj[i].id === id) return i;
  }
  return -1;
}

function removeAtIndex(obj, index) {
  let newArray = {};
  for (let i of Object.keys(obj)) {
    if (obj[i].id != index) newArray[i] = obj[i];
  }
  return newArray;
}

app.get("/", (req, res) => {
  return res.sendFile(`${__dirname}/index.html`, (err) => {
    if(err) throw err;
  })
})

app.get('/todos', (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    res.json(todos);
  })
});

app.get('/todos/:id', (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if(err) throw err;
    const todos = JSON.parse(data);
    if(Object.keys(todos).length == 0) {
      return res.status(404).send();
    }
    const todoIndex = findIndex(todos, parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      res.json(todos[todoIndex]);
  }
  })
  
});

app.post('/todos', (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 1000000), // unique random id
    title: req.body.title,
    description: req.body.description
  };
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    let todos = {};
    if(data != ''){
      todos = JSON.parse(data);
    } 
    todos[newTodo.id] = newTodo;
    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if (err) throw err;
      return res.status(201).json(newTodo);
    });
  });
});

app.put('/todos/:id', (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if(err) throw err;
    let todos = JSON.parse(data);
    const todoIndex = findIndex(todos, parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      todos[todoIndex].title = req.body.title;
      todos[todoIndex].description = req.body.description;
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if(err) throw err;
        res.json(todos[todoIndex]);
      })
  }
  })
  
});

app.delete('/todos/:id', (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if(err) throw err;
    let todos = JSON.parse(data);
    const todoIndex = findIndex(todos, parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      todos = removeAtIndex(todos, todoIndex);
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if(err) throw err;
        res.status(200).send();

      })
    }
  })
  
});


// app.get("/todos/save", (req, res) => {
//   fileUpdate(JSON.stringify({...todos}));
//   return res.send("Got it")
// })

// for all other routes, return 404
app.use((req, res, next) => {
  res.status(404).send();
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})

