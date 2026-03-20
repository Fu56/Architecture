import { Router } from "express";
import { 
  getChannels, getMessages, sendMessage, 
  createChannel, subscribeChannel, unsubscribeChannel, 
  addUserToChannel, getChannelMembers
} from "../controllers/chat.controller";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";

const router = Router();

router.use(requireAuth);

router.get("/channels", getChannels);
router.get("/channels/:channelId/members", getChannelMembers);
router.post("/channels/:channelId/subscribe", subscribeChannel);
router.post("/channels/:channelId/unsubscribe", unsubscribeChannel);
router.post("/channels/:channelId/add-user", requireRole(["Admin", "DepartmentHead", "SuperAdmin"]), addUserToChannel);
router.get("/channels/:channelId/messages", getMessages);
router.post("/channels/:channelId/messages", sendMessage);


// Admin / DeptHead only: Channel creation
router.post("/channels", requireRole(["Admin", "DepartmentHead", "SuperAdmin"]), createChannel);

export default router;
