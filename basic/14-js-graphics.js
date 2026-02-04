/**
 * JS GRAPHICS - Canvas e SVG
 * Este arquivo demonstra Canvas API e manipulação de SVG
 */

console.log("=== JS GRAPHICS - Canvas e SVG ===\n");

// ============================================
// 1. Canvas - Básico
// ============================================
console.log("1. CANVAS - BÁSICO");

function exemploCanvasBasico() {
    return `
        // Obter contexto
        const canvas = document.getElementById('meuCanvas');
        const ctx = canvas.getContext('2d');
        
        // Desenhar retângulo
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, 100, 100);
        
        // Desenhar linha
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(200, 200);
        ctx.stroke();
    `;
}

console.log("Canvas básico:", exemploCanvasBasico());

// ============================================
// 2. Canvas - Formas
// ============================================
console.log("\n2. CANVAS - FORMAS");

function exemploFormas() {
    return `
        const ctx = canvas.getContext('2d');
        
        // Retângulo
        ctx.fillRect(10, 10, 100, 50);
        ctx.strokeRect(120, 10, 100, 50);
        
        // Círculo
        ctx.beginPath();
        ctx.arc(75, 75, 50, 0, Math.PI * 2);
        ctx.fill();
        
        // Triângulo
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(100, 50);
        ctx.lineTo(75, 100);
        ctx.closePath();
        ctx.fill();
        
        // Linha
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(200, 200);
        ctx.stroke();
    `;
}

console.log("Formas:", exemploFormas());

// ============================================
// 3. Canvas - Cores e Estilos
// ============================================
console.log("\n3. CANVAS - CORES E ESTILOS");

function exemploCores() {
    return `
        const ctx = canvas.getContext('2d');
        
        // Fill
        ctx.fillStyle = 'red';
        ctx.fillStyle = '#FF0000';
        ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        
        // Stroke
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round'; // 'butt', 'round', 'square'
        ctx.lineJoin = 'round'; // 'miter', 'round', 'bevel'
        
        // Gradiente linear
        const gradient = ctx.createLinearGradient(0, 0, 200, 0);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(1, 'blue');
        ctx.fillStyle = gradient;
        
        // Gradiente radial
        const radialGradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 50);
        radialGradient.addColorStop(0, 'white');
        radialGradient.addColorStop(1, 'black');
        ctx.fillStyle = radialGradient;
        
        // Padrão (imagem)
        const pattern = ctx.createPattern(imagem, 'repeat');
        ctx.fillStyle = pattern;
    `;
}

console.log("Cores:", exemploCores());

// ============================================
// 4. Canvas - Texto
// ============================================
console.log("\n4. CANVAS - TEXTO");

function exemploTexto() {
    return `
        const ctx = canvas.getContext('2d');
        
        // Fonte
        ctx.font = '30px Arial';
        ctx.fillText('Texto preenchido', 10, 50);
        ctx.strokeText('Texto contorno', 10, 100);
        
        // Alinhamento
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Medir texto
        const metrics = ctx.measureText('Texto');
        console.log('Largura:', metrics.width);
    `;
}

console.log("Texto:", exemploTexto());

// ============================================
// 5. Canvas - Transformações
// ============================================
console.log("\n5. CANVAS - TRANSFORMAÇÕES");

function exemploTransformacoes() {
    return `
        const ctx = canvas.getContext('2d');
        
        // Salvar estado
        ctx.save();
        
        // Translação
        ctx.translate(50, 50);
        
        // Rotação
        ctx.rotate(Math.PI / 4); // 45 graus
        
        // Escala
        ctx.scale(2, 2);
        
        // Desenhar
        ctx.fillRect(0, 0, 50, 50);
        
        // Restaurar estado
        ctx.restore();
        
        // Transformação customizada
        ctx.transform(1, 0, 0, 1, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
    `;
}

console.log("Transformações:", exemploTransformacoes());

// ============================================
// 6. Canvas - Imagens
// ============================================
console.log("\n6. CANVAS - IMAGENS");

function exemploImagens() {
    return `
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Desenhar imagem
            ctx.drawImage(img, 0, 0);
            
            // Escalar
            ctx.drawImage(img, 0, 0, 100, 100);
            
            // Cortar e desenhar
            ctx.drawImage(img, 
                sx, sy, sw, sh,  // Origem
                dx, dy, dw, dh   // Destino
            );
        };
        
        img.src = 'imagem.png';
    `;
}

console.log("Imagens:", exemploImagens());

// ============================================
// 7. Canvas - Animações
// ============================================
console.log("\n7. CANVAS - ANIMAÇÕES");

function exemploAnimacao() {
    return `
        let x = 0;
        
        function animar() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillRect(x, 50, 50, 50);
            x += 2;
            
            if (x > canvas.width) {
                x = 0;
            }
            
            requestAnimationFrame(animar);
        }
        
        animar();
    `;
}

console.log("Animações:", exemploAnimacao());

// ============================================
// 8. Canvas - Pixel Manipulation
// ============================================
console.log("\n8. CANVAS - MANIPULAÇÃO DE PIXELS");

function exemploPixels() {
    return `
        const ctx = canvas.getContext('2d');
        
        // Obter ImageData
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Manipular pixels (RGBA)
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];     // R (inverter)
            data[i + 1] = 255 - data[i + 1]; // G
            data[i + 2] = 255 - data[i + 2]; // B
            // data[i + 3] é alpha
        }
        
        // Aplicar
        ctx.putImageData(imageData, 0, 0);
    `;
}

console.log("Pixels:", exemploPixels());

// ============================================
// 9. SVG - Básico
// ============================================
console.log("\n9. SVG - BÁSICO");

function exemploSVGBasico() {
    return `
        // Criar SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '200');
        svg.setAttribute('height', '200');
        
        // Círculo
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '100');
        circle.setAttribute('cy', '100');
        circle.setAttribute('r', '50');
        circle.setAttribute('fill', 'red');
        svg.appendChild(circle);
        
        // Retângulo
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '10');
        rect.setAttribute('y', '10');
        rect.setAttribute('width', '100');
        rect.setAttribute('height', '50');
        rect.setAttribute('fill', 'blue');
        svg.appendChild(rect);
        
        document.body.appendChild(svg);
    `;
}

console.log("SVG básico:", exemploSVGBasico());

// ============================================
// 10. SVG - Manipulação
// ============================================
console.log("\n10. SVG - MANIPULAÇÃO");

function exemploSVGManipulacao() {
    return `
        // Selecionar elemento SVG
        const circle = document.querySelector('circle');
        
        // Atributos
        circle.setAttribute('fill', 'green');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', '2');
        
        // Transformação
        circle.setAttribute('transform', 'translate(50, 50) rotate(45)');
        
        // Animar
        circle.addEventListener('click', function() {
            this.setAttribute('fill', 'red');
        });
    `;
}

console.log("SVG manipulação:", exemploSVGManipulacao());

// ============================================
// 11. SVG - Path
// ============================================
console.log("\n11. SVG - PATH");

function exemploSVGPath() {
    return `
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Comandos: M (move), L (line), C (curve), Z (close)
        path.setAttribute('d', 'M 10 10 L 100 10 L 100 100 Z');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'black');
        
        // Curva Bézier
        path.setAttribute('d', 'M 10 50 Q 50 10 90 50');
        
        svg.appendChild(path);
    `;
}

console.log("SVG Path:", exemploSVGPath());

// ============================================
// 12. Canvas vs SVG
// ============================================
console.log("\n12. CANVAS VS SVG");

const comparacao = {
    Canvas: {
        tipo: "Bitmap (raster)",
        escalabilidade: "Perde qualidade ao escalar",
        interatividade: "Requer código manual",
        performance: "Melhor para muitas formas",
        uso: "Jogos, gráficos complexos"
    },
    SVG: {
        tipo: "Vetorial",
        escalabilidade: "Mantém qualidade",
        interatividade: "Nativo (eventos DOM)",
        performance: "Melhor para poucas formas",
        uso: "Ícones, gráficos simples"
    }
};

console.log("Comparação:", comparacao);

// ============================================
// 13. Exemplo Completo - Canvas Helper
// ============================================
console.log("\n13. EXEMPLO COMPLETO");

class CanvasHelper {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    
    limpar() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    desenharRetangulo(x, y, largura, altura, cor) {
        this.ctx.fillStyle = cor;
        this.ctx.fillRect(x, y, largura, altura);
    }
    
    desenharCirculo(x, y, raio, cor) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, raio, 0, Math.PI * 2);
        this.ctx.fillStyle = cor;
        this.ctx.fill();
    }
    
    desenharTexto(texto, x, y, fonte, cor) {
        this.ctx.font = fonte;
        this.ctx.fillStyle = cor;
        this.ctx.fillText(texto, x, y);
    }
    
    desenharLinha(x1, y1, x2, y2, cor, largura = 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = cor;
        this.ctx.lineWidth = largura;
        this.ctx.stroke();
    }
    
    criarGradiente(x1, y1, x2, y2, cores) {
        const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
        cores.forEach((cor, index) => {
            gradient.addColorStop(index / (cores.length - 1), cor);
        });
        return gradient;
    }
}

console.log("CanvasHelper criado");

// ============================================
// 14. Exemplo Completo - SVG Helper
// ============================================
console.log("\n14. EXEMPLO COMPLETO - SVG");

class SVGHelper {
    constructor(container) {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', '100%');
        container.appendChild(this.svg);
    }
    
    criarCirculo(cx, cy, r, fill, stroke) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        if (fill) circle.setAttribute('fill', fill);
        if (stroke) circle.setAttribute('stroke', stroke);
        this.svg.appendChild(circle);
        return circle;
    }
    
    criarRetangulo(x, y, width, height, fill) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        if (fill) rect.setAttribute('fill', fill);
        this.svg.appendChild(rect);
        return rect;
    }
    
    criarPath(d, fill, stroke) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        if (fill) path.setAttribute('fill', fill);
        if (stroke) path.setAttribute('stroke', stroke);
        this.svg.appendChild(path);
        return path;
    }
}

console.log("SVGHelper criado");

console.log("\n=== FIM JS GRAPHICS ===");
console.log("\nNota: Execute em ambiente de navegador para funcionalidade completa");
