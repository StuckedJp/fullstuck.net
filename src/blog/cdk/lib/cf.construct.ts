// import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy, StackProps } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
  AllowedMethods,
  Distribution,
  HttpVersion,
  PriceClass,
  SecurityPolicyProtocol,
  SSLMethod,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface CloudFrontStackProps {
  fqdn: string;
  certificateArn: string;
  bucket: Bucket;
}

export class CloudFrontConstruct extends Construct {
  public readonly contents: Bucket;

  constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
    super(scope, id);

    new Distribution(this, "blog-site-dist", {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(props.bucket),
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      certificate: Certificate.fromCertificateArn(
        this,
        "blog-site-cret",
        props.certificateArn
      ),
      priceClass: PriceClass.PRICE_CLASS_200,
      domainNames: [props.fqdn],
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: HttpVersion.HTTP2_AND_3,
      defaultRootObject: "index.html",
    });
  }
}
