import chalk from "chalk" //Chalk a partir da versão 5 só funciona com import
import inquirer from "inquirer"
import fs from "fs"

console.log(chalk.bgGray.white.bold("Olá seja bem vindo ao MovieTer"))
console.log(chalk.bgGray.white.underline("Com os pontos você pode comprar os filmes!"))

const chamada = () => {
    console.log("") // console.log para dividir 

    inquirer.prompt([
        {
            type: 'list',
            name: "choices",
            message: "O que deseja fazer?",
            choices: [
                "Adicionar pontos a carteira",
                "Ver postos da carteira",
                "Ver lista de filmes",
                "Comprar filme",
                "Ver meus filmes",
                "Sair"
            ]
        }
    ]).then( answers => {

        const answerChoice = answers['choices']
        //console.log(answerChoice)

        switch(answerChoice){
            case "Adicionar pontos a carteira":
                addPoints()
                break
            case "Ver postos da carteira":
                viewPoints()
                break
            case "Ver lista de filmes":
                viewFilmList()
                break
            case "Comprar filme":
                toBuyAMovie()
                break
            default:
                console.log(answerChoice)
        }


    }
    ).catch(err => console.log(err))
}
chamada()

const addPoints = () => {
    
    if(!fs.existsSync("Users")){
        fs.mkdirSync("Users")
        fs.writeFileSync(
            "Users/user.json",
            '{"points": 0, "myMovies": []}'
        )
    }

    inquirer.prompt([
        {
            name: 'points',
            message: "Quantos pontos você quer adicionar?"
        }
    ]).then(answers => {

        const user = trasformObj("Users/user.json") //Objeto User

        const point = answers["points"]

        user.points = parseFloat(point) + parseFloat(user.points)

        if(point < 0 || !point){
            console.log(chalk.bgRed.black("Valor invalido, tente novamente!"))
            return addPoints()
        }

        fs.writeFileSync(
            "Users/user.json",
            JSON.stringify(user),
            (err) => console.log(err)
        )

        console.log(chalk.bgYellow.black(`Foi adicionado ${point} postos a sua conta!`))
        chamada()
    
    }
    ).catch(err => console.log(err))

}

// Função para ver pontos da carteira
const viewPoints = () => {

    const user = trasformObj("Users/user.json") //Objeto User
    console.log(chalk.bgBlue.black(`Esses são seus pontos ${user.points}`))
    return chamada()
}

//Função para ver a lista de filmes
const viewFilmList = () => {
    
    const MovieList = trasformObj("Users/filmList.json") //Objeto User
    const arrayMovies = MovieList.filmes

    arrayMovies.forEach(element => {
        console.log(chalk.yellow(`Filme ${element.name}, valor: ${element.PointsToBuy} pontos`))  
    })
    return chamada()

}

// função para comprar um filme
const toBuyAMovie = () => {

    inquirer.prompt([
        {
            name: "MovieName",
            message: "Qual filme você deseja comprar?"
        }
    ]).then(answers => {

        const NameFilme = answers["MovieName"]

        const MovieList = trasformObj("Users/filmList.json") //Objeto Filmes
        const user = trasformObj("Users/user.json") //Objeto User

        const arrayMovies = MovieList.filmes

        if(!NameFilme){
            console.log(chalk.bgRed.black("Erro!"))
            return chamada()
        }

        arrayMovies.forEach(element => {

            if(NameFilme == element.name && user.points >= element.PointsToBuy){
                
                user.myMovies += `${element.name},`
                user.points = parseFloat(user.points) - parseFloat(element.PointsToBuy)
                myMoviesArray(user.myMovies, NameFilme)

                fs.writeFileSync(
                    "Users/user.json",
                    JSON.stringify(user),
                    (err) => console.log(err)
                )

                console.log(chalk.bgBlue.black("Obrigado pela compra!"))
                
                return chamada()

            } else if(NameFilme == element.name && user.points < element.PointsToBuy){
                console.log(chalk.bgRed.black("Seus pontos são insuficientes!"))
                return chamada()
            }

        })

    }).catch(err => console.log(err))

}


// funcão para pegar o json e trasforma em objeto js
const trasformObj = (arquivo) => {
    
    const objJSON = fs.readFileSync(arquivo, {
        encoding: 'utf-8',
        flag: 'r'
    })
    return JSON.parse(objJSON)
}

//traformar o myMovies de string para array
const myMoviesArray = (myListMovies, nameOfMovie) => {

    const dataMyMovies = myListMovies.split(",")
    console.log(dataMyMovies)
    
}

//checar para saber se existe saldo
function checkSaldo(){

}