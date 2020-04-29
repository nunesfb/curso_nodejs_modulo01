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

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().max(100),
      cpf: Yup.string().max(20),
      email: Yup.string().max(50),
      telephone: Yup.string().max(20),
      date_birth: Yup.date(),
      gender: Yup.string().max(1),
      oldPassword: Yup.string(),
      password: Yup.string()
        .min(6)
        .max(8)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .min(6)
        .max(8)
        .when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { email, cpf, oldPassword } = req.body;

    const user = await User.findByPk(req.idUser);

    if (email && email !== user.email) {
      const emailExists = await User.findOne({
        where: { email: req.body.email }
      });

      if (emailExists) {
        return res.status(400).json({
          error: 'Email already exists!'
        });
      }
    }

    if (cpf && cpf !== user.cpf) {
      const cpfExists = await User.findOne({
        where: { cpf: req.body.cpf }
      });

      if (cpfExists) {
        return res.status(400).json({
          error: 'CPF already exists!'
        });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({
        error: 'Password does not match!'
      });
    }

    const { id_user, name, telephone, gender, date_birth } = await user.update(
      req.body
    );

    return res.json({
      id_user,
      name,
      cpf,
      email,
      telephone,
      gender,
      date_birth
    });
  }

  async delete(req, res) {
    const user = await User.findByPk(req.params.id_user);

    if (!user) {
      return res.status(400).json({ error: 'User not exists!' });
    }

    await user.destroy(req.params.id_user);

    return res.json({ message: 'User excluded with success!' });
  }
}

export default new UserController();
