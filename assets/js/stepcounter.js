let theme = 'light';
let loggedUser = null
let main = document.querySelector('main');

const AppTitle = "Lépésszámláló App"
const Author = "13.A Szoftverfejlesztő"
const Company = "Bajai SZC Türr István Technikum"

let Apptitle = document.getElementById("Title")
let author = document.getElementById("Author")
let company = document.getElementById("Company")

let loggedInMenu = document.getElementById("loggedInMenu")
let loggedOutMenu = document.getElementById("loggedOutMenu")

Apptitle.innerHTML = AppTitle
author.innerHTML = Author
company.innerHTML = Company

let lightmodeBtn = document.getElementById("lightmodeBtn")
let darkmodeBtn = document.getElementById("darkmodeBtn")

lightmodeBtn.addEventListener('click', ()=>{
    setTheme('light')
    saveTheme('light')
})

darkmodeBtn.addEventListener('click', ()=>{
    setTheme('dark')
    saveTheme('dark')
})

function loadTheme(){
    theme = 'light'
    if(localStorage.getItem('SCTheme')){
        theme = localStorage.getItem('SCTheme');
        
    }
    setTheme(theme)
}

function saveTheme(theme){
    localStorage.setItem('SCTheme', theme)
}

function setTheme(theme){
    document.documentElement.setAttribute('data-bs-theme', theme)
    setThemeBtn(theme)
}

function setThemeBtn(theme){
    if(theme == 'light'){
        lightmodeBtn.classList.add('hide')
        darkmodeBtn.classList.remove('hide')
    }
    else{
        darkmodeBtn.classList.add('hide')
        lightmodeBtn.classList.remove('hide')
        
    }
}

async function Render(view){
 main.innerHTML =await (await fetch(`views/${view}.html`)).text()
}

async function getLoggedUser(){
    if(sessionStorage.getItem('loggedUser')){
        loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        loggedInMenu.classList.remove("hide")
        loggedOutMenu.classList.add("hide")
        await Render('stepdata')
    }
    else{
        loggedUser = null
        loggedOutMenu.classList.remove("hide")
        loggedInMenu.classList.add("hide")
        await Render('login')
    }
    return loggedUser
}

loadTheme()
getLoggedUser()

