import * as Yup from 'yup';
import { Op } from 'sequelize';
import Driver from '../models/Driver';
import User from '../models/User';

class DriverController {
  async store(req, res) {
    const schema = Yup.object().shape({
      cnh: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const driverExists = await Driver.findOne({
      attributes: ['id_driver'],
      where: {
        [Op.or]: {
          cnh: req.body.cnh,
          id_user: req.idUser
        }
      }
    });

    if (driverExists) {
      return res.status(400).json({ error: 'Driver already exists!' });
    }

    req.body.id_user = req.idUser;
    const { id_driver, cnh } = await Driver.create(req.body);
    return res.json({
      id_driver,
      cnh
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const drivers = await Driver.findAll({
      order: ['id_driver'],
      attributes: ['id_driver', 'cnh'],
      limit: 10,
      offset: (page - 1) * 10
    });

    if (!drivers) {
      return res.status(400).json({ error: 'Drivers not exists!' });
    }

    return res.json(drivers);
  }

  async details(req, res) {
    const driver = await Driver.findOne({
      where: { id_driver: req.params.id_driver },
      attributes: ['id_driver', 'cnh', 'active'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id_user', 'name', 'email', 'telephone']
        }
      ]
    });

    if (!driver) {
      return res.status(400).json({ error: 'Driver not exists!' });
    }

    return res.json(driver);
  }
}

export default new DriverController();
