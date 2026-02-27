import './Navbar.css'
import logo from '../../assets/xchange-symbol.svg'
import search from '../../assets/search1.svg'
import arrow from '../../assets/arrow-down.svg'
import searchWt from '../../assets/search.svg'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link, useNavigate } from 'react-router-dom'
import { auth, fireStore } from '../Firebase/Firebase'
import addBtn from '../../assets/xchange-sell.svg'
import profileIcon from '../../assets/profile.svg'
import { useEffect, useRef, useState } from 'react'
import { signOut } from 'firebase/auth'
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'

const Navbar = (props) => {
    const [user] = useAuthState(auth)
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const [notifications, setNotifications] = useState([])
    const menuRef = useRef(null)
    const notifRef = useRef(null)
    const {
        toggleModal = () => {},
        toggleModalSell = () => {},
        searchQuery = '',
        onSearchChange = () => {},
        locationQuery = '',
        onLocationChange = () => {},
    } = props
    const categories = ['Cars','Books','Houses','Bikes','Sports','Furniture','Electronics']

    useEffect(() => {
      if (!menuOpen) return
      const handleClick = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMenuOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }, [menuOpen])

    useEffect(() => {
      if (!notifOpen) return
      const handleClick = (event) => {
        if (notifRef.current && !notifRef.current.contains(event.target)) {
          setNotifOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }, [notifOpen])

    useEffect(() => {
      if (!user?.uid) {
        setNotifications([])
        return
      }
      const notifRefCol = collection(fireStore, 'notifications')
      const q = query(notifRefCol, where('userId', '==', user.uid), orderBy('createdAt', 'desc'))
      const unsub = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        setNotifications(list)
      })
      return () => unsub()
    }, [user?.uid])

    const handleProfileClick = () => {
      if (!user) {
        toggleModal()
        return
      }
      setMenuOpen((prev) => !prev)
    }

    const unreadCount = notifications.filter((n) => !n.read).length

    const markAllRead = async () => {
      try {
        const unread = notifications.filter((n) => !n.read)
        await Promise.all(unread.map((n) => updateDoc(doc(fireStore,'notifications',n.id), { read: true })))
      } catch (err) {
        console.error(err)
      }
    }

    const goToProfile = () => {
      setMenuOpen(false)
      navigate('/profile')
    }

    const handleLogout = async () => {
      try {
        await signOut(auth)
        setMenuOpen(false)
        navigate('/')
      } catch (err) {
        console.error('Logout failed', err)
      }
    }

  return (
    <div>
           <nav className="fixed z-50 w-full overflow-visible p-4 shadow-md bg-slate-100 border-b-4 border-solid border-b-white nav-shell">
                <Link to="/" className="nav-brand nav-home-link">
                    <img src={logo} alt="Xchange logo" className='w-11 h-11 xchange-spin' />
                    <div className="leading-tight">
                        <p className="text-lg font-extrabold tracking-wide" style={{ color: '#0b1113' }}>Xchange</p>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">swap - sell - shine</p>
                    </div>
                </Link>

                <div className="nav-search">
                    <div className='relative location-search'>
                        <img src={search} alt="" className='absolute top-4 left-2 w-5' />
                        <input
                            value={locationQuery}
                            onChange={(event) => onLocationChange(event.target.value)}
                            placeholder='Search city, area, or locality...'
                            className='w-[70px] sm:w-[170px] md:w-[240px] lg:w-[260px] p-3 pl-8 pr-8 border-sky-300 border-solid border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                            type="text"
                        />
                    </div>

                    <div className="relative w-full main-search">
                        <input
                            value={searchQuery}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder='Find laptops, furniture, gadgets, and more...'
                            className='w-full p-3 border-sky-300 border-solid border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                            type="text"
                        />
                        <div style={{ backgroundColor: '#6dc8e6' }} className="flex justify-center items-center absolute top-0 right-0 h-full rounded-e-md w-12">
                            <img className="w-5 filter invert" src={searchWt} alt="Search Icon" />
                        </div>
                    </div>
                </div>

                <div className="nav-actions">
                    <Link to="/" className="nav-home" aria-label="Home">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 11l9-8 9 8" />
                        <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
                      </svg>
                      <span className="hidden sm:inline">Home</span>
                    </Link>
                    <Link to="/search" className="nav-home ghost" aria-label="Search">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <span className="hidden sm:inline">Search</span>
                    </Link>
                    {user ? (
                      <>
                        <div className="relative" ref={notifRef}>
                          <button className="nav-icon nav-icon-blue" onClick={() => setNotifOpen((p)=>!p)} aria-label="Notifications">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                            </svg>
                            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                          </button>
                          {notifOpen && (
                            <div className="notif-menu">
                              <div className="notif-header">
                                <p className="summary-name">Notifications</p>
                                <button className="notif-clear" onClick={markAllRead}>Mark all read</button>
                              </div>
                              {notifications.length === 0 ? (
                                <p className="notif-empty">No notifications yet</p>
                              ) : notifications.map((n) => (
                                <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`}>
                                  <p className="notif-title">{n.title || 'Update'}</p>
                                  <p className="notif-body">{n.body || ''}</p>
                                  <p className="notif-time">{new Date(n.createdAt).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="relative" ref={menuRef}>
                          <button className="nav-icon nav-icon-blue" onClick={handleProfileClick} aria-label="Profile menu">
                              <img src={profileIcon} alt="" />
                          </button>
                          {menuOpen && (
                            <div className="profile-menu">
                              <div className="profile-summary">
                                <div className="avatar-circle">{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</div>
                                <div>
                                  <p className="summary-name">{user.displayName || 'Guest'}</p>
                                  <p className="summary-email">{user.email}</p>
                                </div>
                              </div>
                              <button className="profile-menu-item" onClick={goToProfile}>Profile</button>
                              <button className="profile-menu-item danger" onClick={handleLogout}>Logout</button>
                            </div>
                          )}
                        </div>
                        <button className="nav-sell" onClick={toggleModalSell} aria-label="Sell item">
                            <img src={addBtn} alt="" />
                            <span>Sell</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="nav-login" onClick={toggleModal} aria-label="Open login">
                          Sign in / Login
                        </button>
                        <button className="nav-sell" onClick={toggleModal} aria-label="Sell item (login first)">
                            <img src={addBtn} alt="" />
                            <span>Sell</span>
                        </button>
                      </>
                    )}
                </div>
            </nav>
            <div className='w-full relative z-0 flex shadow-md p-2 pt-24 pl-6 pr-6 sm:pl-16 md:pr-16 sub-lists bg-white/70 backdrop-blur nav-cats'>
                <ul className='list-none flex items-center gap-3 w-full'>
                    <div  className='flex flex-shrink-0'>
                        <p  className='font-semibold uppercase all-cats'>Categories</p>
                        <img className='w-4 ml-2' src={arrow} alt="" />
                    </div>
                    {categories.map((category) => (
                      <li key={category}>
                        <Link to={`/category/${encodeURIComponent(category)}`} className="cat-pill">
                          {category}
                        </Link>
                      </li>
                    ))}
                </ul>
            </div>
    </div>
  )
}
export default Navbar;
