import { CliHandler } from './cli-handler'

export class CliHandlerNode extends CliHandler {
  constructor() {
    super()
    process.stdin.on('data', async (data: any) => {
      const command = data.toString().replace(/\n/, '')
      await this.type(command)
    })
  }

  write(text: string): void {
    console.log(text)
  }
}
