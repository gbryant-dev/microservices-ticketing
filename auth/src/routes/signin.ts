import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

import jwt from 'jsonwebtoken';

import { validateRequest } from '../middleware/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = Router();

router.post('/api/users/signin', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
], 
validateRequest,
async (req: Request, res: Response) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError('Email does not exist');
  }

  const result = await Password.compare(user.password, password);

  if (!result) {
    throw new BadRequestError('Password is not correct');
  }

  const userJwt = jwt.sign({
    id: user.id,
    email: user.email
  }, 
  process.env.JWT_KEY!
  );

  req.session = {
    jwt: userJwt
  }

  res.status(200).send(user);

});

export { router as signInRouter };