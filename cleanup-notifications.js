// Simple script to clean up orphaned notifications
// Run this with: node cleanup-notifications.js

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Event = require('./server/src/models/Event');
const Society = require('./server/src/models/Society');
const Notification = require('./server/src/models/Notification');

async function cleanupOrphanedNotifications() {
  try {
    console.log('Starting orphaned notification cleanup...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uniq');
    console.log('Connected to database');
    
    // Get all notifications
    const allNotifications = await Notification.find({ type: 'new_event' });
    console.log(`Found ${allNotifications.length} notifications to check`);
    
    let removedCount = 0;
    
    for (const notification of allNotifications) {
      // Check if the event still exists
      if (notification.eventId) {
        const eventExists = await Event.findById(notification.eventId);
        if (!eventExists) {
          // Event was deleted, remove the notification
          await Notification.findByIdAndDelete(notification._id);
          console.log(`✓ Removed orphaned notification for deleted event ${notification.eventId}`);
          removedCount++;
        }
      } else {
        // Old notification without eventId, check by society name
        const societyName = notification.message.split(' has added a new event.')[0];
        if (societyName) {
          // Find the society
          const society = await Society.findOne({ name: societyName });
          if (society) {
            // Check if this society has any active events
            const activeEvents = await Event.find({ 
              society: society._id,
              status: { $in: ['Active', 'Featured'] }
            });
            
            // If no active events, remove the notification
            if (activeEvents.length === 0) {
              await Notification.findByIdAndDelete(notification._id);
              console.log(`✓ Removed orphaned notification for society ${societyName} (no active events)`);
              removedCount++;
            }
          } else {
            // Society doesn't exist, remove notification
            await Notification.findByIdAndDelete(notification._id);
            console.log(`✓ Removed orphaned notification for non-existent society ${societyName}`);
            removedCount++;
          }
        }
      }
    }
    
    console.log(`\n✅ Cleanup complete! Removed ${removedCount} orphaned notifications.`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanupOrphanedNotifications();
