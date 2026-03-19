# 📚 E-Books React App

Aplicación web desarrollada con **React.js** como parte del curso de Full Stack (unidad de React).  
La aplicación permite explorar una colección de libros digitales, realizar búsquedas dinámicas y navegar hacia el detalle de cada libro.

🔗 **Demo en producción:**  
https://ebooks-blue-seven.vercel.app/

📦 **Repositorio:**  
https://github.com/JulianDerudi/ebooks

---

## 🎯 Objetivo del Proyecto

El objetivo principal fue aplicar los conceptos fundamentales de **React moderno**, enfocándome en:

- Arquitectura basada en componentes
- Manejo de estado local y global
- Uso de Hooks
- Lógica de búsqueda dinámica
- Navegación entre vistas
- Despliegue en producción con Vercel

Este proyecto forma parte de mi formación como desarrollador Full Stack.

---

## 🚀 Funcionalidades

- 📚 Listado dinámico de eBooks
- 🔎 Búsqueda por **nombre o ID**
- ✨ Coincidencias parciales (si se escribe parte del nombre redirige al libro correspondiente)
- 📄 Vista de detalle por libro
- 🌐 Navegación entre rutas
- 🧠 Manejo de estado global con **Context API**
- 🚀 Deploy en Vercel

---

## 🛠️ Tecnologías Utilizadas

- **React.js**
- **React Context API**
- **React Hooks (useState, useEffect, useContext)**
- **Vite**
- **JavaScript (ES6+)**
- **CSS**
- **Git & GitHub**
- **Vercel (deploy en producción)**

---

## 🧱 Arquitectura del Proyecto

El proyecto está organizado siguiendo buenas prácticas de React:

    ebooks/
    ├── public/
    ├── src/
    │ ├── Components/
    │ ├── Context/
    │ ├── data/
    │ │ └── ebooksData.js
    | ├── Screens/
    | ├── styles/
    │ ├── App.jsx
    │ └── main.jsx
    ├── package.json
    ├── vite.config.js
    └── README.md


### 📌 Principales conceptos implementados:

- Separación por componentes reutilizables
- Context para evitar prop drilling
- Renderizado condicional
- Navegación mediante rutas
- Lógica de filtrado y búsqueda
- Organización escalable del proyecto

---

## 💻 Instalación y Ejecución Local

1. Clonar el repositorio:
    
    git clone https://github.com/JulianDerudi/ebooks.git

2. Ingresar al directorio del proyecto:
    
    cd ebooks

3. Instalar dependencias:
    
    npm install

4. Ejecutar el servidor de desarrollo:
    
    npm run dev

5. Abrir en el navegador:

    http://localhost:5173

## 📚 Aprendizajes Clave

Este proyecto demuestra:

- Comprensión de React moderno
- Manejo de estado global con Context API
- Organización profesional de un proyecto frontend
- Despliegue real en producción
- Implementación de lógica dinámica en el cliente
- Navegación entre vistas

## 🔮 Posibles Mejoras Futuras

* Integración con API real de libros

* Persistencia en LocalStorage

* Sistema de favoritos

* Filtros avanzados y paginación

* Autenticación de usuarios

* Mejoras de UI/UX

## 👤 Autor

Julián Derudi

📌 Portafolio: https://julianderudi.github.io/Portafolio/

🔗 LinkedIn: https://www.linkedin.com/in/julian-derudi-730ba8343/

---

Proyecto realizado con fines educativos como parte de mi formación en desarrollo Full Stack.