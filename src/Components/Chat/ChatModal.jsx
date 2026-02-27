import { useEffect, useRef, useState } from 'react'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { fireStore } from '../Firebase/Firebase'

const ChatModal = ({ open, onClose, item, user }) => {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)

  const conversationId = user && item ? `${item.id}_${item.userId}_${user.uid}` : null

  useEffect(() => {
    if (!open || !conversationId) return
    const messagesRef = collection(fireStore, 'messages')
    const q = query(messagesRef, where('conversationId', '==', conversationId), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      setMessages(list)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    })
    return () => unsub()
  }, [open, conversationId])

  const sendMessage = async () => {
    if (!user || !text.trim() || !conversationId) return
    try {
      await addDoc(collection(fireStore, 'messages'), {
        conversationId,
        itemId: item.id,
        sellerId: item.userId,
        buyerId: user.uid,
        senderId: user.uid,
        senderName: user.displayName || user.email || 'User',
        text: text.trim(),
        createdAt: serverTimestamp(),
      })
      setText('')
    } catch (err) {
      console.error(err)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[72vh] bg-[#0f172a] text-white rounded-3xl shadow-2xl overflow-hidden grid grid-rows-[auto_1fr_auto] border border-slate-800">
        <div className="px-5 py-4 flex items-center justify-between bg-[#111827] border-b border-slate-800">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Chat</p>
            <p className="text-lg font-semibold text-white">{item?.title || 'Listing'}</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white text-lg">✕</button>
        </div>
        <div className="overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-[#0f172a] via-[#0b1224] to-[#0f172a]">
          {messages.length === 0 && (
            <p className="text-sm text-slate-400 text-center">Start the conversation with an offer or a question.</p>
          )}
          {messages.map((msg) => {
            const mine = msg.senderId === user?.uid
            return (
              <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm shadow ${mine ? 'bg-sky-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-100 rounded-bl-sm'}`}>
                  <p className="font-semibold text-xs uppercase tracking-wide opacity-80">{mine ? 'You' : (msg.senderName || 'Seller')}</p>
                  <p className="mt-1 leading-snug">{msg.text}</p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 bg-[#111827] border-t border-slate-800 flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Write a message..."
            className="flex-1 rounded-2xl bg-[#0b1224] border border-slate-700 text-white px-4 py-3 focus:outline-none focus:border-sky-500"
          />
          <button onClick={sendMessage} className="px-5 py-3 rounded-2xl bg-sky-600 text-white font-semibold hover:bg-sky-500">Send</button>
        </div>
      </div>
    </div>
  )
}

export default ChatModal
