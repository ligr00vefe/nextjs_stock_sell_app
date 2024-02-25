
import React from 'react'
import getCurrentUser from '../actions/getCurrentUser';
import getFavorites from '../actions/getFavorites';

export default async function FavoritesPage() {
      const currentUser1 = await getCurrentUser();
      console.log('favoritesPage_currentUser', currentUser1);
      const {data, currentUser, totalItems} = await getFavorites();
  return (
    <div>
      <h1>favoritesPage</h1>   
      <h2>{totalItems}</h2>   
     
      {data && data.map((stock) => (
              <div key={stock.id}>
                <p>{stock.id}</p>
                <p>{stock.symbol}</p>
                <p>{stock.company}</p>
                <p>{stock.currency}</p>
              </div>
            ))}
    </div>    
  )
  
}

