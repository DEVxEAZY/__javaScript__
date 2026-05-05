/**
 * SEMVER NA PRÁTICA — leitura e comparação de versões
 *
 * Como rodar:
 *   node 02_semver.js
 *   ou:  npm run semver
 *
 * SemVer (Semantic Versioning) é o contrato:
 *   MAJOR.MINOR.PATCH
 *     ^      ^      ^
 *     |      |      └── bugfix compatível
 *     |      └─────────── feature nova compatível
 *     └────────────────── mudança incompatível (breaking)
 */

// ============================================================
// 1. PARSE MANUAL DE UMA VERSÃO
// ============================================================
function parseVersao(v) {
    const [major, minor, patch] = v.split(".").map(Number);
    return { major, minor, patch };
}

console.log("=== 1. PARSE ===");
console.log(parseVersao("4.17.21"));
console.log(parseVersao("1.0.0"));

// ============================================================
// 2. COMPARAÇÃO DE VERSÕES
// ============================================================
// Retorna:  -1 se a < b,  0 se iguais,  1 se a > b
function comparar(a, b) {
    const A = parseVersao(a);
    const B = parseVersao(b);
    if (A.major !== B.major) return A.major < B.major ? -1 : 1;
    if (A.minor !== B.minor) return A.minor < B.minor ? -1 : 1;
    if (A.patch !== B.patch) return A.patch < B.patch ? -1 : 1;
    return 0;
}

console.log("\n=== 2. COMPARAÇÃO ===");
console.log("1.2.3 vs 1.2.4:", comparar("1.2.3", "1.2.4")); // -1
console.log("2.0.0 vs 1.9.9:", comparar("2.0.0", "1.9.9")); //  1
console.log("1.2.3 vs 1.2.3:", comparar("1.2.3", "1.2.3")); //  0

// ============================================================
// 3. RANGES — ^ (caret) e ~ (tilde)
// ============================================================
// Dada a versão BASE no package.json, qual versão instalada
// satisfaz cada operador?
//
//   "^1.2.3"  -> >=1.2.3  e  <2.0.0   (mantém o major)
//   "~1.2.3"  -> >=1.2.3  e  <1.3.0   (mantém o minor)
//   "1.2.3"   -> exatamente 1.2.3
//
// Caso especial: 0.x.y é tratado como instável.
//   "^0.2.3"  -> >=0.2.3 e <0.3.0 (no 0.x, ^ vira ~)

function satisfazCaret(base, candidata) {
    const B = parseVersao(base);
    const C = parseVersao(candidata);
    if (B.major === 0) {
        // ^0.x.y -> trava o minor também
        return C.major === 0 && C.minor === B.minor &&
               comparar(candidata, base) >= 0;
    }
    return C.major === B.major && comparar(candidata, base) >= 0;
}

function satisfazTilde(base, candidata) {
    const B = parseVersao(base);
    const C = parseVersao(candidata);
    return C.major === B.major &&
           C.minor === B.minor &&
           comparar(candidata, base) >= 0;
}

console.log("\n=== 3. RANGES ===");
console.log('"^1.2.3" aceita 1.2.4? ', satisfazCaret("1.2.3", "1.2.4")); // true
console.log('"^1.2.3" aceita 1.5.0? ', satisfazCaret("1.2.3", "1.5.0")); // true
console.log('"^1.2.3" aceita 2.0.0? ', satisfazCaret("1.2.3", "2.0.0")); // false
console.log('"~1.2.3" aceita 1.2.9? ', satisfazTilde("1.2.3", "1.2.9")); // true
console.log('"~1.2.3" aceita 1.3.0? ', satisfazTilde("1.2.3", "1.3.0")); // false
console.log('"^0.2.3" aceita 0.2.9? ', satisfazCaret("0.2.3", "0.2.9")); // true
console.log('"^0.2.3" aceita 0.3.0? ', satisfazCaret("0.2.3", "0.3.0")); // false

// ============================================================
// 4. BUMP DE VERSÃO — npm version patch/minor/major
// ============================================================
function bump(v, tipo) {
    const { major, minor, patch } = parseVersao(v);
    if (tipo === "major") return `${major + 1}.0.0`;
    if (tipo === "minor") return `${major}.${minor + 1}.0`;
    if (tipo === "patch") return `${major}.${minor}.${patch + 1}`;
    throw new Error("tipo inválido: use major | minor | patch");
}

console.log("\n=== 4. BUMP ===");
console.log("1.2.3 patch ->", bump("1.2.3", "patch")); // 1.2.4
console.log("1.2.3 minor ->", bump("1.2.3", "minor")); // 1.3.0
console.log("1.2.3 major ->", bump("1.2.3", "major")); // 2.0.0
// Equivalentes no CLI:
//   npm version patch    (também cria commit + tag git)
//   npm version minor
//   npm version major

// ============================================================
// 5. PRE-RELEASES — alpha, beta, rc
// ============================================================
// Versões pré-lançamento usam hífen:
//   1.0.0-alpha
//   1.0.0-alpha.1
//   1.0.0-beta.2
//   1.0.0-rc.1     (release candidate)
//
// Pela spec, pre-releases têm precedência MENOR que a versão
// final correspondente:
//   1.0.0-alpha < 1.0.0-beta < 1.0.0-rc.1 < 1.0.0
//
// Por padrão, `npm install <pacote>` IGNORA pre-releases.
// Para instalar:
//   npm i pacote@1.0.0-beta.2
//   npm i pacote@next        (tag dist comum para betas)

console.log("\n=== 5. PRE-RELEASES ===");
console.log("Ordem de precedência:");
console.log("  1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-beta < 1.0.0-rc.1 < 1.0.0");

console.log("\n=== FIM — SEMVER ===");
