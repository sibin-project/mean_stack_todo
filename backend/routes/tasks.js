import express from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.get('/', async (req, res, next) => {
    try {
        const { status, priority, search, sortBy, sortOrder } = req.query;

        // Build query
        const query = { userId: req.user._id };

        if (status) {
            query.status = status;
        }

        if (priority) {
            query.priority = priority;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort
        let sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            sort.createdAt = -1; // Default: newest first
        }

        const tasks = await Task.find(query).sort(sort);

        res.json({
            success: true,
            count: tasks.length,
            tasks
        });
    } catch (error) {
        next(error);
    }
});

router.post('/',
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
        body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
        body('dueDate').optional().isISO8601().withMessage('Invalid date format')
    ],
    async (req, res, next) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array().map(e => e.msg)
                });
            }

            const { title, description, status, priority, dueDate } = req.body;

            const task = await Task.create({
                userId: req.user._id,
                title,
                description,
                status,
                priority,
                dueDate
            });

            res.status(201).json({
                success: true,
                message: 'Task created successfully',
                task
            });
        } catch (error) {
            next(error);
        }
    }
);

router.put('/:id',
    [
        body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
        body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
        body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
        body('dueDate').optional().isISO8601().withMessage('Invalid date format')
    ],
    async (req, res, next) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array().map(e => e.msg)
                });
            }

            // Find task
            const task = await Task.findById(req.params.id);

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            // Check ownership
            if (task.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this task'
                });
            }

            // Update task
            const { title, description, status, priority, dueDate } = req.body;

            if (title !== undefined) task.title = title;
            if (description !== undefined) task.description = description;
            if (status !== undefined) task.status = status;
            if (priority !== undefined) task.priority = priority;
            if (dueDate !== undefined) task.dueDate = dueDate;

            await task.save();

            res.json({
                success: true,
                message: 'Task updated successfully',
                task
            });
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id', async (req, res, next) => {
    try {
        // Find task
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check ownership
        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this task'
            });
        }

        await task.deleteOne();

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

export default router;
