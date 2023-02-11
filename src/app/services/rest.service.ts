import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import {BehaviorSubject} from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  apiUrl = "http://localhost/sw15_examen_servicios/index.php/";
  private httpClientFiles: HttpClient;
  public authState =  new BehaviorSubject(false);

  constructor(
    private storage : Storage,
    private platform : Platform,
    private http: HttpClient,
    private toastController: ToastController,
    private loadingController : LoadingController,
    private handler : HttpBackend
    ) {
      this.storage.create();
      this.platform.ready().then(()=>{
        this.isLoggedIn();
        this.httpClientFiles = new HttpClient(this.handler);
      });
  }

  async login(_data : any){
    const loading = await this.loadingController.create({
      message: 'Autenticando...'
    });
    await loading.present();
    console.info(this.apiUrl);
    return this.http.post<any>(this.apiUrl+"users/api/login",_data).subscribe(result =>{
      loading.dismiss();
    },(err) => {
      console.info(err);
      this.display_toast('Error',"danger","Error de comunicación, intente más tarde",'top',4000);
      loading.dismiss();
    });
  }
  post_method(_uri : string,_data : any){
    return this.http.post<any>(this.apiUrl+_uri,_data);
  }
  put_method(_uri : string, _data : any){
    return this.http.put<any>(this.apiUrl+_uri,_data);
  }
  get_method( _uri : string,_params : any){
    return this.http.get<any>(this.apiUrl+_uri,{params: _params});
  }
  delete_method( _uri : string,_params : any){
    return this.http.delete<any>(this.apiUrl+_uri,{params: _params});
  }

  post_method_files(_uri: string, data : any,): Observable<any>{
    const options ={
      headers:{
        'SW15-API-KEY': "$w154pik3Y"
      }
    };
  return this.httpClientFiles.post<any>(this.apiUrl+_uri,data,options);
}

  async logout(user : any){
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...'
    });
    await loading.present();
    loading.dismiss();
    this.storage.remove('sw15sess');
    this.authState.next(false);
  }

  isLoggedIn(){
    this.storage.get('sw15sess').then((response) => {
      if(response){
        this.authState.next(true);
      }
      /*prueba de sesión descomentar el else para pruebas*/
        /*else{
        let sesion_mentira = {
          "nombre" : "X"
        }
        this.storage.set('sw15sess',sesion_mentira).then( (response) =>{
          this.authState.next(true);
        });
      }*/
    });
  }
  isAuthenticacated(){
    return this.authState.value;
  }

  authUserData(){
    return this.storage.get('sw15sess');
  }

  //mensajes con toast
  async display_toast(_title,_type,_message,_position,_duration){
    const toast = await this.toastController.create({
      header: _title,
      message: _message,
      position: _position,
      color : _type,
      duration:  _duration,
      buttons: [
        {
          icon: 'close-circle',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }
}
