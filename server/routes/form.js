import Router from 'express';
import { formController, getAllAffiliates , getLastClubId} from '../controllers/formController.js';

const router = Router();

router.post("/submit", formController);
router.get("/allaffiliates", getAllAffiliates);
router.get("/last-club-id", getLastClubId);

export default router;
