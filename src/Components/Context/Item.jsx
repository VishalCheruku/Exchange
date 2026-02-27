import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { fireStore } from "../Firebase/Firebase";

const Context = createContext(null);
export const ItemsContext = ()=> useContext(Context) //customHook

const seedItems = [
  // Cars
  {
    id: 'seed-car-1',
    title: 'Tesla Model 3 Long Range',
    category: 'Cars',
    price: '42000',
    description: '2022, 18k miles, FSD capable, midnight silver.',
    imageUrl: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80',
    userName: 'AutoHub',
    createAt: '2026-02-20',
  },
  {
    id: 'seed-car-2',
    title: 'Jeep Wrangler Rubicon',
    category: 'Cars',
    price: '38000',
    description: 'Trail-ready, removable hard-top, new all-terrain tires.',
    imageUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80',
    userName: 'TrailPro',
    createAt: '2026-02-18',
  },
  {
    id: 'seed-car-3',
    title: 'Volkswagen Golf GTI',
    category: 'Cars',
    price: '21000',
    description: 'Mk7.5, DSG, performance pack, full service history.',
    imageUrl: 'https://images.unsplash.com/photo-1503736334956-4e2a692b00d7?auto=format&fit=crop&w=900&q=80',
    userName: 'HotHatch',
    createAt: '2026-02-10',
  },
  {
    id: 'seed-car-4',
    title: 'Toyota Camry Hybrid',
    category: 'Cars',
    price: '19500',
    description: '2019 LE, 45 MPG combined, single owner.',
    imageUrl: 'https://images.unsplash.com/photo-1541446654331-595018fbe2b7?auto=format&fit=crop&w=900&q=80',
    userName: 'EcoDrive',
    createAt: '2026-02-12',
  },
  {
    id: 'seed-car-5',
    title: 'BMW 3 Series 330i',
    category: 'Cars',
    price: '32000',
    description: 'M Sport package, mineral grey, premium sound.',
    imageUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=900&q=80',
    userName: 'Beamers',
    createAt: '2026-02-08',
  },
  // Books
  {
    id: 'seed-book-1',
    title: 'Designing Data-Intensive Applications',
    category: 'Books',
    price: '35',
    description: 'Like new, no highlights, 2021 printing.',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    userName: 'ReaderBase',
    createAt: '2026-02-14',
  },
  {
    id: 'seed-book-2',
    title: 'Clean Code',
    category: 'Books',
    price: '18',
    description: 'Paperback, lightly used, includes bookmark.',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    userName: 'CodeShelf',
    createAt: '2026-02-13',
  },
  {
    id: 'seed-book-3',
    title: 'The Pragmatic Programmer',
    category: 'Books',
    price: '22',
    description: '20th Anniversary Edition, excellent condition.',
    imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
    userName: 'DevReads',
    createAt: '2026-02-11',
  },
  {
    id: 'seed-book-4',
    title: 'Atomic Habits',
    category: 'Books',
    price: '12',
    description: 'Hardcover, like new, dust jacket intact.',
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80',
    userName: 'ShelfSwap',
    createAt: '2026-02-09',
  },
  {
    id: 'seed-book-5',
    title: 'Sapiens',
    category: 'Books',
    price: '15',
    description: 'Paperback, some light wear, no markings.',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
    userName: 'BookNest',
    createAt: '2026-02-07',
  },
  // Houses
  {
    id: 'seed-house-1',
    title: 'Modern 3BHK Apartment',
    category: 'Houses',
    price: '120000',
    description: 'City center, 2 balconies, covered parking.',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
    userName: 'MetroHomes',
    createAt: '2026-02-15',
  },
  {
    id: 'seed-house-2',
    title: 'Cozy Suburban Villa',
    category: 'Houses',
    price: '185000',
    description: '4 bed, backyard deck, quiet street.',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    userName: 'Sunrise Realty',
    createAt: '2026-02-14',
  },
  {
    id: 'seed-house-3',
    title: 'Loft Studio',
    category: 'Houses',
    price: '85000',
    description: 'Industrial vibe, exposed brick, near metro.',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-455ede0286ee?auto=format&fit=crop&w=900&q=80',
    userName: 'UrbanLofts',
    createAt: '2026-02-12',
  },
  {
    id: 'seed-house-4',
    title: 'Beachfront Cottage',
    category: 'Houses',
    price: '220000',
    description: 'Sea view, private path to shore, furnished.',
    imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80',
    userName: 'Coastline',
    createAt: '2026-02-10',
  },
  {
    id: 'seed-house-5',
    title: 'Mountain A-frame',
    category: 'Houses',
    price: '160000',
    description: 'Pine finishes, fireplace, trail access.',
    imageUrl: 'https://images.unsplash.com/photo-1475856034135-49a1b2083c1f?auto=format&fit=crop&w=900&q=80',
    userName: 'SummitStay',
    createAt: '2026-02-08',
  },
  // Bikes
  {
    id: 'seed-bike-1',
    title: 'Canyon Roadlite 7',
    category: 'Bikes',
    price: '1100',
    description: 'Carbon fork, 105 groupset, size M.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    userName: 'SpinCity',
    createAt: '2026-02-16',
  },
  {
    id: 'seed-bike-2',
    title: 'Giant Talon 1',
    category: 'Bikes',
    price: '750',
    description: '29er, hydraulic discs, lightly used.',
    imageUrl: 'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=900&q=80',
    userName: 'TrailRider',
    createAt: '2026-02-13',
  },
  {
    id: 'seed-bike-3',
    title: 'Brompton M6L',
    category: 'Bikes',
    price: '1450',
    description: 'Folding, 6 speed, navy blue, commuter ready.',
    imageUrl: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=900&q=80',
    userName: 'Fold&Go',
    createAt: '2026-02-11',
  },
  {
    id: 'seed-bike-4',
    title: 'Fixie Single Speed',
    category: 'Bikes',
    price: '320',
    description: 'Minimal setup, flip-flop hub, lightweight.',
    imageUrl: 'https://images.unsplash.com/photo-1501700493788-1b8a26f29352?auto=format&fit=crop&w=900&q=80',
    userName: 'CitySpin',
    createAt: '2026-02-09',
  },
  {
    id: 'seed-bike-5',
    title: 'Specialized Stumpjumper',
    category: 'Bikes',
    price: '2300',
    description: 'Full-suspension, GX Eagle, dropper post.',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
    userName: 'MTB Collective',
    createAt: '2026-02-07',
  },
  // Sports
  {
    id: 'seed-sports-1',
    title: 'Adidas Predator Edge',
    category: 'Sports',
    price: '120',
    description: 'FG, size 9, barely used.',
    imageUrl: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80',
    userName: 'KickPro',
    createAt: '2026-02-16',
  },
  {
    id: 'seed-sports-2',
    title: 'Wilson Pro Staff 97',
    category: 'Sports',
    price: '180',
    description: 'Strung with RPM Blast, grip 3, excellent.',
    imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=900&q=80',
    userName: 'CourtSide',
    createAt: '2026-02-14',
  },
  {
    id: 'seed-sports-3',
    title: 'Home Gym Set',
    category: 'Sports',
    price: '400',
    description: 'Bench, 80kg plates, adjustable dumbbells.',
    imageUrl: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=900&q=80',
    userName: 'FitRack',
    createAt: '2026-02-12',
  },
  {
    id: 'seed-sports-4',
    title: 'Climbing Shoes La Sportiva',
    category: 'Sports',
    price: '85',
    description: 'Solution Comp, size 41, great rubber.',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    userName: 'CruxClub',
    createAt: '2026-02-10',
  },
  {
    id: 'seed-sports-5',
    title: 'Garmin Forerunner 255',
    category: 'Sports',
    price: '260',
    description: 'GNSS, tri-mode, original band, receipts.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    userName: 'RunFast',
    createAt: '2026-02-08',
  },
  // Furniture
  {
    id: 'seed-furniture-1',
    title: 'Scandi Oak Desk',
    category: 'Furniture',
    price: '280',
    description: '120cm, cable grommet, matte finish.',
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80',
    userName: 'NordicNest',
    createAt: '2026-02-17',
  },
  {
    id: 'seed-furniture-2',
    title: 'Ergonomic Mesh Chair',
    category: 'Furniture',
    price: '190',
    description: 'Lumbar support, headrest, adjustable arms.',
    imageUrl: 'https://images.unsplash.com/photo-1582719478248-54e9f2d3b3d5?auto=format&fit=crop&w=900&q=80',
    userName: 'DeskSetups',
    createAt: '2026-02-15',
  },
  {
    id: 'seed-furniture-3',
    title: 'Velvet Sofa 3-Seater',
    category: 'Furniture',
    price: '520',
    description: 'Teal, stainless legs, pet-free home.',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
    userName: 'HomeLuxe',
    createAt: '2026-02-13',
  },
  {
    id: 'seed-furniture-4',
    title: 'Minimal Bookshelf',
    category: 'Furniture',
    price: '140',
    description: '5-tier, powder-coated steel, walnut shelves.',
    imageUrl: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=900&q=80',
    userName: 'LoftLiving',
    createAt: '2026-02-11',
  },
  {
    id: 'seed-furniture-5',
    title: 'Dining Set (4)',
    category: 'Furniture',
    price: '430',
    description: 'Round table + 4 chairs, light ash.',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-0c8cd4c1eedd?auto=format&fit=crop&w=900&q=80',
    userName: 'Gather&Co',
    createAt: '2026-02-09',
  },
  // Electronics
  {
    id: 'seed-electronics-1',
    title: 'MacBook Air M2',
    category: 'Electronics',
    price: '1100',
    description: '8C GPU, 16GB RAM, 512GB SSD, midnight.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    userName: 'TechVault',
    createAt: '2026-02-18',
  },
  {
    id: 'seed-electronics-2',
    title: 'Sony WH-1000XM5',
    category: 'Electronics',
    price: '320',
    description: 'Noise cancelling, graphite, perfect condition.',
    imageUrl: 'https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=900&q=80',
    userName: 'AudioSphere',
    createAt: '2026-02-16',
  },
  {
    id: 'seed-electronics-3',
    title: 'Samsung Odyssey G7',
    category: 'Electronics',
    price: '450',
    description: '32\" QHD 240Hz, HDR600, curve 1000R.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    userName: 'PixelPerfect',
    createAt: '2026-02-14',
  },
  {
    id: 'seed-electronics-4',
    title: 'Nintendo Switch OLED',
    category: 'Electronics',
    price: '300',
    description: 'White Joy-Cons, screen protector, two games.',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    userName: 'GameWave',
    createAt: '2026-02-12',
  },
  {
    id: 'seed-electronics-5',
    title: 'Canon EOS R6',
    category: 'Electronics',
    price: '1850',
    description: 'Body only, 20k shutter count, dual card slots.',
    imageUrl: 'https://images.unsplash.com/photo-1519183071298-a2962be90b8e?auto=format&fit=crop&w=900&q=80',
    userName: 'LensLab',
    createAt: '2026-02-10',
  },
]

export  const ItemsContextProvider = ({children})=>{
    const [items,setItems] = useState(seedItems);

    useEffect(()=>{
        const productsCollection = collection(fireStore,'products'); // firestore collection names are case-sensitive
        const unsubscribe = onSnapshot(
            productsCollection,
            (snapshot) => {
                const productsList = snapshot.docs.map(doc =>({
                    id:doc.id,
                    ...doc.data()
                }))
                const combined = [...seedItems, ...productsList]
                const unique = []
                const seen = new Set()
                for (const item of combined) {
                    if (seen.has(item.id)) continue
                    seen.add(item.id)
                    unique.push(item)
                }
                unique.sort((a, b) => {
                    const getDate = (entry) => new Date(entry?.createAt || entry?.createdAt || 0).getTime()
                    return getDate(b) - getDate(a)
                })
                setItems(unique)
            },
            (error) => {
                console.log(error,'error fetching products')
            }
        )

        return () => unsubscribe()
    },[]);

    return(
        <>


        <Context.Provider  value={{items, setItems}}>
            {children}
        </Context.Provider>
        
        </>
    )
}
