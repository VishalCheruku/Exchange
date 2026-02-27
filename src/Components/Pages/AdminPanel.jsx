import { useMemo, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { ItemsContext } from '../Context/Item'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, fireStore } from '../Firebase/Firebase'
import { updateDoc, doc } from 'firebase/firestore'

const adminEmails = ['admin@xchange.test']

const AdminPanel = () => {
  const itemsCtx = ItemsContext()
  const [user] = useAuthState(auth)
  const [activeTab, setActiveTab] = useState('ads')

  const isAdmin = user && adminEmails.includes(user.email || '')

  const items = useMemo(() => itemsCtx.items || [], [itemsCtx.items])

  const updateStatus = async (itemId, status) => {
    try {
      await updateDoc(doc(fireStore, 'products', itemId), { status })
    } catch (err) {
      console.error(err)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="pt-28 px-6 text-center">
          <p className="text-lg">Sign in as admin to access the panel.</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="pt-28 px-6 text-center">
          <p className="text-lg">You don’t have admin access.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-slate-900 text-white">
      <Navbar />
      <section className="pt-24 px-5 sm:px-10 md:px-16 lg:px-24">
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Admin</p>
              <h1 className="mt-2 text-3xl font-extrabold text-white">Control center</h1>
            </div>
            <div className="flex gap-2">
              {['ads','users','reports','analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-xl border ${activeTab === tab ? 'bg-white text-black' : 'border-slate-700 text-slate-300'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'ads' && (
            <div className="mt-6 grid gap-4">
              {items.slice(0, 40).map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-800 bg-[#0b1224] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900">
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.category} • Rs {item.price}</p>
                      <p className="text-xs text-slate-500">Status: {item.status || 'active'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 rounded-lg bg-emerald-600 text-white" onClick={() => updateStatus(item.id, 'approved')}>Approve</button>
                    <button className="px-3 py-2 rounded-lg bg-amber-600 text-white" onClick={() => updateStatus(item.id, 'pending')}>Pend</button>
                    <button className="px-3 py-2 rounded-lg bg-rose-600 text-white" onClick={() => updateStatus(item.id, 'rejected')}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="mt-6 text-slate-300 text-sm">
              Placeholder for user management (list users, roles, disable/enable).
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="mt-6 text-slate-300 text-sm">
              Placeholder for reports moderation (view/act on flagged ads).
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stat-card bg-[#0b1224] border border-slate-800 text-white">
                <p className="stat-title text-slate-400">Listings</p>
                <p className="stat-value text-white">{items.length}</p>
              </div>
              <div className="stat-card bg-[#0b1224] border border-slate-800 text-white">
                <p className="stat-title text-slate-400">Categories</p>
                <p className="stat-value text-white">{new Set(items.map(i=>i.category)).size}</p>
              </div>
              <div className="stat-card bg-[#0b1224] border border-slate-800 text-white">
                <p className="stat-title text-slate-400">Pending</p>
                <p className="stat-value text-white">{items.filter(i=>i.status==='pending').length}</p>
              </div>
              <div className="stat-card bg-[#0b1224] border border-slate-800 text-white">
                <p className="stat-title text-slate-400">Rejected</p>
                <p className="stat-value text-white">{items.filter(i=>i.status==='rejected').length}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default AdminPanel
