#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { LambdaStack } from '../lib/stacks/lambda-stack'
import { PipelineStack } from '../lib/stacks/pipeline-stack'
import { App } from '../lib/interfaces/config'

const app = new cdk.App()

const lambdaStack = new LambdaStack(app, `${App.Context.ns}LambdaStack`)
new PipelineStack(app, `${App.Context.ns}PipelineStack`, {
  lambdaCode: lambdaStack.lambdaCode,
  repo: {
    owner: 'haandol',
    name: 'lambda-cicd-tutorial',
    branch: 'main',
  },
})

app.synth()