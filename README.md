Este proyecto se encuentra en Vercel **Vercel** [Revisar aquí](https://battleship-wine.vercel.app/)

# Battleship Game - Inspirado en One Piece

Este proyecto es un juego de **Batalla Naval** inspirado en el universo de **One Piece**, desarrollado utilizando **React**, **CSS**, y otras herramientas modernas. El juego permite a los jugadores enfrentarse a un oponente controlado por la computadora en una versión personalizada de este clásico juego de estrategia.

## Características

- **Colocación de barcos**: Arrastra y suelta los barcos en tu tablero.
- **Turnos alternados**: Los jugadores atacan por turnos, con efectos visuales para los impactos y fallos.
- **Ataque**: La computadora ataca de forma estratégica.
- **Modal de victoria**: Muestra el ganador con opciones para reiniciar el juego.
- **Inspiración One Piece**: Barcos y avatares personalizados de personajes como Luffy, Big Mom, Kid, y Shanks.

## Tecnologías utilizadas

- **Vite**: Para inicializar y gestionar el proyecto.
- **React**: Para construir componentes reutilizables.
- **CSS**: Para el diseño y estilo.
- **JavaScript**: Para la lógica del juego.
- **React Context API**: Para manejar el estado global.

## Instalación y uso

Sigue estos pasos para correr el proyecto en tu entorno local:

1. Clona este repositorio:
   git clone https://github.com/EliannyBello/Battleship

2. Accede a la carpeta del proyecto:
cd battleship-game

3. Instala las dependencias:
npm install

4. Inicia el servidor de desarrollo:
npm run dev

5. Abre el juego en tu navegador en la dirección que aparece en la consola (por defecto: http://localhost:5173).


## Estructura del proyecto

src/
├── assets/
│   └── react.svg
├── components/
│   ├── FinalModal.jsx
│   ├── GameBoard.jsx
│   ├── modal.jsx
│   ├── PlayUserBoard.jsx
│   └── victoryScreen.jsx
├── Context/
│   └── GameContext.jsx
├── image/
│   ├── BigMomAvatar.webp
│   ├── KidAvatar.jpg
│   ├── kidShip.png
│   ├── luffyAvatar.jpg
│   ├── luffyShip.png
│   ├── mamaShip.png
│   ├── marineShip.png
│   ├── ShanksAvatar.jpg
│   └── shanksShip.png
├── style/
│   ├── app.css
│   ├── board.css
│   ├── finalModal.css
│   └── modal.css
├── App.jsx
├── data.js
└── main.jsx

## Cómo jugar
1. Coloca tus barcos: Arrastra los barcos de cada uno de los avatar y colócalos en tu tablero. Puedes alternar entre orientación horizontal y vertical.
2. Empieza el juego: Haz clic en el botón "Comenzar".
3. Ataca al enemigo: Haz clic en una celda del tablero de la computadora para atacar.
4. Gana el juego: Hundir todos los barcos del oponente para ganar.


## Próximas mejoras
1. Implementar diferentes niveles de dificultad.
2. Agregar efectos de sonido y música de fondo inspirados en One Piece.
3. Mejorar la interfaz con animaciones dinámicas.
4. Posibilidad de jugar en línea contra otros jugadores.

## Créditos
Inspirado en el universo de One Piece creado por Eiichiro Oda. Este proyecto es una interpretación personal y no está asociado oficialmente con One Piece.


