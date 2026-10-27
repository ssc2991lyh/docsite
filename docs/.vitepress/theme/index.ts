import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()

    // 正文图片点击放大
    const initZoom = () => {
      mediumZoom('.main img:not(.no-zoom)', {
        background: 'var(--vp-c-bg)',
        margin: 24
      })
    }

    onMounted(() => initZoom())
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
}
