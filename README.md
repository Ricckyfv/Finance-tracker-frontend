# 💸 Finance Tracker — ¡Toma el control de tu dinero sin dolores de cabeza!

¡Hola! Bienvenido/a a **Finance Tracker**. Si alguna vez te has preguntado *"¿en qué demonios se me fue el dinero este mes?"* o has intentado registrar tus gastos en una libreta para terminar abandonándola a los tres días, este proyecto te va a encantar. 

He diseñado esta aplicación web con un objetivo muy simple en mente: hacer que el seguimiento de tus ingresos, gastos, presupuestos y metas de ahorro sea algo **fácil, visual y, por qué no, hasta entretenido**. 

El proyecto está dividido de forma limpia y ordenada en dos partes:
*   **El cerebro (Backend):** Una API REST robusta construida con **Spring Boot 3** y **Java 21**, que gestiona de forma segura toda tu información en una base de datos MySQL.
* **La persistencia (Base de Datos):** Una instancia de **MySQL 8.4** administrada en la nube a través de **Aiven**, garantizando la seguridad y persistencia de tus datos de forma aislada.
*   **La cara bonita (Frontend):** Una interfaz de usuario moderna, rápida y responsiva desarrollada con **Angular 19** y **TailwindCSS**, equipada con gráficos dinámicos interactivos gracias a **Chart.js**.

---

# 🎨 Finance Tracker — Frontend Client

> [!IMPORTANT]
> Este repositorio contiene exclusivamente el código de la **Cara Bonita (Frontend)** desarrollado en Angular. 
> Si deseas inspeccionar la lógica del servidor, las entidades y la seguridad de la API, visita el repositorio hermano aquí: 
> 👉 **[Repositorio Backend - Finance Tracker](https://github.com/Ricckyfv/Finance-tracker-backend)**

---

## ✨ Lo que puedes hacer con Finance Tracker

Aquí tienes un resumen de todo lo que ya está listo para que lo uses:

*   🔐 **Cuentas 100% seguras:** Registro e inicio de sesión protegidos con **JWT (JSON Web Tokens)**. Tus datos financieros son tuyos y de nadie más.
*   📊 **Tu Dashboard personal:** Un panel principal visual con gráficos interactivos que te muestran exactamente cuánto ingresas, cuánto gastas y en qué categorías específicas se te va el dinero.
*   💸 **Registro sencillo de Transacciones:** Registra tus ingresos y gastos en segundos, categorízalos (comida, ocio, transporte, etc.) y mantén un historial ordenado.
*   🎯 **Tus metas de ahorro (Goals):** ¿Quieres ahorrar para un viaje, un coche o un fondo de emergencia? Crea una meta, define cuánto necesitas, para cuándo, ¡y mira cómo avanza tu progreso!
*   🛡️ **Presupuestos bajo control (Budgets):** Define límites de gasto mensuales por categoría. La aplicación te ayudará a vigilar que no te pases de la raya antes de que termine el mes.

---

## 🛠️ El arsenal tecnológico (Tech Stack)

### Backend (finance-tracker-back)
*   **Java 21** (Moderno, rápido y eficiente).
*   **Spring Boot 3.5.12** (El estándar de oro para crear APIs).
*   **Spring Security & JWT** (Para que toda la autenticación sea ultra segura).
*   **Spring Data JPA & Hibernate** (Para comunicarnos de forma fluida con la base de datos).
*   **MapStruct** (Para convertir datos de manera limpia entre la base de datos y la interfaz de usuario sin escribir código repetitivo).
*   **Lombok** (Para mantener el código limpio y libre de boilerplate).
*   **MySQL** (Base de datos relacional robusta y confiable).

### Frontend (finance-tracker-front)
*   **Angular 19** (Con un rendimiento brutal y arquitectura limpia).
*   **TailwindCSS** (Para un diseño visual moderno, limpio y totalmente responsivo).
*   **Chart.js & ng2-charts** (Para dar vida a tus números a través de gráficos interactivos hermosos).
*   **RxJS** (Para manejar los datos asíncronos y la comunicación con el servidor como un profesional).

### DevOps & Despliegue
* **Docker** (Contenerización de la aplicación para consistencia entre desarrollo y producción).
* **Render** (Alojamiento del contenedor del Backend).
* **Vercel** (Despliegue continuo e inmediato del cliente Frontend).

---

## 🚀 ¿Cómo ponerlo en marcha en tu máquina?

Es muy fácil. Asegúrate de tener instalado **Java 21**, **Maven**, **Node.js (versión 18 o superior)** y **MySQL**.

### 1️⃣ La Base de Datos (MySQL)
Primero, necesitamos crear el contenedor o la base de datos local en MySQL. Abre tu cliente de base de datos favorito (como MySQL Workbench, DBeaver o la consola) y ejecuta:

```sql
CREATE DATABASE finance_tracker;
```

> [!TIP]
> Por defecto, el backend está configurado para conectarse usando el usuario `root` y sin contraseña. Si en tu caso es diferente, puedes cambiarlo en un segundo en el archivo:
> `finance-tracker-back/src/main/resources/application.properties`

> [!TIP]
> **¿Cómo correr la base de datos local?**
> Puedes levantar un MySQL local en el puerto `3306` rápidamente usando Docker con el siguiente comando:
> ```bash
> docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=tu_contraseña -e MYSQL_DATABASE=finance_tracker -p 3306:3306 -d mysql:8.4
> ```

---

### 2️⃣ Arrancar el Backend (Servidor)
Entra en la carpeta del backend y arráncalo con Maven. En tu terminal:

```bash
cd finance-tracker-back
# Si usas Windows:
mvnw.cmd spring-boot:run

# Si usas Linux o macOS:
./mvnw spring-boot:run
```

¡Listo! El servidor se iniciará y estará escuchando peticiones en `http://localhost:8080`.

---

### 3️⃣ Arrancar el Frontend (Cliente)
Ahora vamos a encender la interfaz visual. Abre otra ventana de la terminal y ejecuta:

```bash
cd finance-tracker-front

# Instalamos las dependencias
npm install

# Encendemos el servidor de desarrollo de Angular
npm start
```

Una vez que termine de compilar (tarda solo unos segundos), abre tu navegador y entra en:
👉 **`http://localhost:4200`**

¡Y ya está! Regístrate con una cuenta nueva, inicia sesión y empieza a organizar tus finanzas. 🚀

---

## 🗺️ Mapa de la API (Endpoints principales)

Si te da curiosidad saber cómo se comunican el frontend y el backend, aquí tienes una pequeña chuleta con las rutas principales de nuestra API REST:

| Método | Endpoint | ¿Para qué sirve? | Requiere Auth |
| :--- | :--- | :--- | :---: |
| **POST** | `/api/auth/register` | Crea una cuenta de usuario nueva | ❌ |
| **POST** | `/api/auth/login` | Inicia sesión y te devuelve tu token JWT | ❌ |
| **GET** | `/api/transactions` | Obtiene tus ingresos y gastos (con filtros) |  |
| **POST** | `/api/transactions` | Registra una nueva transacción |  |
| **DELETE** | `/api/transactions/{id}` | Elimina una transacción específica |  |
| **GET** | `/api/budgets` | Muestra tus límites de gasto (presupuestos) |  |
| **POST** | `/api/budgets` | Crea un nuevo presupuesto mensual |  |
| **GET** | `/api/goals` | Lista tus metas de ahorro y su progreso |  |
| **POST** | `/api/goals` | Crea una nueva meta de ahorro |  |
| **PUT** | `/api/goals/{id}` | Actualiza tus progresos en una meta |  |

---

## 💡 Ideas para el futuro (Roadmap de mejoras)

Como este es un proyecto vivo, aquí tienes algunas ideas geniales que me gustaría sumarle pronto:
-   [ ] 🌙 **Modo Oscuro (Dark Mode):** Para que revisar tus gastos por la noche y usar el modo que ten venga mejor.
-   [ ] 📥 **Exportar reportes:** Botones para descargar tu historial financiero en formato PDF o Excel.
-   [ ] 💱 **Soporte multi-moneda:** Para poder registrar transacciones en dólares, euros u otras monedas locales con conversión automática.
-   [ ] 📱 **Diseño optimizado para móvil progresivo (PWA):** Para poder instalar la app en el móvil como si fuera nativa.

---

---

## 🔗 Enlaces del Proyecto
* 🚀 **Demo en Vivo (Frontend):** [Visita Finance Tracker en Vercel](https://finance-tracker-frontend-tau-brown.vercel.app/)

> [!NOTE]
> **Nota sobre la Demo en Vivo (Cold Start):** > El backend de esta aplicación está alojado en la capa gratuita de Render. Por políticas de la plataforma, si el servidor no recibe peticiones durante 15 minutos, entra en modo de suspensión. 
> 
> Si es la primera vez que entras o llevas tiempo sin usar la app, **la primera petición (como iniciar sesión o registrarte) puede tardar entre 30 y 50 segundos** mientras el servidor "despierta". ¡No te preocupes! He implementado un interceptor dinámico en Angular con Tailwind que te avisará en pantalla en tiempo real cuando esto ocurra. Las siguientes acciones funcionarán de forma instantánea.

---

## ✍️ Autor y contribuciones

Este proyecto fue desarrollado con mucho cariño y código por **[Ricardo Fernández Vilca](https://github.com/Ricckyfv)**.

Si tienes alguna idea para mejorarlo, encuentras algún fallo o simplemente quieres charlar sobre código, ¡no dudes en abrir un *Issue* o mandar un *Pull Request*! Toda ayuda es súper bienvenida. 

*¡Gracias por pasarte por aquí y espero que Finance Tracker te ayude a llevar tus finanzas al siguiente nivel!* ⭐
