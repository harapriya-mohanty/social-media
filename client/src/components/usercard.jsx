import React, { useState } from 'react'
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { dummyUserData } from '../assets/assets'

const UserCard = ({ user }) => {
  const navigate = useNavigate()
  const currentUser = dummyUserData

  const FOLLOWING_KEY = 'demo_following_ids'
  const CONNECTED_KEY = 'demo_connected_ids'

  const [followingIds, setFollowingIds] = useState(() => {
    try {
      const raw = localStorage.getItem(FOLLOWING_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const [connectedIds, setConnectedIds] = useState(() => {
    try {
      const raw = localStorage.getItem(CONNECTED_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const isFollowing =
    (Array.isArray(currentUser?.following) && currentUser.following.includes(user?._id)) ||
    (Array.isArray(followingIds) && followingIds.includes(user?._id))

  const isConnected =
    (Array.isArray(currentUser?.connections) && currentUser.connections.includes(user?._id)) ||
    (Array.isArray(connectedIds) && connectedIds.includes(user?._id))

  const handleFollow = () => {
    if (!user?._id) return
    if (isFollowing) return

    const next = Array.isArray(followingIds) ? Array.from(new Set([...followingIds, user._id])) : [user._id]
    setFollowingIds(next)
    try {
      localStorage.setItem(FOLLOWING_KEY, JSON.stringify(next))
    } catch {
      // ignore (storage may be blocked)
    }
  }

  const handleConnectionAction = () => {
    if (!user?._id) return
    if (isConnected) {
      navigate(`/messages/${user._id}`)
      return
    }

    const next = Array.isArray(connectedIds) ? Array.from(new Set([...connectedIds, user._id])) : [user._id]
    setConnectedIds(next)
    try {
      localStorage.setItem(CONNECTED_KEY, JSON.stringify(next))
    } catch {
      // ignore (storage may be blocked)
    }
  }

  return (
    <div className='p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md'>
      <div className='text-center'>
        <img
          src={user?.profile_picture}
          alt=""
          className='rounded-full w-16 h-16 object-cover shadow-md mx-auto'
        />
        <p className='mt-4 font-semibold'>{user?.full_name}</p>
        {user?.username && <p className='text-gray-500 font-light'>@{user.username}</p>}
        {user?.bio && <p className='text-gray-600 mt-2 text-center text-sm px-4'>{user.bio}</p>}
      </div>
      <div className='mt-4 flex items-center justify-center gap-2 flex-wrap'>
        <div className='flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 max-w-full'>
          <MapPin className='w-4 h-4 shrink-0'/>
          <span className='truncate'>{user?.location ?? 'Unknown Location'}</span>
        </div>
        <div className='flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1'>
          <span className='whitespace-nowrap'>{user?.followers?.length ?? 0} followers</span>
        </div>
      </div>

      <div className='flex mt-4 gap-2'>
        {/* Follow button */}
        <button
          onClick={handleFollow}
          disabled={isFollowing}
          className={
            'w-full py-2 rounded-md flex justify-center items-center gap-2 active:scale-95 transition text-white cursor-pointer ' +
            (isFollowing
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700')
          }
        >
            <UserPlus className='w-4 h-4'/>{isFollowing ? 'Following' : 'Follow'}
        </button>
        {/* Connection Request Button/Message Button */}
        <button
          onClick={handleConnectionAction}
          className='flex items-center justify-center w-16 border text-slate-500 group rounded-md cursor-pointer active:scale-95 transition hover:bg-slate-50'
          title={isConnected ? 'Message' : 'Connect'}
        >
          {isConnected ? (
            <MessageCircle className='w-5 h-5 group-hover:scale-105 transition'/>
          ) : (
            <Plus className='w-5 h-5 group-hover:scale-105 transition'/>
          )}
        </button>
      </div>
    </div>
  )
}

export default UserCard
