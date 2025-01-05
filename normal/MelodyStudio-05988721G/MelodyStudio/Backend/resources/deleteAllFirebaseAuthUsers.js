//deleteAllFirebaseAuthUsers.js

const admin = require('../firebase/firebase').admin;

// Function to delete users in batches
async function deleteAllUsers(nextPageToken) {
  try {
    // List all users, 1000 at a time
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    
    // Collect user UIDs to delete
    const uids = listUsersResult.users.map(user => user.uid);

    if (uids.length > 0) {
      // Delete all the users in the current batch
      await admin.auth().deleteUsers(uids);
      console.log(`Successfully deleted ${uids.length} users`);
    }

    // If there are more users to retrieve, continue with the next batch
    if (listUsersResult.pageToken) {
      deleteAllUsers(listUsersResult.pageToken);
    } else {
      console.log('All users deleted');
    }
  } catch (error) {
    console.error('Error deleting users:', error);
  }
}

// Start the deletion process
deleteAllUsers();
