const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 8000;
require('dotenv').config();

const dbConnectionStr = process.env.DB_STRING;
const dbName = 'fakePplDB';

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`);
        const db = client.db(dbName);
        const collection = db.collection('fakePplCollection');

        // Middlewares
        app.set('view engine', 'ejs');
        app.use(express.static('public'));
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        // Routes
        app.get('/', async (req, res) => {
            res.locals.users = [];
            const collection = await db.collection('fakePplCollection').find().toArray()
            for (key in collection) {
                res.locals.users.push(collection[key].firstName);
            }
            // console.log('Users: ', res.locals.users);
            res.render('index.ejs', {
                users: res.locals.users,
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
    })
    .catch(console.error)