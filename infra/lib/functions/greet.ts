const GREETING = "Hello, AWS!"

export async function handler(event: any, context: any) {
  console.log(JSON.stringify(event, null, 2))

  return GREETING
}