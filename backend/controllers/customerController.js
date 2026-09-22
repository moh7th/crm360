const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const Task = require('../models/Task');

const getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : '';

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: customers.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: customers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching customers',
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('createdBy', 'name email');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    const leads = await Lead.find({ customer: customer._id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    const tasks = await Task.find({
      relatedTo: 'Customer',
      relatedToId: customer._id,
    })
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 });

    return res.status(200).json({
      success: true,
      data: {
        ...customer.toObject(),
        leads,
        tasks,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching customer details',
    });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, address, city, state, zip, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and email are required',
      });
    }

    const customer = await Customer.create({
      name,
      email,
      phone: phone || '',
      company: company || '',
      address: address || '',
      city: city || '',
      state: state || '',
      zip: zip || '',
      notes: notes || '',
      createdBy: req.user.id,
    });

    const populatedCustomer = await Customer.findById(customer._id).populate('createdBy', 'name email');

    return res.status(201).json({
      success: true,
      data: populatedCustomer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating customer',
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, address, city, state, zip, notes } = req.body;

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    const updatedData = {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(company !== undefined && { company }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(zip !== undefined && { zip }),
      ...(notes !== undefined && { notes }),
    };

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      data: updatedCustomer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating customer',
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    await Customer.findByIdAndDelete(req.params.id);
    await Lead.updateMany({ customer: req.params.id }, { $set: { customer: null } });
    await Task.deleteMany({ relatedTo: 'Customer', relatedToId: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Customer and associated tasks deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting customer',
    });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
