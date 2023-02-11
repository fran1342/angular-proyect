import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { RestService } from '../services/rest.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  registro = {
    "pNombre" : "",
    "pCodigoB" : "",
    "pDescripcion" : "",
    "pCantidad" : "",
    "pPrecio" : ""
  };
  previo_img = null;
  registroForm : FormGroup;
  mensajes={
    "nombre" : [
      {
        type : "required",
        mensaje : "El campo nombre es requerido"
      }
    ],
    "codigo" : [
      {
        type : "required",
        mensaje : "El campo codigo es requerido"
      }
    ],
    "descripcion" : [
      {
        type : "required",
        mensaje : "El campo descripcion es requerido"
      }
    ],
    "cantidad" : [
      {
        type : "required",
        mensaje : "El campo cantidad es requerido"
      }
    ],
    "precio" : [
      {
        type : "required",
        mensaje : "El campo precio es requerido"
      }
    ]
  }

  constructor(
    private restService : RestService,
    private formBuilder : FormBuilder
  ) {
    this.registroForm = this.formBuilder.group(
      {
        nombre : new FormControl('',Validators.required),
        codigo : new FormControl('',Validators.required),
        descripcion : new FormControl('',Validators.required),
        cantidad : new FormControl('',Validators.required),
        precio : new FormControl('',Validators.required)
      }
    );
   }

  ngOnInit() {
  }

  async tomar_foto(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });
    this.previo_img = 
    'data:image/jpeg;base64,' + image.base64String;
  }

  async registrar(){
    if (this.registroForm.valid) {
      let base64Response = await fetch(this.previo_img);
      let blob = await base64Response.blob();
      let datos_enviar = new FormData();
      datos_enviar.append("pNombre",this.registro.pNombre);
      datos_enviar.append("pCodigoB",this.registro.pCodigoB);
      datos_enviar.append("pDescripcion",this.registro.pDescripcion);
      datos_enviar.append("pCantidad",this.registro.pCantidad);
      datos_enviar.append("pPrecio",this.registro.pPrecio);
      datos_enviar.append("pFoto",blob);

      this.restService.post_method_files('productos/api/productos',datos_enviar)
     .subscribe(resultado =>{
      console.info(resultado);
     });
    }
  }

}
