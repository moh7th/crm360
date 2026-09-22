const Lead = require('../models/Lead');
const Task = require('../models/Task');

const getLeads = async (req, res) => {
  try {
    const { status, assignedTo, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (assignedTo && assignedTo !== 'All') {
      query.assignedTo = assignedTo;
    }

    if (search) {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const leads = await Lead.find(query)
      .populate('customer', 'name email company phone')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching leads',
    });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('customer', 'name email company phone address city state zip')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    const tasks = await Task.find({
      relatedTo: 'Lead',
      relatedToId: lead._id,
    })
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 });

    return res.status(200).json({
      success: true,
      data: {
        ...lead.toObject(),
        tasks,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching lead details',
    });
  }
};

const createLead = async (req, res) => {
  try {
    const { title, customer, status, value, assignedTo, notes, followUpDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Lead title is required',
      });
    }

    const lead = await Lead.create({
      title,
      customer: customer || null,
      status: status || 'New',
      value: Number(value) || 0,
      assignedTo: assignedTo || null,
      notes: notes || '',
      followUpDate: followUpDate || null,
      createdBy: req.user.id,
    });

    const populatedLead = await Lead.findById(lead._id)
      .populate('customer', 'name email company phone')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    return res.status(201).json({
      success: true,
      data: populatedLead,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating lead',
    });
  }
};

const updateLead = async (req, res) => {
  try {
    const { title, customer, status, value, assignedTo, notes, followUpDate } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    const updateData = {
      ...(title !== undefined && { title }),
      ...(customer !== undefined && { customer: customer || null }),
      ...(status !== undefined && { status }),
      ...(value !== undefined && { value: Number(value) || 0 }),
      ...(assignedTo !== undefined && { assignedTo: assignedTo || null }),
      ...(notes !== undefined && { notes }),
      ...(followUpDate !== undefined && { followUpDate: followUpDate || null }),
    };

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('customer', 'name email company phone')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      data: updatedLead,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating lead',
    });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    lead.status = status;
    await lead.save();

    const updatedLead = await Lead.findById(lead._id)
      .populate('customer', 'name email company phone')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      data: updatedLead,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating lead status',
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    await Lead.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ relatedTo: 'Lead', relatedToId: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Lead and associated tasks deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting lead',
    });
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
};
