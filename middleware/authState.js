const isLoggedIn = async (req, res, next) => {
    const bearerHearder = req.headers?.["authorization"];
    try {
      // decrypt the token
      if (bearerHearder != "") {
        // @ts-ignore
        const token = jwt.verify(bearerHearder, process.env.SECRET_KEY);
        // @ts-ignore
        const user = await User.findOne({ publicId: token.user });
        // @ts-ignore
        res.locals.user = user;
        next();
      } else {
        return res.status(403).json({ message: "Login Reqired" });
      }
    }
    catch {
      return res.status(400).json({ message: "No Authentication header provided" });
    }
  };

module.exports = isLoggedIn