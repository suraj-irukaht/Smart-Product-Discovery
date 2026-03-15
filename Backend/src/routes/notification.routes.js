const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const {
  streamNotifications,
  getNotifications,
  markAllRead,
  markOneRead,
} = require("../controllers/notification.controller");

router.use(authMiddleware);
router.use(roleMiddleware("ADMIN"));

router.get("/stream", streamNotifications); // SSE — keep-alive stream
router.get("/", getNotifications); // fetch list + unread count
router.patch("/read-all", markAllRead); // mark all as read
router.patch("/:id/read", markOneRead); // mark one as read

module.exports = router;
