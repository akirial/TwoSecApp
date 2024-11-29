import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { aws_dynamodb } from "aws-cdk-lib";
const backend = defineBackend({
  auth,
  data,
});


backend.addOutput({
  storage: {
    aws_region: "us-east-2",
    bucket_name: "twosecawasbucketappforme"
  },
});


const externalDataSourcesStack = backend.createStack("MyExternalDataSources");


const tables = [
  { name: "Comment-ashkgnrhvnhfpmqy524hjvgpsy-NONE", dataSourceName: "ExternalCommentTableDataSource" },
  { name: "Friend-rvkj7qs6ffdyhjaqdvrdws7bn4-NONE", dataSourceName: "ExternalFriendTableDataSource" },
  { name: "User-rvkj7qs6ffdyhjaqdvrdws7bn4-NONE", dataSourceName: "ExternalUserTableDataSource" },
  { name: "Video-ashkgnrhvnhfpmqy524hjvgpsy-NONE", dataSourceName: "ExternalVideoTableDataSource" }
];

// Dynamically create data sources for each table
tables.forEach(({ name, dataSourceName }) => {
  const table = aws_dynamodb.Table.fromTableName(externalDataSourcesStack, name, name);
  backend.data.addDynamoDbDataSource(dataSourceName, table);
});


//https://amplify-twosecapp-eleva-s-amplifyteamdrivebucket28-fpzgdu4hit7l.s3.us-east-2.amazonaws.com/video-submissions/video-1732839036270.mp4
//https://amplify-twosecapp-eleva-s-amplifyteamdrivebucket28-fpzgdu4hit7l.s3.us-east-2.amazonaws.com/video-submissions/video-1732857551188.mp4