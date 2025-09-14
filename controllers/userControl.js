const passRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const API = 'http://localhost:3000'


async function Registration(){
    //await fetch('http://localhost:3000/users').then(res => res.json().then(data => console.log(data)))
    let passfield = document.getElementById('passField')
    let nameField = document.getElementById('nameField')
    let emailField = document.getElementById('emailField')
    let confirmpassField = document.getElementById('confirmpassField')

    if(nameField.value == "" || passfield.value == "" || emailField.value == "" || confirmpassField.value == ""){
        ShowAlert("Nem adtál meg minden adatot!", "alert-danger")
        return
    }

    if(!emailRegExp.test(emailField.value)){
        ShowAlert("A megadott email cím nem megfelelő formátumú", "alert-danger")
        return
    }

    if(passfield.value != confirmpassField.value){
        ShowAlert("A megadott jelszavak nem egyeznek!", "alert-danger")
        return
    }

    if(!passRegExp.test(passfield.value)){
        ShowAlert("A megadott jelszó nem elég biztonságos!", "alert-danger")
        return
    }

    try{



        const res = await fetch(`${API}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
    
            },
            body: JSON.stringify({
                id: 0,
                name: nameField.value,
                email: emailField.value,
                password: passfield.value
            })
        })

        const data = await res.json()
        //console.log(data)
        if(String(data.msg) == "bademail"){
            ShowAlert("Ez az email cím már regisztrált", "alert-danger")
        }
        if (res.status == 200){
            nameField.value = ''
            emailField.value = ''
            passfield.value = ''
            confirmpassField.value = ''
            ShowAlert("Sikeres regisztráció!", "alert-success")
        }
    }
    catch(err){
        console.log('Hiba történt: ', err)
    }

    
}

async function Login(){
    let emailField = document.getElementById('emailField')
    let passfield = document.getElementById('passField')

    if(passfield.value == "" || emailField.value == ""){
        ShowAlert("Nem adtál meg minden adatot!", "alert-danger")
        return
    }
    let user = {}
    try{
        const res = await fetch(`${API}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
    
            },
            body: JSON.stringify({
                email: emailField.value,
                password: passfield.value
            })
        })
        ShowAlert("Sikeres belépés!","alert-success")
        user = await res.json()

        if(user.id != undefined){
            loggedUser = user;

        }
        
        
        if(!loggedUser){
            ShowAlert("Hibás belépési adatok!", "alert-danger")
            return
        }
       
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser))
        await Render("stepdata")
        getLoggedUser()
       
    }
    catch(err){
        console.log("Hiba!", err)
    }
    
}

function Logout(){
    sessionStorage.removeItem('loggedUser')
    getLoggedUser();
    Render("login")
}

async function getProfile(){
    let emailField = document.getElementById('emailField')
    let nameField = document.getElementById('nameField')
    const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
    try{
        const res = await fetch(`${API}/users/${loggedUser.id}`)
        if(!res.ok){
            ShowAlert("Nem sikerult lekerni a profilt :c","alert-danger")
            return
        }
        const user= await res.json()
        emailField.value=user.email;
        nameField.value=user.name;
    }
    catch(err){
        ShowAlert("Hiba tortent lekereskor","alert-danger")
    }
    

}

async function UpdateProfile(){
    let emailField = document.getElementById('emailField')
    let nameField = document.getElementById('nameField')
    if(!emailRegExp.test(emailField.value)){
        ShowAlert("Megadott email cim nm megfelelo formatomu >:c","alert-danger")
        return
    }
    try{
        const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))

        const res = await fetch(`${API}/users/${loggedUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
    
            },
            body: JSON.stringify({
                email: emailField.value,
                name: nameField.value
            })
        })
        if(!res.ok){
            const data = await res.json()
            ShowAlert(data.msg,"alert-danger")
            return
        }
        const updatedUser=await res.json()
        sessionStorage.setItem('loggedUser',JSON.stringify(updatedUser.user))
        ShowAlert("Profil sikeresen frissitve","alert-success")

    }
    catch(err){
        ShowAlert("hiba tortent a profil frissitesekor","alert-danger")
    }
}

async function ChangePass(){
    let oldpassfield = document.getElementById('oldPassField')
    let NewPassField = document.getElementById('NewPassField')
    let CNewPassField = document.getElementById('CNewPassField')
 
    if(oldpassfield.value == "" || NewPassField.value == "" || CNewPassField.value == ""){
        ShowAlert("nm adtal meg minden adatot", "alert-danger")
        return
    }
    if(NewPassField.value != CNewPassField.value){
        ShowAlert("ket jelszo nm egyezik", "alert-danger")
        return
    }
    if(!passRegExp.test(NewPassField.value)){
        ShowAlert("uj jelszo nem biztonsagos", "alert-danger")
        return
    }
    try {
        const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        const res = await fetch(`${API}/users/changepass/${loggedUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldpass: oldpassfield.value,
                newpass: NewPassField.value
            })
        })
        if (!res.ok) {
            const data = await res.json()
            console.log(data.msg)
            ShowAlert(data.msg, "alert-danger")
            return
        }
        oldpassfield.value = ''
        NewPassField.value = ''
        CNewPassField.value = ''
        const updatedUser = await res.json()
        sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser.user))
        ShowAlert("jelszo sikeresen megvaltoztatva", "alert-success")
    } catch (err) {
        ShowAlert("hiba tortent a jelszo megvaltoztatasakor", "alert-danger")
        console.log("Hiba!", err)
    }
 
}

function ShowAlert(message, alerttype){
        let alertReg = document.getElementById("alertReg")
        alertReg.classList.remove("hide")
        alertReg.classList.add(alerttype)
        alertReg.innerText= message

        setTimeout(()=>{
            alertReg.classList.remove(alerttype)
            alertReg.innerHTML= ''
            alertReg.classList.add("hide")
        },3000)
}

