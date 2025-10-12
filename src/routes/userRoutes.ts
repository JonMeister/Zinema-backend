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

router.get("/getUser", authenticateToken, (req, res) =>
  userController.getUser(req, res)
);

router.put("/updateUser", authenticateToken, (req, res) =>
  userController.updateUser(req, res)
);

/**
 *  * Export the router instance to be mounted in the main routes file.
*/
export default router;
