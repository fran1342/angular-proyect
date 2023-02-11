import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { RestService } from './rest.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService  implements CanActivate{

  constructor(
    public authService : RestService
  ) {

  }
  canActivate():boolean{
    return this.authService.isAuthenticacated();
  }
}
