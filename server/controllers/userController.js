const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { createTokens, verifyRefreshToken } = require("./tokenController");
const crypto = require("crypto");
const { sendMail } = require("../utils/mailSender");
const cookie = require("cookie");
const Token = require("../models/token");
const client = require("../config/auth");

const cookieOptions =
  process.env.NODE_ENV === "production"
    ? {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      }
    : {};

exports.register = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res
        .status(400)
        .json({ success: false, message: "Account already exists" });
    } else {
      const newUser = new User({
        id: uuidv4(),
        name: req.body.name,
        surname: req.body.surname,
        photo: "",
        email: req.body.email,
        password: crypto
          .createHash("sha256")
          .update(req.body.password)
          .digest("hex"),
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: "free",
        lastSeen: new Date(),
        provider: "local",
        providerId: uuidv4(),
      });
      await newUser.save();
      const tokens = await createTokens(newUser.id);
      if (tokens) {
        res.cookie("refreshToken", tokens.refreshToken, {
          ...cookieOptions,
          maxAge: process.env.REFRESH_TOKEN_EXPIRES_IN * 1000,
        });
        res.cookie("accessToken", tokens.accessToken, {
          ...cookieOptions,
          maxAge: process.env.ACCESS_TOKEN_EXPIRES_IN * 1000,
        });
        res.status(201).json({ success: true });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Something went wrong" });
      }
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (user.provider === "local") {
        if (
          user.password ===
          crypto.createHash("sha256").update(req.body.password).digest("hex")
        ) {
          const tokens = await createTokens(user.id);
          if (tokens) {
            res.cookie("refreshToken", tokens.refreshToken, {
              ...cookieOptions,
              maxAge: process.env.REFRESH_TOKEN_EXPIRES_IN * 1000,
            });
            res.cookie("accessToken", tokens.accessToken, {
              ...cookieOptions,
              maxAge: process.env.ACCESS_TOKEN_EXPIRES_IN * 1000,
            });
            res.status(200).json({ success: true });
          } else {
            res
              .status(400)
              .json({ success: false, message: "Something went wrong" });
          }
        } else {
          res.status(400).json({ success: false, message: "Invalid password" });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "Log in using Google",
        });
      }
    } else {
      res.status(404).json({ success: false, message: "Account not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.refreshTokens = async (req, res) => {
  try {
    const cookies = cookie.parse(req.headers.cookie);
    const refreshToken = cookies.refreshToken;
    const decoded = await verifyRefreshToken(refreshToken);
    if (decoded) {
      const tokens = await createTokens(decoded.sub);
      if (tokens) {
        res.cookie("refreshToken", tokens.refreshToken, {
          ...cookieOptions,
          maxAge: process.env.REFRESH_TOKEN_EXPIRES_IN * 1000,
        });
        res.cookie("accessToken", tokens.accessToken, {
          ...cookieOptions,
          maxAge: process.env.ACCESS_TOKEN_EXPIRES_IN * 1000,
        });
        res.status(200).json({ success: true });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Something went wrong" });
      }
    } else {
      res.cookie("accessToken", "", { maxAge: 0 });
      res.cookie("refreshToken", "", { maxAge: 0 });
      res.status(400).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const clientUrl = process.env.CLIENT_URL;
      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenData = await Token.findOne({ userId: user.id });
      if (tokenData) {
        await Token.findOneAndUpdate(
          { userId: user.id },
          {
            token: resetToken,
            expiresAt: new Date(Date.now() + 3600 * 1000),
          }
        );
      } else {
        await Token.create({
          id: uuidv4(),
          token: resetToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 3600 * 1000),
          createdAt: new Date(),
        });
      }
      const data = {
        to: user.email,
        subject: "Password reset",
        text: "Reset your password",
        html: `This message is sent to reset your password. Click <a href="${clientUrl}/reset_password/${resetToken}">here</a> to reset your password. Link is valid for 1 hour.<br/>If you didn't request this, you can ignore this email`,
      };
      const result = await sendMail(data);
      if (result) {
        res.status(200).json({
          success: true,
          message:
            "An email has been sent to reset your password. Please check your email",
        });
      } else {
        res.status(400).json({ success: false, message: "Cannot send email" });
      }
    } else {
      res.status(404).json({ success: false, message: "Account not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const tokenData = await Token.findOneAndDelete({ token: req.body.token });
    if (!tokenData) {
      return res.status(400).json({
        success: false,
        message: "Link is invalid or expired",
      });
    }
    const user = await User.findOne({ id: tokenData.userId });
    if (user) {
      user.password = crypto
        .createHash("sha256")
        .update(req.body.password)
        .digest("hex");
      await user.save();
      res.status(200).json({ success: true, message: "Password updated" });
    } else {
      res.status(404).json({ success: false, message: "Account not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { id: req.userId },
      {
        name: req.body.name,
        surname: req.body.surname,
        photo: req.body.photo,
        updatedAt: new Date(),
      }
    );
    if (user) {
      res
        .status(200)
        .json({ success: true, message: "User updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const emailRegex = new RegExp(req.params.email, "i");
    const users = await User.find({
      email: emailRegex,
      id: { $ne: req.userId },
    })
      .select("id name surname photo email lastSeen")
      .lean();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id })
      .select("id name surname photo email lastSeen")
      .lean();
    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.userId })
      .select("id name surname photo email")
      .lean();
    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.logOut = async (req, res) => {
  try {
    res.cookie("refreshToken", "", { maxAge: 0 });
    res.cookie("accessToken", "", { maxAge: 0 });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

exports.signUpWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    const user = await User.findOne({ email });
    if (user) {
      res
        .status(400)
        .json({ success: false, message: "Account already exists" });
    } else {
      const newUser = new User({
        id: uuidv4(),
        name: name.split(" ")[0],
        surname: name.split(" ")[1] || "",
        photo: picture || "",
        email: email,
        password: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: "free",
        lastSeen: new Date(),
        provider: "google",
        providerId: googleId,
      });
      await newUser.save();
      const tokens = await createTokens(newUser.id);
      if (tokens) {
        res.cookie("refreshToken", tokens.refreshToken, {
          ...cookieOptions,
          maxAge: process.env.REFRESH_TOKEN_EXPIRES_IN * 1000,
        });
        res.cookie("accessToken", tokens.accessToken, {
          ...cookieOptions,
          maxAge: process.env.ACCESS_TOKEN_EXPIRES_IN * 1000,
        });
        res.status(201).json({ success: true });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Something went wrong" });
      }
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

exports.signInWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email } = payload;
    const user = await User.findOne({ email });
    if (user) {
      if (user.provider === "google") {
        const tokens = await createTokens(user.id);
        if (tokens) {
          res.cookie("refreshToken", tokens.refreshToken, {
            ...cookieOptions,
            maxAge: process.env.REFRESH_TOKEN_EXPIRES_IN * 1000,
          });
          res.cookie("accessToken", tokens.accessToken, {
            ...cookieOptions,
            maxAge: process.env.ACCESS_TOKEN_EXPIRES_IN * 1000,
          });
          res.status(200).json({ success: true });
        } else {
          res
            .status(400)
            .json({ success: false, message: "Something went wrong" });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "Account is not registered with Google",
        });
      }
    } else {
      res.status(404).json({ success: false, message: "Account not found" });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};
