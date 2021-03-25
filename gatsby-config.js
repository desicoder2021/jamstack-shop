require("dotenv").config();

module.exports = {
  plugins: [
    "gatsby-plugin-postcss",
    {
      resolve: `gatsby-source-shopify`,
      options: {
        accessToken: process.env.SHOPIFY_TOKEN,
        shopName: `jamstackshop`,
      },
    },
  ],
};
