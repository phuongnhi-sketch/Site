import { supabase } from './supabaseClient.js';

/**
 * StorageService — Upload/download ảnh qua Supabase Storage.
 */
const BUCKET = 'site-photos';

export const StorageService = {
    /**
     * Upload ảnh lên Supabase Storage.
     * @param {File} file - File ảnh
     * @param {string} siteId - ID site
     * @param {string} type - 'thumb' hoặc 'inner'
     * @returns {Promise<string>} - Public URL
     */
    async uploadImage(file, siteId, type = 'inner') {
        const ext = file.name.split('.').pop();
        const fileName = `${siteId}/${type}_${Date.now()}.${ext}`;

        const { error } = await supabase.storage
            .from(BUCKET)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }

        const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    },

    /**
     * Nén ảnh trước khi upload (giữ logic nén hiện tại).
     * @param {File} file
     * @param {number} maxWidth
     * @param {number} quality
     * @returns {Promise<Blob>}
     */
    async compressImage(file, maxWidth = 1200, quality = 0.7) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let w = img.width;
                    let h = img.height;

                    if (w > maxWidth) {
                        h = (h * maxWidth) / w;
                        w = maxWidth;
                    }

                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);

                    canvas.toBlob(resolve, 'image/jpeg', quality);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    },

    /**
     * Nén + Upload ảnh.
     * @param {File} file
     * @param {string} siteId
     * @param {string} type
     * @returns {Promise<string>}
     */
    async compressAndUpload(file, siteId, type = 'inner') {
        const compressed = await this.compressImage(file);
        const compressedFile = new File([compressed], file.name, { type: 'image/jpeg' });
        return this.uploadImage(compressedFile, siteId, type);
    },

    /**
     * Xóa ảnh.
     * @param {string} path
     */
    async deleteImage(path) {
        await supabase.storage.from(BUCKET).remove([path]);
    },
};
