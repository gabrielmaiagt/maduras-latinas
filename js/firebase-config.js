/**
 * Maduras Latinas - Firebase Configuration
 * Configuración del Firebase y Firestore para tracking
 */

// Configuración Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD7PBzkNkM4LnDr5G8xB2m63gzyfreMmq0",
    authDomain: "maduras-latinas-2026.firebaseapp.com",
    projectId: "maduras-latinas-2026",
    storageBucket: "maduras-latinas-2026.firebasestorage.app",
    messagingSenderId: "323801050832",
    appId: "1:323801050832:web:39913b93555c12be6f38d5",
    measurementId: "G-CZ6VBDRHXJ"
};

// Inicialización del proyecto
let db = null;
let analytics = null;

// Inicializa Firebase cuando los scripts estén cargados
function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        try {
            // Inicializa el app
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            // Inicializa Firestore
            db = firebase.firestore();

            // Inicializa Analytics (opcional)
            if (firebase.analytics) {
                analytics = firebase.analytics();
            }

            console.log('🔥 Firebase inicializado con éxito');
            return true;
        } catch (error) {
            console.error('Error al inicializar Firebase:', error);
            return false;
        }
    } else {
        console.warn('Firebase SDK no cargado');
        return false;
    }
}

// =====================
// Firestore Helper Functions
// =====================

const MadurasFirestore = {
    // Verifica si Firestore está disponible
    isReady: function () {
        return db !== null;
    },

    // Remove valores undefined (Firestore crashea con undefined)
    cleanData: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Salva evento de tracking
    saveEvent: async function (eventData) {
        if (!this.isReady()) {
            console.warn('Firestore no disponible, guardando localmente');
            return false;
        }

        try {
            const data = this.cleanData({
                ...eventData,
                server_timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            const docRef = await db.collection('events').add(data);
            console.log('📊 Evento guardado en Firestore:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error al guardar evento:', error);
            return false;
        }
    },

    // Salva o actualiza datos del usuario
    saveUser: async function (sessionId, userData) {
        if (!this.isReady()) {
            console.warn('Firestore no disponible');
            return false;
        }

        try {
            const safeData = { ...userData };
            delete safeData.password;
            delete safeData.confirmPassword;

            const cleanUser = this.cleanData({
                ...safeData,
                country: userData.country || 'MX',
                language: 'es',
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });

            await db.collection('users').doc(sessionId).set(cleanUser, { merge: true });

            console.log('👤 Datos del usuario guardados:', sessionId);
            return true;
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            return false;
        }
    },

    // Actualiza la etapa del funnel del usuario
    updateFunnelStage: async function (sessionId, stage, additionalData = {}) {
        if (!this.isReady()) return false;

        try {
            const data = this.cleanData({
                funnel_stage: stage,
                funnel_stage_updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                ...additionalData
            });

            await db.collection('users').doc(sessionId).set(data, { merge: true });

            console.log('🎯 Funnel actualizado:', stage);
            return true;
        } catch (error) {
            console.error('Error al actualizar funnel:', error);
            return false;
        }
    },

    // Busca eventos (para el dashboard)
    getEvents: async function (options = {}) {
        if (!this.isReady()) return [];

        try {
            let query = db.collection('events');

            // Filtro por período
            if (options.startDate) {
                query = query.where('timestamp', '>=', options.startDate);
            }

            // Filtro por país
            if (options.country) {
                query = query.where('country', '==', options.country);
            }

            // Límite
            query = query.orderBy('timestamp', 'desc').limit(options.limit || 1000);

            const snapshot = await query.get();
            const events = [];
            snapshot.forEach(doc => {
                events.push({ id: doc.id, ...doc.data() });
            });

            return events;
        } catch (error) {
            console.error('Error al buscar eventos:', error);
            return [];
        }
    }
};

// Exporta para uso global
window.MadurasFirestore = MadurasFirestore;
window.initializeFirebase = initializeFirebase;

// Auto-inicializa cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Aguarda los scripts de Firebase cargarse
    setTimeout(initializeFirebase, 100);
});
