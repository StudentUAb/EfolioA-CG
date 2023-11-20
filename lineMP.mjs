 //main.js
/*
UC: 21020 - Computação Grafica
Ano 2023/24 - EFOLIO A -  Implementação do algoritmo do ponto médio e  Interface Gráfico - UAb
**
** Aluno: 2100927 - Ivo Baptista 
*/

// Método MidpointLine para desenhar linhas
export function MidpointLine(P, Q) {
    P = { ...P }; // cria uma cópia de P
    Q = { ...Q }; // cria uma cópia de Q
    let points = []; // inicializa um array vazio para armazenar os pontos
    const dx = Math.abs(Q.x - P.x); // calcula a diferença absoluta entre as coordenadas x
    const dy = Math.abs(Q.y - P.y); // calcula a diferença absoluta entre as coordenadas y
    let sx = (P.x < Q.x) ? 1 : -1; // determina o sentido do incremento de x
    let sy = (P.y < Q.y) ? 1 : -1; // determina o sentido do incremento de y
    let err = dx - dy; // calcula o erro inicial

    // loop principal
    while (true) {
        points.push({ x: P.x, y: P.y }); // adiciona o ponto atual ao array

        if (P.x === Q.x && P.y === Q.y) break; // para o loop quando alcançar o ponto final

        let e2 = 2 * err; // calcula o erro para a próxima iteração

        // atualiza o ponto P e o erro para a próxima iteração
        if (e2 > -dy) {
            err -= dy; // atualiza o erro
            P.x += sx; // atualiza a coordenada x
        }
        // atualiza o ponto P e o erro para a próxima iteração
        if (e2 < dx) {
            err += dx; // atualiza o erro
            P.y += sy; // atualiza a coordenada y
        }
    }
    
    // Adiciona ponto final ao array
    return points;
}
