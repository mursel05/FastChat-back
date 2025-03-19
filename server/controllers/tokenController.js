const Token = require("../models/token");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const CryptoJS = require("crypto-js");

dotenv.config();

const jwtAccessSecretKey = process.env.JWT_ACCESS_SECRET_KEY;
const jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;
const cryptoSecretKey = process.env.CRYPTO_SECRET_KEY;

exports.createTokens = async (userId) => {
  try {
    const accessToken = jwt.sign({ sub: userId }, jwtAccessSecretKey, {
      expiresIn: Number(accessTokenExpiresIn),
    });
    const refreshToken = jwt.sign({ sub: userId }, jwtRefreshSecretKey, {
      expiresIn: Number(refreshTokenExpiresIn),
    });
    const tokenData = await Token.findOne({ userId });
    if (tokenData) {
      await Token.findOneAndUpdate(
        { userId: userId },
        {
          token: crypto.createHash("sha256").update(refreshToken).digest("hex"),
          expiresAt: new Date(
            Date.now() + Number(refreshTokenExpiresIn) * 1000
          ),
        }
      );
    } else {
      await Token.create({
        id: uuidv4(),
        token: crypto.createHash("sha256").update(refreshToken).digest("hex"),
        userId,
        expiresAt: new Date(Date.now() + Number(refreshTokenExpiresIn) * 1000),
        createdAt: new Date(),
      });
    }
    const encriptedRefreshToken = CryptoJS.AES.encrypt(
      refreshToken,
      cryptoSecretKey
    ).toString();
    const encriptedAccessToken = CryptoJS.AES.encrypt(
      accessToken,
      cryptoSecretKey
    ).toString();
    return {
      accessToken: encriptedAccessToken,
      refreshToken: encriptedRefreshToken,
    };
  } catch (error) {
    return null;
  }
};

exports.verifyAccessToken = (accessToken) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      accessToken,
      cryptoSecretKey
    ).toString(CryptoJS.enc.Utf8);
    const decoded = jwt.verify(decrypted, jwtAccessSecretKey);
    return decoded;
  } catch (error) {
    return null;
  }
};

exports.verifyRefreshToken = async (refreshToken) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      refreshToken,
      cryptoSecretKey
    ).toString(CryptoJS.enc.Utf8);
    const decoded = jwt.verify(decrypted, jwtRefreshSecretKey);
    const tokenData = await Token.findOne({ userId: decoded.sub });
    if (!tokenData) {
      return null;
    } else {
      const hashToken = crypto
        .createHash("sha256")
        .update(decrypted)
        .digest("hex");
      if (hashToken !== tokenData.token) {
        return null;
      } else {
        return decoded;
      }
    }
  } catch (error) {
    return null;
  }
};
