// app/composables/useNavigation.ts

export const useAppNavigation = () => {
  
  /**
   * Navigasi ke daftar soal berdasarkan Bab tertentu
   * @param babId - ID dari Bab yang dipilih
   */
  const goToQuestionsByBab = (babId: string) => {
    return navigateTo({
      path: '/questions',
      query: { bab_id: babId }
    })
  }

  // Tambahkan ini di app/composables/useNavigation.ts
const goToQuestionDetail = (id: string) => {
  return navigateTo(`/questions/${id}`);
}

  /**
   * Navigasi ke halaman utama semua soal
   */
  const goToAllQuestions = () => {
    return navigateTo('/admin/questions')
  }

  // Kamu bisa tambah fungsi navigasi lainnya di sini nanti
  // Contoh: const goToEditBab = (id: string) => ...

  return {
    goToQuestionsByBab,
    goToAllQuestions,
    goToQuestionDetail
  }
}