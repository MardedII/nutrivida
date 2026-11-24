# NutriVida React — Testing con Jasmine y Karma

## Requisitos
- Node.js y npm instalados.
- Google Chrome instalado para ejecutar Karma en modo `ChromeHeadless`.

## Instalación
Desde la carpeta raíz `nutrivida-react`:

```bash
npm install
```

## Ejecutar la aplicación
```bash
npm start
```
La app se sirve normalmente en `http://localhost:3000`.

## Ejecutar los 22 casos Jasmine/Karma
```bash
npm run test:karma
```
Karma abre Chrome en modo headless, ejecuta `tests/nutrivida.spec.js` y finaliza mostrando los resultados.

## Ejecutar la suite original de Create React App/Jest
```bash
npm test
```
El proyecto conserva Jest/react-scripts como opción adicional. Se eliminó el `src/App.test.js` predeterminado de Create React App que buscaba el enlace "learn react", que no corresponde al contenido de NutriVida.

## Ejecutar ambas suites
```bash
npm run test:all
```

## Archivos agregados
- `karma.conf.js`: configuración de Karma, Jasmine y webpack.
- `tests/karma.entry.js`: entrada de pruebas.
- `tests/nutrivida.spec.js`: 22 casos TC-01 a TC-22.
- `package.json`: scripts y dependencias de desarrollo de Jasmine/Karma.

## Cambios funcionales para validar con las pruebas
- `src/utils/validaciones.js`: ahora rechaza una fecha de nacimiento no interpretable.
- `src/pages/Agendar.jsx`: no permite seleccionar una fecha anterior al día actual y vuelve a validarla al enviar.
- `src/pages/PanelMedico.jsx`: valida que peso y talla sean mayores que cero antes de guardar una ficha.

## Importante
- Los tests están preparados, pero deben ejecutarse en tu equipo después de `npm install`; este paquete no incluye `node_modules`.
- Karma requiere Chrome instalado. Si el navegador no está disponible, el comando puede fallar aunque los tests estén bien configurados.
- TC-20 y TC-22 comprueban la selección y navegación por rol del frontend; **no** demuestran autenticación ni autorización segura. Para eso se necesita control de acceso real, idealmente en backend.
- TC-13 utiliza una cita de demostración local. La app no debe presentarse como persistente en base de datos si no hay backend conectado.
- Si la rúbrica exige Jasmine/Karma, conserva una captura del comando `npm run test:karma` y del resumen real de pruebas aprobadas/fallidas.
