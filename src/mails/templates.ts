export const recoveryPassword = (name:string, code:string) =>{
	return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title><style>body{font-family:'Gill Sans','Gill Sans MT',Calibri,'Trebuchet MS',sans-serif;background-color:#1c1c1c;color:red!important;margin:0;padding:0;height:100%;width:100%}.container{width:100%;table-layout:fixed}.content{width:600px;margin:0 auto;background-color:#2b2b2b;color:#fff!important;border:5% groove red;padding:3%}h1{color:red!important}p,ul{font-size:larger;color:#fff!important}button{font-size:large;background:red;color:#000!important;border:none;padding:1%;cursor:pointer}button:hover{background-color:#8b0000}.code-container{background-color:#fff;color:#000!important;border-radius:5%;font-size:700%;padding:2%;text-align:center}</style></head><body><table class="container"><tr><td><div class="content"><h1>¿Olvidaste tu contraseña?</h1><p>Hola ${name}, hemos recibido una solicitud de cambio de contraseña para tu cuenta.</p><p>Por favor confirma tu correo electrónico ingresando los números que ves en pantalla en la página de recuperación para continuar con el proceso.</p><div class="code-container">${code}</div></div></td></tr></table></body></html>`;
};