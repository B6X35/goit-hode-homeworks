const express = require("express");
const createError = require("http-errors")
const Joi = require('joi')

const contacts = require('../../models/contacts')

const router = express();

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required()
});

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } 
  catch(error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const result = await contacts.getContactById(contactId);
    if(!result) {
      throw createError(404, 'Not found');
    }
    res.json(result);
  } catch(error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {error} = contactSchema.validate(req.body);
    if(error) {
      throw createError(400, error.message);
    }
    const { name, email, phone } = req.body;
    const result = await contacts.addContact(name, email, phone);
    res.status(201).json(result);
  } catch(error) {
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const result = await contacts.removeContact(contactId);
    if(!result) {
      throw createError(404, 'Not found');
    }
    res.json({
      "message": "product deleted"
    });
  } catch(error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const {error} = contactSchema.validate(req.body);
    if(error) {
      throw createError(400, error.message);
    }
    const {id} = req.params;
    const result = await contacts.updateContact(id, req.body);
    if(!result) {
      throw createError(404, 'Not found');
    }
    res.json(result)
  } catch(error) {
    next(error);
  }
})

module.exports = router
