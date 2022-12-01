const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 8000;
require('dotenv').config();

let db,
    dbConnectionStr = process.env.DB_STRING, 
    dbName = 'fakePplDB',
    collectionName = 'fakePplCollection';

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
        collection = db.collection(collectionName)
})

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let userParams = {
    avatar: null,
    firstName: null,
    race: null,
    language: null,
    gender: null,
    work_department: null,
    buzzword: null
}

let operation = '';

app.get('/',(req, res) => {
    collection.find().toArray()
    .then(data => {
        res.render('index', {
            avatar: userParams.avatar,
            firstName: userParams.firstName,
            race: userParams.race,
            language: userParams.language,
            gender: userParams.gender,
            work_department: userParams.work_department,
            buzzword: userParams.buzzword,
            operation: operation,
            usersInfo: data,
        })
    })  
})

app.get('/getUserData',(req, res) => {
    for (const property in userParams) {
        if (userParams[property] === null) {
            console.log('Attempted to get user data when userObj is null');
            res.status(400).json({error: 'Cant get user data before generating a new user'})
            return
        } else {
            res.status(200).json(userParams)
            return
        }
    }
})

const validateObj = (obj) =>  {
    for (const property in obj) {
        if (typeof obj[`${property}`] !== 'string') {
            console.log('Invalid request, cannot add obj to DB')
            return false 
        }
    }

    if (Object.keys(obj).length !== 7) {
        console.log('Invalid request, cannot add obj to DB')
        return false
    } else {
        return true
    }   
}

app.post('/addUserToDB', (req, res) => {
    // validate what we add to db
    let isValid = validateObj(req.body.response);
    if (isValid) {
        console.log(`Added ${req.body.response.firstName} to DB.`);
        collection.insertOne(req.body.response);
        operation = `Added ${req.body.response.firstName} to DB.`;
        res.status(200).json(`Added ${req.body.response.firstName} to DB.`);
    } else {
        console.log('Invalid request, cannot add user to DB.');
        res.status(400).json('Invalid OBJ.');
    }
})

app.put('/getNewUser', (req, res) => {
    let data = req.body.data;
    userParams.avatar = data['0'].avatar;
    userParams.firstName = data['0'].first_name;
    userParams.race = data['0'].race;
    userParams.language = data['0'].language;
    userParams.gender = data['0'].gender;
    userParams.work_department = data['0'].work_department;
    userParams.buzzword = data['0'].buzzword;
    res.json('Success')
})

app.delete('/deleteUserData', (req, res) => {
    let isValid = validateObj(userParams);
    if (isValid) {
        collection.deleteOne({firstName: userParams.firstName})
        .then(result => {
        console.log('User Deleted')
        operation = `Deleted ${userParams.firstName} from DB.`;
        userParams.avatar = null;
        userParams.firstName = null;
        userParams.race = null;
        userParams.language = null;
        userParams.gender = null;
        userParams.work_department = null;
        userParams.buzzword = null;
        res.json('User Deleted')
    })
    .catch(error => console.error(error))
    } else {
        console.log('Cannot delete user.');
        res.status(400).json('Invalid request.');
    }
})
 
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})