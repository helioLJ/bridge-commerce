import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      featured
    }
  }
`;

export const TOGGLE_PRODUCT_FEATURED = gql`
  mutation ToggleProductFeatured($id: Int!) {
    toggleProductFeatured(id: $id) {
      id
      featured
    }
  }
`; 