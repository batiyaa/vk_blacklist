let access_token = document.getElementById("access_token")
let user_token = document.getElementById("user_token")


chrome.storage.local.get(["access_token", "user_token"], (items) => {
    let localAccess = items.access_token
    let localUser = items.user_token

    console.log(`2AC ${localAccess}`)
    console.log(`2US ${localUser}`)

    if (localAccess !== undefined && localUser !== undefined) {
        access_token.value = localAccess
        user_token.value = localUser
    }
})

let submit = document.getElementById("form_auth_button");

submit.addEventListener("click", async (event) => {

    const access_token = document.getElementById("access_token").value
    const user_token = document.getElementById("user_token").value
    console.log(`1AC ${access_token}`)
    console.log(`1US ${user_token}`)

    chrome.storage.local.set({"access_token": access_token}, () => {
        console.log("SETTED")
    })

    chrome.storage.local.set({"user_token": user_token}, () => {
        console.log("SETTED")
    })
    window.close()
})


