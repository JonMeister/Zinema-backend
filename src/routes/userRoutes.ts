import { Router } from "express";
import { userController } from "../controllers/userController";

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
 *  * Export the router instance to be mounted in the main routes file.
*/
export default router;
