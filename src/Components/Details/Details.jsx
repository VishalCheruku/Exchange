import Navbar from "../Navbar/Navbar"
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ItemsContext } from '../Context/Item';
import Login from "../Modal/Login";
import Sell from "../Modal/Sell";
import Card from "../Card/Card";
import { auth, fireStore } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import ChatModal from "../Chat/ChatModal";

const Details = () => {
  const location = useLocation(); 
  const { item } = location.state || {}; 

  const [openModal, setModal] = useState(false);
  const [openModalSell, setModalSell] = useState(false);
  const [saved, setSaved] = useState(false)
  const [offers, setOffers] = useState([])
  const [offerValue, setOfferValue] = useState('')
  const [reviews, setReviews] = useState([])
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(5)
  const [openChat, setOpenChat] = useState(false)
  const itemsCtx= ItemsContext();
  const [user] = useAuthState(auth)

  const toggleModal = () => setModal(!openModal);
  const toggleModalSell = () => setModalSell(!openModalSell);
  const toggleChat = () => setOpenChat((prev)=>!prev)

  useEffect(() => {
    if (!item?.id) return
    const stored = JSON.parse(localStorage.getItem('xchange_favorites') || '[]')
    setSaved(Array.isArray(stored) ? stored.includes(item.id) : false)
  }, [item?.id])

  useEffect(() => {
    if (!item?.id) return
    const offersRef = collection(fireStore, 'offers')
    const q = query(offersRef, where('itemId', '==', item.id), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      setOffers(list)
    })
    return () => unsub()
  }, [item?.id])

  useEffect(() => {
    if (!item?.userId) return
    const reviewsRef = collection(fireStore, 'reviews')
    const q = query(reviewsRef, where('sellerId', '==', item.userId), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      setReviews(list)
    })
    return () => unsub()
  }, [item?.userId])

  const handleSave = () => {
    if (!item?.id) return
    const stored = JSON.parse(localStorage.getItem('xchange_favorites') || '[]')
    const list = Array.isArray(stored) ? stored : []
    let next = list
    if (list.includes(item.id)) {
      next = list.filter((id) => id !== item.id)
      setSaved(false)
    } else {
      next = [item.id, ...list].slice(0, 50)
      setSaved(true)
    }
    localStorage.setItem('xchange_favorites', JSON.stringify(next))
  }

  const similarItems = useMemo(() => {
    const items = itemsCtx.items || []
    if (!item?.id) return []
    return items
      .filter((entry) => entry.id !== item.id && entry.category === item.category)
      .slice(0, 4)
  }, [itemsCtx.items, item?.id, item?.category])

  const sendOffer = async () => {
    if (!user) { toggleModal(); return }
    const amount = Number(offerValue)
    if (!Number.isFinite(amount) || amount <= 0) return
    try {
      await addDoc(collection(fireStore, 'offers'), {
        itemId: item.id,
        sellerId: item.userId,
        buyerId: user.uid,
        buyerName: user.displayName || user.email || 'Buyer',
        amount,
        status: 'pending',
        createdAt: new Date().toISOString(),
      })
      setOfferValue('')
    } catch (err) {
      console.error(err)
    }
  }

  const updateOfferStatus = async (offerId, nextStatus) => {
    try {
      await updateDoc(doc(fireStore, 'offers', offerId), { status: nextStatus })
    } catch (err) {
      console.error(err)
    }
  }

  const submitReview = async () => {
    if (!user) { toggleModal(); return }
    if (!reviewText.trim()) return
    try {
      await addDoc(collection(fireStore, 'reviews'), {
        sellerId: item.userId,
        sellerName: item.userName || 'Seller',
        reviewerId: user.uid,
        reviewerName: user.displayName || user.email || 'User',
        rating,
        text: reviewText.trim(),
        createdAt: new Date().toISOString(),
      })
      setReviewText('')
      setRating(5)
    } catch (err) {
      console.error(err)
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : null

  return (
      <div>
          <Navbar toggleModalSell={toggleModalSell} toggleModal={toggleModal} />
          <Login toggleModal={toggleModal} status={openModal} />

          <div className="grid gap-0 sm:gap-5 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 p-10 px-5 sm:px-15 md:px-30 lg:px-40">
              <div className="border-2 w-full rounded-lg flex justify-center overflow-hidden h-96 bg-white/80">
                  <img className="object-cover w-full" src={item?.imageUrl} alt={item?.title} />
              </div>
              <div className="flex flex-col relative w-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="p-1 pl-0 text-2xl font-bold text-slate-900">Rs {item?.price}</p>
                      <p className="p-1 pl-0 text-base text-slate-500">{item?.category}</p>
                      <p className="p-1 pl-0 text-xl font-bold text-slate-900">{item?.title}</p>
                    </div>
                    <button onClick={handleSave} className={`favorite-toggle ${saved ? 'active' : ''}`}>
                      {saved ? 'Saved' : 'Save'}
                    </button>
                  </div>
                  <p className="p-1 pl-0 sm:pb-0 break-words text-ellipsis overflow-hidden w-full text-slate-600">
                      {item?.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="xchange-btn" onClick={() => {
                      if (!user) { toggleModal(); return }
                      setOpenChat(true)
                    }}>Message seller</button>
                    <button className="xchange-btn ghost">Make offer</button>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="detail-card">
                      <p className="detail-title">Seller</p>
                      <p className="detail-value">{item?.userName || 'Anonymous'}</p>
                    </div>
                    <div className="detail-card">
                      <p className="detail-title">Listed on</p>
                      <p className="detail-value">{item?.createAt || item?.createdAt || 'Recently'}</p>
                    </div>
                    <div className="detail-card">
                      <p className="detail-title">Rating</p>
                      <p className="detail-value">{avgRating ? `${avgRating}★ (${reviews.length})` : 'No reviews yet'}</p>
                    </div>
                    <div className="detail-card">
                      <p className="detail-title">Category</p>
                      <p className="detail-value">{item?.category}</p>
                    </div>
                  </div>
                  <div className="mt-6 safety-card">
                    <p className="font-semibold">Safety tips</p>
                    <ul className="text-sm text-slate-600 list-disc list-inside">
                      <li>Meet in a well-lit public place.</li>
                      <li>Inspect items before paying.</li>
                      <li>Use cashless payments when possible.</li>
                    </ul>
                  </div>
              </div>
          </div>

          <div className="mt-8 px-5 sm:px-12 md:px-20 lg:px-32 grid gap-8 lg:grid-cols-[1fr_0.7fr]">
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <p className="section-title text-xl">Make an offer</p>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Negotiate</span>
              </div>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  value={offerValue}
                  onChange={(e) => setOfferValue(e.target.value)}
                  placeholder="Enter your price"
                  className="flex-1 rounded-lg border border-slate-200 p-3 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <button className="xchange-btn w-full sm:w-auto" onClick={sendOffer}>Send offer</button>
              </div>
              <div className="mt-4 space-y-3">
                {offers.length === 0 ? (
                  <p className="text-sm text-slate-500">No offers yet. Be the first.</p>
                ) : offers.map((offer) => (
                  <div key={offer.id} className="detail-card flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">Rs {offer.amount}</p>
                      <p className="text-xs text-slate-500">By {offer.buyerName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${offer.status === 'pending' ? 'bg-amber-100 text-amber-700' : offer.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {offer.status}
                      </span>
                      {user?.uid === item?.userId && offer.status === 'pending' ? (
                        <>
                          <button className="favorite-toggle" onClick={() => updateOfferStatus(offer.id, 'accepted')}>Accept</button>
                          <button className="favorite-toggle ghost" onClick={() => updateOfferStatus(offer.id, 'rejected')}>Reject</button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <p className="section-title text-xl">Reviews</p>
                {avgRating ? <p className="text-sm text-slate-600">{avgRating}★ avg</p> : null}
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-8 h-8 rounded-full border ${star <= rating ? 'bg-amber-400 border-amber-400 text-white' : 'border-slate-200 text-slate-500'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this seller"
                  className="mt-3 w-full min-h-[90px] rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <div className="mt-2 flex justify-end">
                  <button className="xchange-btn" onClick={submitReview}>Post review</button>
                </div>
              </div>
              <div className="mt-4 space-y-3 max-h-72 overflow-auto pr-1">
                {reviews.length === 0 ? (
                  <p className="text-sm text-slate-500">No reviews yet.</p>
                ) : reviews.map((rev) => (
                  <div key={rev.id} className="detail-card">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900">{rev.reviewerName}</p>
                      <span className="text-amber-500 font-semibold">{rev.rating}★</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{rev.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(rev.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {similarItems.length > 0 ? (
            <Card
              items={similarItems}
              title="Similar listings"
              subtitle="More picks from the same category."
              viewMode="grid"
              compact
            />
          ) : null}

          <ChatModal open={openChat} onClose={() => setOpenChat(false)} item={item} user={user} />
          <Sell setItems={(itemsCtx ).setItems} toggleModal={toggleModalSell} status={openModalSell} />
      </div>
  );
};

export default Details
