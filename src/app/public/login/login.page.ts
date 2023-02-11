import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private restService : RestService
  ) {
  }

  ngOnInit() {

  }

  do_login(){
    let data = {

    };
    this.restService.login(data);
  }

}
