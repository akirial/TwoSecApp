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





//https://amplify-twosecapp-eleva-s-amplifyteamdrivebucket28-fpzgdu4hit7l.s3.us-east-2.amazonaws.com/video-submissions/video-1732839036270.mp4
//https://amplify-twosecapp-eleva-s-amplifyteamdrivebucket28-fpzgdu4hit7l.s3.us-east-2.amazonaws.com/video-submissions/video-1732857551188.mp4