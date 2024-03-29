import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private curentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.curentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if(user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.curentUserSource.next(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if(user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.curentUserSource.next(user);
        }
      })
    )
  }

  setCurrentUser(user: User) {
    this.curentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.curentUserSource.next(null);
  }
}
