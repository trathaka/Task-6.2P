const mongoose = require("mongoose")
const validator = require("validator")
const accountSchema = new mongoose.Schema(
    {
        _country: {
            type: String,
            required: [true, 'Country required']
        },

        _firstname: {
            type: String,
            required: [true, 'First name required']
        },

        _lastname: {
            type: String,
            required: [true, 'Last name required']
        },
        _email: {
            type: String,
            required: [true, 'E-Mail required'],
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) { throw new Error('The email is not valid!') }
            },
            _password: {
                type: String,
                required: [true, 'Password required'],
                min: [8, 'Must be at least 8 characters'],

            },
            _confirmpassword: {
                type: String,
                required: [true, 'Re-enter the password'],
                min: [8, 'Must be at least 8 characters'],
                validate: {
                    validator: function (v) {
                        return v != accountSchema._password
                    },
                    message: 'Password entered do not match'
                }

            },
            _address: {
                type: String,
                required: [true, 'Address required'],
            },
            _city: {
                type: String,
                required: [true, 'City required'],
            },
            _state: {
                type: String,
                required: [true, 'State required'],
            },
            _zip: {
                type: String,
            },
            _phone: {
                type: Number,
                validate(value) {
                    if (!validator.isMobilePhone(value)) { throw new Error('The Phone number is not valid!') }
                },
            }
        }
    }
)


module.exports = mongoose.model("Account", accountSchema);