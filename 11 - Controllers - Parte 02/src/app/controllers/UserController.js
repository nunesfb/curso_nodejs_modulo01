import * as Yup from 'yup';
import { Op } from 'sequelize';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .max(100),
      cpf: Yup.string()
        .required()
        .max(20),
      email: Yup.string()
        .required()
        .max(50),
      telephone: Yup.string()
        .required()
        .max(20),
      date_birth: Yup.date().required(),
      gender: Yup.string()
        .required()
        .max(1),
      password: Yup.string()
        .required()
        .min(6)
        .max(8)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const UserExists = await User.findOne({
      attributes: ['id_user'],
      where: {
        [Op.or]: {
          cpf: req.body.cpf,
          email: req.body.email
        }
      }
    });

    if (UserExists) {
      return res.status(400).json({ error: 'User already exists!' });
    }

    const { id_user, name, email } = await User.create(req.body);
    return res.json({
      id_user,
      name,
      email
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const users = await User.findAll({
      where: { admin: false },
      limit: 10,
      offset: (page - 1) * 10,
      order: ['name'],
      attributes: ['id_user', 'name', 'email', 'cpf', 'telephone', 'date_birth']
    });
    return res.json(users);
  }

  async details(req, res) {
    const user = await User.findOne({
      where: { id_user: req.params.id_user },
      attributes: [
        'id_user',
        'name',
        'email',
        'cpf',
        'telephone',
        'date_birth',
        'gender',
        'admin'
      ]
    });

    if (!user) {
      return res.status(400).json({ error: 'User not exists!' });
    }

    return res.json(user);
  }
}

export default new UserController();
