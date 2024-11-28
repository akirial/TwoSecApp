import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/

import moment from 'moment';

function getCurrentDateTime() {
  return moment().toISOString();  // Returns the current date-time in ISO 8601 format
}

const schema = a.schema({
 
 
  User: a.model({
    userId: a.id().required(),
    username: a.string().required(),
    email: a.email().required(),
    name: a.string(),
    profilePictureUrl: a.url(),
    
    
    friends: a.hasMany('Friend','friendOf'),
    comments: a.hasMany('Comment', 'commentOwnerId'),
    videos: a.hasMany('Video', 'ownerId'), // a user has many friends
  }).identifier(['userId']).authorization(allow => [allow.guest()]),



  Video: a.model({
    videoId: a.id().required(),
    ownerId: a.id().required(),
    title: a.string(),
    description: a.string(),
    videoUrl: a.url().required(),
    owner: a.belongsTo('User', 'ownerId'),
    likes: a.integer().default(0),
    uploadedAt: a.datetime().default(getCurrentDateTime()),
    videoComments: a.hasMany('Comment','videoOwnerId')
     // Many-to-many through a join table (Post-Tags)
  }).authorization(allow => [allow.guest()]),

  Friend: a.model({

      
      friendOf: a.id(),  
      friendUser: a.belongsTo('User', 'friendOf'),
      id: a.id(),





  }).authorization(allow => [allow.guest()]),
 

  Comment: a.model({
    commentId: a.id().required(),
    commentOwnerId: a.id(),
    videoOwnerId: a.id(),
    content: a.string(),
    commentOwner: a.belongsTo('User','commentOwnerId'),
    videoOwner: a.belongsTo('Video', 'videoOwnerId'),
    
    createdAt: a.datetime().default(getCurrentDateTime()),
     
  }).authorization(allow => [allow.guest()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
