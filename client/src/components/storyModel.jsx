import React, { useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { dummyUserData } from '../assets/assets'

const StoryModel = ({ setShowModel, fetchStories, onAddStory }) => {

    const bgColors = ['#4f46e5', '#7c3aed', '#db2777', '#ea580c', '#c2410c']

    const fileInputRef = useRef(null)

    const [mode, setMode] = useState('text') // 'text' | 'media'
    const [backgroundColor, setBackgroundColor] = useState(bgColors[0])
    const [text, setText] = useState('')
    const [media, setMedia] = useState(null)
    const [preview, setPreview] = useState(null)

    const handleMediaUpload = (e)=> {
        const file = e.target.files?.[0]
        if(file) {
            setMedia(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const resetForm = () => {
      setMode('text')
      setBackgroundColor(bgColors[0])
      setText('')
      setMedia(null)
      setPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleCreateStory = async () => {
      if (mode === 'text') {
        if (!text.trim()) throw new Error('Please write something for your story.')
        const newStory = {
          _id: `local_${Date.now()}`,
          user: dummyUserData,
          content: text.trim(),
          media_url: '',
          media_type: 'text',
          background_color: backgroundColor,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        onAddStory?.(newStory)
      } else {
        if (!media || !preview) throw new Error('Please choose an image or video.')
        const mediaType = media.type?.startsWith('video/') ? 'video' : 'image'
        const newStory = {
          _id: `local_${Date.now()}`,
          user: dummyUserData,
          content: '',
          media_url: preview,
          media_type: mediaType,
          background_color: '#4f46e5',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        onAddStory?.(newStory)
      }

      // If parent didn't provide an add callback, fall back to refetching.
      if (!onAddStory) await fetchStories?.()
      resetForm()
      setShowModel(false)
    }

  return (
    <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4 '>
        <div className='w-full max-w-md'>
            <div className='text-center mb-4 flex items-center justify-between'>
                <button onClick={() => setShowModel(false)} className='text-white p-2 cursor-pointer'> 
                    <ArrowLeft/>
                </button>
                <h2 className='text-lg font-semibold'>Create Story</h2>
                <span className='w-10'></span>
            </div>

            <div className='rounded-xl bg-white/10 border border-white/10 p-4 space-y-3'>
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={() => setMode('text')}
                  className={`px-3 py-1.5 rounded-lg text-sm ${mode === 'text' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  Text
                </button>
                <button
                  type='button'
                  onClick={() => setMode('media')}
                  className={`px-3 py-1.5 rounded-lg text-sm ${mode === 'media' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  Image/Video
                </button>
              </div>

              {mode === 'text' ? (
                <div className='space-y-2'>
                  <div
                    className='w-full rounded-lg border border-white/10 overflow-hidden'
                    style={{ backgroundColor }}
                  >
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder='Write something...'
                      className='w-full min-h-28 p-3 bg-transparent outline-none placeholder:text-white/70'
                    />
                  </div>
                  <div className='flex gap-2 flex-wrap'>
                    {bgColors.map((c) => (
                      <button
                        key={c}
                        type='button'
                        onClick={() => setBackgroundColor(c)}
                        className={`h-7 w-7 rounded-full border ${backgroundColor === c ? 'border-white' : 'border-white/20'}`}
                        style={{ backgroundColor: c }}
                        aria-label={`Background ${c}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className='space-y-2'>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*,video/*'
                    onChange={handleMediaUpload}
                    className='hidden'
                  />
                  <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    className='w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition'
                  >
                    Choose Image/Video
                  </button>

                  {preview ? (
                    <div className='rounded-lg overflow-hidden border border-white/10 bg-black/20'>
                      {media?.type?.startsWith('video/') ? (
                        <video src={preview} className='w-full max-h-64 object-cover' controls />
                      ) : (
                        <img src={preview} alt='' className='w-full max-h-64 object-cover' />
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              <button
                type='button'
                onClick={() =>
                  toast.promise(handleCreateStory(), {
                    loading: 'Saving...',
                    success: 'Story Added',
                    error: (e) => e?.message || 'Something went wrong',
                  })
                }
                className='w-full py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition'
              >
                Create Story
              </button>
            </div>
        </div>
    </div>
  )
}

export default StoryModel

 
