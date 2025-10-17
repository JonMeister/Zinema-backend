import { Router } from "express";
import { userController } from "../controllers/userController";
import { authenticateToken } from "../utils/auth";

const router = Router();

/**
 * @route POST /api/users/register
 * @description Register a new user.
 * @body {string} firstName - The first name of the user.
 * @body {string} lastName - The last name of the user.
 * @body {number} age - The age of the user.
 * @body {string} email - The email of the user.
 * @body {string} password - The password of the user.
 * @body {string} confirmPassword - The password confirmation.
 * @access Public
 */
router.post("/register", (req, res) => userController.registerUser(req, res));

/**
 * @route POST /api/users/login
 * @description Login a user and return a JWT token.
 * @body {string} email - The user's email.
 * @body {string} password - The user's password.
 * @access Public
 */
router.post("/login", (req, res) => userController.loginUser(req, res));

/**
 * @route GET /api/users/getUser
 * @description Get the current logged-in user's data.
 * @header {string} Authorization - Bearer token for authentication.
 * @access Private
 */
router.get("/getUser", authenticateToken, (req, res) =>
  userController.getUser(req, res)
);

/**
 * @route PUT /api/users/updateUser
 * @description Update the current logged-in user's information.
 * @header {string} Authorization - Bearer token for authentication.
 * @body {string} [firstName] - Updated first name.
 * @body {string} [lastName] - Updated last name.
 * @body {number} [age] - Updated age.
 * @body {string} [email] - Updated email.
 * @access Private
 */
router.put("/updateUser", authenticateToken, (req, res) =>
  userController.updateUser(req, res)
);

/**
 * @route DELETE /api/users/deleteUser
 * @description Delete the current logged-in user's account.
 * @header {string} Authorization - Bearer token for authentication.
 * @access Private
 */
router.delete("/deleteUser", authenticateToken, (req, res) =>
  userController.deleteUser(req, res)
);

/**
<<<<<<< HEAD
=======
 * @route POST /api/users/request-password-reset
 * @description Request a password reset email.
 * @body {string} email - The user's email.
 * @access Public
 */
router.post("/request-password-reset", (req, res) => userController.requestPasswordReset(req, res));

/**
 * @route POST /api/users/reset-password
 * @description Reset password using token from email.
 * @body {string} token - The reset token from email.
 * @body {string} password - The new password.
 * @body {string} confirmPassword - The password confirmation.
 * @access Public
 */
router.post("/reset-password", (req, res) => userController.resetPassword(req, res));

/**
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
 * Export the router instance to be mounted in the main routes file.
 */
export default router;
