import { createServer } from 'http';
const http = require("http");
const readlineSync = require("readline-sync");
const words = ["ironMan" , "thor", "hulk",  "hawkeye", "spiderman", "doctorstrange",  "wolverine", "deadpool", "magneto"];
const secretWord = words[Math.floor(Math.random() * words.length)];
let correctLetters = [];
let incorrectLetters = [];
let attemptsLeft = 6;
const images = [
  "https://github.com/juanro9910/juego-ahorcado-master/blob/master/img/ahorcado_6.png?raw=true",
  "https://github.com/juanro9910/juego-ahorcado-master/blob/master/img/ahorcado_5.png?raw=true",
  "https://github.com/juanro9910/juego-ahorcado-master/blob/master/img/ahorcado_4.png?raw=true",
  "https://github.com/juanro9910/juego-ahorcado-master/blob/master/img/ahorcado_3.png?raw=true",
  "https://github.com/juanro9910/juego-ahorcado-master/blob/master/img/ahorcado_2.png?raw=true",
  "https://github.com/juanro9910/juego-ahorcado-master/blob/master/img/ahorcado_1.png?raw=true",
];
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    let display = "";
    for (let i = 0; i < secretWord.length; i++) {
      if (correctLetters.includes(secretWord[i])) {
        display += secretWord[i] + " ";
      } else {
        display += "_ ";
      }
    }
    let html = `
    <html>
    <head>
      <title>Juego de Ahorcado</title>
      <meta charset="UTF-8">
      <style>
      body {
font-family: Arial, sans-serif;
text-align: center;
background-color: rgb(248, 246, 246);
color: navy;
}

h1 {
margin-bottom: 20px;
color: navy;
}
h2 {
  margin-bottom: 10px;
  color: rgb(128, 0, 0);
}
p {
margin-bottom: 10px;
color: navy;
}

form {
margin-top: 20px;
display: inline-block;
text-align: left;
}

label {
display: block;
margin-bottom: 5px;
color: navy;
}

input[type="text"] {
width: 212px;
padding: 5px;
font-size: 16px;
color: navy;
background-color: white;
border: 1px solid navy;
border-radius: 5px;
}

button[type="submit"] {
padding: 5px 20px;
font-size: 16px;
background-color: navy;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}

button[type="submit"]:hover {
background-color: white;
color: navy;
}

img {
border-radius: 10px;
width: 300px;
height: auto;
}
</style>

    </head>
    <body>
      <h1>Juego de Ahorcado - Marvel</h1>
      <h2>Debe ser en Minuscula la Letras</h2>

      <p>Palabra secreta: ${display}</p>
      <p>Letras incorrectas: ${incorrectLetters.join(", ")}</p>
      <p>Intentos restantes: ${attemptsLeft}</p>
      <img src="${images[incorrectLetters.length]}"/>
      <br>        <br><br>

      <form action="/guess" method="post">
        <label for="letter">Ingresa una letra:</label>
        <input type="text" name="letter" id="letter" maxlength="1">
        <button type="submit">Adivinar</button>

      </form>
      <h2>Fabricio Adrian Lopez Rosales</h2>

    </body>
  </html>
    `;


    
    if (incorrectLetters.length >= 6) {
      html = `
        <html>
          <head> 
          <title>Juego de Ahorcado</title>
          <meta charset="UTF-8">


          <style>
          body {
            background-color: lightgray;
            font-family: Arial, sans-serif;
          }
          
          h1 {
            text-align: center;
            color: red;
          }
          
          p {
            text-align: center;
            font-size: 1.5em;
            margin-top: 10px;
          }
          
          img {
            display: block;
            margin-left: auto;
            margin-right: auto;
            width: 28%;
          }
          
          button {
            display: block;
            margin-left: auto;
            margin-right: auto;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: green;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          </style>
          </head>
    
          <body>
            <h1>Perdiste!</h1>
            <p>La palabra era: "${secretWord}"</p>
            <img src="https://github.com/juanro9910/juego-ahorcado-master/blob/master/img/ahorcado_0.png?raw=true"/>
    
            <button onclick="location.reload()">Iniciar de nuevo</button>
          </body>
          <script>
    function restart() {
      location.reload();
    }
    </script>
        </html>
      `;
    } else if (secretWord.split("").every(letter => correctLetters.includes(letter))) {
      html = `
        <html>
          <head> 
          <title>Juego de Ahorcado</title>
          <meta charset="UTF-8">
          <style>
          body {
            text-align: center;
            font-family: Arial, sans-serif;
          }
      
          h1 {
            color: green;
          }
      
          button {
            padding: 10px 20px;
            border-radius: 5px;
            background-color: lightblue;
            color: white;
            cursor: pointer;
          }
          img {
            display: block;
            margin-left: auto;
            margin-right: auto;
            width: 28%;
          }
          
        </style>
          </head>
    
          <body>
            <h1>¡Ganaste!</h1>
            <p>Adivinaste la palabra "${secretWord}"</p>
            <img src="https://pngimage.net/wp-content/uploads/2018/06/ganaste-png-1.png"/>

            <button onclick="location.reload()">Jugar de nuevo</button>
          </body>
          <script>
    function restart() {
      location.reload();
    }
    </script>
        </html>
      `;
    }
    

    res.end(html);
  } else if (req.url === "/guess") {
    let letter = "";
    req.on("data", chunk => {
    letter += chunk;
    });
    req.on("end", () => {
    letter = decodeURIComponent(letter.split("=")[1]);
    if (secretWord.includes(letter)) {
    correctLetters.push(letter);
    } else {
    incorrectLetters.push(letter);
    }
    res.writeHead(302, { "Location": "/" });
    res.end();
    });
    } else if (req.url === "/play-again") {
    correctLetters = [];
    incorrectLetters = [];
    attemptsLeft = 6;
    secretWord = words[Math.floor(Math.random() * words.length)];
    res.writeHead(302, { "Location": "/" });
    res.end();
    } else {
    res.writeHead(404);
    res.end();
    }
    });   
}).listen(process.env.PORT);
