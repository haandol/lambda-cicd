import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as lambdaNode from '@aws-cdk/aws-lambda-nodejs'
import * as codedeploy from '@aws-cdk/aws-codedeploy'
import { App } from '../interfaces/config'

export class LambdaStack extends cdk.Stack {
  public readonly lambdaCode: lambda.CfnParametersCode

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.lambdaCode = lambda.Code.fromCfnParameters()

    const fn = new lambdaNode.NodejsFunction(this, 'GreetFunction', {
      functionName: `${App.Context.ns}GreetFunction`,
      entry: path.resolve(__dirname, '..', 'functions', 'greet.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: cdk.Duration.seconds(5),
      memorySize: 128,
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
