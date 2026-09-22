const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const Task = require('../models/Task');

const getMetrics = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const activeLeads = await Lead.countDocuments({
      status: { $nin: ['Won', 'Lost'] },
    });
    const pendingTasks = await Task.countDocuments({
      status: { $ne: 'Completed' },
    });
    const closedDeals = await Lead.countDocuments({
      status: 'Won',
    });

    const wonLeadsAggregation = await Lead.aggregate([
      { $match: { status: 'Won' } },
      { $group: { _id: null, totalValue: { $sum: '$value' } } },
    ]);

    const totalDealValue =
      wonLeadsAggregation.length > 0 ? wonLeadsAggregation[0].totalValue : 0;

    const pipelineAggregation = await Lead.aggregate([
      { $match: { status: { $nin: ['Lost'] } } },
      { $group: { _id: null, totalPipeline: { $sum: '$value' } } },
    ]);
    const totalPipelineValue =
      pipelineAggregation.length > 0 ? pipelineAggregation[0].totalPipeline : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        activeLeads,
        pendingTasks,
        closedDeals,
        totalDealValue,
        totalPipelineValue,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error calculating dashboard metrics',
    });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const recentCustomers = await Customer.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name email');

    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name email');

    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name email');

    const activities = [
      ...recentCustomers.map((c) => ({
        id: c._id,
        type: 'customer',
        title: `Customer Created: ${c.name}`,
        subtitle: c.company || c.email,
        createdAt: c.createdAt,
        user: c.createdBy ? c.createdBy.name : 'System',
      })),
      ...recentLeads.map((l) => ({
        id: l._id,
        type: 'lead',
        title: `Lead Logged: ${l.title}`,
        subtitle: `Stage: ${l.status} | $${l.value.toLocaleString()}`,
        createdAt: l.createdAt,
        user: l.createdBy ? l.createdBy.name : 'System',
      })),
      ...recentTasks.map((t) => ({
        id: t._id,
        type: 'task',
        title: `Task Created: ${t.title}`,
        subtitle: `Priority: ${t.priority} | Status: ${t.status}`,
        createdAt: t.createdAt,
        user: t.createdBy ? t.createdBy.name : 'System',
      })),
    ];

    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const limitedActivities = activities.slice(0, 10);

    return res.status(200).json({
      success: true,
      count: limitedActivities.length,
      data: limitedActivities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching recent activities',
    });
  }
};

const getSalesPipeline = async (req, res) => {
  try {
    const allStatuses = [
      'New',
      'Contacted',
      'Qualified',
      'Proposal Sent',
      'Won',
      'Lost',
    ];

    const pipelineData = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
        },
      },
    ]);

    const totalLeads = await Lead.countDocuments();
    const wonCount =
      pipelineData.find((item) => item._id === 'Won')?.count || 0;
    const overallConversionRate =
      totalLeads > 0 ? Number(((wonCount / totalLeads) * 100).toFixed(1)) : 0;

    const statusMap = {};
    pipelineData.forEach((item) => {
      statusMap[item._id] = {
        count: item.count,
        value: item.totalValue,
      };
    });

    const formattedPipeline = allStatuses.map((status) => {
      const info = statusMap[status] || { count: 0, value: 0 };
      const percentage =
        totalLeads > 0 ? Number(((info.count / totalLeads) * 100).toFixed(1)) : 0;
      return {
        status,
        count: info.count,
        value: info.value,
        percentage,
      };
    });

    return res.status(200).json({
      success: true,
      totalLeads,
      conversionRate: overallConversionRate,
      pipeline: formattedPipeline,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching sales pipeline data',
    });
  }
};

module.exports = {
  getMetrics,
  getRecentActivities,
  getSalesPipeline,
};
