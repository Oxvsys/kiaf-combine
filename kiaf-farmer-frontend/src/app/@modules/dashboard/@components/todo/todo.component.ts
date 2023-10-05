import { Component, OnInit } from '@angular/core';
import { TodoCreate, TodoResponse, TodoResult } from './todo.interface';
import { TodoService } from './todo.service';

export interface Todo {
  Todo: string;
  Status: boolean;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  constructor(private todoService: TodoService) { }

  data!: TodoResponse;
  task = '';
  totalLen = 1;
  todos: TodoResult[] = [];

  ngOnInit(): void {
    this.getAllTodo(1);
  }

  getTotalPages() {
    return Math.ceil(this.totalLen / 5)
  }

  getAllTodo(pageNumber: number) {
    this.todoService.getAllTodo(pageNumber).subscribe(next => {
      this.totalLen = next.count;
      this.todos = next.results;
    });
  }


  onCreateTodo() {
    if (this.task.length > 0) {
      this.todoService.onCreateTodo({ task: this.task, completed: false }).subscribe(next => {
        let newTodos = [next, ...this.todos];
        this.todos = newTodos.slice(0, 5)
        // this.todos.push(next);
        // this.getAllTodo(this.pageNumber);
        this.totalLen += 1;
        this.task = "";
      });
    }
  }

  onDelete(id?: number) {
    id = id ? id : 0;
    this.todoService.onDelete(id).subscribe(next => {
      this.todos = this.todos.filter(obj => {
        return obj.id != id;
      });
      this.totalLen -= 1;
    })
  }

  onPageChange(pageNo: number) {
    this.getAllTodo(pageNo);
  }
  // previous() {
  //   this.pageNumber = this.pageNumber - 1
  //   this.getAllTodo(this.pageNumber)
  // }

  // next() {
  //   this.pageNumber = this.pageNumber + 1
  //   this.getAllTodo(this.pageNumber)
  // }
  toggleTodoTask(event: any, todo: TodoResult) {
    todo.completed = event;
    this.todoService.updateTodo(todo).subscribe((next: TodoResult) => {
      let index = this.todos.findIndex(obj => obj.id == todo.id);
      this.todos[index] = next;
    })
  }
}
