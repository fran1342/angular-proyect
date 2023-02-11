import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { RestService } from '../services/rest.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
})
export class EmpleadosPage implements OnInit {
  registro = {
    "pNombre" : "",
    "pApellidos" : "",
    "pPuesto" : "",
    "pSueldo" : ""
  };
  mis_empleados=[];
  previo_img = null;
  registroForm : FormGroup;
  mensajes={
    "nombre" : [
      {
        type : "required",
        mensaje : "El campo nombre es requerido"
      }
    ],
    "apellidos" : [
      {
        type : "required",
        mensaje : "El apellidos nombre es requerido"
      }
    ],
    "puesto" : [
      {
        type : "required",
        mensaje : "El campo puesto es requerido"
      }
    ],
    "sueldo" : [
      {
        type : "required",
        mensaje : "El campo sueldo es requerido"
      }
    ]
  }

  constructor(
    private restService : RestService,
    private formBuilder : FormBuilder
    ){
      this.registroForm = this.formBuilder.group(
        {
          nombre : new FormControl('',Validators.required),
          apellidos : new FormControl('',Validators.required),
          puesto : new FormControl('',Validators.required),
          sueldo : new FormControl('',Validators.required)
        }
      );
  }

  ngOnInit() {
    this.restService.get_method("cursos/api/cursos_alumno", null).
    subscribe(empleados =>{
      if(empleados.status == "success"){
        this.mis_empleados = empleados.data;
        console.info(this.mis_empleados);
      }else if(empleados.status == "error"){
        this.restService.display_toast("Sw15 : Error interno","danger", empleados.message,"top",4000);
      }else{
       this.restService.display_toast("Sw15 : Error de comunicacion","danger", empleados.message,"top",4000);
      }
    });
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
      datos_enviar.append("pApellidos",this.registro.pApellidos);
      datos_enviar.append("pPuesto",this.registro.pPuesto);
      datos_enviar.append("pSueldo",this.registro.pSueldo);
      datos_enviar.append("pFoto",blob);

      this.restService.post_method_files('empleados/api/empleados',datos_enviar)
     .subscribe(resultado =>{
      console.info(resultado);
     });
    }
  }

}
