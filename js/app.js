var todoList = {
  todos : [],

  addTodo: function(todoName, array, indexToInsertIn){
    array.splice(indexToInsertIn,0,{
      todoName: todoName,
      completed:false,
      children: [],
       id: util.uuid(),
      collapsed: false,
    })
    return array[indexToInsertIn].id
  },
  editTodo: function(todo, newTodoName){
    todo.todoName = newTodoName;
  },
  deleteTodo: function(indexOfTodo, array){
    array.splice(indexOfTodo,1);
  },
  toggleTodo: function(todo, toggleFlag){
    //reverses the boolean value of completed unless a true toggleFlag is passed in
    if(todo.completed === false || toggleFlag === true){
      todo.completed = true;
    }else{
      todo.completed = false;
    }
    //recurses to toggle nested Todos
    for(var i=0; i< todo.children.length;i++){
      this.toggleTodo(todo.children[i], toggleFlag);
    }
  },
  toggleAll: function(){
    //creates a toggleFlag that is true only if at least one todo is incomplete
    var toggleFlag = this.checkTodos(this.todos);
    //if atleast one todo is false, set all of the todos to true
    for(var i=0; i < this.todos.length; i++){
      this.toggleTodo(this.todos[i], toggleFlag);
    }
  },
  //check Todos checks if all todos are completed. If they are all Completed
  // it returns false
  checkTodos: function(array){
    var toggleFlag = false
    //if any todos are false toggle Flag is returned as true.
    for(var i=0; i< array.length; i++){
      if(array[i].completed === false) return toggleFlag = true;
      //recurses to check nested Todos.
      if(array[i].children.length > 0){
        this.checkTodos(array[i].children)
      }
    }
    return toggleFlag;
  },
  clearCompleted: function(array){
    for(var i=array.length - 1; i >= 0; i--){
      if(array[i].completed === true){
        todoList.deleteTodo(i, array);
      }
      if(array[i] !== undefined && array[i].children.length > 0){
        this.clearCompleted(array[i].children)
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
    //add todo to the end of the main todo list
    todoList.addTodo(todoInput.value, todoList.todos, todoList.todos.length);
    //clear todoInput
    todoInput.value = "";
    view.render();
  },
  clearCompleted: function(){
    todoList.clearCompleted(todoList.todos);
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
      noTodosP.textContent = "Looks like there are no todos";
      ul.appendChild(noTodosP);
    }
      this.renderList(todoList.todos, ul);
    //saves todos
    util.store('todoListData', todoList.todos)
  },
  renderList: function(array, ulToAppendTo){
    for(var i=0; i<array.length; i++){
      this.createTodoLi(array[i],i,array,ulToAppendTo)
      if(array[i].children.length >0){
        var nestedUl = document.createElement('ul');
        ulToAppendTo.appendChild(nestedUl);
        this.renderList(array[i].children, nestedUl);
      }
    }
  },
  createTodoLi: function(todo,indexOfTodo, array, ulToAppendTo){
    var div = document.createElement('div')
    div.className = 'li-div'
    var todoLi = document.createElement("li")
    var id = todo.id;
    todoLi.id =id;
    var todoTextP = this.createTodoP(todo.todoName, id);
    if(todo.completed === true){
      todoLi.className += 'completed';
    }

    var deleteButton = this.createDeleteButton(indexOfTodo, array);
    var toggleButton = this.createToggleCompletedButton(todo);
    var editInput = this.createEditInput(todo, indexOfTodo, array, id);
    var addSubTodoButton = this.createAddSubTodoButton(todo.children);

    // if(todo.children.length > 0){
    //     var collpaseButton = this.createCollapseButton(todo.collapsed);
    //     todoLi.appendChild(collpaseButton);
    //   }
    ulToAppendTo.appendChild(div);
    div.appendChild(todoLi);
    todoLi.appendChild(todoTextP);
    todoLi.appendChild(editInput);
    todoLi.appendChild(deleteButton);
    todoLi.appendChild(toggleButton);
    todoLi.appendChild(addSubTodoButton);

//when todoTextP is double clicked you can edit todo
  },
  createTodoP: function(text, id){
    var p = document.createElement('p');
    p.textContent = text || 'New Todo';
    p.id = id + 'p'
    //when clicked hide p element and make edit input visible
    p.addEventListener('click', function(){
      var p = document.getElementById(id + 'p');
      var editInput = document.getElementById(id + "editInput");
      //makes editInput visible and p invisible
      editInput.style.display= 'block';
      p.style.display = 'none';
      editInput.focus();
    })

    return p;
  },
  createEditInput: function(todo, indexOfTodo, array, id){
    var editInput = document.createElement('input');
    editInput.value = todo.todoName;
    editInput.id= id+"editInput";
    editInput.style.display = 'none';

    //makes changes and hides todo Input when enter is pressed
    editInput.addEventListener('keyup', function(e){
        todoList.editTodo(todo, editInput.value);
    })
    //if enter is pressed rerender
    editInput.addEventListener('keypress',function(e){
      if(e.key === "Enter"){
        view.render();
      }
    })
    editInput.addEventListener('blur',function(e){
        view.render();
    })
    return editInput;
  },
  createDeleteButton: function(indexOfTodo, array){
    var deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete Todo";
    deleteButton.className = 'delete-button'

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
      var subtodoId = todoList.addTodo('New SubTodo',array, array.length);
      view.render();
      var subTodoP = document.getElementById(subtodoId + "p")
      subTodoP.click();
    }

    return addSubTodoButton;
  },
  createCollapseButton: function(toggledFlag,todo){
    var collapseButton = document.createElement('button');
    collapseButton.className = 'collapse-button';
    //if not toggled toggle button shows '(0)'
    if(toggledFlag === false){
      collapseButton.textContent = '( - )'
    }else{
      collapseButton.textContent = '( + )'
    }
    collapseButton.onlick = function(event,todo){
      todo.collapsed = !todo.collapsed;
    }
    return collapseButton;
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
  uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		},
}
//when enter is pressed on new todo input, a new todo is created
document.getElementById("add-todo-input").addEventListener('keypress', function(e){
  if(e.key === "Enter"){
    handlers.addTodo();
  }
})
//makes up and down arrows functional. It should change focus of todo based on which key is pressed
document.onkeydown = function(e){
  addTodoInput = document.getElementById('add-todo-input')
  currentFocusedElement = document.activeElement;
  //If down arrow is pressed
  if(e.code === "ArrowDown" || e.code === "ArrowUp"){
    //if focused on add Todo Input and down key is pressed, focus on first todo
    if(currentFocusedElement == addTodoInput ){
      firstTodoId = todoList.todos[0].id;
      var firstTodoP = document.getElementById(firstTodoId + 'p');
      return firstTodoP.click();
    }
    //if focused on a todo input
    if(currentFocusedElement != document.querySelector('body')){
      //getsId of Todo from input. slice removes editInput part of id
      var currentTodoId = currentFocusedElement.id.slice(0,-9)
      var todoLiArray = document.getElementsByTagName("li");
      for(var i=0; i < todoLiArray.length; i++){
        if(todoLiArray[i].id === currentTodoId){
          var arrayPosOfCurrentLi = i;
        }
      }
      //if arrowDown is pressed, next li to focus on is below the current one
      if(e.code === "ArrowDown"){
        var arrayPosOfNextLi = arrayPosOfCurrentLi + 1;
      }else{
        //else focus on li above the current one
        var arrayPosOfNextLi = arrayPosOfCurrentLi - 1;
      }
      //if next li doesnt exist, make the next li to focus on the first one
      //or last one if arrow down is pressed
      if(todoLiArray[arrayPosOfNextLi] === undefined){
        if(e.code === "ArrowDown"){
          var idOfNextTodo = todoLiArray[0].id
        }else{
          var idOfNextTodo = todoLiArray[todoLiArray.length - 1].id
        }
      }else{
        //else get id of the next li
        var idOfNextTodo = todoLiArray[arrayPosOfNextLi].id;
      }
      //moves cursor to next Todo
      pElementOfNextTodo = document.getElementById(idOfNextTodo + 'p');
      view.render();
      return  pElementOfNextTodo.click();
    }
    //if user is not focused on anything when arrow key is pressed. It focuses on add todo input
    else{
      addTodoInput.focus();
    }
  }

}
//loads todos from last session and renders todo List
todoList.todos = util.store('todoListData')
view.render(document.getElementById('add-todo-input'));
