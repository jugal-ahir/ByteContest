import Router from 'express';
import { contestController } from '../controllers/contest.controller';
import { verifyJWT } from '../middleware/auth.middleware';
import { verifyIsAdmin } from '../middleware/admin.middleware';
import { verifyNoCustomContestCookie, verifyCustomContestCookie } from '../middleware/customContestCokkie.middleware';
const router = Router();

router.route('/create').post(verifyJWT, verifyIsAdmin, contestController.createContest);
router.route('/getAllContests').get(verifyJWT, contestController.getAllContests);
router.route('/:contestId').get(verifyJWT, contestController.getContest);
router.route('/:contestId').put(verifyJWT, verifyIsAdmin, contestController.updateContest);
router.route('/:contestId').delete(verifyJWT, verifyIsAdmin, contestController.deleteContest);

router.route('/updateDeadline/:contestId').put(verifyJWT, verifyIsAdmin, contestController.updateContestDeadline);
router.route('/signIn/:contestId').post(verifyJWT, contestController.signInContest);
router.route('/getContestDeadline/:contestId').get(verifyJWT, verifyCustomContestCookie, contestController.getContestDeadline);
router.route('/retainUser').post(verifyJWT, verifyIsAdmin, contestController.clearUserContestCustomCookie);
export default router;