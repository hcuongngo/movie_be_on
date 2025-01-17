import express from 'express';
import { getMovies, createNewMovie, updateMovie, deleteMovie } from '../controllers/movieController.js';
import { auth, authAdmin } from '../middlewares/auth.js';
const router = express.Router();

router.get('/', auth, getMovies)

router.post('/', auth, authAdmin, createNewMovie)

router.put('/:id', auth, authAdmin, updateMovie)

router.delete('/:id', auth, authAdmin, deleteMovie)

export { router as movieRoutes }
