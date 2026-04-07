export function useAuth() {
  const authenticated = useState('auth', () => false)
  const checking = ref(true)

  async function check() {
    checking.value = true
    try {
      const data = await $fetch<{ authenticated: boolean }>('/api/auth/check')
      authenticated.value = data.authenticated
    } catch {
      authenticated.value = false
    } finally {
      checking.value = false
    }
  }

  async function login(password: string): Promise<boolean> {
    try {
      await $fetch('/api/auth/login', { method: 'POST', body: { password } })
      authenticated.value = true
      return true
    } catch {
      return false
    }
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    authenticated.value = false
  }

  return { authenticated, checking, check, login, logout }
}
