import React from 'react'
import Avatar from 'react-avatar'

function Client({username}) {
  return (
    <div className='d-flex flex-column align-items-center mb-2'>
        <Avatar name={username} size="50" round="14px" />
        <span className='mt-2 text-truncate' style={{maxWidth:"100px"}}>{username}</span>
    </div>
  )
}

export default Client
