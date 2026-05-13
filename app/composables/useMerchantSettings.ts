// composables/useMerchantSettings.ts
export const useMerchantSettings = () => {
  const settings = ref<any>(null);
  const settingsStruct = ref<any>(null);
  const settingsStructSummary = ref<any>(null);
  const loading = ref(false);
  const error = ref(null);

  /**
   * Mengambil data settingan dari server.
   * Secara default mengambil domain GLOBAL (Theme, Tax, dll).
   */
  const fetchSettings = async () => {
    loading.value = true;
    error.value = null;
    try {
      // Memanggil API Handler Nitro dengan query param domain
      const res: any = await $fetch('/api/settings', {
        // params: { domain }
      });
      
      if (res) settings.value = res;
      return res;
    } catch (err: any) {
      error.value = err;
      console.error(`[Fetch Settings Error]:`, err);
    } finally {
      loading.value = false;
    }
  };


const fetchSettingsStruct = async () => {
    loading.value = true;
    error.value = null;
    try {
      // Memanggil API Handler Nitro dengan query param domain
      const res: any = await $fetch('/api/settings/struct', {
      });
      
      console.log("🚀 ~ useMerchantSettings ~ fetchSettingsStruct ~ res:", res )

      
      if (res) settings.value = res;
      return res;
    } catch (err: any) {
      error.value = err;
      console.error(`[Fetch Settings Error]:`, err);
    } finally {
      loading.value = false;
    }
  };

const fetchSettingsStructSummary = async () => {
    loading.value = true;
    error.value = null;
    try {
      // Memanggil API Handler Nitro dengan query param domain
      const res: any = await $fetch('/api/settings/struct-summary', {
      });
      
      console.log("🚀 ~ useMerchantSettings ~ fetchSettingsStructSummary ~ res:", res )

      
      if (res) settings.value = res; 
      return res.data;
    } catch (err: any) {
      error.value = err;
      console.error(`[Fetch Settings Error]:`, err);
    } finally {
      loading.value = false;
    }
  };


  /**
   * Update Pengaturan Global (Theme, Pajak, Detail Toko)
   */
  const updateGlobalSettings = async (payload: { theme: string; tax: any; shopDetails?: any, metadata?: any }) => {
    loading.value = true;
    error.value = null;
    try {
      return await $fetch('/api/settings', {
        method: 'PATCH',
        body: {
          domain: 'APP',
          app_theme: payload.theme,
          tax_settings: payload.tax,
          name_outlet: payload.shopDetails?.name,
          auto_print: payload.shopDetails?.auto_print,
          auto_save_print: payload.shopDetails?.auto_save_print,
          address: payload.shopDetails?.address
        }
      });
    } catch (err: any) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update Pengaturan Khusus Struk (RECEIPT)
   */
  const updateReceiptSettings = async (receiptConfig: any) => {
    loading.value = true;
    error.value = null;
    try {
      return await $fetch('/api/settings', {
        method: 'PATCH',
        body: {
          domain: 'RECEIPT',
          settings_receipt: receiptConfig
        }
      });
    } catch (err: any) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  /**
   * Update Pengaturan Khusus Struk (RECEIPT)
   */
  const updateReceiptSummarySettings = async (receiptConfig: any) => {
    loading.value = true;
    error.value = null;
    try {
      console.log("🚀 ~ useMerchantSettings ~ updateReceiptSummarySettings ~ res:", receiptConfig )
      return await $fetch('/api/settings', {
        method: 'PATCH',
        body: {
          domain: 'RECEIPT_SUMMARY',
          settings_receipt_summary: receiptConfig
        }
      });
    } catch (err: any) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    settings,
    settingsStruct: computed(() => settings.value?.settings_receipt || null),
    loading,
    error,
    settingsStructSummary,
    fetchSettingsStructSummary,
    fetchSettingsStruct,
    fetchSettings, // Gunakan ini pengganti fetchGlobalSettings agar lebih dinamis
    updateGlobalSettings,
    updateReceiptSettings,
    updateReceiptSummarySettings
  };
};