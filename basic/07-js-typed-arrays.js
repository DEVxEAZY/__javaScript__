/**
 * JS TYPED ARRAYS - Arrays Tipados
 * Este arquivo demonstra ArrayBuffer, TypedArray e DataView
 */

console.log("=== JS TYPED ARRAYS - Arrays Tipados ===\n");

// ============================================
// 1. ArrayBuffer
// ============================================
console.log("1. ARRAYBUFFER");

// Criar buffer de 16 bytes
const buffer = new ArrayBuffer(16);
console.log("Buffer tamanho:", buffer.byteLength);

// ArrayBuffer não pode ser acessado diretamente
// Precisa de uma "view" (TypedArray ou DataView)

// ============================================
// 2. Typed Arrays - Int8Array
// ============================================
console.log("\n2. TYPED ARRAYS - Int8Array");

// Int8Array: 8 bits, inteiro com sinal (-128 a 127)
const int8 = new Int8Array(4);
int8[0] = 42;
int8[1] = -10;
int8[2] = 100;
int8[3] = -50;

console.log("Int8Array:", int8);
console.log("Tamanho:", int8.length);
console.log("Bytes por elemento:", int8.BYTES_PER_ELEMENT);

// ============================================
// 3. Typed Arrays - Uint8Array
// ============================================
console.log("\n3. Uint8Array");

// Uint8Array: 8 bits, inteiro sem sinal (0 a 255)
const uint8 = new Uint8Array([10, 20, 30, 40]);
console.log("Uint8Array:", uint8);

// Útil para trabalhar com dados binários
const bytes = new Uint8Array([0x48, 0x65, 0x6C, 0x6C, 0x6F]); // "Hello"
console.log("Bytes:", bytes);

// ============================================
// 4. Typed Arrays - Int16Array, Uint16Array
// ============================================
console.log("\n4. Int16Array e Uint16Array");

// Int16Array: 16 bits, inteiro com sinal
const int16 = new Int16Array([1000, -500, 2000]);
console.log("Int16Array:", int16);

// Uint16Array: 16 bits, inteiro sem sinal
const uint16 = new Uint16Array([1000, 500, 2000]);
console.log("Uint16Array:", uint16);

// ============================================
// 5. Typed Arrays - Int32Array, Uint32Array
// ============================================
console.log("\n5. Int32Array e Uint32Array");

// Int32Array: 32 bits, inteiro com sinal
const int32 = new Int32Array([100000, -50000]);
console.log("Int32Array:", int32);

// Uint32Array: 32 bits, inteiro sem sinal
const uint32 = new Uint32Array([100000, 50000]);
console.log("Uint32Array:", uint32);

// ============================================
// 6. Typed Arrays - Float32Array, Float64Array
// ============================================
console.log("\n6. Float32Array e Float64Array");

// Float32Array: 32 bits, ponto flutuante
const float32 = new Float32Array([3.14, 2.71, 1.41]);
console.log("Float32Array:", float32);

// Float64Array: 64 bits, ponto flutuante (double)
const float64 = new Float64Array([3.14159265359, 2.71828182846]);
console.log("Float64Array:", float64);

// ============================================
// 7. Criar TypedArray a partir de ArrayBuffer
// ============================================
console.log("\n7. TYPEDARRAY DE ARRAYBUFFER");

const buffer2 = new ArrayBuffer(16);

// Múltiplas views do mesmo buffer
const view1 = new Int32Array(buffer2);
const view2 = new Uint8Array(buffer2);

view1[0] = 0x12345678;
console.log("Int32Array[0]:", view1[0].toString(16));
console.log("Uint8Array[0-3]:", view2.slice(0, 4));

// ============================================
// 8. DataView - Acesso Flexível
// ============================================
console.log("\n8. DATAVIEW");

const buffer3 = new ArrayBuffer(16);
const view = new DataView(buffer3);

// Escrever valores com diferentes tamanhos
view.setInt8(0, 42);        // 1 byte
view.setInt16(1, 1000);      // 2 bytes (little-endian)
view.setInt32(3, 100000);    // 4 bytes
view.setFloat64(7, 3.14159); // 8 bytes

// Ler valores
console.log("Int8:", view.getInt8(0));
console.log("Int16:", view.getInt16(1));
console.log("Int32:", view.getInt32(3));
console.log("Float64:", view.getFloat64(7));

// Big-endian vs Little-endian
view.setInt16(0, 0x1234, true); // little-endian
console.log("Little-endian:", view.getInt16(0, true).toString(16));

view.setInt16(2, 0x1234, false); // big-endian
console.log("Big-endian:", view.getInt16(2, false).toString(16));

// ============================================
// 9. Métodos de TypedArray
// ============================================
console.log("\n9. MÉTODOS DE TYPEDARRAY");

const arr = new Int32Array([10, 20, 30, 40, 50]);

// Métodos similares a Array
console.log("Length:", arr.length);
console.log("Slice:", arr.slice(1, 3));
console.log("Subarray:", arr.subarray(1, 3));

// Map, filter, reduce (retornam Array normal)
const dobrado = Array.from(arr).map(x => x * 2);
console.log("Dobrado:", dobrado);

// Set e copyWithin
const arr2 = new Int32Array([1, 2, 3, 4, 5]);
arr2.set([10, 20], 1);
console.log("Após set:", arr2);

arr2.copyWithin(0, 3, 5);
console.log("Após copyWithin:", arr2);

// ============================================
// 10. Conversão entre Tipos
// ============================================
console.log("\n10. CONVERSÃO ENTRE TIPOS");

// De Array normal para TypedArray
const arrayNormal = [1, 2, 3, 4, 5];
const typedFromArray = new Int32Array(arrayNormal);
console.log("De Array:", typedFromArray);

// De TypedArray para Array
const arrayFromTyped = Array.from(typedFromArray);
console.log("Para Array:", arrayFromTyped);

// Spread operator
const spreadArray = [...typedFromArray];
console.log("Spread:", spreadArray);

// ============================================
// 11. Buffer Compartilhado
// ============================================
console.log("\n11. BUFFER COMPARTILHADO");

const bufferCompartilhado = new SharedArrayBuffer(16);
const viewA = new Int32Array(bufferCompartilhado);
const viewB = new Int32Array(bufferCompartilhado);

viewA[0] = 42;
console.log("View A:", viewA[0]);
console.log("View B (compartilhado):", viewB[0]); // Mesmo valor!

// SharedArrayBuffer é útil para Web Workers

// ============================================
// 12. Aplicação Prática - Manipulação de Imagem
// ============================================
console.log("\n12. APLICAÇÃO PRÁTICA");

// Simular manipulação de pixels de imagem
function processarImagem(largura, altura) {
    // Cada pixel = 4 bytes (RGBA)
    const tamanho = largura * altura * 4;
    const pixels = new Uint8ClampedArray(tamanho);
    
    // Preencher com cor vermelha
    for (let i = 0; i < tamanho; i += 4) {
        pixels[i] = 255;     // R
        pixels[i + 1] = 0;   // G
        pixels[i + 2] = 0;   // B
        pixels[i + 3] = 255; // A (opacidade)
    }
    
    return pixels;
}

const imagem = processarImagem(2, 2);
console.log("Pixels (primeiros 16 bytes):", imagem.slice(0, 16));

// ============================================
// 13. Performance - Comparação
// ============================================
console.log("\n13. PERFORMANCE");

// TypedArrays são mais rápidos para operações numéricas
const tamanho = 1000000;

// Array normal
const inicioNormal = Date.now();
const arrNormal = new Array(tamanho);
for (let i = 0; i < tamanho; i++) {
    arrNormal[i] = i * 2;
}
const tempoNormal = Date.now() - inicioNormal;

// TypedArray
const inicioTyped = Date.now();
const arrTyped = new Int32Array(tamanho);
for (let i = 0; i < tamanho; i++) {
    arrTyped[i] = i * 2;
}
const tempoTyped = Date.now() - inicioTyped;

console.log(`Array normal: ${tempoNormal}ms`);
console.log(`TypedArray: ${tempoTyped}ms`);
console.log(`TypedArray é ${(tempoNormal / tempoTyped).toFixed(2)}x mais rápido`);

// ============================================
// 14. WebGL e WebAssembly
// ============================================
console.log("\n14. WEBGL E WEBASSEMBLY");

// TypedArrays são essenciais para:
// - WebGL (gráficos 3D)
// - WebAssembly (performance)
// - Processamento de áudio/vídeo
// - Manipulação de dados binários

console.log("\n=== FIM JS TYPED ARRAYS ===");
