//deleteAllFirestoreUsers.js

const admin = require('../firebase/firebase').admin;
const { db } = require('../firebase/firebase'); // Importamos Firestore

const collectionName = 'users';  // Change to the correct collection name if needed

// Function to delete all documents in the 'users' collection
async function deleteAllUsersFromFirestore() {
  const batchSize = 100; // Firestore batch limit
  const usersCollectionRef = db.collection(collectionName);

  try {
    let query = usersCollectionRef.limit(batchSize);
    let snapshot = await query.get();

    while (!snapshot.empty) {
      const batch = db.batch();

      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Deleted ${snapshot.size} users`);

      // Get the next batch of users
      snapshot = await query.get();
    }

    console.log('All users deleted from Firestore');
  } catch (error) {
    console.error('Error deleting users from Firestore:', error);
  }
}

// Start the deletion process
deleteAllUsersFromFirestore();
