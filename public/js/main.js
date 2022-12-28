const userBtn = document.querySelector('#generate-button ');
const saveBtn = document.querySelector('#save-button');
const deleteBtn = document.querySelector('#delete-button');
const queryURL = 'https://api.mockaroo.com/api/b3aeff80?count=1&key=edbcd6a0';
const clearBtn = document.querySelector('#clearAll');
const liItems = document.querySelectorAll('.li');
const img = document.querySelector('.myimg');
const firstNameSpan = document.querySelector('.firstName');
const raceSpan = document.querySelector('.race');
const languageSpan = document.querySelector('.language');
const genderSpan = document.querySelector('.gender');
const workSpan = document.querySelector('.work');
const buzzwordSpan = document.querySelector('.buzzword');
const ul = document.querySelector('.saved-users');

const getNewUser = async () => {
    let query = await fetch(queryURL);
    let data = await query.json()
    // obj format
    console.log(data[0]);
    let {avatar, buzzword, first_name, gender, id, language, race, work_department} = data[0];
    img.src = avatar;
    firstNameSpan.innerText = first_name;
    raceSpan.innerText = race;
    languageSpan.innerText = language;
    genderSpan.innerText = gender;
    workSpan.innerText = work_department;
    buzzwordSpan.innerText = buzzword;
    console.log('Generated new user ', first_name);
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
            }, 500);
        }
    } catch (err) {
        console.log(err);
    }
}

const deleteUser = async () => {
    if (!ul.innerHTML) {
        alert('Nothing to delete');
        return;
    } else {
        const f = await fetch('/deleteLastUser', {
            method: 'delete',
        })
        const res = await f.json();
        if (res.status == 'ok') {
            console.log(res.message);
        }
    }
}

const deleteData = async () => {
    liItems.forEach((el) => {
        el.innerHTML = '';
    })
    const f = await fetch('/deleteAllUsers', {
        method:'delete',
    })
    const res = await f.json();
    if (res.status === 'Success') console.log(res.msg);
}

userBtn.addEventListener('click', getNewUser);
saveBtn.addEventListener('click', saveUser);
deleteBtn.addEventListener('click', deleteUser);
clearBtn.addEventListener('click', deleteData);