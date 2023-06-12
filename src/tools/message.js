import {Message} from 'element-ui'

/**
 * 全局提示
 * @param 'success' | 'error' | 'warning' | 'info'
 * @param msg
 */

export class Msg {
  static success(msg) {
    Message.success(msg)
  }

  static error(msg) {
    Message.error(msg)
  }

  static warning(msg) {
    Message.warning(msg)
  }

  static info(msg) {
    Message.info(msg)
  }
}
