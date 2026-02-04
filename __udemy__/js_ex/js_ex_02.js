function ePaisagem(width, height){
    if (width > height){
        console.log("A imagem está na orientação paisagem")
    } else if (height > width){
        console.log("A imagem está na orientação retrato")
    }
    return ""
}

console.log(ePaisagem(321,234))

