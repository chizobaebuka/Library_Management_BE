import { Router } from 'express';
import { deleteUser, getAllUsers, getUserProfile, loginUser, logoutUser, signupUser, updateUserProfile } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/authMiddleware';
// import { signUp, login, getProfile, updateProfile } from '../controllers/userController';
// import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/:userId', getUserProfile);
router.get('/', authenticateToken, getAllUsers);
router.put('/:userId', authenticateToken, updateUserProfile);
router.delete('/:userId', authenticateToken, deleteUser);

export default router;
