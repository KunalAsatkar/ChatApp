const express = require("express");
const {
    accessChat,
    fetchChats,
    createGroupChat,
    groupExit,
    fetchGroups,
    addSelfToGroup
} = require("../Controllers/chatControllers.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/createGroup").post(protect, createGroupChat);
router.route("/fetchGroups").get(protect, fetchGroups);
router.route("/groupExit").put(protect, groupExit);
router.route("/addSelfToGroup").put(protect, addSelfToGroup);

module.exports = router;