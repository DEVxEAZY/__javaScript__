/**
 * JS WEB APIs - APIs do Navegador
 * Este arquivo demonstra várias Web APIs disponíveis no navegador
 */

console.log("=== JS WEB APIs - APIs do Navegador ===\n");

// ============================================
// 1. Geolocation API
// ============================================
console.log("1. GEOLOCATION API");

function obterLocalizacao() {
    return `
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Latitude:', position.coords.latitude);
                    console.log('Longitude:', position.coords.longitude);
                },
                (error) => {
                    console.error('Erro:', error.message);
                }
            );
        }
    `;
}

console.log("Geolocation:", obterLocalizacao());

// Watch position
function observarLocalizacao() {
    return `
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                console.log('Nova posição:', position.coords);
            }
        );
        
        // Parar observação
        navigator.geolocation.clearWatch(watchId);
    `;
}

console.log("Watch position:", observarLocalizacao());

// ============================================
// 2. Notification API
// ============================================
console.log("\n2. NOTIFICATION API");

async function exemploNotificacao() {
    // Solicitar permissão
    if ('Notification' in window) {
        const permissao = await Notification.requestPermission();
        
        if (permissao === 'granted') {
            // Criar notificação
            const notificacao = new Notification('Título', {
                body: 'Corpo da notificação',
                icon: '/icon.png',
                badge: '/badge.png',
                tag: 'tag-unica',
                requireInteraction: true
            });
            
            // Eventos
            notificacao.onclick = () => {
                console.log('Notificação clicada');
            };
            
            notificacao.onclose = () => {
                console.log('Notificação fechada');
            };
        }
    }
}

console.log("Notification API disponível");

// ============================================
// 3. Clipboard API
// ============================================
console.log("\n3. CLIPBOARD API");

async function exemploClipboard() {
    return `
        // Copiar texto
        await navigator.clipboard.writeText('Texto para copiar');
        
        // Colar texto
        const texto = await navigator.clipboard.readText();
        
        // Copiar imagem
        const blob = await fetch('image.png').then(r => r.blob());
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
    `;
}

console.log("Clipboard API:", exemploClipboard());

// ============================================
// 4. File API
// ============================================
console.log("\n4. FILE API");

function exemploFileAPI() {
    return `
        // Input file
        const input = document.querySelector('input[type="file"]');
        
        input.addEventListener('change', (e) => {
            const arquivo = e.target.files[0];
            
            // Ler como texto
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log('Conteúdo:', e.target.result);
            };
            reader.readAsText(arquivo);
            
            // Ler como Data URL
            reader.readAsDataURL(arquivo);
            
            // Ler como ArrayBuffer
            reader.readAsArrayBuffer(arquivo);
        });
    `;
}

console.log("File API:", exemploFileAPI());

// ============================================
// 5. Drag and Drop API
// ============================================
console.log("\n5. DRAG AND DROP API");

function exemploDragDrop() {
    return `
        // Elemento arrastável
        elemento.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', 'dados');
        });
        
        // Zona de drop
        zonaDrop.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        zonaDrop.addEventListener('drop', (e) => {
            e.preventDefault();
            const dados = e.dataTransfer.getData('text/plain');
            console.log('Dados:', dados);
        });
    `;
}

console.log("Drag and Drop:", exemploDragDrop());

// ============================================
// 6. Intersection Observer API
// ============================================
console.log("\n6. INTERSECTION OBSERVER API");

function exemploIntersectionObserver() {
    return `
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Elemento visível');
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        });
        
        observer.observe(elemento);
    `;
}

console.log("Intersection Observer:", exemploIntersectionObserver());

// ============================================
// 7. Resize Observer API
// ============================================
console.log("\n7. RESIZE OBSERVER API");

function exemploResizeObserver() {
    return `
        const observer = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                console.log('Novo tamanho:', entry.contentRect);
            });
        });
        
        observer.observe(elemento);
    `;
}

console.log("Resize Observer:", exemploResizeObserver());

// ============================================
// 8. Performance API
// ============================================
console.log("\n8. PERFORMANCE API");

// Performance.now() - Tempo de alta precisão
const inicio = performance.now();
// ... código ...
const fim = performance.now();
console.log("Tempo decorrido:", fim - inicio, "ms");

// Performance.mark e Measure
function exemploPerformance() {
    return `
        // Marcar ponto
        performance.mark('inicio');
        // ... código ...
        performance.mark('fim');
        
        // Medir entre marcas
        performance.measure('operacao', 'inicio', 'fim');
        
        // Obter medidas
        const medidas = performance.getEntriesByType('measure');
        console.log('Medidas:', medidas);
    `;
}

console.log("Performance API:", exemploPerformance());

// ============================================
// 9. Web Workers
// ============================================
console.log("\n9. WEB WORKERS");

function exemploWebWorker() {
    return `
        // Criar worker
        const worker = new Worker('worker.js');
        
        // Enviar mensagem
        worker.postMessage({ tipo: 'calcular', dados: [1, 2, 3] });
        
        // Receber mensagem
        worker.onmessage = (e) => {
            console.log('Resultado:', e.data);
        };
        
        // Erro
        worker.onerror = (e) => {
            console.error('Erro no worker:', e);
        };
        
        // Terminar
        worker.terminate();
    `;
}

console.log("Web Workers:", exemploWebWorker());

// ============================================
// 10. Service Workers
// ============================================
console.log("\n10. SERVICE WORKERS");

function exemploServiceWorker() {
    return `
        // Registrar
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('SW registrado'))
                .catch(err => console.error('Erro:', err));
        }
        
        // No service worker (sw.js):
        // self.addEventListener('install', ...);
        // self.addEventListener('fetch', ...);
    `;
}

console.log("Service Workers:", exemploServiceWorker());

// ============================================
// 11. WebSocket API
// ============================================
console.log("\n11. WEBSOCKET API");

function exemploWebSocket() {
    return `
        const ws = new WebSocket('ws://example.com');
        
        ws.onopen = () => {
            console.log('Conectado');
            ws.send('Mensagem');
        };
        
        ws.onmessage = (e) => {
            console.log('Mensagem recebida:', e.data);
        };
        
        ws.onerror = (e) => {
            console.error('Erro:', e);
        };
        
        ws.onclose = () => {
            console.log('Desconectado');
        };
        
        ws.close();
    `;
}

console.log("WebSocket:", exemploWebSocket());

// ============================================
// 12. MediaDevices API
// ============================================
console.log("\n12. MEDIADEVICES API");

async function exemploMediaDevices() {
    return `
        // Acessar câmera
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        
        // Usar stream em vídeo
        videoElement.srcObject = stream;
        
        // Parar
        stream.getTracks().forEach(track => track.stop());
        
        // Listar dispositivos
        const dispositivos = await navigator.mediaDevices.enumerateDevices();
    `;
}

console.log("MediaDevices:", exemploMediaDevices());

// ============================================
// 13. Battery API
// ============================================
console.log("\n13. BATTERY API");

async function exemploBattery() {
    if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();
        
        console.log("Bateria carregando:", battery.charging);
        console.log("Nível:", battery.level * 100 + "%");
        console.log("Tempo de carregamento:", battery.chargingTime);
        console.log("Tempo de descarga:", battery.dischargingTime);
        
        battery.addEventListener('chargingchange', () => {
            console.log("Status de carregamento mudou");
        });
    }
}

console.log("Battery API disponível");

// ============================================
// 14. Payment Request API
// ============================================
console.log("\n14. PAYMENT REQUEST API");

function exemploPaymentRequest() {
    return `
        const paymentRequest = new PaymentRequest(
            [{
                supportedMethods: 'basic-card',
                data: {
                    supportedNetworks: ['visa', 'mastercard']
                }
            }],
            {
                total: {
                    label: 'Total',
                    amount: { currency: 'BRL', value: '100.00' }
                }
            }
        );
        
        paymentRequest.show()
            .then(paymentResponse => {
                // Processar pagamento
                paymentResponse.complete('success');
            });
    `;
}

console.log("Payment Request:", exemploPaymentRequest());

// ============================================
// 15. Speech Synthesis API
// ============================================
console.log("\n15. SPEECH SYNTHESIS API");

function exemploSpeechSynthesis() {
    return `
        const utterance = new SpeechSynthesisUtterance('Olá, mundo!');
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        speechSynthesis.speak(utterance);
        
        // Parar
        speechSynthesis.cancel();
    `;
}

console.log("Speech Synthesis:", exemploSpeechSynthesis());

// ============================================
// 16. Speech Recognition API
// ============================================
console.log("\n16. SPEECH RECOGNITION API");

function exemploSpeechRecognition() {
    return `
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        
        recognition.onresult = (e) => {
            const texto = e.results[e.results.length - 1][0].transcript;
            console.log('Texto:', texto);
        };
        
        recognition.start();
        recognition.stop();
    `;
}

console.log("Speech Recognition:", exemploSpeechRecognition());

// ============================================
// 17. Fullscreen API
// ============================================
console.log("\n17. FULLSCREEN API");

function exemploFullscreen() {
    return `
        // Entrar em fullscreen
        elemento.requestFullscreen();
        
        // Sair
        document.exitFullscreen();
        
        // Verificar se está em fullscreen
        const isFullscreen = document.fullscreenElement !== null;
        
        // Evento
        document.addEventListener('fullscreenchange', () => {
            console.log('Fullscreen mudou');
        });
    `;
}

console.log("Fullscreen API:", exemploFullscreen());

// ============================================
// 18. Page Visibility API
// ============================================
console.log("\n18. PAGE VISIBILITY API");

function exemploPageVisibility() {
    return `
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('Página oculta');
            } else {
                console.log('Página visível');
            }
        });
        
        const isVisible = !document.hidden;
    `;
}

console.log("Page Visibility:", exemploPageVisibility());

// ============================================
// 19. Broadcast Channel API
// ============================================
console.log("\n19. BROADCAST CHANNEL API");

function exemploBroadcastChannel() {
    return `
        const channel = new BroadcastChannel('meu-canal');
        
        // Enviar mensagem
        channel.postMessage({ tipo: 'dados', valor: 42 });
        
        // Receber mensagem
        channel.onmessage = (e) => {
            console.log('Mensagem recebida:', e.data);
        };
        
        // Fechar
        channel.close();
    `;
}

console.log("Broadcast Channel:", exemploBroadcastChannel());

// ============================================
// 20. Exemplo Completo - Helper
// ============================================
console.log("\n20. EXEMPLO COMPLETO");

class WebAPIHelper {
    static async obterLocalizacao() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation não suportado"));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                position => resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }),
                error => reject(error)
            );
        });
    }
    
    static async copiarParaClipboard(texto) {
        try {
            await navigator.clipboard.writeText(texto);
            return true;
        } catch (err) {
            console.error("Erro ao copiar:", err);
            return false;
        }
    }
    
    static verificarSuporte() {
        return {
            geolocation: 'geolocation' in navigator,
            clipboard: 'clipboard' in navigator,
            notifications: 'Notification' in window,
            serviceWorker: 'serviceWorker' in navigator,
            webSocket: 'WebSocket' in window
        };
    }
}

console.log("WebAPIHelper criado");
console.log("Suporte:", WebAPIHelper.verificarSuporte());

console.log("\n=== FIM JS WEB APIs ===");
