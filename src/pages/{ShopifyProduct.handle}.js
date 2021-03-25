import React, { useContext } from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import StoreContext from "../context/store-context";

const Product = ({ data }) => {
  const { addVariantToCart } = useContext(StoreContext);
  return (
    <div className='conatiner mx-auto p-6'>
      <div className='md:flex md:items-center'>
        <div className='w-full h-64 lg:w-96 md:1/2'>
          <img
            className='h-full w-full rounded-md object-cover max-w-lg mx-auto'
            src={data.shopifyProduct.images[0].originalSrc}
            alt={data.shopifyProduct.title}
          />
        </div>
        <div className='w-full max-w-lg mx-auto md:ml-8 md:mt-0 md:1/2 divide-y space-y-2 divide-gray-400'>
          <div>
            <h2 className='text-gray-700 uppercase text-lg'>
              {data.shopifyProduct.title}
            </h2>
            <span className='text-gray-500 mt-3'>
              {data.shopifyProduct.priceRange.maxVariantPrice.currencyCode}{" "}
              {data.shopifyProduct.priceRange.maxVariantPrice.amount}
            </span>
          </div>
          <div>
            <div
              className='my-3'
              dangerouslySetInnerHTML={{
                __html: data.shopifyProduct.descriptionHtml,
              }}
            ></div>
            <button
              className='px-8 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-500 focus:outline-none focus: bg-indigo-500'
              onClick={() => {
                addVariantToCart(data.shopifyProduct.variants[0].shopifyId, 1);
              }}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductPage = ({ data }) => {
  return (
    <Layout>
      <Product data={data} />
    </Layout>
  );
};

export const query = graphql`
  query($handle: String) {
    shopifyProduct(handle: { eq: $handle }) {
      title
      handle
      shopifyId
      descriptionHtml
      priceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants {
        shopifyId
      }
      images {
        originalSrc
      }
    }
  }
`;

export default ProductPage;
