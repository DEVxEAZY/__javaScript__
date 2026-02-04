



function aboultVinsion(number){
    if (number % 3 === 0 ){
        number_type = "Fizz"
    console.log(number_type, "numero: ", number + " é Fizz" + ".")
}
if (number % 5 === 0 ){
    number_type = "Buzz"
    console.log(number_type, "numero: ", number + " é Buzz" + ".")
}
if (number % 3 === 0 && number % 5 === 0 ){
    number_type = "FizzBuzz"
    console.log(number_type, "numero: ", number + " é FizzBuzz" + "."  )
}
}

for (let i = 0; i <= 100; i++){
    aboultVinsion(i)
}





