const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const { assignedTo, status, priority, search } = req.query;
    let query = {};

    if (assignedTo && assignedTo !== 'All') {
      query.assignedTo = assignedTo;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (search) {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching tasks',
    });
  }
};

const getUserAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching assigned tasks',
    });
  }
};

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      relatedTo,
      relatedToId,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const task = await Task.create({
      title,
      description: description || '',
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      priority: priority || 'Medium',
      relatedTo: relatedTo || null,
      relatedToId: relatedToId || null,
      createdBy: req.user.id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    return res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating task',
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      status,
      relatedTo,
      relatedToId,
    } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const updateData = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(assignedTo !== undefined && { assignedTo: assignedTo || null }),
      ...(dueDate !== undefined && { dueDate: dueDate || null }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
      ...(relatedTo !== undefined && { relatedTo: relatedTo || null }),
      ...(relatedToId !== undefined && { relatedToId: relatedToId || null }),
    };

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating task',
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating task status',
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting task',
    });
  }
};

module.exports = {
  getTasks,
  getUserAssignedTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
