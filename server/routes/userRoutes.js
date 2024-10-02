const {
  login,
  register,
  getAllUsers,
  SetAvatar, 
} = require("../controllers/userController");

const router = require("express").Router();


router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers); 
router.post("/setavatar/:id", SetAvatar); 

module.exports = router;
