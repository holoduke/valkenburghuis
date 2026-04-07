<script setup lang="ts">
const { authenticated, login } = useAuth()
const password = ref('')
const error = ref(false)
const loading = ref(false)

async function handleSubmit() {
  error.value = false
  loading.value = true
  const ok = await login(password.value)
  loading.value = false
  if (ok) {
    navigateTo('/')
  } else {
    error.value = true
    password.value = ''
  }
}

onMounted(() => {
  if (authenticated.value) navigateTo('/')
})
</script>

<template>
  <div class="min-h-screen font-sans bg-warm-50 flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-accent-500 flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
          </svg>
        </div>
        <h1 class="text-xl font-bold text-warm-900">Valkenburghuis</h1>
        <p class="text-sm text-warm-500 mt-1">Oplevering Tracker</p>
      </div>

      <form
        class="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm"
        @submit.prevent="handleSubmit"
      >
        <label class="text-xs font-medium text-warm-500 uppercase tracking-wide">Wachtwoord</label>
        <input
          v-model="password"
          type="password"
          placeholder="Voer wachtwoord in"
          required
          autofocus
          class="mt-1 w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
          :class="error ? 'border-red-400' : 'border-warm-200'"
        />
        <p v-if="error" class="mt-2 text-xs text-red-500">Verkeerd wachtwoord</p>

        <button
          type="submit"
          :disabled="loading"
          class="mt-4 w-full py-3 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Laden...' : 'Inloggen' }}
        </button>
      </form>
    </div>
  </div>
</template>
