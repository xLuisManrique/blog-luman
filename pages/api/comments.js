
/** *************************************************************
* Any file inside the folder pages/api is mapped to /api/* and  *
* will be treated as an API endpoint instead of a page.         *
*************************************************************** */

import type { NextApiRequest, NextApiResponse } from 'next'
import { GraphQLClient, gql } from 'graphql-request';
import { submitComment } from '../../services';
import { async } from 'rxjs';

const graphqlAPI = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const hygraphcmsToken = process.env.HYGRAPHCMS_TOKEN;

type Data = {
  name: string
}

export default async function comments(req: NextApiRequest, res: NextApiResponse<Data>) {

  const GraphQLClient = new GraphQLClient(
    graphqlAPI, {
      headers: {
        authorization: `Bearer ${hygraphcmsToken}`,
      },
    })
  
    const query = gql`
    mutation CreateComment($name: String!, $email: String!, $comment: String!, $slug: String!) {
      createComment(data: {name: $name, email: $email, comment: $comment, post: {connect: {slug: $slug}}}) { id }
    }
  `;

  try {
    const result = await graphQLClient.request(query, req.body );
    return res.status(200).send(result);
  }catch(error){
    console.log(error)
    return res.status(500).send(error);

  }
  
}
