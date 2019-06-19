/**
 * functions to be passed into routes
 */
function UserController(userInteractor) {
  async function createNewUser(req, res) {
    const { username, password } = req.body;
    const { ok, result, error } = await userInteractor.createNewUser({ username, password });
    if (!ok) {
      res.status(409).json({ message: `user could not be created. Reason: ${error}` });
    } else {
      res.status(201).json({ message: 'User has been created', username: result.Username, token: result.webToken });
    }
  }

  async function login(req, res) {
    const { username, password } = req.body;
    const rslt = await userInteractor.login({ username, password });
    if (!rslt.ok) {
      res.status(401).json(`Login failed. Reason: ${rslt.error}`);
    } else {
      const { result } = rslt;
      res.status(200).json({ message: 'user logged in with success', user: result.username, token: result.token });
    }
  }

  async function getProfile(req, res) {
    const profile = await userInteractor.getProfile(req.token);
    if (profile.ok) {
      res.status(200).json({ user: { id: profile.id, username: profile.username } });
    } else {
      res.status(204).json({ message: `could not find the user. Reason ${profile.error}` });
    }
  }

  async function getUser(req, res) {
    const profile = await userInteractor.getUser(req.params.id);
    if (profile.ok && profile.id) {
      res.status(200).json({ id: profile.id, username: profile.username, like_count: profile.like_count });
    } else {
      res.status(204).json({ message: `could not find the user. Reason ${profile.error}` });
    }
  }

  async function getUserList(req, res) {
    const list = await userInteractor.getUserList();
    if (list.ok) {
      res.status(200).json({ user: list.result });
    } else {
      res.status(204).json({ message: `could not find the user. Reason ${list.error}` });
    }
  }

  async function updatePassword(req, res) {
    const { password } = req.body;
    const { username } = req.token;
    const result = await userInteractor.updatePassword({ password, username });
    if (result.ok) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }

  async function like(req, res) {
    const { id } = req.token;
    const secondUserId = req.params.id;
    const result = await userInteractor.saveLike({ firstUserId: id, secondUserId });
    if (result.ok) {
      res.sendStatus(201);
    } else {
      res.status(400).json({ message: result.error });
    }
  }

  async function unlike(req, res) {
    const { id } = req.token;
    const secondUserId = req.params.id;
    const result = await userInteractor.deleteLike({ firstUserId: id, secondUserId });
    if (result.ok) {
      res.sendStatus(200);
    } else {
      res.status(400).json({ message: result.error });
    }
  }

  return {
    createNewUser,
    getProfile,
    login,
    updatePassword,
    like,
    unlike,
    getUser,
    getUserList,
  };
}

module.exports = UserController;
