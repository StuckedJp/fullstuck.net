import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CloudFrontConstruct } from "./cf.construct";
import { S3Construct } from "./s3.construct";
import { CertificateConstruct } from "./certificate.construct";

export class WwwSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const cert = new CertificateConstruct(this, "www-site-cert");
    const s3 = new S3Construct(this, "www-site-s3");
    new CloudFrontConstruct(this, "www-site-cloud-front", {
      bucket: s3.contents,
      certificate: cert.cert,
    });
  }
}
