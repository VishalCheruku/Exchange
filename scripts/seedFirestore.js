/**
 * Seed Firestore with sample listings (5 per category) using the existing client config.
 * Run: `node scripts/seedFirestore.js`
 * Requires network access and valid Firebase rules to allow authenticated writes.
 */
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { firebaseConfig } from '../src/Components/Firebase/Firebase.js'
import seedItems from './seedData.json' assert { type: 'json' }

async function main() {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  for (const item of seedItems) {
    const ref = doc(db, 'products', item.id)
    await setDoc(ref, item, { merge: true })
    console.log('Upserted', item.id)
  }
  console.log('Done seeding.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
