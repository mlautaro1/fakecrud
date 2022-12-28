const userBtn = document.querySelector('#generate-button ');
const saveBtn = document.querySelector('#save-button');
const deleteBtn = document.querySelector('#delete-button');
const queryURL = 'https://api.mockaroo.com/api/b3aeff80?count=1&key=edbcd6a0';
const clearBtn = document.querySelector('.btn');
const liItems = document.querySelectorAll('.li');
const img = document.querySelector('.myimg');
const firstNameSpan = document.querySelector('.firstName');
const raceSpan = document.querySelector('.race');
const languageSpan = document.querySelector('.language');
const genderSpan = document.querySelector('.gender');
const workSpan = document.querySelector('.work');
const buzzwordSpan = document.querySelector('.buzzword');

const getNewUser = async () => {
    let query = await fetch(queryURL);
    let data = await query.json()
    // obj format
    return data
}

const sendUser = async () => {
    let data = await getNewUser();
    try {
        let f = await fetch('/getNewUser', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data})
        })
        const res = await f.json();
        if (res.status) console.log(res.data);
        img.src = res.data.avatar;
        firstNameSpan.innerText = res.data.first_name;
        raceSpan.innerText = res.data.race;
        languageSpan.innerText = res.data.language;
        genderSpan.innerText = res.data.gender;
        workSpan.innerText = res.data.work_department;
        buzzwordSpan.innerText = res.data.buzzword;
    } catch (err) {
        console.log(err);
    }
}

const saveUser = async () => {
    if (firstNameSpan.innerText == '') {
        alert('Cannot save empty user, please generate a new one.');
        return;
    }
    let data = {
        firstName: firstNameSpan.innerText,
        race: raceSpan.innerText,
        language: languageSpan.innerText,
        gender: genderSpan.innerText,
        work: workSpan.innerText,
        buzzword: buzzwordSpan.innerText,
    }
    
    try {
        const f = await fetch('/addUserToDB', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data
            })
        })
        const res = await f.json();
        if (res.status === 'ok') {
            alert(res.message);
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    } catch (err) {
        console.log(err);
    }
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

const deleteData = async () => {
    liItems.forEach((el) => {
        el.innerHTML = '';
    })

    const f = await fetch('/deleteAllUsers', {
        method:'delete',
    })
    const res = await f.json();
    if (res.ok) console.log(res);
}

userBtn.addEventListener('click', sendUser);
saveBtn.addEventListener('click', saveUser);
deleteBtn.addEventListener('click', deleteUser);
// clearBtn.addEventListener('click', deleteData);