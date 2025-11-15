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
}