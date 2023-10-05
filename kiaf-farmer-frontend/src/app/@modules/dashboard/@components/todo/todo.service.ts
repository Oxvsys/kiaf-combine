import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TodoCreate, TodoResponse, TodoResult } from './todo.interface';

@Injectable()
export class TodoService {

  constructor(private http:HttpClient) {  }

  onCreateTodo(todoItem: TodoCreate): Observable<TodoResult>{
    return this.http.post(environment.apiUrl + '/todo/', todoItem) as Observable<TodoResult>;
  }

  getAllTodo(pageNumber: number): Observable<TodoResponse>{
    return this.http.get(environment.apiUrl + '/todo/', {params: {
      page: pageNumber.toString()
    }
  }) as Observable<TodoResponse>;
  }

  onDelete(id: number){
    return this.http.delete(environment.apiUrl + '/todo/' + id + '/');
  }

  updateTodo(t:TodoResult){
    return this.http.put(environment.apiUrl + '/todo/' + t.id + '/', t) as Observable<TodoResult>;
  }
}
