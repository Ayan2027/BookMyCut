import UserProfile from "./user.model.js"

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    let profile = await UserProfile.findOne({
      account: req.user._id
    });

    if (!profile) {
      profile = await UserProfile.create({
        account: req.user._id,
        name,
        phone,
        avatar
      });
    } else {
      profile.name = name;
      profile.phone = phone;
      profile.avatar = avatar;
      await profile.save();
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      account: req.user._id
    });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
