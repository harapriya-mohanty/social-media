import React, {useState} from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { Search } from 'lucide-react'
import UserCard from '../components/usercard'
import Loading from '../components/loading'

const Discover = () => {

  const [inputs, setInputs] = useState('')
  const [users, setUsers] = useState(dummyConnectionsData)
  const [loading, setLoading] = useState(false)

   const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setUsers([])
      setLoading(true)
      setTimeout(() => {
        const q = inputs.toLowerCase()
        setUsers(
          dummyConnectionsData.filter(
            (user) =>
              user.full_name.toLowerCase().includes(q) ||
              user.username.toLowerCase().includes(q) ||
              (user.bio ?? '').toLowerCase().includes(q) ||
              (user.location ?? '').toLowerCase().includes(q)
          )
        )
        setLoading(false)
      }, 1000)
    }
   }
  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover People</h1>
          <p className='text-slate-600'>Connect with amazing people and grow your network</p>
        </div>
        {/* Search Bar */}
        <div className='mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
          <div className='p-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5'/>
              <input type='text' placeholder='Search people by name, username, bio, or location...' className='pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm' onChange={(e) => setInputs(e.target.value)} value={inputs} onKeyUp={handleSearch}/>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-6'>
          {users.map((user) => (<UserCard user={user} key={user._id}/>))}
        </div>

        {
          loading && (<Loading height='60vh'/>)
        }
        
      </div>
    </div>
  )
}

export default Discover
