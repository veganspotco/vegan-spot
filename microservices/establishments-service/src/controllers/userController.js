import { User } from "../models/User.js";
import bcrypt from 'bcrypt';

export class UserController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const user = await User.findById(email.toLowerCase());

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Remove sensitive data
      const { password_hash, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: userWithoutPassword,
        message: 'Login successful'
      });

    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const { email, password, full_name, role } = req.body;

      if (!email || !password || !full_name || !role) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, full name and role are required'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create(email.toLowerCase(), hashedPassword, full_name, role);

      res.json({
        success: true,
        data: user,
        message: 'User registered successfully'
      });
    } catch (error) {
      next(error);
    }
  }


  static async getAll(req, res, next) {
    try {
      const { limit = 10, page = 1 } = req.query;
      const offset = (page - 1) * limit;

      const users = await User.findAll(parseInt(limit), offset);

      res.json({
        success: true,
        data: users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          count: users.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByEmail(req, res, next) {
    try {
      const { email } = req.params;
      const user = await User.findById(email.toLowerCase());
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}