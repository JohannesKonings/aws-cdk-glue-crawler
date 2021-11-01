import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'
import * as iam from '@aws-cdk/aws-iam'
import * as s3 from '@aws-cdk/aws-s3'

export class AwsCdkGlueCrawlerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const name = 'cdk-glue-crawler'

    const glueDb = new glue.Database(this, 'glue db', {
      databaseName: `${name}-db`,
    })

    const s3Bucket = new s3.Bucket(this, 's3-bucket', {
      bucketName: `${name}-bucket`,
    })

    const roleCrawler = new iam.Role(this, 'role crawler', {
      roleName: `${name}-role`,
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
    })

    const glueCrawler = new glue.CfnCrawler(this, 'glue crawler', {
      role: roleCrawler.roleArn,
      targets: {
        s3Targets: [
          {
            path: `s3://${s3Bucket.bucketName}`,
          },
        ],
      },
      databaseName: glueDb.databaseName
    })

  }
}
