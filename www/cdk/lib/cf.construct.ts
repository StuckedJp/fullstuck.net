import { Construct } from "constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
  Distribution,
  Function,
  FunctionCode,
  FunctionEventType,
  FunctionRuntime,
  HttpVersion,
  PriceClass,
  S3OriginAccessControl,
  SecurityPolicyProtocol,
  Signing,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Size } from "aws-cdk-lib";

const params = require(__dirname + '/../params.json')

export interface CloudFrontStackProps {
  certificate: Certificate;
  bucket: Bucket;
}

export class CloudFrontConstruct extends Construct {
  public readonly contents: Bucket;

  constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
    super(scope, id);

    const originAccessControl = new S3OriginAccessControl(
      this,
      "www-site-oac",
      {
        signing: Signing.SIGV4_NO_OVERRIDE,
      }
    );
    const lambdaEdge = new Function(this, "www-site-dist-func", {
      code: FunctionCode.fromFile({ filePath: "lib/assets/viewer_request.js" }),
      runtime: FunctionRuntime.JS_2_0,
    });
    const distribution = new Distribution(this, "www-site-dist", {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(props.bucket, {
          originAccessControl,
          originPath: "/",
        }),
        functionAssociations: [
          {
            eventType: FunctionEventType.VIEWER_REQUEST,
            function: lambdaEdge,
          },
        ],
      },
      defaultRootObject: "index.html",
      certificate: props.certificate,
      priceClass: PriceClass.PRICE_CLASS_200,
      domainNames: [params.www.fqdn],
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: HttpVersion.HTTP2_AND_3,
    });
    new BucketDeployment(this, "www-site-dist-deploy", {
      sources: [Source.asset("../dist")],
      destinationBucket: props.bucket,
      distribution,
      distributionPaths: ["/*"],
      memoryLimit: 10240,
      ephemeralStorageSize: Size.gibibytes(10)
    });
  }
}
