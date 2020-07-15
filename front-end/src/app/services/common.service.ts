import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../model/product';
import {Respack} from '../model/respack';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

// user list method used to list user data on table
 user_list(): Observable<Product[]>{
  return this.http.get<Product[]>(environment.SERVER_URL + '/crud/list');
}

user_add(obj: Product): Observable<Respack>{
  return this.http.post<Respack>( environment.SERVER_URL + '/crud/add', obj);
}
user_update(obj: Product): Observable<Respack>{
  return this.http.post<Respack>(environment.SERVER_URL + '/crud/update', obj);
}
user_delete(id: number): Observable<Respack>{
  return this.http.post<Respack>(environment.SERVER_URL + '/crud/delete', {id});
}

 alert(type: string, message: string, action?: string, timeout?: number ){

  action = action == null ? 'ok' : action;
  timeout = timeout == null ? 5000 : timeout;
  this.snackBar.open(message, action, {
    duration: timeout, panelClass: type


  });

}

}
