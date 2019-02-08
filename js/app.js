var todoList = {
  todos : [],

  addTodo: function(todoName, array){
    array.push({
      todoName: todoName,
      completed:false,
      children: [],
    })
  },
  editTodo: function(todo, newTodoName){
    todo.todoName = newTodoName;
  },
  deleteTodo: function(indexOfTodo, array){
    array.splice(indexOfTodo,1);
  },
  toggleTodo: function(todo){
    todo.completed = !todo.completed
  },
  toggleAll: function(){
    //checks if any of the todos are false
    var aTodoIsFalse = this.todos.find(function(value){
      return value.completed === false
    });
    //if atleast one todo is false, set all of the todos to true
    if(aTodoIsFalse){
      todoList.todos.forEach(function(value){
        value.completed = true;
      });
    }
    else{
      todoList.todos.forEach(function(value){
        value.completed = false;
      });
    }
  },
  clearCompleted: function(){
    for(var i=this.todos.length - 1; i >= 0; i--){
      if(this.todos[i].completed === true){
        todoList.deleteTodo(i);
      }
    }
  },
  clearAll: function(){
    this.todos=[];
  },
}

var handlers = {
  addTodo: function(){
    var todoInput = document.getElementById('add-todo-input');
    todoList.addTodo(todoInput.value, todoList.todos);
    todoInput.value = "";
    view.render();
  },
  clearCompleted: function(){
    todoList.clearCompleted();
    view.render();
  },
  clearAll: function(){
    todoList.clearAll();
    view.render();
  },
  toggleAll: function(){
    todoList.toggleAll();
    view.render();
  },
}

var view = {
  render: function(){
    var ul = document.getElementById("todo-list");
    ul.innerHTML = ""
    //inserts text for when there are no todos
    if(todoList.todos.length === 0){
      var noTodosP = document.createElement('p');
      noTodosP.textContent = "Looks like there are no more todos";
      ul.appendChild(noTodosP);
    }
      this.renderLi(todoList.todos, ul);
    //saves todos
    util.store('todoListData', todoList.todos)
  },
  renderLi: function(array, ulToAppendTo){
    for(var i=0; i<array.length; i++){
      this.createTodoLi(array[i],i,array,ulToAppendTo)
      if(array[i].children.length >0){
        var nestedUl = document.createElement('ul');
        ulToAppendTo.appendChild(nestedUl);
        this.renderLi(array[i].children, nestedUl);
      }
    }
  },
  createTodoLi: function(todo,indexOfTodo, array, ulToAppendTo){
    var todoLi = document.createElement("li")
    var todoTextP = document.createElement('p')
    todoTextP.textContent = todo.todoName;
    todoTextP.id = indexOfTodo + 'p'
    if(todo.completed === true){
      todoLi.className += 'completed';
    }
    var deleteButton = this.createDeleteButton(indexOfTodo, array);
    var toggleButton = this.createToggleCompletedButton(todo);
    var editInput = this.createEditInput(todo, indexOfTodo);
    var addSubTodoButton = this.createAddSubTodoButton(todo.children);

    ulToAppendTo.appendChild(todoLi);
    todoLi.appendChild(todoTextP)
    todoLi.appendChild(editInput);
    todoLi.appendChild(deleteButton);
    todoLi.appendChild(toggleButton);
    todoLi.appendChild(addSubTodoButton);

//when todoTextP is double clicked you can edit todo
    todoTextP.addEventListener('dblclick', function(){
      editInput.style.display = "block";
      todoTextP.style.display = "none";
      editInput.focus();
    })
  },
  createEditInput: function(todo, indexOfTodo){
    var editInput = document.createElement('input');
    editInput.value = todo.todoName;
    editInput.style.display = 'none';
    editInput.id= indexOfTodo + 'input'

    //makes changes and hides todo Input when enter is pressed
    editInput.addEventListener('keypress', function(e){
      if(e.key === 'Enter'){
        todoList.editTodo(todo, editInput.value);
        editInput.style.display = "none"
        var todoTextP = document.getElementById(indexOfTodo + 'p')
        todoTextP.style.display = "block";
        view.render();
      }
    })

    return editInput;
  },
  createDeleteButton: function(indexOfTodo, array){
    var deleteButton = document.createElement('button');
    deleteButton.textContent = "deleteTodo";
    deleteButton.className += 'delete-button'

    deleteButton.onclick = function(){
        todoList.deleteTodo(indexOfTodo, array);
        view.render();
      };
    return deleteButton;
  },
  createToggleCompletedButton: function(todo){
    var toggleButton = document.createElement('button');
    toggleButton.textContent = "Toggle Todo";
    toggleButton.className = 'toggle-button';

    toggleButton.onclick = function(){
        todoList.toggleTodo(todo);
        view.render();
      };
    return toggleButton;
  },
  createAddSubTodoButton: function(array){
    var addSubTodoButton = document.createElement('button');
    addSubTodoButton.textContent = 'Add Sub Todo';
    addSubTodoButton.className = 'add-sub-todo';

    addSubTodoButton.onclick = function(){
      todoList.addTodo('New SubTodo',array);
      view.render();
    }

    return addSubTodoButton;
  },
}
var util = {
  store: function(nameSpace, data){
    if(arguments.length <2){
      var store = localStorage.getItem(nameSpace);
			return (store && JSON.parse(store)) || [];
    }else{
      return localStorage.setItem(nameSpace, JSON.stringify(data));
    }
  },
}
document.getElementById("add-todo-input").addEventListener('keypress', function(e){
  if(e.key === "Enter"){
    handlers.addTodo();
  }
})
//loads todos from last session and renders todo List
todoList.todos = util.store('todoListData')
view.render();
