
import React from 'react'
import getCurrentUser from '../actions/getCurrentUser';

export default async function FavoritesPage() {
      const currentUser = await getCurrentUser();
      console.log('favoritesPage_currentUser', currentUser);
  return (
    <div>favoritesPage</div>    
  )
  
}

