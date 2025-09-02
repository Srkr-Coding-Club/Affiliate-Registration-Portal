import Router from 'express';
import { formController, getAllAffiliates , getLastClubId} from '../controllers/formController.js';
import { protectRoute } from '../middleware/auth.js';

const router = Router();

router.post("/submit",protectRoute,formController);
router.get("/allaffiliates",protectRoute,getAllAffiliates);
router.get("/last-club-id", getLastClubId);
router.get("/check-auth", protectRoute, (req, res) => {
  res.json({ isLoggedIn: true });
});

export default router;
