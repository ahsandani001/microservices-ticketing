import express, { Request, Response } from 'express';
import { body, validationResult, ValidationError } from 'express-validator';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array().map((err: ValidationError) => ({
          field: err.type === 'field' ? err.path : '',
          message: err.msg,
        })),
      });
      return;
    }

    const { email, password } = req.body;
    res.status(201).json({
      message: 'Signup',
    });
  }
);

export { router as signupRouter };
