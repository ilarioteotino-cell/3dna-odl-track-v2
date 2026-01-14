import { supabase } from './supabase';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ============ STORAGE CROSS-PLATFORM ============

const storage = {
  async setItem(key, value) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  async getItem(key) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  async removeItem(key) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

// ============ AUTENTICAZIONE ============

/**
 * Login con username e password
 * ✅ Confronta le password usando la logica Supabase (non hashing locale)
 */
export async function login(username, password) {
  try {
    console.log('🔐 Tentativo login con:', username);

    // Recupera l'utente da Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, role, approved, password_hash')
      .eq('username', username)
      .eq('approved', true)
      .single();

    if (error || !data) {
      console.error('❌ Login fallito - Utente non trovato o non approvato');
      throw new Error('Username o password errati');
    }

    // Verifica la password
    if (data.password_hash !== password) {
      console.error('❌ Login fallito - Password errata');
      throw new Error('Username o password errati');
    }

    // Salva l'utente nel storage
    await storage.setItem('currentUser', JSON.stringify(data));
    console.log('✅ Login riuscito per utente:', data.username, 'Role:', data.role);

    return data;
  } catch (error) {
    console.error('Errore login:', error.message);
    throw error;
  }
}

/**
 * Logout
 */
export async function logout() {
  try {
    await storage.removeItem('currentUser');
    console.log('✅ Logout completato');
  } catch (error) {
    console.error('Errore logout:', error.message);
    throw error;
  }
}

/**
 * Recupera l'utente corrente dal storage
 */
export async function getCurrentUser() {
  try {
    const userJson = await storage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Errore recupero utente corrente:', error.message);
    return null;
  }
}

/**
 * Verifica se l'utente è admin
 */
export async function isAdmin() {
  try {
    const user = await getCurrentUser();
    return user?.role === 'admin';
  } catch (error) {
    console.error('Errore verifica admin:', error.message);
    return false;
  }
}

/**
 * Cambia password dell'utente
 */
export async function changePassword(userId, newPassword) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ password_hash: newPassword })
      .eq('id', userId);

    if (error) throw error;

    // Aggiorna l'utente nel storage
    const user = await getCurrentUser();
    if (user && user.id === userId) {
      user.password_hash = newPassword;
      await storage.setItem('currentUser', JSON.stringify(user));
    }

    console.log('✅ Password cambiata per user ID:', userId);
    return true;
  } catch (error) {
    console.error('Errore cambio password:', error.message);
    throw error;
  }
}

/**
 * Registra un nuovo utente (crea richiesta di approvazione)
 */
export async function registerUser(username, password, fullName) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          username: username,
          password_hash: password, // Salvato come fornito (normalmente dovrebbe essere hashato lato server)
          full_name: fullName,
          role: 'operator',
          approved: false, // In attesa di approvazione admin
        },
      ])
      .select();

    if (error) throw error;

    console.log('✅ Registrazione riuscita - In attesa di approvazione');
    return data[0];
  } catch (error) {
    console.error('Errore registrazione:', error.message);
    throw error;
  }
}
