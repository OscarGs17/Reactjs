#!/bin/bash

# Variables
DROPLET_IP="143.110.148.36"
DROPLET_USER="oscar"
DROPLET_PATH="/home/oscar/apps"
REPO_URL="https://github.com/OscarGs17/Reactjs.git"
API_REPO_URL="https://github.com/OscarGs17/api_marvel.git"

echo "=== Iniciando Deploy a Droplet ==="

# 1. Conectar y crear directorios
echo "1. Creando directorios en el Droplet..."
ssh ${DROPLET_USER}@${DROPLET_IP} "mkdir -p ${DROPLET_PATH}"

# 2. Clonar o actualizar repositorio
echo "2. Clonando/actualizando repositorio..."
ssh ${DROPLET_USER}@${DROPLET_IP} "
  if [ -d ${DROPLET_PATH}/Reactjs ]; then
    cd ${DROPLET_PATH}/Reactjs && git pull
  else
    cd ${DROPLET_PATH} && git clone ${REPO_URL}
  fi
"

# 3. Instalar dependencias del Frontend
echo "3. Instalando dependencias del Frontend..."
ssh ${DROPLET_USER}@${DROPLET_IP} "
  cd ${DROPLET_PATH}/Reactjs/peliculas
  npm install
  npm run build
"

# 4. Clonar o actualizar API
echo "4. Clonando/actualizando API..."
ssh ${DROPLET_USER}@${DROPLET_IP} "
  if [ -d ${DROPLET_PATH}/api_marvel ]; then
    cd ${DROPLET_PATH}/api_marvel && git pull
  else
    cd ${DROPLET_PATH} && git clone ${API_REPO_URL}
  fi
"

# 5. Instalar dependencias del API
echo "5. Instalando dependencias del API..."
ssh ${DROPLET_USER}@${DROPLET_IP} "
  cd ${DROPLET_PATH}/api_marvel
  npm install
"

# 6. Instalar PM2 globalmente (si no está)
echo "6. Configurando PM2..."
ssh ${DROPLET_USER}@${DROPLET_IP} "
  sudo npm install -g pm2
  cd ${DROPLET_PATH}/api_marvel
  pm2 delete api_marvel 2>/dev/null || true
  pm2 start npm --name 'api_marvel' -- start
  pm2 save
  pm2 startup
"

echo "=== Deploy completado ==="
echo "Frontend: http://143.110.148.36"
echo "API: http://143.110.148.36:3000"
