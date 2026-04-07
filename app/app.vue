<script setup lang="ts">
const { authenticated, checking, check } = useAuth()
const route = useRoute()

onMounted(() => check())

watch([authenticated, checking], () => {
  if (checking.value) return
  if (!authenticated.value && route.path !== '/login') {
    navigateTo('/login')
  }
})
</script>

<template>
  <div v-if="checking" class="min-h-screen flex items-center justify-center bg-warm-50">
    <div class="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
  </div>
  <NuxtPage v-else />
</template>
