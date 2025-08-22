# Bee-Ware! 🐝

Un juego de supervivencia top-down donde controlas una abeja que debe defenderse de enemigos usando magia y mejoras.

## 🎮 Características

- **Mapa grande**: Mundo expansivo de 2048x1536 píxeles
- **Sistema de magia**: Thunder magic con rayos automáticos
- **Sistema de mejoras**: 6 tipos diferentes de mejoras
- **Game over mejorado**: Pantalla de reinicio funcional
- **Cámara dinámica**: Sigue al jugador suavemente
- **UI centrada**: Interfaz siempre visible y centrada

## 🚀 Despliegue en Render

### Configuración Automática

1. Conecta tu repositorio de GitHub a Render
2. Render detectará automáticamente la configuración desde `render.yaml`
3. El servicio se desplegará automáticamente

### Configuración Manual

Si prefieres configurar manualmente:

1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm start`
3. **Environment**: Node.js
4. **Health Check Path**: `/`

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 🎯 Controles

- **WASD / Flechas**: Mover la abeja
- **Mouse**: Apuntar y disparar
- **SPACE**: Reiniciar juego (en pantalla de game over)

## ⚡ Mejoras Disponibles

1. **Increased Damage**: Aumenta el daño de proyectiles
2. **Attack Speed**: Aumenta la velocidad de ataque
3. **Multi-Shot**: Dispara proyectiles adicionales
4. **Larger Projectiles**: Aumenta el tamaño de proyectiles
5. **Max Health**: Aumenta la salud máxima
6. **Movement Speed**: Aumenta la velocidad de movimiento
7. **Thunder Magic**: ⚡ Rayos automáticos cada 4 segundos

## 🎨 Tecnologías

- **Frontend**: React + TypeScript
- **Game Engine**: Phaser 3
- **Build Tool**: Vite
- **Deployment**: Render

## 📝 Licencia

Este proyecto es privado y está desarrollado para fines educativos y de entretenimiento.
