<script>
export default {
  name: "Item",
  functional: true,
  props: {
    icon: { type: String, default: "", required: true },
    title: { type: String, default: "", required: true }
  },
  render(h, context) {
    const { icon, title } = context.props;
    const vnodes = [];
    if (icon) {
      vnodes.push(<svg-icon icon-class={icon} />);
    }
    if (title) {
      vnodes.push(<span>{title}</span>);
    }
    return vnodes;
  }
};
</script>

