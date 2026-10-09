## 📂 Estructura del Proyecto

```text
nutrivida/
├── public/
│   ├── img/
│   │   ├── 1nutri.jpg
│   │   ├── 2nutri.png
│   │   ├── 3nutri.png
│   │   ├── control_peso.jpg
│   │   ├── derpo.jpg
│   │   ├── metabo.jpg
│   │   └── nutri4.jpg
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── component/            # Componentes reutilizables de la UI
│   │   ├── Footer.jsx
│   │   ├── Map.jsx
│   │   └── navbar.js         # Barra de navegación principal
│   ├── pages/                # Vistas principales de la aplicación
│   │   ├── Agendar.jsx
│   │   ├── Contacto.jsx
│   │   ├── Inicio.jsx
│   │   ├── Login.jsx
│   │   ├── PanelAdmin.jsx    # Panel de administración (Gestión de usuarios y profesionales)
│   │   ├── PanelMedico.jsx   # Portal médico (Atención y fichas clínicas)
│   │   ├── PanelPaciente.jsx # Portal paciente (Agendamiento y seguimiento)
│   │   └── Registro.jsx
│   ├── utils/                # Utilidades y lógica de validación
│   │   ├── funciones.js      # Funciones auxiliares generales
│   │   └── validaciones.js   # Reglas de validación (Regex, RUT Módulo 11, edad)
│   ├── App.css               # Hoja de estilos global
│   ├── App.js                # Enrutador principal (React Router)
│   ├── index.css             # Estilos base
│   └── index.js              # Punto de entrada de React
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
