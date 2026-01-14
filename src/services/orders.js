import { supabase } from './supabase';

// ============ ORDINI ============

/**
 * Recupera tutti gli ordini con relazioni
 */
export const getAllOrders = async () => {
  try {
    console.log('📦 Caricando tutti gli ordini...');
    
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        order_number,
        job_number,
        staccato_number,
        starting_department_id,
        current_department_id,
        created_by,
        scarti,
        note,
        created_at,
        updated_at,
        current_dept:current_department_id(id, name),
        starting_dept:starting_department_id(id, name),
        creator:created_by(id, username, full_name)
      `
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    console.log('✅ Ordini caricati:', data?.length);
    return data;
  } catch (error) {
    console.error('❌ Errore recupero ordini:', error.message);
    throw error;
  }
};

/**
 * Recupera un ordine per numero
 */
export const getOrderByNumber = async (orderNumber) => {
  try {
    console.log('🔍 Cercando ordine:', orderNumber);
    
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        order_number,
        job_number,
        staccato_number,
        starting_department_id,
        current_department_id,
        created_by,
        scarti,
        note,
        created_at,
        updated_at,
        current_dept:current_department_id(id, name),
        starting_dept:starting_department_id(id, name),
        creator:created_by(id, username, full_name)
      `
      )
      .eq('order_number', orderNumber)
      .single();

    if (error) throw error;
    
    console.log('✅ Ordine trovato:', data);
    return data;
  } catch (error) {
    console.error('❌ Errore recupero ordine:', error.message);
    throw error;
  }
};

/**
 * Crea un nuovo ordine
 */
export const createOrder = async (orderNumber, staccatoNumber, jobNumber, startingDeptId, createdById) => {
  try {
    console.log('📝 Creando nuovo ordine...');
    console.log('  order_number:', orderNumber);
    console.log('  job_number:', jobNumber);
    console.log('  staccato_number:', staccatoNumber);
    console.log('  starting_department_id:', startingDeptId);
    console.log('  created_by:', createdById);

    const newOrderData = [
      {
        order_number: orderNumber || null,
        staccato_number: staccatoNumber || null,
        job_number: jobNumber || null,
        starting_department_id: startingDeptId,
        current_department_id: startingDeptId,
        created_by: createdById,
        scarti: 0,
        note: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const { data, error } = await supabase
      .from('orders')
      .insert(newOrderData)
      .select();

    if (error) {
      console.error('❌ Errore creazione ordine:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error('❌ Nessun record creato!');
      throw new Error('Errore: nessun record creato nella tabella orders');
    }

    console.log('✅ Ordine creato:', data[0]);
    return data[0];
  } catch (error) {
    console.error('❌ Errore completo creazione ordine:', error);
    throw error;
  }
};

/**
 * Aggiorna lo stato di un ordine
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    console.log('🔄 Aggiornando stato ordine:', orderId);
    
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    
    console.log('✅ Ordine aggiornato:', data[0]);
    return data[0];
  } catch (error) {
    console.error('❌ Errore aggiornamento ordine:', error.message);
    throw error;
  }
};

/**
 * Aggiorna i dati di un ordine (scarti, note)
 */
export const updateOrderData = async (orderId, scarti, note) => {
  try {
    console.log('🔄 Aggiornando dati ordine:', orderId);
    
    const { data, error } = await supabase
      .from('orders')
      .update({
        scarti: scarti || 0,
        note: note || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    
    console.log('✅ Dati ordine aggiornati');
    return data[0];
  } catch (error) {
    console.error('❌ Errore aggiornamento dati ordine:', error.message);
    throw error;
  }
};

// ============ REPARTI ============

/**
 * Recupera tutti i reparti ordinati
 */
export const getDepartments = async () => {
  try {
    console.log('🏭 Caricando reparti...');
    
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('order_position', { ascending: true });

    if (error) throw error;
    
    console.log('✅ Reparti caricati:', data?.length);
    return data;
  } catch (error) {
    console.error('❌ Errore recupero reparti:', error.message);
    throw error;
  }
};

/**
 * Aggiungi un nuovo reparto
 */
export const addDepartment = async (name, position) => {
  try {
    console.log('➕ Aggiungendo reparto:', name);
    
    const { data, error } = await supabase
      .from('departments')
      .insert([
        {
          name: name,
          order_position: position,
        },
      ])
      .select();

    if (error) throw error;
    
    console.log('✅ Reparto aggiunto:', name);
    return data[0];
  } catch (error) {
    console.error('❌ Errore aggiunta reparto:', error.message);
    throw error;
  }
};

/**
 * Elimina un reparto
 */
export const deleteDepartment = async (deptId) => {
  try {
    console.log('🗑️ Eliminando reparto:', deptId);
    
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', deptId);

    if (error) throw error;
    
    console.log('✅ Reparto eliminato');
  } catch (error) {
    console.error('❌ Errore eliminazione reparto:', error.message);
    throw error;
  }
};

// ============ MOVIMENTAZIONI ============

/**
 * Sposta un ordine avanti (avanzamento)
 */
export const moveOrder = async (orderId, fromDeptId, toDeptId, userId, orderData = {}) => {
  try {
    console.log('🚀 Spostando ordine (avanzamento)...');
    console.log('  orderId:', orderId);
    console.log('  fromDeptId:', fromDeptId);
    console.log('  toDeptId:', toDeptId);
    console.log('  userId:', userId);

    // STEP 1: Aggiorna ordine
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        current_department_id: toDeptId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('❌ Errore update ordine:', updateError);
      throw updateError;
    }

    console.log('✅ Ordine aggiornato');

    // STEP 2: Registra movimento in storico
    const historyData = {
      order_id: orderId,
      order_number: orderData.order_number || null,
      job_number: orderData.job_number || null,
      staccato_number: orderData.staccato_number || null,
      from_department_id: fromDeptId,
      to_department_id: toDeptId,
      moved_by_user_id: userId,
      operation_type: 'avanzamento',
      scarti: orderData.scarti || 0,
      note: orderData.note || null,
      moved_at: new Date().toISOString(),
    };

    console.log('📝 Inserendo in order_history:', historyData);

    const { error: historyError, data: historyData_result } = await supabase
      .from('order_history')
      .insert([historyData])
      .select();

    if (historyError) {
      console.error('❌ Errore insert order_history:', historyError);
      throw historyError;
    }

    console.log('✅ Movimento registrato:', historyData_result?.[0]);
    return true;
  } catch (error) {
    console.error('❌ Errore movimento ordine:', error);
    throw error;
  }
};

/**
 * Sposta un ordine indietro (retrocessione)
 */
export const moveOrderBackward = async (orderId, fromDeptId, toDeptId, userId, note = '', orderData = {}) => {
  try {
    console.log('⬅️ Spostando ordine (retrocessione)...');
    console.log('  orderId:', orderId);
    console.log('  fromDeptId:', fromDeptId);
    console.log('  toDeptId:', toDeptId);
    console.log('  userId:', userId);
    console.log('  note:', note);

    // STEP 1: Aggiorna ordine
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        current_department_id: toDeptId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('❌ Errore update ordine:', updateError);
      throw updateError;
    }

    console.log('✅ Ordine aggiornato');

    // STEP 2: Registra movimento di retrocessione
    const historyData = {
      order_id: orderId,
      order_number: orderData.order_number || null,
      job_number: orderData.job_number || null,
      staccato_number: orderData.staccato_number || null,
      from_department_id: fromDeptId,
      to_department_id: toDeptId,
      moved_by_user_id: userId,
      operation_type: 'retrocessione',
      scarti: orderData.scarti || 0,
      note: note || null,
      moved_at: new Date().toISOString(),
    };

    console.log('📝 Inserendo in order_history:', historyData);

    const { error: historyError, data: historyData_result } = await supabase
      .from('order_history')
      .insert([historyData])
      .select();

    if (historyError) {
      console.error('❌ Errore insert order_history:', historyError);
      throw historyError;
    }

    console.log('✅ Retrocessione registrata:', historyData_result?.[0]);
    return true;
  } catch (error) {
    console.error('❌ Errore retrocessione ordine:', error);
    throw error;
  }
};

/**
 * Recupera la cronologia di un ordine
 */
export const getOrderHistory = async (orderId) => {
  try {
    console.log('📋 Caricando cronologia ordine:', orderId);
    
    const { data, error } = await supabase
      .from('order_history')
      .select(
        `
        id,
        order_id,
        order_number,
        job_number,
        staccato_number,
        from_department_id,
        to_department_id,
        moved_by_user_id,
        operation_type,
        scarti,
        note,
        moved_at,
        from_dept:from_department_id(id, name),
        to_dept:to_department_id(id, name),
        user:moved_by_user_id(id, username, full_name)
      `
      )
      .eq('order_id', orderId)
      .order('moved_at', { ascending: false });

    if (error) throw error;
    
    console.log('✅ Cronologia caricata:', data?.length, 'records');
    return data;
  } catch (error) {
    console.error('❌ Errore recupero cronologia:', error.message);
    throw error;
  }
};

/**
 * Recupera la cronologia recente di tutti gli ordini con nomi leggibili
 */
export const getRecentHistory = async (limit = 50) => {
  try {
    console.log('📋 Caricando cronologia recente (ultimi', limit, 'record)');
    
    const { data, error } = await supabase
      .from('order_history')
      .select(
        `
        id,
        order_id,
        order_number,
        job_number,
        staccato_number,
        from_department_id,
        to_department_id,
        moved_by_user_id,
        operation_type,
        scarti,
        note,
        moved_at,
        from_dept:from_department_id(id, name),
        to_dept:to_department_id(id, name),
        user:moved_by_user_id(id, username, full_name)
      `
      )
      .order('moved_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    console.log('✅ Cronologia caricata:', data?.length, 'records');
    return data;
  } catch (error) {
    console.error('❌ Errore recupero cronologia recente:', error.message);
    throw error;
  }
};

/**
 * Cerca un ordine per number, job_number, o staccato_number
 */
export const searchOrder = async (searchTerm) => {
  try {
    console.log('🔍 Cercando ordine:', searchTerm);
    
    const upperSearchTerm = searchTerm.toUpperCase();

    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        order_number,
        job_number,
        staccato_number,
        starting_department_id,
        current_department_id,
        created_by,
        scarti,
        note,
        created_at,
        updated_at,
        current_dept:current_department_id(id, name),
        starting_dept:starting_department_id(id, name),
        creator:created_by(id, username, full_name)
      `
      )
      .or(
        `order_number.eq.${upperSearchTerm},job_number.eq.${upperSearchTerm},staccato_number.eq.${upperSearchTerm}`
      );

    if (error) throw error;
    
    console.log('✅ Ordini trovati:', data?.length);
    return data;
  } catch (error) {
    console.error('❌ Errore ricerca ordine:', error.message);
    throw error;
  }
};

/**
 * Ottieni informazioni complete di un ordine (con cronologia)
 */
export const getOrderWithHistory = async (orderId) => {
  try {
    console.log('📊 Caricando ordine con cronologia:', orderId);

    // Carica l'ordine
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(
        `
        id,
        order_number,
        job_number,
        staccato_number,
        starting_department_id,
        current_department_id,
        created_by,
        scarti,
        note,
        created_at,
        updated_at,
        current_dept:current_department_id(id, name),
        starting_dept:starting_department_id(id, name),
        creator:created_by(id, username, full_name)
      `
      )
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    // Carica la cronologia
    const history = await getOrderHistory(orderId);

    console.log('✅ Ordine e cronologia caricati');
    return {
      order: orderData,
      history: history,
    };
  } catch (error) {
    console.error('❌ Errore caricamento ordine con cronologia:', error.message);
    throw error;
  }
};

/**
 * Conta quanti ordini sono in un reparto specifico
 */
export const countOrdersInDepartment = async (deptId) => {
  try {
    console.log('📊 Contando ordini in reparto:', deptId);

    const { count, error } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('current_department_id', deptId);

    if (error) throw error;

    console.log('✅ Ordini trovati:', count);
    return count;
  } catch (error) {
    console.error('❌ Errore conteggio ordini:', error.message);
    throw error;
  }
};

/**
 * Ottieni riepilogo ordini per reparto
 */
export const getOrdersSummaryByDepartment = async () => {
  try {
    console.log('📊 Caricando riepilogo ordini per reparto...');

    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        current_department_id,
        id
      `
      );

    if (error) throw error;

    // Raggruppa per reparto
    const summary = {};
    data?.forEach((order) => {
      const deptId = order.current_department_id;
      summary[deptId] = (summary[deptId] || 0) + 1;
    });

    console.log('✅ Riepilogo caricato:', summary);
    return summary;
  } catch (error) {
    console.error('❌ Errore riepilogo ordini:', error.message);
    throw error;
  }
};
