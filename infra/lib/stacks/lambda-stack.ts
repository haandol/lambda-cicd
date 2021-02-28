import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as codedeploy from '@aws-cdk/aws-codedeploy'

export class LambdaStack extends cdk.Stack {
  public readonly lambdaCode: lambda.CfnParametersCode

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.lambdaCode = lambda.Code.fromCfnParameters()

    const fn = new lambda.Function(this, 'GreetFunction', {
      code: this.lambdaCode,
      handler: 'greet.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
    })

    const alias = new lambda.Alias(this, 'GreetAlias', {
      aliasName: 'live',
      version: fn.currentVersion,
    })

    new codedeploy.LambdaDeploymentGroup(this, 'DeploymentGroup', {
      alias,
      deploymentConfig: codedeploy.LambdaDeploymentConfig.CANARY_10PERCENT_5MINUTES,
    })
  }
}
