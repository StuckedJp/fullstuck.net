import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CloudFrontConstruct } from "./cf.construct";
import { S3Construct } from "./s3.construct";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BlogSiteStack extends cdk.Stack {
  public readonly s3: S3Construct;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'BlogSiteQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    this.s3 = new S3Construct(this, "blog-site-s3", {
      fqdn: process.env.FQDN!,
      region: props.env!.region!,
    });
    new CloudFrontConstruct(this, "blog-site-cloud-front", {
      bucket: this.s3.contents,
      certificateArn: process.env.CERTIFICATE_ARN!,
      fqdn: process.env.FQDN!,
    });
  }
}
