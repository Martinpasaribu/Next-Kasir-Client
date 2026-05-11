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
    class="relative w-full max-w-[20rem] flex items-center gap-2 p-2 rounded-xl border cursor-pointer border-slate-200 dark:border-zinc-800 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
    @click="toggleTheme"
  >
    <ClientOnly>
      <div class="w-10 h-10 rounded-xl bg-nuxt-gray-50 dark:bg-nuxt-gray-800 flex items-center justify-center text-nuxt-gray-400 group-hover:text-nuxt-green transition-colors">
        <Sun v-if="colorMode.preference === 'light'" class=" text-amber-500" :size="20"/>
        <Moon v-else-if="colorMode.preference === 'dark'" class=" text-indigo-400" :size="20"/>
        <Monitor v-else class=" text-slate-400" :size="20"/>
      </div>

      <!-- <span class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
        {{ colorMode.preference }}
      </span> -->

      <div class="text-left ml-2">
        <p class="text-sm font-bold">Mode {{ colorMode.preference  }}</p>
        <p class="text-[10px] text-nuxt-gray-400">Tema antarmuka</p>
      </div>

      <template #fallback>
        <div class="w-5 h-5 flex items-center justify-center">
          <Monitor class="w-full h-full text-slate-300 animate-pulse" />
        </div>
        <span class="text-xs font-bold text-slate-300"></span>
      </template>
    </ClientOnly>
  </button>
</template>