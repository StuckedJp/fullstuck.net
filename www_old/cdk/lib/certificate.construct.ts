import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";

const params = require(__dirname + "/../params.json");

export class CertificateConstruct extends Construct {
  readonly cert: Certificate;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.cert = new Certificate(this, "cert", {
      domainName: params.www.fqdn,
      validation: CertificateValidation.fromDns(),
    });
  }
}
