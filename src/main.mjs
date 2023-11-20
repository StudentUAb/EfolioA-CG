 //main.js
/*
UC: 21020 - Computação Grafica
Ano 2023/24 - EFOLIO A -  Implementação do algoritmo do ponto médio e  Interface Gráfico - UAb
**
** Aluno: 2100927 - Ivo Baptista 
*/

// Importa o módulo lineMP
import { MidpointLine as lineMP } from '../lineMP.mjs';
// Importa o módulo THREE
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
// Importa o módulo OrbitControls
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';

// Lista de quadrados
let squaresArray = [];
// Lista de objetos adicionados
let addedObjects = [];

// Loop de renderização da cena
let isCameraAnimating = false;
let cameraTargetPosition = new THREE.Vector3();
let cameraStartPosition = new THREE.Vector3();
let cameraMoveDuration = 1.5; // duração da animação em segundos
let cameraMoveTime = 0; // Coloca o tempo inicial em 0
const cameraNewPosition = new THREE.Vector3(0, 0, 10); // A posição da câmera para vista de cima

// Criação da cena, câmera e renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Inicializa o relógio do THREE.js para controlar o tempo
const clock = new THREE.Clock();

// Instruçoes menu
const instructionsContainer = document.createElement('div');
instructionsContainer.innerHTML = `
    <h3>Instruções:</h3>
    <p>Pressionar <b>X</b> - Selecionar quadrado</p>
    <p>Pressionar <b>Backspace</b> - Apagar objetos adicionados</p>
    <p>Pressionar <b>C</b> - Reset da posição da câmera</p>
`;
instructionsContainer.id = 'instructions'; // Adiciona ID para manipular o elemento com CSS
document.body.appendChild(instructionsContainer);

// Orbit Controls para movimentar a câmera
const controls = new OrbitControls(camera, renderer.domElement);

const sideLength = 1; // tamanho de um lado do quadrado

// Tamanho da grelha
const gridSize = 21;
const halfSize = Math.floor(gridSize / 2);

// Cria a grelha de quadrados alternados
for (let i = -halfSize; i <= halfSize; i++) { // loop para criar os quadrados
    for (let j = -halfSize; j <= halfSize; j++) { // loop para criar os quadrados
        const geometry = new THREE.BoxGeometry(sideLength, sideLength, 0.1); // geometria do quadrado
        const isEven = (i + j) % 2 === 0; // verifica se é par ou ímpar
        const color = isEven ? 0x8a89b3 : 0xf18966; // cores alternadas
        const material = new THREE.MeshBasicMaterial({color: color}); // material do quadrado
        const square = new THREE.Mesh(geometry, material); // cria o mesh do quadrado
        square.position.set(i * sideLength, j * sideLength, 0.05); // posiciona o quadrado na grelha
        square.name = `square_${i}_${j}`; // nome para identificação do quadrado
        scene.add(square); // Adiciona o quadrado à cena
        squaresArray.push(square); // Adicionado à lista de quadrados
    }
}

// Desenhar os eixos X e Y em azul e vermelho
// // Eixo X
// const materialX = new THREE.LineBasicMaterial({color: 0x0000ff});
// const geometryX = new THREE.Geometry();
// geometryX.vertices.push(new THREE.Vector3(-halfSize * sideLength, 0, 0.1));
// geometryX.vertices.push(new THREE.Vector3(halfSize * sideLength, 0, 0.1));
// const lineX = new THREE.Line(geometryX, materialX);
// scene.add(lineX);
// // Eixo Y
// const materialY = new THREE.LineBasicMaterial({color: 0xff0000});
// const geometryY = new THREE.Geometry();
// geometryY.vertices.push(new THREE.Vector3(0, -halfSize * sideLength, 0.1));
// geometryY.vertices.push(new THREE.Vector3(0, halfSize * sideLength, 0.1));
// const lineY = new THREE.Line(geometryY, materialY);
// scene.add(lineY);

// Desenhar os eixos X e Y em azul e vermelho em forma de L
// Eixo X 
const materialX = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Cor azul
const geometryX = new THREE.Geometry(); // Geometria
geometryX.vertices.push(new THREE.Vector3(0, 0, 0.1)); // Começa do ponto central
geometryX.vertices.push(new THREE.Vector3(halfSize * sideLength, 0, 0.1)); // Vai até a metade positiva
const lineX = new THREE.Line(geometryX, materialX); // Cria a linha
scene.add(lineX); // Adiciona à cena

// Eixo Y 
const materialY = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Cor vermelha
const geometryY = new THREE.Geometry(); // Geometria
geometryY.vertices.push(new THREE.Vector3(0, halfSize * sideLength, 0.1)); // Começa da metade positiva
geometryY.vertices.push(new THREE.Vector3(0, 0, 0.1)); // Termina no ponto central
const lineY = new THREE.Line(geometryY, materialY); // Cria a linha
scene.add(lineY); // Adiciona à cena

// Raycaster e mouse para interação com os quadrados
const raycaster = new THREE.Raycaster(); // Raycaster para interação com os objetos
const mouse = new THREE.Vector2(); // Posição do mouse no espaço de coordenadas da tela

// Lista de pontos selecionados
let selectedPoints = []; // Lista de pontos selecionados
let lastHighlightedSquare = null; // Mantém registo do último quadrado destacado
// let selectedSquare = null; // Mantém registo do quadrado selecionado



    




// Event listener para o movimento do rato
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1; // Normaliza a posição do rato
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // Normaliza a posição do rato
    raycaster.setFromCamera(mouse, camera); // Lança raio a partir da câmera
    // Obter o quadrado sob o cursor
    const intersects = raycaster.intersectObjects(squaresArray, true); // Interseção com os objetos
    if (intersects.length > 0) {
        const intersection = intersects[0]; // Obter a primeira interseção
        
          // Verificar se o quadrado não está na lista de selecionados antes de alterar a cor
          if (!selectedSquares.has(intersection.object)) {
            // Restaurar a cor do último quadrado destacado
            if (lastHighlightedSquare && !selectedSquares.has(lastHighlightedSquare)) {
                const isEven = (lastHighlightedSquare.position.x + lastHighlightedSquare.position.y) % 2 === 0;
                const color = isEven ? 0x8a89b3 : 0xf18966;
                lastHighlightedSquare.material.color.set(color);
            }

            // Destacar o quadrado atual sob o cursor
            intersection.object.material.color.set(0x00ff00);
            lastHighlightedSquare = intersection.object;
        }
    }
    
//Atualizar as coordenadas x e y no div de instruções
 const halfGridSize = 21; // Metade do tamanho da grelha para o mapeamento
 const normalizedX = (event.clientX / window.innerWidth) * 2 - 1; // Normaliza a posição X do mouse
 const normalizedY = -(event.clientY / window.innerHeight) * 2 + 1; // Normaliza a posição Y do mouse
 const boardX = Math.round(normalizedX * halfGridSize);
 const boardY = Math.round(normalizedY * halfGridSize)/2;

 const cursorPositionElement = document.getElementById('cursorPosition');
 cursorPositionElement.textContent = `Pixel: X: ${event.clientX} Y: ${event.clientY} | Normalizadas: X: ${normalizedX.toFixed(2)} Y: ${normalizedY.toFixed(2)} | Tabuleiro: X: ${boardX} Y: ${boardY}`;
});

 

// Lista de quadrados selecionados
let selectedSquares = new Set();
    
    // Event listener para o clique do rato
    window.addEventListener('keydown', async (event) => {
        // // Reset da posição da câmera
        // if (event.key === "C" || event.key === "c") {
        //     camera.position.x = 0;
        //     camera.position.y = 0;
        //     camera.position.z = 11;
        //     camera.lookAt(0, 0, 0);
        // }
        
        // Seleção de quadrados com "X"
        if (event.key === "X" || event.key === "x") {
            console.log("Tecla 'X' pressionada");  // Mensagem de Debbug
            raycaster.setFromCamera(mouse, camera); // Lança raio a partir da câmera
            const intersects = raycaster.intersectObjects(squaresArray, true); // Interseção com os objetos
            // Se o cursor estiver sobre um quadrado
            if (intersects.length > 0) {
                const intersection = intersects[0]; // obtem a primeira interseção
                // Se o quadrado selecionado for um quadrado da grelha
                if (intersection.object.type === "Mesh") {
                    selectedSquares.add(intersection.object); // Adicionar o quadrado à lista de selecionados
                    intersection.object.material.color.set(0xff0000); // Cor vermelha
                    console.log("Tipo de objeto interagido: ", intersection.object.type); // Mensagem de Debbug
                    
                    // Colorir o quadrado selecionado de vermelho
                    intersection.object.material.color.set(0xff0000); // Cor vermelha
                    intersection.object.material.opacity = 1; // Opacidade total
                    intersection.object.material.transparent = false; // Não transparente

                    // Armazenar o ponto selecionado
                    const gridPoint = { x: Math.round(intersection.object.position.x), y: Math.round(intersection.object.position.y) }; // Arredonda a posição do quadrado
                    selectedPoints.push(gridPoint);// Adicionar o ponto à lista de pontos selecionados
                    console.log("Ponto adicionado: ", gridPoint); // Mensagem de Debbug
                    // Se já existirem dois pontos selecionados para desenhar uma linha)
                    if (selectedPoints.length == 2) {
                        // Chamar lineMP e obter os pontos da linha
                        const segment = lineMP(selectedPoints[0], selectedPoints[1]); // Chama o método MidpointLine
                        console.log(segment); // Pontos da linha no console
                        const ladrilhoHeight = sideLength / 4; // Altura dos ladrilhos
                        segment.forEach(point => {
                        console.log("Criando ladrilho em: ", point); // Mensagem de Debbug
                            // Desenhar ladrilho em amarelo
                           const ladrilhoGeometry = new THREE.BoxGeometry(sideLength, sideLength, ladrilhoHeight); // Geometria do ladrilho
                           const ladrilhoMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.7, depthWrite: false });  // Material do ladrilho                          
                           const ladrilho = new THREE.Mesh(ladrilhoGeometry, ladrilhoMaterial); // Criar objeto ladrilho
                           // Posicionar o ladrilho
                           ladrilho.position.set(point.x * sideLength, point.y * sideLength, 0.2);  // Posiciona o ladrilho
                           scene.add(ladrilho); // Adiciona o ladrilho à cena
                           addedObjects.push(ladrilho); // Adiciona o objeto criado à lista de objetos criados
                        });                        
                                
                        // Desenhar linha exata em preto
                        const material = new THREE.LineBasicMaterial({ color: 0x000000 }); // Material da linha
                        const geometry = new THREE.Geometry(); // Geometria da linha
                        geometry.vertices.push(new THREE.Vector3(selectedPoints[0].x, selectedPoints[0].y, 0.3)); // Adiciona o primeiro ponto
                        geometry.vertices.push(new THREE.Vector3(selectedPoints[1].x, selectedPoints[1].y, 0.3)); // Adiciona o segundo ponto
                        console.log("Criando linha entre: ", selectedPoints[0], " e ", selectedPoints[1]); // Mensagem de Debbug
                        // Adicionar a linha à cena
                        const line = new THREE.Line(geometry, material); // Cria a linha com a geometria e material definidos
                        scene.add(line); // Adiciona a linha à cena
                        addedObjects.push(line); // Adiciona a linha à lista de objetos criados
    
                        // Reset dos pontos selecionados
                        selectedPoints = []; // Limpa a lista de pontos selecionados
                    }
                }
            }
        } 
        
        // Backspace para apagar os objetos adicionados
        else if (event.key === "Backspace") {
            // Remove todos os objetos adicionados
            addedObjects.forEach(object => {
                scene.remove(object);
            });
            addedObjects = []; // Limpa a lista de objetos adicionados
        
            // Restauramos a cor dos quadrados selecionados
            selectedSquares.forEach(square => {
                const isEven = (square.position.x + square.position.y) % 2 === 0;
                const color = isEven ? 0x8a89b3 : 0xf18966;
                square.material.color.set(color);
            });
            selectedSquares.clear(); // Limpa a lista de quadrados selecionados
        
            selectedPoints = []; // Limpa a lista de pontos selecionados
        }
        
        // Reset posiçao da camara com Tecla C, animação e a câmera para a vista de cima
        if (event.key === "C" || event.key === "c") {
            // Inicia a animação da câmera para a vista de cima
            cameraStartPosition.copy(camera.position); // Copia a posição atual da câmera
            cameraTargetPosition.copy(cameraNewPosition); // Define a posição alvo da câmera
            isCameraAnimating = true; // Ativa a animação da câmera
            cameraMoveTime = 0; // Coloca em zero o tempo da animação
        }  
    });

    // Animação da câmera
    function updateCameraPosition(deltaTime) {
        if (isCameraAnimating) {
            cameraMoveTime += deltaTime; // Incrementa o tempo da animação
            if (cameraMoveTime > cameraMoveDuration) {
                cameraMoveTime = cameraMoveDuration; // Limitamos o tempo da animação
                isCameraAnimating = false; // Desativamos a animação da câmera
            }
            const t = cameraMoveTime / cameraMoveDuration; // Calculamos o tempo da animação relativo ao total
            camera.position.lerpVectors(cameraStartPosition, cameraTargetPosition, t); // Interpolamos a posição da câmera entre o inicio e alvo
            camera.lookAt(new THREE.Vector3(0, 0, 0)); // Apontamos a câmera para o centro da cena
        }
    }
    
// // Logo Three.js em 3D com o propio Three.js
// // Adiciona um carregador de texturas
// const textureLoader = new THREE.TextureLoader();

// // Carrega a textura do logotipo theejs
// const logoTexture = textureLoader.load('/assets/triang3.png');

// // Cria a TetrahedronGeometry e o material do logotipo com a textura
// const logoGeometry = new THREE.TetrahedronGeometry(1, 0);
// const logoMaterial = new THREE.MeshBasicMaterial({ map: logoTexture, });
// const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);

// // Define a posição e adiciona o logotipo à cena
// logoMesh.position.set(17, -7, 0); // Ajustamos a posição conforme necessário
// scene.add(logoMesh);

// Camera inicial e renderização da cena
camera.position.set(0, 0, 10); // Posição inicial da câmera

// Render loop para animação
function animate() {
    requestAnimationFrame(animate); // Chama o método animate recursivamente

    const deltaTime = clock.getDelta(); // Obtém o deltaTime desde o último frame
    updateCameraPosition(deltaTime); // Atualizamos a posição da câmera com base na animação

    //  // Rotação do logotipo em torno de seus eixos y e x e z
    // logoMesh.rotation.y += 0.01;
    // logoMesh.rotation.x += 0.01;
    // logoMesh.rotation.z += 0.01;
    renderer.render(scene, camera); // Renderiza a cena
}
// Iniciar animação
animate(); // Chama o método animate pela primeira vez
