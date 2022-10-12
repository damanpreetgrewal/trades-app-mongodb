const { body } = require('express-validator');
const express = require('express');
const router = express.Router();

const { getUsers, postUser } = require('../controllers/userController');

router
  .route('/')
  .get(getUsers)
  .post(
    [body('name').not().isEmpty().trim().withMessage('Name is required')],
    postUser
  );

module.exports = router;
