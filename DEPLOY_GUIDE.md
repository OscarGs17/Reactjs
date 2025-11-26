# Guía de Deploy a Droplet DigitalOcean

## 📋 Pasos previos (en tu máquina local):

### 1. Configura SSH sin contraseña (opcional pero recomendado)
```powershell
# En PowerShell, genera una clave SSH si no la tienes
ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\id_rsa"

# Copia la clave pública al Droplet
type $env:USERPROFILE\.ssh\id_rsa.pub | ssh oscar@143.110.148.36 "cat >> ~/.ssh/authorized_keys"
```

### 2. Instala Git en Windows (si no lo tienes)
- Descarga desde: https://git-scm.com/download/win

### 3. Asegúrate que tus cambios estén en GitHub
```powershell
cd c:\xampp\htdocs\peliculas
git add .
git commit -m "Deploy changes"
git push origin main
```

---

## 🚀 Opciones de Deploy:

### OPCIÓN 1: Usando el script (Recomendado)

En PowerShell o Git Bash:
```powershell
cd c:\xampp\htdocs\peliculas
bash deploy.sh
```

---

### OPCIÓN 2: Manualmente paso a paso

```bash
# 1. Conectar al Droplet
ssh oscar@143.110.148.36

# 2. Una vez dentro del Droplet, crear directorios
mkdir -p ~/apps
cd ~/apps

# 3. Clonar el repositorio del Frontend
git clone https://github.com/OscarGs17/Reactjs.git
cd Reactjs/peliculas

# 4. Instalar dependencias e compilar
npm install
npm run build

# 5. Volver a la carpeta apps y clonar el API
cd ~/apps
git clone https://github.com/OscarGs17/api_marvel.git
cd api_marvel

# 6. Instalar dependencias del API
npm install

# 7. Instalar PM2 para mantener servicios corriendo
sudo npm install -g pm2

# 8. Iniciar el API con PM2
pm2 start npm --name "api_marvel" -- start
pm2 save
pm2 startup

# 9. Instalar Nginx
sudo apt update
sudo apt install nginx

# 10. Configurar Nginx (ver sección abajo)
sudo nano /etc/nginx/sites-available/default
```

---

## ⚙️ Configuración de Nginx

Reemplaza el contenido de `/etc/nginx/sites-available/default` con:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name 143.110.148.36;

    # Servir archivos estáticos del frontend
    location / {
        root /home/oscar/apps/Reactjs/peliculas/build;
        try_files $uri /index.html;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }

    # Redirigir peticiones del API al puerto 3000
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # También servir al root del API
    location ~ ^/(login|registro|vengadores|guardianes|xmen|usuarios|informacion|manejar_estado|archivo|actualizar_usuario) {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Luego ejecuta:
```bash
sudo nginx -t  # Verifica la configuración
sudo systemctl restart nginx
```

---

## 🔄 Actualizar después de cambios

Si realizas cambios en el código:

```bash
# En tu máquina local
cd c:\xampp\htdocs\peliculas
git add .
git commit -m "tus cambios"
git push origin main

# En el Droplet
ssh oscar@143.110.148.36
cd ~/apps/Reactjs/peliculas
git pull
npm run build

# Si también cambió el API
cd ~/apps/api_marvel
git pull
npm install
pm2 restart api_marvel
```

---

## 📱 Acceder a tu aplicación

- **Frontend**: http://143.110.148.36
- **API**: http://143.110.148.36:3000

---

## 🔍 Verificar estado de servicios

```bash
# Ver estado del API
pm2 status

# Ver logs del API
pm2 logs api_marvel

# Ver estado de Nginx
sudo systemctl status nginx
```

---

## ⚠️ Notas importantes

1. **CORS**: Si tienes problemas de CORS en producción, asegúrate que tu API tenga configurado:
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://143.110.148.36',
  credentials: true
}));
```

2. **Variables de entorno**: Actualiza el `.env` en el Droplet con la URL correcta:
```bash
cd ~/apps/api_marvel
nano .env
# REACT_APP_API_URL=http://143.110.148.36
```

3. **Certificado SSL** (HTTPS - Recomendado):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu_dominio.com
```

---

¡Tu aplicación ya estará en vivo! 🎉
