import React, { useState, useEffect } from "react";
import StoreContext, { defaultStoreContext } from "../context/store-context";
import { Link } from "gatsby";
import "../styles/tailwind.css";

const Layout = ({ children }) => {
  const [state, setState] = useState({
    store: {
      ...defaultStoreContext,
    },
  });
  const initialzeCheckout = async () => {
    const isBrowser = typeof window !== "undefined";
    const existingCheckoutID = isBrowser
      ? localStorage.getItem("shopify_checkout_id")
      : null;
    const setCheckoutInState = (checkout) => {
      if (isBrowser) {
        localStorage.setItem("shopify_checkout_id", checkout.id);
      }
      console.log("checkout", checkout);
      setState((prevState) => ({
        store: {
          ...prevState.store,
          checkout,
        },
      }));
      console.log(state.store);
    };
    const createNewCheckout = () => state.store.client.checkout.create();
    const fetchCheckout = (id) => state.store.client.checkout.fetch(id);
    if (existingCheckoutID) {
      try {
        const checkout = await fetchCheckout(existingCheckoutID);
        console.log("checkout", checkout);
        if (!checkout.completedAt) {
          setCheckoutInState(checkout);
          return;
        }
      } catch (e) {
        localStorage.setItem("shopify_checkout_id", null);
      }
    }
    const newCheckout = await createNewCheckout();
    setCheckoutInState(newCheckout);
  };
  useEffect(() => {
    console.log("init");
    initialzeCheckout();
  }, []);
  return (
    <StoreContext.Provider
      value={{
        ...state.store,
        addVariantToCart: (variantId, quantity) => {
          console.log("Adding to cart");
          if (variantId === "" || !quantity) {
            console.error("Both variantId and quantity are required");
            return;
          }
          setState((prevState) => ({
            store: { ...prevState.store, adding: true },
          }));
          const { checkout, client } = state.store;
          console.log(state.store);
          const checkoutId = checkout.id;
          const lineItemsToUpdate = [
            { variantId, quantity: parseInt(quantity, 10) },
          ];
          return client.checkout
            .addLineItems(checkoutId, lineItemsToUpdate)
            .then((checkout) => {
              setState((prevState) => ({
                store: { ...prevState.store, checkout, adding: false },
              }));
            });
        },
        removeLineItem: (client, checkoutID, lineItemID) => {
          console.log("Removing from cart");
          return client.checkout
            .removeLineItems(checkoutID, [lineItemID])
            .then((res) => {
              setState((prevState) => ({
                store: { ...prevState.store, checkout: res },
              }));
            });
        },
        updateLineItem: (client, checkoutID, lineItemID, quantity) => {
          console.log("Updating cart");
          const lineItemsToUpdate = [
            {
              id: lineItemID,
              quantity: parseInt(quantity, 10),
            },
          ];
          return client.checkout
            .updateLineItems(checkoutID, lineItemsToUpdate)
            .then((res) => {
              setState((prevState) => ({
                store: { ...prevState.store, checkout: res },
              }));
            });
        },
      }}
    >
      <header className='py-6 px-2 bg-indigo-600 text-white'>
        <nav className='container mx-auto max-w-screen-xl text-grey-200 flex justify-between items-center'>
          <Link to='/'>
            <h1 className='text-3xl'>JAMStore</h1>
          </Link>
          <Link to='/cart' className='block relative'>
            {state.store.checkout.lineItems.length <= 0 ? null : (
              <span className='absolute -left-2 -top-2 rounded-full bg-red-400 block px-2 py-1 text-xs'>
                {state.store.checkout.lineItems.length}
              </span>
            )}
            <svg
              className='w-8 h-8'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
              />
            </svg>
          </Link>
        </nav>
      </header>
      <main className='bg-gray-200 min-h-screen'>{children}</main>
    </StoreContext.Provider>
  );
};
export default Layout;
