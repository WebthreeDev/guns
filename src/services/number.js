export const soloNumeros = (e) => {
  
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toLowerCase();
    let letras = "1234567890.";
    let especiales = "";
    let tecla_especial = false
    for(var i in especiales){
         if(key == especiales[i]){
             tecla_especial = true;
     alert(tecla);
             break;
         }
     }

     if(letras.indexOf(tecla)==-1 && !tecla_especial){
         return false;
     }
   };

   