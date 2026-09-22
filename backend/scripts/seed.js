const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const Task = require('../models/Task');

dotenv.config();

const seedDatabase = async (standalone = false) => {
  try {
    if (standalone) {
      await connectDB();
    }

    await Task.deleteMany({});
    await Lead.deleteMany({});
    await Customer.deleteMany({});
    await User.deleteMany({});

    const admin = await User.create({
      name: 'Eleanor Vance',
      email: 'admin@crm360.com',
      password: 'Admin@123',
      role: 'Admin',
    });

    const manager = await User.create({
      name: 'Marcus Sterling',
      email: 'manager@crm360.com',
      password: 'Manager@123',
      role: 'Sales Manager',
    });

    const executive = await User.create({
      name: 'Sophia Chen',
      email: 'executive@crm360.com',
      password: 'Executive@123',
      role: 'Sales Executive',
    });

    const customers = await Customer.create([
      {
        name: 'Alexander Wright',
        email: 'alex.wright@acmecorp.com',
        phone: '+1 (555) 234-5678',
        company: 'Acme Corporation',
        address: '742 Evergreen Terrace',
        city: 'San Francisco',
        state: 'CA',
        zip: '94107',
        notes: 'Key enterprise account exploring multi-region expansion.',
        createdBy: admin._id,
      },
      {
        name: 'Beatrice Morales',
        email: 'b.morales@novadynamics.io',
        phone: '+1 (555) 876-5432',
        company: 'Nova Dynamics',
        address: '100 Silicon Blvd, Suite 400',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        notes: 'High-growth fintech startup seeking compliance automation.',
        createdBy: manager._id,
      },
      {
        name: 'David Reynolds',
        email: 'david@stellartech.net',
        phone: '+1 (555) 345-6789',
        company: 'Stellar Tech Solutions',
        address: '500 Tech Parkway',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
        notes: 'Requested a tailored product walkthrough for 50+ seats.',
        createdBy: executive._id,
      },
      {
        name: 'Elena Rostova',
        email: 'elena@apexlogistics.com',
        phone: '+1 (555) 456-7890',
        company: 'Apex Global Logistics',
        address: '12 Harbor Way',
        city: 'Chicago',
        state: 'IL',
        zip: '60601',
        notes: 'Looking to optimize CRM integration with their ERP stack.',
        createdBy: executive._id,
      },
      {
        name: 'James Thornton',
        email: 'jthornton@cloudscale.io',
        phone: '+1 (555) 567-8901',
        company: 'CloudScale Systems',
        address: '88 Innovation Court',
        city: 'Boston',
        state: 'MA',
        zip: '02110',
        notes: 'Referred by venture partner; looking for immediate onboarding.',
        createdBy: manager._id,
      },
      {
        name: 'Rachel Kim',
        email: 'rachel@horizonmedia.com',
        phone: '+1 (555) 678-9012',
        company: 'Horizon Media Group',
        address: '350 5th Avenue, 18th Floor',
        city: 'New York',
        state: 'NY',
        zip: '10118',
        notes: 'Mid-market media house reviewing Q3 budget approvals.',
        createdBy: admin._id,
      },
    ]);

    const leads = await Lead.create([
      {
        title: 'Acme Enterprise CRM Migration',
        customer: customers[0]._id,
        status: 'Won',
        value: 95000,
        assignedTo: manager._id,
        notes: 'Contract signed for 3-year annual subscription tier.',
        followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        title: 'Nova Dynamics Security Suite Rollout',
        customer: customers[1]._id,
        status: 'Proposal Sent',
        value: 48000,
        assignedTo: executive._id,
        notes: 'Sent pricing proposal with volume discounts. Awaiting CFO signoff.',
        followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdBy: manager._id,
      },
      {
        title: 'Stellar Tech Custom API Integration',
        customer: customers[2]._id,
        status: 'Qualified',
        value: 32000,
        assignedTo: executive._id,
        notes: 'Technical evaluation passed. Scheduling commercial negotiation.',
        followUpDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        createdBy: executive._id,
      },
      {
        title: 'Apex Logistics Fleet CRM Sync',
        customer: customers[3]._id,
        status: 'Contacted',
        value: 65000,
        assignedTo: manager._id,
        notes: 'Introductory demo completed. Gathering departmental requirements.',
        followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdBy: executive._id,
      },
      {
        title: 'CloudScale Cloud Infrastructure Deal',
        customer: customers[4]._id,
        status: 'Won',
        value: 120000,
        assignedTo: admin._id,
        notes: 'Closed flagship enterprise contract with SLA guarantees.',
        followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdBy: manager._id,
      },
      {
        title: 'Horizon Media Creative Asset Connector',
        customer: customers[5]._id,
        status: 'New',
        value: 22000,
        assignedTo: executive._id,
        notes: 'Inbound inquiry from webinar demo form.',
        followUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        title: 'Apex Global Telematics Addon',
        customer: customers[3]._id,
        status: 'Lost',
        value: 15000,
        assignedTo: executive._id,
        notes: 'Client deferred decision to fiscal next year due to budget freeze.',
        followUpDate: null,
        createdBy: executive._id,
      },
    ]);

    await Task.create([
      {
        title: 'Finalize SLA terms for Acme Corp',
        description: 'Review legal addendum with legal counsel and upload signed copy.',
        assignedTo: manager._id,
        status: 'In Progress',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: 'High',
        relatedTo: 'Customer',
        relatedToId: customers[0]._id,
        createdBy: admin._id,
      },
      {
        title: 'Send Revised Quote to Nova Dynamics',
        description: 'Adjust discounting tier for 24-month payment cadence.',
        assignedTo: executive._id,
        status: 'Pending',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        priority: 'High',
        relatedTo: 'Lead',
        relatedToId: leads[1]._id,
        createdBy: manager._id,
      },
      {
        title: 'Prepare Technical Architecture Deck',
        description: 'Provide system architecture diagram for Stellar Tech solutions engineer.',
        assignedTo: executive._id,
        status: 'In Progress',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        priority: 'Medium',
        relatedTo: 'Customer',
        relatedToId: customers[2]._id,
        createdBy: executive._id,
      },
      {
        title: 'Quarterly Account Check-in with CloudScale',
        description: 'Confirm implementation milestones and measure user adoption rates.',
        assignedTo: admin._id,
        status: 'Completed',
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        priority: 'Low',
        relatedTo: 'Customer',
        relatedToId: customers[4]._id,
        createdBy: admin._id,
      },
      {
        title: 'Introductory Discovery Call with Horizon Media',
        description: 'Discuss current workflow bottlenecks and team permission needs.',
        assignedTo: executive._id,
        status: 'Pending',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        priority: 'High',
        relatedTo: 'Lead',
        relatedToId: leads[5]._id,
        createdBy: admin._id,
      },
    ]);

    console.log('CRM360 database successfully seeded with sample records');

    if (standalone) {
      await disconnectDB();
      process.exit(0);
    }
    return { success: true };
  } catch (error) {
    console.error('Seeding failed:', error);
    if (standalone) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedDatabase(true);
}

module.exports = { seedDatabase };
