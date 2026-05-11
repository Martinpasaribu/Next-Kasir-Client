<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Heading1, Heading2,
  Undo, Redo
} from 'lucide-vue-next'

const props = defineProps(['modelValue', 'label'])
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert prose-sm max-w-none focus:outline-none min-h-[200px] p-4 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200',
    },
  },
})

// SEBELUM (Error: editor.getHTML is not a function)
watch(() => props.modelValue, (value) => {
  const isSame = editor.value.getHTML() === value // Ini benar jika editor adalah Ref
  // Tapi biasanya error muncul jika editor belum terinisialisasi saat watch berjalan
  if (editor.value && !isSame) {
    editor.value.commands.setContent(value, false)
  }
})


</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
      {{ label }}
    </label>

    <div class="w-full border border-slate-200 dark:border-nuxt-gray-800 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
      <div v-if="editor" class="bg-slate-50 dark:bg-nuxt-gray-800 p-2 border-b border-slate-200 dark:border-zinc-700 flex gap-1 flex-wrap">
        
        <div class="flex gap-1 pr-2 border-r border-slate-200 dark:border-zinc-700">
          <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'bg-blue-600 text-white': editor.isActive('bold') }" class="btn-tool"><Bold class="w-4 h-4"/></button>
          <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'bg-blue-600 text-white': editor.isActive('italic') }" class="btn-tool"><Italic class="w-4 h-4"/></button>
          <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'bg-blue-600 text-white': editor.isActive('underline') }" class="btn-tool"><UnderlineIcon class="w-4 h-4"/></button>
        </div>

        <div class="flex gap-1 px-2 border-r border-slate-200 dark:border-zinc-700">
          <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'bg-blue-600 text-white': editor.isActive('heading', { level: 1 }) }" class="btn-tool"><Heading1 class="w-4 h-4"/></button>
          <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'bg-blue-600 text-white': editor.isActive('heading', { level: 2 }) }" class="btn-tool"><Heading2 class="w-4 h-4"/></button>
        </div>

        <div class="flex gap-1 px-2 border-r border-slate-200 dark:border-zinc-700">
          <button @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'bg-blue-600 text-white': editor.isActive({ textAlign: 'left' }) }" class="btn-tool"><AlignLeft class="w-4 h-4"/></button>
          <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'bg-blue-600 text-white': editor.isActive({ textAlign: 'center' }) }" class="btn-tool"><AlignCenter class="w-4 h-4"/></button>
          <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'bg-blue-600 text-white': editor.isActive({ textAlign: 'right' }) }" class="btn-tool"><AlignRight class="w-4 h-4"/></button>
        </div>

        <div class="flex gap-1 px-2">
          <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'bg-blue-600 text-white': editor.isActive('bulletList') }" class="btn-tool"><List class="w-4 h-4"/></button>
          <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'bg-blue-600 text-white': editor.isActive('orderedList') }" class="btn-tool"><ListOrdered class="w-4 h-4"/></button>
        </div>

        <div class="flex gap-1 ml-auto">
          <button @click="editor.chain().focus().undo().run()" class="btn-tool"><Undo class="w-4 h-4"/></button>
          <button @click="editor.chain().focus().redo().run()" class="btn-tool"><Redo class="w-4 h-4"/></button>
        </div>
      </div>
      
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<style scoped>
/* Sesuaikan path ini dengan lokasi file CSS utama Anda */
@reference "../../../assets/css/main.css"; 

.btn-tool {
  @apply p-2 rounded-lg transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400;
}
</style>