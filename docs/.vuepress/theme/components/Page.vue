<template>
  <main class="page">
    <slot name="top" />

    <Content class="theme-default-content" />
    <TagLinks class="custom-component tag-links bottom" />
    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'

export default {
  components: { PageEdit, PageNav },
  props: ['sidebarItems']
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'

.page
  padding-bottom 2rem
  display block

.custom-component
  @extend $wrapper
  padding-top 1rem
  padding-bottom 1rem
  overflow auto

@media (max-width: $MQMobile)
  .custom-component.tag-links
    margin-left 1rem
    margin-right 1rem
</style>
