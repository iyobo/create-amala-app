import config from '../config/lib/config'
import { IMailAdapter, IMailAdapterSendParams } from '../config/lib/configTypes'

let mailEngine: IMailAdapter

export const initMail = async () => {
  console.log(`Initializing Mailer...`)
  if (config.mail.engine.adapter) {
    mailEngine = config.mail.engine.adapter
    await mailEngine.init(config.mail.engine.opts)
  }
}

export const sendEmail = async (params: IMailAdapterSendParams) => {
  if (!mailEngine) await initMail()

  return await mailEngine.send(params)
}
