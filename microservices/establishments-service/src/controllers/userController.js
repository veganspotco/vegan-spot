import { User } from "../models/User.js";

export class UserController {
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