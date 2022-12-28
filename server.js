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
                res.locals.users.push(collection[key].name);
            }
            res.render('index.ejs', {
                firstName: '',
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

        app.post('/addUserToDB', async (req, res) => {
            // let isValid = validateObj(req.body.response);
            let {firstName, race, language, gender, work, buzzword} = req.body.data;
            const doc = await collection.insertOne({
                name: firstName,
                race: race,
                language: language,
                gender: gender,
                work: work,
                buzzword: buzzword,
            })
            if (doc.acknowledged) console.log('User ' + firstName + ' added to db');
            res.status(200).json({status: 'ok', message: 'User ' + firstName + ' added to db'});
        })

        app.put('/getNewUser', (req, res) => {
            let data = req.body.data[0];
            res.status(200).json({status: 'ok', data: data});
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

        app.delete('/deleteAllUsers', async (req, res) => {
            const del = await collection.deleteMany({});
            if (del) console.log('Successfully deleted users from database.');
            res.status(200).json('Success');
        })

        app.listen(process.env.PORT || PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch(console.error)