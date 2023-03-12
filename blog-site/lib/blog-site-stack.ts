import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CloudFrontStack } from "./cf-stack";
import { S3Stack } from "./s3-stack";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BlogSiteStack extends cdk.Stack {
  public readonly s3: S3Stack;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'BlogSiteQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    this.s3 = new S3Stack(this, "blog-site-s3", {
      fqdn: process.env.FQDN!,
      region: props.env!.region!,
    });
    new CloudFrontStack(this, "blog-site-cloud-front", {
      bucket: this.s3.contents,
      certificateArn: process.env.CERTIFICATE_ARN!,
      fqdn: process.env.FQDN!,
    });
  }
}
