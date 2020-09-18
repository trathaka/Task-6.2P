const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Account = require("./models/Account.js")
const app = express()
const https = require("https")

mongoose.connect("mongodb://localhost:27017/iCrowdTaskDB", { useNewUrlParser: true })


app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))


app.route('/')
    .get((req, res) => {
        res.sendFile(__dirname + "/index.html")
    })

    .post((req, res) => {
        const country = req.body.country
        const firstname = req.body.first_name
        const lastname = req.body.last_name
        const email = req.body.email
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword
        const address = req.body.address
        const address2 = req.body.address2
        const city = req.body.city
        const state = req.body.state
        const zip = req.body.zip
        const phone = req.body.phone


        const account = new Account(
            {
                _country: country,
                _firstname: firstname,
                _lastname: lastname,
                _email: email,
                _password: password,
                _address: address,
                _address2: address2,
                _city: city,
                _state: state,
                _zip: zip,
                _phone: phone

            }
        )
        account.save((err) => {
            if (err) { console.log(err) }
            else { console.log("Inserted successfully") }
        })

        const apiKey = "5a0589ffd1e4153e344c1b61b9fceda9-us2"
        //const list_id="625c9ddf31"
        const data = {
            members: [{
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }

            }]
        }
        jsonData = JSON.stringify(data)

        const url = "https://us2.api.mailchimp.com/3.0/lists/625c9ddf31"
        const options = {
            method: "POST",
            auth: "azi:5a0589ffd1e4153e344c1b61b9fceda9-us2"
        }

        const request = https.request(url, options, (response) => {

            response.on("data", (data) => {
                console.log(JSON.parse(data))
            })

        })

        request.write(jsonData)
        request.end()
        console.log(firstname, lastname, email)
    })


app.route('/accounts')

    //Retreive workers
    .get((req, res) => {
        Account.find((err, accountList) => {
            if (err) { res.send(err) }
            else { res.send(accountList) }
        })

    })

    //Adding workers
    .post((req, res) => {

        const account = new Account(
            {
                _firstname: firstname,
                _lastname: lastname,
                _password: password,
                _address: address,
                _phone: phone

            }
        )
        account.save((err) => {
            if (err) { res.send(err) }
            else { res.send("Successfully added a new contact") }
        })
    })

    //Delete workers
    .delete((req, res) => {
        Account.deleteMany((err) => {
            if (err) { res.send(err) }
            else { res.send('Successfully deleted all contacts!') }
        })
    })

app.route('/accounts/:wname')
    //Retrieve specific worker
    .get((req, res) => {
        Account.findOne({ _firstname: req.params.wname }, (err, foundName) => {
            if (foundName) (res.send(foundName))
            else res.send("No Matched Worker Found!")
        })
    })

    //Update workers
    .put((req, res) => {
        Account.update(
            { _firstname: req.params.wname },
            { _firstname: req.body.name },
            { overwrite: true },
            (err) => {
                if (err) { res.send(err) }
                else { res.send('Successfully updated name') }
            }
        )
    })
    // Update specific worker
    .patch((req, res) => {
        Account.update(
            { _firstname: req.params.wname },
            { $set: req.body },
            (err) => {
                if (!err) { res.send('Successfully updated name! ') }
                else res.send(err)
            }
        )
    })

    // Delete specific worker
    .delete((req, res) => {
        Account.deleteOne(
            { _firstname: req.params.wname },
            (err) => {
                if (!err) { res.send('Successfully deleted a worker! ') }
                else res.send(err)
            }
            
        )
    })

app.route('/accounts/:waddress')
    //Update specific worker's address
    .patch((req, res) => {
        Account.update(
            { _address: req.params.waddress },
            { $set: req.body },
            (err) => {
                if (!err) { res.send('Successfully updated address! ') }
                else res.send(err)
            }
        )
    })

app.route('/accounts/:wphone')
//Update specific worker's phone number
    .patch((req, res) => {
        Account.update(
            { _phone: req.params.wphone },
            { $set: req.body },
            (err) => {
                if (!err) { res.send('Successfully updated phone number! ') }
                else res.send(err)
            }
        )
    })

app.route('/accounts/:wpassword')
//Update specific worker's password
    .patch((req, res) => {
        Account.update(
            { _password: req.params.wpassword },
            { $set: req.body },
            (err) => {
                if (!err) { res.send('Successfully updated password! ') }
                else res.send(err)
            }
        )
    })

app.listen(8080, function (request, response) {
    console.log("Server is running on port 8080")
})