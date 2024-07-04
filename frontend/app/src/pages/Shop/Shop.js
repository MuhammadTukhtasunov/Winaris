import React, { useEffect, useState, useRef } from 'react'
import { SHOP_URL, COURSE_ANALYTICS_URLS, WINARIS_SHOP_URL } from '../../config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate, useLocation } from "react-router-dom";
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';
import { useShopContext } from '../../hooks/useShopContext';
import SearchDropdown from '../../components/SearchDropdown/SearchDropdown';
import './shop.css'

const Shop = () => {
  const navigate = useNavigate()

  const query = new URLSearchParams(useLocation().search)
  const queryEmail = query.get('email')

  const { user } = useAuthContext()
  const { parts, shopDispatch } = useShopContext()

  const [error, setError] = useState(null)

  const [partsQuery, setPartsQuery] = useState('')

  // Don't allow non-logged in users to access this page
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  // Fetch parts (winaris)
  useEffect(() => {
    const fetchParts = async () => {
      const response = await fetch(WINARIS_SHOP_URL, {
        method: 'GET',
        credentials: 'include'
      })
      const data = await response.json()
      if (response.ok) {
        shopDispatch({type: 'SET_PARTS', payload: data})
        console.log(data)
      }
      else if (!response.ok) {
        console.log(data?.error)
        setError(data?.error)
      }
    }
    if (!parts) {
      fetchParts()
    }
  }, [parts, shopDispatch])

  return(
    <div className="shopBody">
      <div className='parts'>
        <h1 className="pageHeader">Winaris Shop</h1>
        <div className='shopCard shopOptions'>
          <div className='shopButtons'>
            <div className='shopDropdownBox'>
              <h3>Filter Parts</h3>
            </div>
          </div>
        </div>
          { parts?.filter(
            (part) => part.part_number.includes(partsQuery)
          ).map((part, i) => 
            <div className='shopCard' key={i}>
              <div className='shopCardContent'>
                <p>Part Number: { part.part_number }</p>
                <p>Price: ${ part.price }</p>
                <p>Quantity: { part.quantity }</p>
              </div>
            </div>
          )}
          {/* {error ? <p className='shopError'>{error}</p> : <p>Loading...</p>} */}
      </div>
    </div>
  )
}

export default Shop
