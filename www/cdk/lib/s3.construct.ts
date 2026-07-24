import { RemovalPolicy, Stack } from "aws-cdk-lib";
import {
  BlockPublicAccess,
  Bucket,
} from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

const params = require(__dirname + '/../params.json')

export class S3Construct extends Construct {
  public readonly contents: Bucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const region = Stack.of(this).region;
    const prefix = params.www.fqdn.replace(/\./g, "-");
    this.contents = new Bucket(this, "www-site-s3-contents", {
      bucketName: `${prefix}-${region}`,
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });
  }
}
