const { RefreshToken } = require('../models')
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken")

const createToken = async function (user) {
  let token = uuidv4();
  let expiryDate = Date.now() + 1000 * 60 * 10;
  let refreshToken = await RefreshToken.create({
    token: token,
    userId: user.id,
    expire: expiryDate,
  });
  return refreshToken;
};

const refreshTokenHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookie;
    if (!refreshToken) {
      return res
        .status(200)
        .json({ success: false, message: "Token required" });
    }
    const refToken = await RefreshToken.findOne({
      where: { token: refreshToken },
    });

    if (!refToken) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid refresh token" });
    }

    if (refToken.expiry_date < Date.now()) {
      return res
        .status(404)
        .json({ success: false, message: "Refresh token has expired" });
    }

    const accessToken = await jwt.sign(
      { userId: refToken.userId },
      process.env.secret_key,
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 60 * 1000),
    });
    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: accessToken
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshToken:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         userId:
 *           type: integer
 *         expire:
 *           type: integer
 *     AccessTokenResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: string
 */

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh the access token using the refresh token
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         schema:
 *           type: string
 *         required: true
 *         description: Refresh token used to generate a new access token
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccessTokenResponse'
 *       404:
 *         description: Refresh token is invalid or expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /create-token:
 *   post:
 *     summary: Create a new refresh token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user for whom the refresh token is created
 *     responses:
 *       201:
 *         description: Refresh token created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshToken'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

module.exports = { createToken, refreshTokenHandler }