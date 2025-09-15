
function setDate(){
    let today=new Date().toISOString().split('T')[0];
    let dateField = document.getElementById("dateField")
    dateField.setAttribute('max',today)
}
async function Add() {
    let dateField = document.getElementById("dateField")
    let stepcountField = document.getElementById("stepcountField")
    try{
 
        const res = await fetch(`${API}/steps`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: 0,
                uid: loggedUser.id,
                stepcount: stepcountField.value,
                date: dateField.value.toString()
            })
        })
 
        const data = await res.json()
 
        if (res.status == 200){
            dateField.value = ''
            stepcountField.value = ''
            ShowAlert("Sikeres adatfelvitel!", "alert-success")
        }
    }
    catch(err){
        console.log('Hiba történt: ', err)
    }
}
 