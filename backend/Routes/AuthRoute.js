const { Signup, Login, GoogleSignin } = require("../Controllers/AuthController");
const { InitiateGoogleLogin, HandleGoogleLogin } = require("../Controllers/GoogleLoginController");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.post("/signup", Signup);
router.post('/login', Login);
router.post('/', userVerification);
router.post('/GoogleSignin', GoogleSignin)
router.get('/auth/google', InitiateGoogleLogin)
router.get('/auth/google/callback', HandleGoogleLogin)

module.exports = router;