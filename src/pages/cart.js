import React, { useState, useContext } from "react";
import StoreContext from "../context/store-context";
import Layout from "../components/Layout";

const CartItem = ({ item, updateItem, removeItem }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  return (
    <li className='md:flex md:items-center md:justify-between py-2 block'>
      <div className='w-full md:w-1/2 flex justify-between'>
        <div>{item.title}</div>
        <div>
          <input
            className='w-20 text-center shadow focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md'
            onChange={(e) => setQuantity(e.target.value)}
            type='number'
            defaultValue={quantity}
          />
        </div>
      </div>
      <div>
        <button
          className='px-8 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500'
          onClick={() => updateItem(item.id, quantity)}
        >
          Update
        </button>
        <button
          className='px-8 py-2 ml-4 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-500 focus:outline-none focus:bg-red-500'
          onClick={() => removeItem(item.id)}
        >
          Remove
        </button>
      </div>
    </li>
  );
};

const Cart = () => {
  const { checkout, removeLineItem, updateLineItem, client } = useContext(
    StoreContext
  );
  const updateItem = (id, quantity) => {
    updateLineItem(client, checkout.id, id, quantity);
  };
  const removeItem = (id) => {
    removeLineItem(client, checkout.id, id);
  };

  return (
    <div className='container mx-auto max-w-screen-xl p-6'>
      <h3 className='text-xl uppercase'>Your Shoping Cart</h3>
      <div className='bg-white rounded shadow-lg mx-auto w-full max-w-3xl p-8'>
        <ul className='border-b p-2 divide-y space-y-6 mb-6'>
          {checkout.lineItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              updateItem={updateItem}
              removeItem={removeItem}
            />
          ))}
        </ul>
        <span className='uppercase font-bold'>Subtotal: </span>
        <span>
          {checkout.currencyCode} {checkout.subtotalPrice}
        </span>
        <button
          className='ml-4 px-8 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-500 focus:outline-none focus:bg-green-500'
          onClick={() => {
            window.location = checkout.webUrl;
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

const CartPage = () => {
  return (
    <Layout>
      <Cart />
    </Layout>
  );
};

export default CartPage;
