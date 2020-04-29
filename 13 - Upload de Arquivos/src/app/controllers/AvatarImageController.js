import User from '../models/User';

class AvatarImageController {
  async update_avatar_image(req, res) {
    const { filename: avatar_image } = req.file;

    const user = await User.findByPk(req.idUser);

    const userData = await user.update({ avatar_image });

    return res.json(userData);
  }
}

export default new AvatarImageController();
