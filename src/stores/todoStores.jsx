import { observable, action, computed, makeObservable } from "mobx";

class Todo{
    @observable id = Math.random();
    @observable title = "";
    @observable finished = false;

    constructor( title ){
        makeObservable(this);
        this.title = title;
    }

    @action toggleFinished(){
        this.finished = !this.finished;
    }
}

class TodoList{
    constructor(){
        makeObservable(this);
    }
    @observable todos = ["AAA","BBB", "CCC"];

    @action addTodo ( title ){
        const todo = new Todo( title );
        this.todos.unshift( todo );
    }

    @action delTodo ( todo ){
        this.todos.remove( todo );
    }

    @computed get unfinishedTodo( ){
        return this.todos.filter( todo => !todo.finished ).length;
    }
}

let todoList = new TodoList();


class NavList{
    @observable activeName = "tab3";

    constructor(){
        makeObservable(this);
    }
    @action changeActiveName( activeName ){
        this.activeName = activeName;
    }
}
let navList = new NavList();


export { todoList, navList };

