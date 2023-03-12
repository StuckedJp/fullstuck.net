// import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy, StackProps } from "aws-cdk-lib";
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
} from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface S3StackProps {
  region: string;
  fqdn: string;
}

export class S3Stack extends Construct {
  public readonly contents: Bucket;

  constructor(scope: Construct, id: string, props: S3StackProps) {
    super(scope, id);

    const prefix = props.fqdn.replace(/\./g, "-");
    this.contents = new Bucket(this, "blog-site-s3-contents", {
      bucketName: `${prefix}-${props.region}`,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      accessControl: BucketAccessControl.PUBLIC_READ,
    });
  }
}
