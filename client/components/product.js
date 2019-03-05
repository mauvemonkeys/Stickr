import React from 'react'

const Product = ({product, handleClick, isAdmin, handleDispatchProduct}) => {
  return (
    <div className="product-item">
      <div id="backgroundimg">
        <img src={product.imageUrl} onClick={() => handleClick(product.id)} />
      </div>
      <div>
        <h3 onClick={() => handleClick(product.id)}>{product.name}</h3>
      </div>
      <div>${product.price}</div>
      {isAdmin && (
        <button onClick={() => handleDispatchProduct(product.id)}>Edit</button>
      )}
    </div>
  )
}

export default Product
