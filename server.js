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

        // Middlewares
        app.set('view engine', 'ejs');
        app.use(express.static('public'));
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        // Routes
        app.get('/', async (req, res) => {
            const savedUsers = await db.collection('fakePplCollection').find().toArray();
            console.log('users: ', savedUsers);
            res.render('index.ejs', {
                users: savedUsers,
            });
        })

        app.post('/addUserToDB', (req, res) => {
            let {firstName, race, language, gender, work, buzzword} = req.body.data;
            try {
                db.collection('fakePplCollection').insertOne({
                    name: firstName,
                    race: race, 
                    language: language,
                    gender: gender,
                    work: work,
                    buzzword: buzzword,
                })
                let msg = 'Succesfully added ' + firstName + ' to database.';
                console.log(msg);
                res.status(200).json({status: 'ok', message: msg});
            } catch (err) {
                console.log(err);
            }
        })

        app.delete('/deleteAllUsers', async (req, res) => {
            const del = await db.collection('fakePplCollection').deleteMany({});
            let msg = 'Successfully deleted all users from database.';
            if (del) console.log(msg);
            res.status(200).json({status: 'Success', msg: msg});
        })

        app.delete('/deleteLastUser', async (req, res) => {
            const savedUsers = await db.collection('fakePplCollection').find().toArray();
            let last = (Object.keys(savedUsers).length - 1);
            let lastUser = savedUsers[`${last}`];
            let msg = 'Deleted ' + lastUser.name + ' from database';
            try {
                db.collection('fakePplCollection').deleteOne({
                    name: lastUser.name
                })
                console.log(msg);
                res.status(200).json({status: 'success', message: msg});
            } catch (err) {
                console.log(err);
            }
        })

        app.listen(process.env.PORT || PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch(console.error)