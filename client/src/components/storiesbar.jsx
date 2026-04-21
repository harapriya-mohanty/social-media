import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { dummyStoriesData } from '../assets/assets'
import moment from 'moment'
import StoryModel from './storyModel'
import StoryViewer from './storyViewer'

const StoriesBar = () => {
    const [stories, setStories] = useState(dummyStoriesData)
    const [showModel, setShowModel] = useState(false)
    const [viewStory, setViewStory] = useState(null)

    const fetchStories = async () => {
        setStories(dummyStoriesData)
    }   

    const handleAddStory = (newStory) => {
      setStories((prev) => [newStory, ...prev])
    }
  return (
    <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4'>
      
      <div className="flex gap-4 pb-5">
        {/* Add Story Card */}
        <div onClick={() => setShowModel(true)} className='rounded-lg shadow-sm min-w-[7.5rem] max-w-[10rem] aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white'>
            <div className='h-full flex flex-col items-center justify-center p-4'>

                <div className='size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3'>
                    <Plus className='w-5 h-5 text-white'/>
                </div>
                <p className='text-sm font-medium text-slate-700 text-center'>Create Story</p>

            </div>
        </div>
        {/* Story Cards */}
        {
            stories.map((story, index) => {
              const mediaType = story?.media_type || 'text'
              const isText = mediaType === 'text'
              const isImage = mediaType === 'image'
              const isVideo = mediaType === 'video'

              return ( 
                <div onClick={()=>setViewStory(story)}
                  key={story?._id ?? index}
                  className='relative rounded-lg shadow-sm min-w-[7.5rem] max-w-[10rem] aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden'
                  style={isText ? { backgroundColor: story?.background_color || '#4f46e5' } : undefined}
                  title={story?.user?.full_name || 'Story'}
                >
                  {!isText && (
                    <div className='absolute inset-0 bg-black'>
                      {isImage && (
                        <img
                          src={story?.media_url}
                          alt=''
                          className='h-full w-full object-cover opacity-70 hover:opacity-80 hover:scale-110 transition duration-500'
                        />
                      )}
                      {isVideo && (
                        <video
                          src={story?.media_url}
                          className='h-full w-full object-cover opacity-70 hover:opacity-80 hover:scale-110 transition duration-500'
                          autoPlay
                          loop
                          muted
                        />
                      )}
                    </div>
                  )}

                  <img
                    src={story?.user?.profile_picture}
                    alt=''
                    className='absolute size-8 top-3 left-3 z-10 rounded-full ring-2 ring-white shadow'
                  />
                  {story?.content ? (
                    <p className='absolute top-14 left-3 right-3 z-10 text-white/90 text-xs line-clamp-2'>
                      {story.content}
                    </p>
                  ) : null}
                  <p className='text-white/80 absolute bottom-2 right-2 z-10 text-xs'>
                    {story?.createdAt ? moment(story.createdAt).fromNow() : ''}
                  </p>
                </div>
              )
            })
        }
      </div>

        {/* Add Story Model */}
        {showModel && (
          <StoryModel
            setShowModel={setShowModel}
            fetchStories={fetchStories}
            onAddStory={handleAddStory}
          />
        )}
        {/* view story model */}
        {viewStory && <StoryViewer key={viewStory?._id} viewStory={viewStory} setViewStory={setViewStory} />}

    </div>
  )
}

export default StoriesBar
