const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'uas_si';

async function main() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('\nSample grade document:');
    const sampleGrade = await db.collection('grades').findOne();
    console.log(sampleGrade);

    console.log('\nUnique student IDs in grades:');
    const uniqueStudentsInGrades = await db.collection('grades').distinct('Student');
    console.log(`Count: ${uniqueStudentsInGrades.length}`);
    if (uniqueStudentsInGrades.length > 0) {
        console.log('Sample IDs:', uniqueStudentsInGrades.slice(0, 5));
    }

    console.log('\nSample User (any):');
    const sampleUser = await db.collection('users').findOne();
    console.log(sampleUser);

    console.log('\nAll users roles:');
    const allUsers = await db.collection('users').find({}).toArray();
    console.log(allUsers.map(u => ({ name: u.name, role: u.role, noInduk: u.noInduk })));

  } finally {
    await client.close();
  }
}

main().catch(console.error);
