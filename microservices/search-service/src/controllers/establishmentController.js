import { Establishment } from "../models/Establishment.js";


export class EstablishmentController {
  static async getAllEstablishments(req, res) {
    try {
      const establishments = await Establishment.findAllEstablishments();
      res.json({
        success: true,
        data: establishments,
      });
    } catch (error) {
      console.error("Error al obtener los establecimientos:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
}