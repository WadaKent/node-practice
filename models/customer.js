const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  name: {
    type:String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  phone: {
    type: Number,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: {
    type: Boolean,
    default: false
  }
});
const Customer = mongoose.model('Customer', customerSchema);


function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.number().required(),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
