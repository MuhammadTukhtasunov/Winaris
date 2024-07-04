import { ShopContext } from "../context/ShopContext"
import { useContext } from "react"

export const useShopContext = () => {
  const context = useContext(ShopContext)

  if(!context) {
    throw Error('useShopContext must be used inside an useShopContextProvider')
  }

  return context
}