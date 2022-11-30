const userBtn = document.querySelector('#generate-button ');
const saveBtn = document.querySelector('#save-button');
const deleteBtn = document.querySelector('#delete-button');
const queryURL = 'https://api.mockaroo.com/api/b3aeff80?count=1&key=edbcd6a0' 

const getNewUser = async () => {
    let query = await fetch(queryURL);
    let data = await query.json()
    // obj format
    return data
}

const sendUser = async () => {
    let data = await getNewUser();
    let f = await fetch('/getNewUser', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data})
    })
    .then(res => {
        if (res.ok) {
            return res.json()
        }
    })
    .then(response => {
        location.reload()
    })
    .catch(err => {
        console.log(err)
    })
}

const saveUser = async () => {
    // get user from sv
    let data = await fetch('/getUserData', {
        method: 'get',
    })
    .then(res => {
        if (res.ok) {
            return res.json()
        }
        if (!res.ok) {
            throw new Error('Could not get user data')
        }
    })
    .then( async (response) => {
        // response = obj with user data
        let f = await fetch('/addUserToDB', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({response})
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            if (!res.ok) {
                throw new Error('Invalid request, cannot add obj to DB')
            }
        })
        .then(response => {
            location.reload()
        })
        .catch(err => {
            console.log(err)
        })
    })
    .catch(err => {
        console.log(err)
    })
}

const deleteUser = async () => {
    let data = await fetch('/deleteUserData', {
        method: 'delete',
    })
    .then(res => {
        if (res.ok) {
            return res.json()
        }
        if (!res.ok) {
            throw new Error('Invalid request.')
        }
    })
    .then((response) => {
        location.reload()
    })
    .catch(err => {
        console.log(err)
    })
}

userBtn.addEventListener('click', sendUser);
saveBtn.addEventListener('click', saveUser);
deleteBtn.addEventListener('click', deleteUser);