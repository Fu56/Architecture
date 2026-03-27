import { Router } from "express";
import { 
  getChannels, getMessages, sendMessage, 
  createChannel, subscribeChannel, unsubscribeChannel, 
  addUserToChannel, getChannelMembers, markMessagesRead,
  markAllRead, getOrCreatePrivateChannel,
  searchPublicChannels, joinPublicChannel
} from "../controllers/chat.controller";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";

import { upload } from "../utils/uploader";

const router = Router();

router.use(requireAuth);

router.get("/channels", getChannels);
router.get("/channels/search", searchPublicChannels);
router.get("/channels/:channelId/members", getChannelMembers);
router.post("/channels/:channelId/subscribe", subscribeChannel);
router.post("/channels/:channelId/join", joinPublicChannel);
router.post("/channels/:channelId/unsubscribe", unsubscribeChannel);
router.post("/channels/:channelId/add-user", requireRole(["Admin", "DepartmentHead", "SuperAdmin"]), addUserToChannel);
router.post("/channels/mark-all-read", markAllRead);
router.post("/channels/private", getOrCreatePrivateChannel);
router.post("/channels/:channelId/mark-read", markMessagesRead);
router.get("/channels/:channelId/messages", getMessages);
router.post("/channels/:channelId/messages", upload.single("file"), sendMessage);


// Admin / DeptHead only: Channel creation
router.post("/channels", requireRole(["Admin", "DepartmentHead", "SuperAdmin"]), createChannel);

export default router;
