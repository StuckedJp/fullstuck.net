// import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy, StackProps } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
  AllowedMethods,
  Distribution,
  SecurityPolicyProtocol,
  SSLMethod,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface CloudFrontStackProps {
  fqdn: string;
  certificateArn: string;
  bucket: Bucket;
}

export class CloudFrontStack extends Construct {
  public readonly contents: Bucket;

  constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
    super(scope, id);

    new Distribution(this, "blog-site-dist", {
      defaultBehavior: {
        origin: new S3Origin(props.bucket),
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      certificate: Certificate.fromCertificateArn(
        this,
        "blog-site-cret",
        props.certificateArn
      ),
      domainNames: [props.fqdn],
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      sslSupportMethod: SSLMethod.SNI,
    });
  }
}
