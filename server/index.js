const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const database = require('./database_connect.js');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(cors());

app.use('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
     database.db.query("SELECT username, password, inactive FROM users WHERE users.username = ?", [username], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result.length > 0 && result[0].inactive === 0) {
                bcrypt.compare(password, result[0].password, function(err, isMatch) {
                    if (err) {
                        console.log(err)
                    } else if (!isMatch) {
                        res.send([]);
                        console.log("Username matches passwords do not match");
                    } else {
                        console.log("Username and passwords match");
                        res.send(result);
                    }
                }) 
            } else {
                res.send([]);   
                console.log("Username does not match or inactived user");
            }
        }
    });
});

app.use('/checkloggedinuser', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    database.db.query("SELECT username, password FROM users WHERE users.username = ? AND users.password = ?", [username, password], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result.length > 0){
                res.send(true)
                console.log('Username & password match')
            } else {
                res.send(false);
                console.log("Username & password don't match")
            }
        }
    });
});

app.post('/newuser', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const group = req.body.group;
    database.db.query("INSERT INTO users (username, password, name, accessgroup, inactive) VALUES (?, ?, ?, ?, 0)", [username, password, name, group], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send({username : username})
        }
    });

});

app.post('/deleteuser', (req,res) => {
    const id = req.body.id;
    database.db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {                
            res.send({result})
        }
    });
});

app.post('/inactiveuser', (req,res) => {
    const id = req.body.id;
    database.db.query("UPDATE users SET inactive = 1 WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {                
            res.send({result})
        }
    });
});

app.post('/activeuser', (req,res) => {
    const id = req.body.id;
    database.db.query("UPDATE users SET inactive = 0 WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {                
            res.send({result})
        }
    });
});

app.post('/edituser', (req,res) => {
    const password = req.body.password;
    const id = req.body.id;
    const name = req.body.name;
    const group = req.body.group;
    if (password === '') {
        database.db.query("UPDATE users SET name = ?, accessgroup = ? WHERE id = ?", [name, group, id], (err, result) => {
            if (err) {
                console.log(err)
            } else {                
                res.send({result})
            }
        });

    } else {
        database.db.query("UPDATE users SET name = ?, accessgroup = ?, password = ? WHERE id = ?", [name, group, password, id], (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.send({result})
            }
        });


    }
});

app.post('/checkexistusername', (req,res) => {
    const username = req.body.username;
    database.db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    });
});

app.get('/getuserlist', (req,res) => {
    database.db.query("SELECT users.id, users.username, users.name, users.inactive, users.accessgroup, accessgroups.group_name FROM users INNER JOIN accessgroups ON users.accessgroup = accessgroups.id ORDER By users.id", (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    });
});

app.get('/getaccessgrouplist', (req,res) => {
    database.db.query("SELECT * FROM accessgroups" , (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    });
});

app.get('/getcities', (req,res) => {
    database.db.query("SELECT * FROM cities" , (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    });
});

app.post('/newclient', (req,res) => {
    const name = req.body.name;
    const clientid = req.body.id;
    const gender = req.body.gender;
    const cityid = req.body.cityid;
    const street = req.body.street;
    const housenumber = req.body.housenumber;
    const floor = req.body.floor;
    const door = req.body.door;
    const birthdate = req.body.birthdate;
    const email = req.body.email;
    const phone = req.body.phone;
    database.db.query("INSERT INTO clients (name, client_id, gender, city_id, street, house_number, floor, door, birth_date, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [name, clientid, gender, cityid, street, housenumber, floor, door, birthdate, email, phone], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send({name : name})
            console.log(name, 'added to the database')
        }
    });
});

app.post('/checkexistclientid', (req,res) => {
    const clientid = req.body.id;
    database.db.query("SELECT * FROM clients WHERE client_id = ?", [clientid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
            console.log('Check exist client id',result)
        }
    });
});

app.get('/getclientlist', (req,res) => {
    const sqlSelect = `SELECT 
                        clients.id,
                        name,
                        client_id,
                        DATE_FORMAT(birth_date, "%Y-%m-%d") AS birth_date,
                        gender,
                        email,
                        phone,
                        cities.zip,
                        cities.city,
                        street,
                        house_number,
                        floor,
                        door,
                        CONCAT(
                            cities.city,
                            CONCAT_WS(', ', '', NULLIF(street, '')),
                            ' ',
                            CONCAT_WS('. ', NULLIF(house_number, ''), ''),
                            CONCAT_WS('/', NULLIF(floor, ''), NULLIF(door, '')))
                            AS address,
                        TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age
                       FROM clients
                       INNER JOIN cities ON clients.city_id = cities.id
                       ORDER By clients.id`;
    database.db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    });
});

app.listen(8080, () => {
    console.log('Server listening on port 8080')
})
