# 🚀 Guía de Despliegue en Render

## Pasos para Desplegar Bee-Ware en Render

### 1. Preparar el Repositorio

Asegúrate de que tu código esté en GitHub y que todos los archivos estén committeados:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Crear Cuenta en Render

1. Ve a [render.com](https://render.com)
2. Crea una cuenta o inicia sesión
3. Conecta tu cuenta de GitHub

### 3. Crear Nuevo Servicio Web

1. En el dashboard de Render, haz clic en **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `bee-ware-main`

### 4. Configurar el Servicio

Render detectará automáticamente la configuración desde `render.yaml`, pero puedes verificar:

- **Name**: `bee-ware-game` (o el nombre que prefieras)
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free (para empezar)

### 5. Variables de Entorno

No necesitas configurar variables de entorno adicionales, pero puedes agregar:

- `NODE_ENV`: `production`

### 6. Desplegar

1. Haz clic en **"Create Web Service"**
2. Render comenzará a construir y desplegar tu aplicación
3. El proceso tomará unos minutos

### 7. Verificar el Despliegue

Una vez completado, Render te dará una URL como:
`https://bee-ware-game.onrender.com`

### 8. Configuración Automática

Con el archivo `render.yaml`, cada vez que hagas push a tu repositorio:
- Render detectará automáticamente los cambios
- Reconstruirá y redesplegará la aplicación
- Mantendrá la URL consistente

## 🛠️ Solución de Problemas

### Error de Build
- Verifica que `npm run build` funcione localmente
- Revisa los logs de build en Render

### Error de Start
- Verifica que `npm start` funcione localmente
- Asegúrate de que el puerto esté configurado correctamente

### Assets No Encontrados
- Verifica que las rutas de los assets sean correctas
- Asegúrate de que los archivos estén en la carpeta `public/`

## 📝 Notas Importantes

- **Free Tier**: Render tiene un plan gratuito con limitaciones
- **Auto-Deploy**: Cada push a main activará un nuevo despliegue
- **Logs**: Puedes ver los logs en tiempo real en el dashboard de Render
- **Health Checks**: Render verificará automáticamente que tu app esté funcionando

## 🔗 URLs Útiles

- [Render Dashboard](https://dashboard.render.com)
- [Render Documentation](https://render.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
