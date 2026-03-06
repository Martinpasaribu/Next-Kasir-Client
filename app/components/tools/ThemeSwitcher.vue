<script setup lang="ts">
import { Sun, Moon, Monitor } from 'lucide-vue-next'

const colorMode = useColorMode()

const toggleTheme = () => {
  const modes = ['system', 'light', 'dark']
  const current = colorMode.preference ?? 'system'
  const nextIndex = (modes.indexOf(current) + 1) % modes.length
  colorMode.preference = modes[nextIndex] as string
}
</script>

<template>
  <button
    @click="toggleTheme"
    class="relative flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
  >
    <ClientOnly>
      <div class="w-5 h-5 flex items-center justify-center">
        <Sun v-if="colorMode.preference === 'light'" class="w-full h-full text-amber-500" />
        <Moon v-else-if="colorMode.preference === 'dark'" class="w-full h-full text-indigo-400" />
        <Monitor v-else class="w-full h-full text-slate-500" />
      </div>

      <!-- <span class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
        {{ colorMode.preference }}
      </span> -->

      <template #fallback>
        <div class="w-5 h-5 flex items-center justify-center">
          <Monitor class="w-full h-full text-slate-300 animate-pulse" />
        </div>
        <span class="text-xs font-bold text-slate-300"></span>
      </template>
    </ClientOnly>
  </button>
</template>