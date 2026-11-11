/* =========================================================================
   TGS PLATFORM - DATABASE ENGINE (INDEXEDDB OFFLINE STORAGE)
   Hỗ trợ lưu trữ Trạm, Tuyến ống và Đồng hồ khách hàng
   ========================================================================= */

const DB = (() => {
    const DB_NAME = "TGS_WaterGIS_DB";
    const DB_VERSION = 1;
    const STORE_NAME = "projects";
    let dbInstance = null;

    return {
        init() {
            return new Promise((resolve, reject) => {
                if (dbInstance) {
                    resolve(dbInstance);
                    return;
                }

                const request = indexedDB.open(DB_NAME, DB_VERSION);

                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: "code" });
                    }
                };

                request.onsuccess = (e) => {
                    dbInstance = e.target.result;
                    resolve(dbInstance);
                };

                request.onerror = (e) => {
                    console.error("Lỗi khởi tạo IndexedDB:", e.target.error);
                    reject(e.target.error);
                };
            });
        },

        getAllProjects() {
            return new Promise(async (resolve, reject) => {
                try {
                    const db = await this.init();
                    const tx = db.transaction([STORE_NAME], "readonly");
                    const store = tx.objectStore(STORE_NAME);
                    const req = store.getAll();

                    req.onsuccess = () => resolve(req.result || []);
                    req.onerror = () => reject(req.error);
                } catch (err) {
                    reject(err);
                }
            });
        },

        createProject(project) {
            return new Promise(async (resolve, reject) => {
                try {
                    const db = await this.init();
                    const tx = db.transaction([STORE_NAME], "readwrite");
                    const store = tx.objectStore(STORE_NAME);
                    const req = store.add(project);

                    req.onsuccess = () => resolve(project);
                    req.onerror = () => reject(req.error);
                } catch (err) {
                    reject(err);
                }
            });
        },

        saveProject(project) {
            return new Promise(async (resolve, reject) => {
                try {
                    const db = await this.init();
                    const tx = db.transaction([STORE_NAME], "readwrite");
                    const store = tx.objectStore(STORE_NAME);
                    const req = store.put(project);

                    req.onsuccess = () => resolve(project);
                    req.onerror = () => reject(req.error);
                } catch (err) {
                    reject(err);
                }
            });
        },

        deleteProject(code) {
            return new Promise(async (resolve, reject) => {
                try {
                    const db = await this.init();
                    const tx = db.transaction([STORE_NAME], "readwrite");
                    const store = tx.objectStore(STORE_NAME);
                    const req = store.delete(code);

                    req.onsuccess = () => resolve(true);
                    req.onerror = () => reject(req.error);
                } catch (err) {
                    reject(err);
                }
            });
        }
    };
})();
