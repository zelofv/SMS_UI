export default {
  props: {
    render: {
      type: Function
    },
    param: {
      type: Object
    }
  },
  render(h) {
    return this.render(h, this.param)
  }
}
