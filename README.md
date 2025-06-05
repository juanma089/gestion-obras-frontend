# Gestión de Obras FrontEnd

## Requisitos del Sistema

El proyecto requiere las siguientes tecnologías base:

- **Node.js** (versión compatible con React 19)
- **npm** como gestor de paquetes
- **Navegador web moderno** con soporte para ES modules `package.json:21-22`

## Instalación

### 1. Clonar el repositorio

```bash
git clone `https://github.com/juanma089/gestion-obras-frontend.gi`
```

```bash
cd gestion-obras-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

Las dependencias principales incluyen React 19, TypeScript, Vite, TailwindCSS y librerías para mapas y comunicación en tiempo real. `package.json:12-26`

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```
`package.json:7`

### 4. Otros comandos disponibles
- **Build para producción**: `npm run build` `package.json:8`
- **Linting**: `npm run lint` `package.json:9`
- **Preview**: `npm run preview` `package.json:10`

## Configuración de Base de Datos

**Importante**: Este es el frontend del sistema. No maneja base de datos directamente, sino que se conecta a servicios backend externos:

- **Servicio de Usuarios**: `https://github.com/juanma089/login-gestion-obras.git`
- **API de Gestión**: `https://github.com/juanma089/gestio-obras-backend.git`

Debes asegurarte de que estos servicios backend estén ejecutándose antes de usar la aplicación frontend.

## Estructura de Inicio

La aplicación se inicializa a través de `index.html` que carga el componente principal desde `main.tsx`. `main.tsx:20-31`

**Notes**

El proyecto utiliza Vite como herramienta de build y desarrollo, lo que proporciona hot reload automático. La aplicación está configurada con React Query para manejo de estado del servidor, autenticación basada en contexto, y soporte para mapas interactivos con Leaflet. Para un funcionamiento completo, necesitarás configurar los servicios backend correspondientes que manejan la lógica de negocio y persistencia de datos.
