const { createToken } = require('./refreshTokenCOntroller');
const jwt = require("jsonwebtoken");
const { Employee, } = require('../models')
const bcrypt = require('bcryptjs');


/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns access and refresh tokens.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       500:
 *         description: Server error
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const emp = await Employee.findOne({ where: { email } });

        if (!emp) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const isMatch = await bcrypt.compare(password, emp.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const accessToken = jwt.sign({ id: emp.id }, process.env.secret_key, { expiresIn: '20m' });

        const refreshToken = await createToken(emp);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 10 * 60 * 1000),
        });
        res.cookie("refreshToken", refreshToken, {
            expires: new Date(Date.now() + 7 * 60 * 60 * 1000),
            httpOnly: true,
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {accessToken, refreshToken },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User logout
 *     description: Logs out a user and clears cookies.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "logout successfully"
 *       500:
 *         description: Server error
 */
const logout = (req, res) => {
    try {
        res.cookie("accessToken", null, {
            httpOnly: true,
            expires: new Date(Date.now()),
        });
        res.cookie("refreshToken", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(200).json({ success: true, message: "logout successfully" });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = { login, logout };