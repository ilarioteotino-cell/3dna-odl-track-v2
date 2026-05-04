





**App.js:**

import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ActivityIndicator, View } from 'react-native';



// Import screens - PERCORSI CORRETTI (senza ./src/)

import LoginScreen from './screens/LoginScreen';

import HomeScreen from './screens/HomeScreen';

import TrackOrderScreen from './screens/TrackOrderScreen';

import ProfileScreen from './screens/ProfileScreen';

import DepartmentsScreen from './screens/DepartmentsScreen';

import AdminPanel from './screens/AdminPanel';

import OrderListScreen from './screens/OrderListScreen';



// Import auth - PERCORSO CORRETTO (senza ./src/)

import { getCurrentUser } from './services/auth';



const Stack = createNativeStackNavigator();



export default function App() {

&#x20; const \[initialRoute, setInitialRoute] = useState(null);

&#x20; const \[loading, setLoading] = useState(true);



&#x20; useEffect(() => {

&#x20;   checkUserStatus();

&#x20; }, \[]);



&#x20; const checkUserStatus = async () => {

&#x20;   try {

&#x20;     const user = await getCurrentUser();

&#x20;     if (user) {

&#x20;       setInitialRoute('Home');

&#x20;     } else {

&#x20;       setInitialRoute('Login');

&#x20;     }

&#x20;   } catch (error) {

&#x20;     console.error('Errore verifica utente:', error);

&#x20;     setInitialRoute('Login');

&#x20;   } finally {

&#x20;     setLoading(false);

&#x20;   }

&#x20; };



&#x20; if (loading) {

&#x20;   return (

&#x20;     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

&#x20;       <ActivityIndicator size="large" color="#2D6BA8" />

&#x20;     </View>

&#x20;   );

&#x20; }



&#x20; return (

&#x20;   <NavigationContainer>

&#x20;     <Stack.Navigator

&#x20;       screenOptions={{

&#x20;         headerShown: false,

&#x20;         animationEnabled: true,

&#x20;       }}

&#x20;       initialRouteName={initialRoute}

&#x20;     >

&#x20;       <Stack.Screen

&#x20;         name="Login"

&#x20;         component={LoginScreen}

&#x20;         options={{

&#x20;           animationEnabled: false,

&#x20;         }}

&#x20;       />

&#x20;       <Stack.Screen

&#x20;         name="Home"

&#x20;         component={HomeScreen}

&#x20;         options={{

&#x20;           animationEnabled: false,

&#x20;         }}

&#x20;       />

&#x20;       <Stack.Screen

&#x20;         name="TrackOrder"

&#x20;         component={TrackOrderScreen}

&#x20;         options={{

&#x20;           title: 'Traccia Ordine',

&#x20;         }}

&#x20;       />

&#x20;       <Stack.Screen

&#x20;         name="Profile"

&#x20;         component={ProfileScreen}

&#x20;         options={{

&#x20;           title: 'Il Mio Profilo',

&#x20;         }}

&#x20;       />

&#x20;       <Stack.Screen

&#x20;         name="Departments"

&#x20;         component={DepartmentsScreen}

&#x20;         options={{

&#x20;           title: 'Gestione Reparti',

&#x20;         }}

&#x20;       />

&#x20;       <Stack.Screen

&#x20;         name="AdminPanel"

&#x20;         component={AdminPanel}

&#x20;         options={{

&#x20;           title: 'Gestione Utenti',

&#x20;         }}

&#x20;       />

&#x20;       <Stack.Screen

&#x20;         name="OrderHistory"

&#x20;         component={OrderListScreen}

&#x20;         options={{

&#x20;           title: 'Storico Movimentazioni',

&#x20;         }}

&#x20;       />

&#x20;     </Stack.Navigator>

&#x20;   </NavigationContainer>

&#x20; );

}









**Orders.js:**

import { supabase } from './supabase';



// ============ ORDINI ============



/\*\*

&#x20;\* Recupera tutti gli ordini con relazioni

&#x20;\*/

export const getAllOrders = async () => {

&#x20; try {

&#x20;   console.log('📦 Caricando tutti gli ordini...');

&#x20;   

&#x20;   const { data, error } = await supabase

&#x20;     .from('orders')

&#x20;     .select(

&#x20;       `

&#x20;       id,

&#x20;       order\_number,

&#x20;       job\_number,

&#x20;       staccato\_number,

&#x20;       starting\_department\_id,

&#x20;       current\_department\_id,

&#x20;       created\_by,

&#x20;       scarti,

&#x20;       note,

&#x20;       created\_at,

&#x20;       updated\_at,

&#x20;       current\_dept:current\_department\_id(id, name),

&#x20;       starting\_dept:starting\_department\_id(id, name),

&#x20;       creator:created\_by(id, username, full\_name)

&#x20;     `

&#x20;     )

&#x20;     .order('created\_at', { ascending: false });



&#x20;   if (error) throw error;

&#x20;   

&#x20;   console.log('✅ Ordini caricati:', data?.length);

&#x20;   return data;

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore recupero ordini:', error.message);

&#x20;   throw error;

&#x20; }

};



/\*\*

&#x20;\* Recupera un ordine per numero

&#x20;\*/

export const getOrderByNumber = async (orderNumber) => {

&#x20; try {

&#x20;   console.log('🔍 Cercando ordine:', orderNumber);

&#x20;   

&#x20;   const { data, error } = await supabase

&#x20;     .from('orders')

&#x20;     .select(

&#x20;       `

&#x20;       id,

&#x20;       order\_number,

&#x20;       job\_number,

&#x20;       staccato\_number,

&#x20;       starting\_department\_id,

&#x20;       current\_department\_id,

&#x20;       created\_by,

&#x20;       scarti,

&#x20;       note,

&#x20;       created\_at,

&#x20;       updated\_at,

&#x20;       current\_dept:current\_department\_id(id, name),

&#x20;       starting\_dept:starting\_department\_id(id, name),

&#x20;       creator:created\_by(id, username, full\_name)

&#x20;     `

&#x20;     )

&#x20;     .eq('order\_number', orderNumber)

&#x20;     .single();



&#x20;   if (error) throw error;

&#x20;   

&#x20;   console.log('✅ Ordine trovato:', data);

&#x20;   return data;

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore recupero ordine:', error.message);

&#x20;   throw error;

&#x20; }

};



/\*\*

&#x20;\* Crea un nuovo ordine

&#x20;\*/

export const createOrder = async (orderNumber, staccatoNumber, jobNumber, startingDeptId, createdById) => {

&#x20; try {

&#x20;   console.log('📝 Creando nuovo ordine...');

&#x20;   console.log('  order\_number:', orderNumber);

&#x20;   console.log('  job\_number:', jobNumber);

&#x20;   console.log('  staccato\_number:', staccatoNumber);

&#x20;   console.log('  starting\_department\_id:', startingDeptId);

&#x20;   console.log('  created\_by:', createdById);



&#x20;   const newOrderData = \[

&#x20;     {

&#x20;       order\_number: orderNumber || null,

&#x20;       staccato\_number: staccatoNumber || null,

&#x20;       job\_number: jobNumber || null,

&#x20;       starting\_department\_id: startingDeptId,

&#x20;       current\_department\_id: startingDeptId,

&#x20;       created\_by: createdById,

&#x20;       scarti: 0,

&#x20;       note: null,

&#x20;       created\_at: new Date().toISOString(),

&#x20;       updated\_at: new Date().toISOString(),

&#x20;     },

&#x20;   ];



&#x20;   const { data, error } = await supabase

&#x20;     .from('orders')

&#x20;     .insert(newOrderData)

&#x20;     .select();



&#x20;   if (error) {

&#x20;     console.error('❌ Errore creazione ordine:', error);

&#x20;     throw error;

&#x20;   }



&#x20;   if (!data || data.length === 0) {

&#x20;     console.error('❌ Nessun record creato!');

&#x20;     throw new Error('Errore: nessun record creato nella tabella orders');

&#x20;   }



&#x20;   console.log('✅ Ordine creato:', data\[0]);

&#x20;   return data\[0];

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore completo creazione ordine:', error);

&#x20;   throw error;

&#x20; }

};



/\*\*

&#x20;\* Aggiorna lo stato di un ordine

&#x20;\*/

export const updateOrderStatus = async (orderId, newStatus) => {

&#x20; try {

&#x20;   console.log('🔄 Aggiornando stato ordine:', orderId);

&#x20;   

&#x20;   const { data, error } = await supabase

&#x20;     .from('orders')

&#x20;     .update({

&#x20;       status: newStatus,

&#x20;       updated\_at: new Date().toISOString(),

&#x20;     })

&#x20;     .eq('id', orderId)

&#x20;     .select();



&#x20;   if (error) throw error;

&#x20;   

&#x20;   console.log('✅ Ordine aggiornato:', data\[0]);

&#x20;   return data\[0];

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore aggiornamento ordine:', error.message);

&#x20;   throw error;

&#x20; }

};



/\*\*

&#x20;\* Aggiorna i dati di un ordine (scarti, note)

&#x20;\*/

export const updateOrderData = async (orderId, scarti, note) => {

&#x20; try {

&#x20;   console.log('🔄 Aggiornando dati ordine:', orderId);

&#x20;   

&#x20;   const { data, error } = await supabase

&#x20;     .from('orders')

&#x20;     .update({

&#x20;       scarti: scarti || 0,

&#x20;       note: note || null,

&#x20;       updated\_at: new Date().toISOString(),

&#x20;     })

&#x20;     .eq('id', orderId)

&#x20;     .select();



&#x20;   if (error) throw error;

&#x20;   

&#x20;   console.log('✅ Dati ordine aggiornati');

&#x20;   return data\[0];

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore aggiornamento dati ordine:', error.message);

&#x20;   throw error;

&#x20; }

};



// ============ REPARTI ============



/\*\*

&#x20;\* Recupera tutti i reparti ordinati

&#x20;\*/

export const getDepartments = async () => {

&#x20; try {

&#x20;   console.log('🏭 Caricando reparti...');

&#x20;   

&#x20;   const { data, error } = await supabase

&#x20;     .from('departments')

&#x20;     .select('\*')

&#x20;     .order('order\_position', { ascending: true });



&#x20;   if (error) throw error;

&#x20;   

&#x20;   console.log('✅ Reparti caricati:', data?.length);

&#x20;   return data;

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore recupero reparti:', error.message);

&#x20;   throw error;

&#x20; }

};



/\*\*

&#x20;\* Aggiungi un nuovo reparto

&#x20;\*/

export const addDepartment = async (name, position) => {

&#x20; try {

&#x20;   console.log('➕ Aggiungendo reparto:', name);

&#x20;   

&#x20;   const { data, error } = await supabase

&#x20;     .from('departments')

&#x20;     .insert(\[

&#x20;       {

&#x20;         name: name,

&#x20;         order\_position: position,

&#x20;       },

&#x20;     ])

&#x20;     .select();



&#x20;   if (error) throw error;

&#x20;   

&#x20;   console.log('✅ Reparto aggiunto:', name);

&#x20;   return data\[0];

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore aggiunta reparto:', error.message);

&#x20;   throw error;

&#x20; }

};



/\*\*

&#x20;\* Elimina un reparto

&#x20;\*/

export const deleteDepartment = async (deptId) => {

&#x20; try {

&#x20;   console.log('🗑️ Eliminando reparto:', deptId);

&#x20;   

&#x20;   const { error } = await supabase

&#x20;     .from('departments')

&#x20;     .delete()

&#x20;     .eq('id', deptId);



&#x20;   if (error) throw error;

&#x20;   

&#x20;   console.log('✅ Reparto eliminato');

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore eliminazione reparto:', error.message);

&#x20;   throw error;

&#x20; }

};



// ============ MOVIMENTAZIONI ============



/\*\*

&#x20;\* Sposta un ordine avanti (avanzamento)

&#x20;\*/

export const moveOrder = async (orderId, fromDeptId, toDeptId, userId, orderData = {}) => {

&#x20; try {

&#x20;   console.log('🚀 Spostando ordine (avanzamento)...');

&#x20;   console.log('  orderId:', orderId);

&#x20;   console.log('  fromDeptId:', fromDeptId);

&#x20;   console.log('  toDeptId:', toDeptId);

&#x20;   console.log('  userId:', userId);



&#x20;   // STEP 1: Aggiorna ordine

&#x20;   const { error: updateError } = await supabase

&#x20;     .from('orders')

&#x20;     .update({

&#x20;       current\_department\_id: toDeptId,

&#x20;       updated\_at: new Date().toISOString(),

&#x20;     })

&#x20;     .eq('id', orderId);



&#x20;   if (updateError) {

&#x20;     console.error('❌ Errore update ordine:', updateError);

&#x20;     throw updateError;

&#x20;   }



&#x20;   console.log('✅ Ordine aggiornato');



&#x20;   // STEP 2: Registra movimento in storico

&#x20;   const historyData = {

&#x20;     order\_id: orderId,

&#x20;     order\_number: orderData.order\_number || null,

&#x20;     job\_number: orderData.job\_number || null,

&#x20;     staccato\_number: orderData.staccato\_number || null,

&#x20;     from\_department\_id: fromDeptId,

&#x20;     to\_department\_id: toDeptId,

&#x20;     moved\_by\_user\_id: userId,

&#x20;     operation\_type: 'avanzamento',

&#x20;     scarti: orderData.scarti || 0,

&#x20;     note: orderData.note || null,

&#x20;     moved\_at: new Date().toISOString(),

&#x20;   };



&#x20;   console.log('📝 Inserendo in order\_history:', historyData);



&#x20;   const { error: historyError, data: historyData\_result } = await supabase

&#x20;     .from('order\_history')

&#x20;     .insert(\[historyData])

&#x20;     .select();



&#x20;   if (historyError) {

&#x20;     console.error('❌ Errore insert order\_history:', historyError);

&#x20;     throw historyError;

&#x20;   }



&#x20;   console.log('✅ Movimento registrato:', historyData\_result?.\[0]);

&#x20;   return true;

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore movimento ordine:', error);

&#x20;   throw error;

&#x20; }

};



/\*\*

&#x20;\* Sposta un ordine indietro (retrocessione)

&#x20;\*/

export const moveOrderBackward = async (orderId, fromDeptId, toDeptId, userId, note = '', orderData = {}) => {

&#x20; try {

&#x20;   console.log('⬅️ Spostando ordine (retrocessione)...');

&#x20;   console.log('  orderId:', orderId);

&#x20;   console.log('  fromDeptId:', fromDeptId);

&#x20;   console.log('  toDeptId:', toDeptId);

&#x20;   console.log('  userId:', userId);

&#x20;   console.log('  note:', note);



&#x20;   // STEP 1: Aggiorna ordine

&#x20;   const { error: updateError } = await supabase

&#x20;     .from('orders')

&#x20;     .update({

&#x20;       current\_department\_id: toDeptId,

&#x20;       updated\_at: new Date().toISOString(),

&#x20;     })

&#x20;     .eq('id', orderId);



&#x20;   if (updateError) {

&#x20;     console.error('❌ Errore update ordine:', updateError);

&#x20;     throw updateError;

&#x20;   }



&#x20;   console.log('✅ Ordine aggiornato');



&#x20;   // STEP 2: Registra movimento di retrocessione

&#x20;   const historyData = {

&#x20;     order\_id: orderId,

&#x20;     order\_number: orderData.order\_number || null,

&#x20;     job\_number: orderData.job\_number || null,

&#x20;     staccato\_number: orderData.staccato\_number || null,

&#x20;     from\_department\_id: fromDeptId,

&#x20;     to\_department\_id: toDeptId,

&#x20;     moved\_by\_user\_id: userId,

&#x20;     operation\_type: 'retrocessione',

&#x20;     scarti: orderData.scarti || 0,

&#x20;     note: note || null,

&#x20;     moved\_at: new Date().toISOString(),

&#x20;   };



&#x20;   console.log('📝 Inserendo in order\_history:', historyData);



&#x20;   const { error: historyError, data: historyData\_result } = await supabase

&#x20;     .from('order\_history')

&#x20;     .insert(\[historyData])

&#x20;     .select();



&#x20;   if (historyError) {

&#x20;     console.error('❌ Errore insert order\_history:', historyError);

&#x20;     throw historyError;

&#x20;   }



&#x20;   console.log('✅ Retrocessione registrata:', historyData\_result?.\[0]);

&#x20;   return true;

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore retrocessione ordine:', error);

&#x20;   throw error;

&#x20; }

};



/\*\*

&#x20;\* Recupera la cronologia di un ordine

&#x20;\*/

export const getOrderHistory = async (orderId) => {

&#x20; try {

&#x20;   console.log('📋 Caricando cronologia ordine:', orderId);

&#x20;   

&#x20;   const { data, error } = await supabase

&#x20;     .from('order\_history')

&#x20;     .select(

&#x20;       `

&#x20;       id,

&#x20;       order\_id,

&#x20;       order\_number,

&#x20;       job\_number,

&#x20;       staccato\_number,

&#x20;       from\_department\_id,

&#x20;       to\_department\_id,

&#x20;       moved\_by\_user\_id,

&#x20;       operation\_type,

&#x20;       scarti,

&#x20;       note,

&#x20;       moved\_at,

&#x20;       from\_dept:from\_department\_id(id, name),

&#x20;       to\_dept:to\_department\_id(id, name),

&#x20;       user:moved\_by\_user\_id(id, username, full\_name)

&#x20;     `

&#x20;     )

&#x20;     .eq('order\_id', orderId)

&#x20;     .order('moved\_at', { ascending: false });



&#x20;   if (error) throw error;

&#x20;   

&#x20;   console.log('✅ Cronologia caricata:', data?.length, 'records');

&#x20;   return data;

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore recupero cronologia:', error.message);

&#x20;   throw error;

&#x20; }

};



/\*\*

&#x20;\* Recupera la cronologia recente di tutti gli ordini con nomi leggibili

&#x20;\*/

export const getRecentHistory = async (limit = 50) => {

&#x20; try {

&#x20;   console.log('📋 Caricando cronologia recente (ultimi', limit, 'record)');

&#x20;   

&#x20;   const { data, error } = await supabase

&#x20;     .from('order\_history')

&#x20;     .select(

&#x20;       `

&#x20;       id,

&#x20;       order\_id,

&#x20;       order\_number,

&#x20;       job\_number,

&#x20;       staccato\_number,

&#x20;       from\_department\_id,

&#x20;       to\_department\_id,

&#x20;       moved\_by\_user\_id,

&#x20;       operation\_type,

&#x20;       scarti,

&#x20;       note,

&#x20;       moved\_at,

&#x20;       order:orders (

&#x20;         order\_number,

&#x20;         job\_number,

&#x20;         staccato\_number

&#x20;       ),

&#x20;       from\_dept:from\_department\_id(id, name),

&#x20;       to\_dept:to\_department\_id(id, name),

&#x20;       user:moved\_by\_user\_id(id, username, full\_name)

&#x20;     `

&#x20;     )

&#x20;     .order('moved\_at', { ascending: false })

&#x20;     .limit(limit);



&#x20;   if (error) throw error;

&#x20;   

&#x20;   console.log('✅ Cronologia caricata:', data?.length, 'records');

&#x20;   return data;

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore recupero cronologia recente:', error.message);

&#x20;   throw error;

&#x20; }

};



/\*\*

&#x20;\* Cerca un ordine per number, job\_number, o staccato\_number

&#x20;\*/

export const searchOrder = async (searchTerm) => {

&#x20; try {

&#x20;   console.log('🔍 Cercando ordine:', searchTerm);

&#x20;   

&#x20;   const upperSearchTerm = searchTerm.toUpperCase();



&#x20;   const { data, error } = await supabase

&#x20;     .from('orders')

&#x20;     .select(

&#x20;       `

&#x20;       id,

&#x20;       order\_number,

&#x20;       job\_number,

&#x20;       staccato\_number,

&#x20;       starting\_department\_id,

&#x20;       current\_department\_id,

&#x20;       created\_by,

&#x20;       scarti,

&#x20;       note,

&#x20;       created\_at,

&#x20;       updated\_at,

&#x20;       current\_dept:current\_department\_id(id, name),

&#x20;       starting\_dept:starting\_department\_id(id, name),

&#x20;       creator:created\_by(id, username, full\_name)

&#x20;     `

&#x20;     )

&#x20;     .or(

&#x20;       `order\_number.eq.${upperSearchTerm},job\_number.eq.${upperSearchTerm},staccato\_number.eq.${upperSearchTerm}`

&#x20;     );



&#x20;   if (error) throw error;

&#x20;   

&#x20;   console.log('✅ Ordini trovati:', data?.length);

&#x20;   return data;

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore ricerca ordine:', error.message);

&#x20;   throw error;

&#x20; }

};



/\*\*

&#x20;\* Ottieni informazioni complete di un ordine (con cronologia)

&#x20;\*/

export const getOrderWithHistory = async (orderId) => {

&#x20; try {

&#x20;   console.log('📊 Caricando ordine con cronologia:', orderId);



&#x20;   // Carica l'ordine

&#x20;   const { data: orderData, error: orderError } = await supabase

&#x20;     .from('orders')

&#x20;     .select(

&#x20;       `

&#x20;       id,

&#x20;       order\_number,

&#x20;       job\_number,

&#x20;       staccato\_number,

&#x20;       starting\_department\_id,

&#x20;       current\_department\_id,

&#x20;       created\_by,

&#x20;       scarti,

&#x20;       note,

&#x20;       created\_at,

&#x20;       updated\_at,

&#x20;       current\_dept:current\_department\_id(id, name),

&#x20;       starting\_dept:starting\_department\_id(id, name),

&#x20;       creator:created\_by(id, username, full\_name)

&#x20;     `

&#x20;     )

&#x20;     .eq('id', orderId)

&#x20;     .single();



&#x20;   if (orderError) throw orderError;



&#x20;   // Carica la cronologia

&#x20;   const history = await getOrderHistory(orderId);



&#x20;   console.log('✅ Ordine e cronologia caricati');

&#x20;   return {

&#x20;     order: orderData,

&#x20;     history: history,

&#x20;   };

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore caricamento ordine con cronologia:', error.message);

&#x20;   throw error;

&#x20; }

};



/\*\*

&#x20;\* Conta quanti ordini sono in un reparto specifico

&#x20;\*/

export const countOrdersInDepartment = async (deptId) => {

&#x20; try {

&#x20;   console.log('📊 Contando ordini in reparto:', deptId);



&#x20;   const { count, error } = await supabase

&#x20;     .from('orders')

&#x20;     .select('id', { count: 'exact', head: true })

&#x20;     .eq('current\_department\_id', deptId);



&#x20;   if (error) throw error;



&#x20;   console.log('✅ Ordini trovati:', count);

&#x20;   return count;

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore conteggio ordini:', error.message);

&#x20;   throw error;

&#x20; }

};



/\*\*

&#x20;\* Ottieni riepilogo ordini per reparto

&#x20;\*/

export const getOrdersSummaryByDepartment = async () => {

&#x20; try {

&#x20;   console.log('📊 Caricando riepilogo ordini per reparto...');



&#x20;   const { data, error } = await supabase

&#x20;     .from('orders')

&#x20;     .select(

&#x20;       `

&#x20;       current\_department\_id,

&#x20;       id

&#x20;     `

&#x20;     );



&#x20;   if (error) throw error;



&#x20;   // Raggruppa per reparto

&#x20;   const summary = {};

&#x20;   data?.forEach((order) => {

&#x20;     const deptId = order.current\_department\_id;

&#x20;     summary\[deptId] = (summary\[deptId] || 0) + 1;

&#x20;   });



&#x20;   console.log('✅ Riepilogo caricato:', summary);

&#x20;   return summary;

&#x20; } catch (error) {

&#x20;   console.error('❌ Errore riepilogo ordini:', error.message);

&#x20;   throw error;

&#x20; }

};







**auth.js:**

import { supabase } from './supabase';

import \* as SecureStore from 'expo-secure-store';

import { Platform } from 'react-native';



// ============ STORAGE CROSS-PLATFORM ============



const storage = {

&#x20; async setItem(key, value) {

&#x20;   if (Platform.OS === 'web') {

&#x20;     localStorage.setItem(key, value);

&#x20;   } else {

&#x20;     await SecureStore.setItemAsync(key, value);

&#x20;   }

&#x20; },

&#x20; async getItem(key) {

&#x20;   if (Platform.OS === 'web') {

&#x20;     return localStorage.getItem(key);

&#x20;   } else {

&#x20;     return await SecureStore.getItemAsync(key);

&#x20;   }

&#x20; },

&#x20; async removeItem(key) {

&#x20;   if (Platform.OS === 'web') {

&#x20;     localStorage.removeItem(key);

&#x20;   } else {

&#x20;     await SecureStore.deleteItemAsync(key);

&#x20;   }

&#x20; },

};



// ============ AUTENTICAZIONE ============



/\*\*

&#x20;\* Login con username e password

&#x20;\* ✅ Confronta le password usando la logica Supabase (non hashing locale)

&#x20;\*/

export async function login(username, password) {

&#x20; try {

&#x20;   console.log('🔐 Tentativo login con:', username);



&#x20;   // Recupera l'utente da Supabase

&#x20;   const { data, error } = await supabase

&#x20;     .from('profiles')

&#x20;     .select('id, username, full\_name, role, approved, password\_hash')

&#x20;     .eq('username', username)

&#x20;     .eq('approved', true)

&#x20;     .single();



&#x20;   if (error || !data) {

&#x20;     console.error('❌ Login fallito - Utente non trovato o non approvato');

&#x20;     throw new Error('Username o password errati');

&#x20;   }



&#x20;   // Verifica la password

&#x20;   if (data.password\_hash !== password) {

&#x20;     console.error('❌ Login fallito - Password errata');

&#x20;     throw new Error('Username o password errati');

&#x20;   }



&#x20;   // Salva l'utente nel storage

&#x20;   await storage.setItem('currentUser', JSON.stringify(data));

&#x20;   console.log('✅ Login riuscito per utente:', data.username, 'Role:', data.role);



&#x20;   return data;

&#x20; } catch (error) {

&#x20;   console.error('Errore login:', error.message);

&#x20;   throw error;

&#x20; }

}



/\*\*

&#x20;\* Logout

&#x20;\*/

export async function logout() {

&#x20; try {

&#x20;   await storage.removeItem('currentUser');

&#x20;   console.log('✅ Logout completato');

&#x20; } catch (error) {

&#x20;   console.error('Errore logout:', error.message);

&#x20;   throw error;

&#x20; }

}



/\*\*

&#x20;\* Recupera l'utente corrente dal storage

&#x20;\*/

export async function getCurrentUser() {

&#x20; try {

&#x20;   const userJson = await storage.getItem('currentUser');

&#x20;   return userJson ? JSON.parse(userJson) : null;

&#x20; } catch (error) {

&#x20;   console.error('Errore recupero utente corrente:', error.message);

&#x20;   return null;

&#x20; }

}



/\*\*

&#x20;\* Verifica se l'utente è admin

&#x20;\*/

export async function isAdmin() {

&#x20; try {

&#x20;   const user = await getCurrentUser();

&#x20;   return user?.role === 'admin';

&#x20; } catch (error) {

&#x20;   console.error('Errore verifica admin:', error.message);

&#x20;   return false;

&#x20; }

}



/\*\*

&#x20;\* Cambia password dell'utente

&#x20;\*/

export async function changePassword(userId, newPassword) {

&#x20; try {

&#x20;   const { error } = await supabase

&#x20;     .from('profiles')

&#x20;     .update({ password\_hash: newPassword })

&#x20;     .eq('id', userId);



&#x20;   if (error) throw error;



&#x20;   // Aggiorna l'utente nel storage

&#x20;   const user = await getCurrentUser();

&#x20;   if (user \&\& user.id === userId) {

&#x20;     user.password\_hash = newPassword;

&#x20;     await storage.setItem('currentUser', JSON.stringify(user));

&#x20;   }



&#x20;   console.log('✅ Password cambiata per user ID:', userId);

&#x20;   return true;

&#x20; } catch (error) {

&#x20;   console.error('Errore cambio password:', error.message);

&#x20;   throw error;

&#x20; }

}



/\*\*

&#x20;\* Registra un nuovo utente (crea richiesta di approvazione)

&#x20;\*/

export async function registerUser(username, password, fullName) {

&#x20; try {

&#x20;   const { data, error } = await supabase

&#x20;     .from('profiles')

&#x20;     .insert(\[

&#x20;       {

&#x20;         username: username,

&#x20;         password\_hash: password, // Salvato come fornito (normalmente dovrebbe essere hashato lato server)

&#x20;         full\_name: fullName,

&#x20;         role: 'operator',

&#x20;         approved: false, // In attesa di approvazione admin

&#x20;       },

&#x20;     ])

&#x20;     .select();



&#x20;   if (error) throw error;



&#x20;   console.log('✅ Registrazione riuscita - In attesa di approvazione');

&#x20;   return data\[0];

&#x20; } catch (error) {

&#x20;   console.error('Errore registrazione:', error.message);

&#x20;   throw error;

&#x20; }

}







**TrackOrderScreen.js:**



import React, { useState, useEffect } from 'react';

import {

&#x20; View,

&#x20; Text,

&#x20; StyleSheet,

&#x20; TouchableOpacity,

&#x20; TextInput,

&#x20; Alert,

&#x20; ScrollView,

&#x20; Platform,

&#x20; KeyboardAvoidingView,

&#x20; ActivityIndicator,

&#x20; SafeAreaView,

} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import { supabase } from '../services/supabase';

import { getCurrentUser } from '../services/auth';

import { getDepartments } from '../services/orders';



const isWeb = Platform.OS === 'web';



const alertErrore = (title, message = '') => {

&#x20; if (isWeb) {

&#x20;   alert(`${title}: ${message}`);

&#x20; } else {

&#x20;   Alert.alert(title, message);

&#x20; }

};



const alertSuccesso = (title, message = '') => {

&#x20; if (isWeb) {

&#x20;   alert(`${title}: ${message}`);

&#x20; } else {

&#x20;   Alert.alert(title, message);

&#x20; }

};



export default function TrackOrderScreen({ navigation }) {

&#x20; const \[itemType, setItemType] = useState('ODL');

&#x20; const \[itemCode, setItemCode] = useState('');

&#x20; const \[departments, setDepartments] = useState(\[]);

&#x20; const \[fromDepartment, setFromDepartment] = useState(null);

&#x20; const \[toDepartment, setToDepartment] = useState(null);

&#x20; const \[operation, setOperation] = useState('AVANZAMENTO');

&#x20; const \[scarti, setScarti] = useState('');

&#x20; const \[note, setNote] = useState('');

&#x20; const \[currentUser, setCurrentUser] = useState(null);

&#x20; const \[loading, setLoading] = useState(false);



&#x20; useEffect(() => {

&#x20;   loadUser();

&#x20;   loadDepartments();

&#x20; }, \[]);



&#x20; const loadUser = async () => {

&#x20;   try {

&#x20;     const user = await getCurrentUser();

&#x20;     setCurrentUser(user);

&#x20;     console.log('✅ Utente caricato:', user?.username);

&#x20;   } catch (error) {

&#x20;     console.error('Errore caricamento utente:', error);

&#x20;     alertErrore('Errore', 'Impossibile caricare l\\'utente');

&#x20;   }

&#x20; };



&#x20; const loadDepartments = async () => {

&#x20;   try {

&#x20;     const data = await getDepartments();

&#x20;     setDepartments(data || \[]);

&#x20;     console.log('✅ Reparti caricati:', data?.length);

&#x20;   } catch (error) {

&#x20;     console.error('Errore caricamento reparti:', error);

&#x20;     alertErrore('Errore', 'Impossibile caricare i reparti');

&#x20;   }

&#x20; };



&#x20; const validateItemCode = (type, code) => {

&#x20;   const upperCode = code.toUpperCase();

&#x20;   

&#x20;   switch (type) {

&#x20;     case 'JOB':

&#x20;       if (upperCode.length === 0 || upperCode.length > 10) {

&#x20;         alertErrore('Errore', 'Il numero JOB deve essere massimo 10 caratteri');

&#x20;         return false;

&#x20;       }

&#x20;       break;

&#x20;     case 'STACCATO':

&#x20;       if (upperCode.length === 0 || upperCode.length > 10) {

&#x20;         alertErrore('Errore', 'Il numero STACCATO deve essere massimo 10 caratteri');

&#x20;         return false;

&#x20;       }

&#x20;       break;

&#x20;     case 'ODL':

&#x20;       if (upperCode.length === 0 || upperCode.length > 11) {

&#x20;         alertErrore('Errore', 'Il numero ODL deve essere massimo 11 caratteri');

&#x20;         return false;

&#x20;       }

&#x20;       break;

&#x20;     default:

&#x20;       break;

&#x20;   }

&#x20;   return true;

&#x20; };



&#x20; const handleTrackOrder = async () => {

&#x20;   // Validazioni

&#x20;   if (!itemCode.trim()) {

&#x20;     alertErrore('Errore', `Inserisci un numero ${itemType}`);

&#x20;     return;

&#x20;   }



&#x20;   if (!validateItemCode(itemType, itemCode)) {

&#x20;     return;

&#x20;   }



&#x20;   if (!fromDepartment) {

&#x20;     alertErrore('Errore', 'Seleziona il reparto di partenza');

&#x20;     return;

&#x20;   }



&#x20;   if (!toDepartment) {

&#x20;     alertErrore('Errore', 'Seleziona il reparto di destinazione');

&#x20;     return;

&#x20;   }



&#x20;   if (fromDepartment.id === toDepartment.id) {

&#x20;     alertErrore('Errore', 'I reparti di partenza e destinazione devono essere diversi');

&#x20;     return;

&#x20;   }



&#x20;   if (!currentUser) {

&#x20;     alertErrore('Errore', 'Utente non autenticato');

&#x20;     return;

&#x20;   }



&#x20;   setLoading(true);



&#x20;   try {

&#x20;     const upperCode = itemCode.toUpperCase();

&#x20;     console.log(`🔍 Cercando ${itemType}: ${upperCode}`);



&#x20;     let orderId = null;

&#x20;     let order = null;



&#x20;     // PASSO 1: Cerca se l'ordine esiste

&#x20;     if (itemType === 'ODL') {

&#x20;       const { data } = await supabase

&#x20;         .from('orders')

&#x20;         .select('id, current\_department\_id')

&#x20;         .eq('order\_number', upperCode)

&#x20;         .single();



&#x20;       if (data) {

&#x20;         orderId = data.id;

&#x20;         order = data;

&#x20;         console.log('✅ ODL trovato:', orderId);

&#x20;       }

&#x20;     } else if (itemType === 'JOB') {

&#x20;       const { data } = await supabase

&#x20;         .from('orders')

&#x20;         .select('id, current\_department\_id')

&#x20;         .eq('job\_number', upperCode)

&#x20;         .single();



&#x20;       if (data) {

&#x20;         orderId = data.id;

&#x20;         order = data;

&#x20;         console.log('✅ JOB trovato:', orderId);

&#x20;       }

&#x20;     } else if (itemType === 'STACCATO') {

&#x20;       const { data } = await supabase

&#x20;         .from('orders')

&#x20;         .select('id, current\_department\_id')

&#x20;         .eq('staccato\_number', upperCode)

&#x20;         .single();



&#x20;       if (data) {

&#x20;         orderId = data.id;

&#x20;         order = data;

&#x20;         console.log('✅ STACCATO trovato:', orderId);

&#x20;       }

&#x20;     }



&#x20;     // PASSO 2: Se l'ordine non esiste, crealo

&#x20;     if (!orderId) {

&#x20;       console.log('📦 Creazione nuovo ordine...');

&#x20;       

&#x20;       const newOrderData = {

&#x20;         order\_number: itemType === 'ODL' ? upperCode : null,

&#x20;         job\_number: itemType === 'JOB' ? upperCode : null,

&#x20;         staccato\_number: itemType === 'STACCATO' ? upperCode : null,

&#x20;         starting\_department\_id: fromDepartment.id,

&#x20;         current\_department\_id: fromDepartment.id,

&#x20;         created\_by: currentUser.id,

&#x20;         created\_at: new Date().toISOString(),

&#x20;         updated\_at: new Date().toISOString(),

&#x20;       };



&#x20;       const { data: createdOrder, error: createError } = await supabase

&#x20;         .from('orders')

&#x20;         .insert(\[newOrderData])

&#x20;         .select();



&#x20;       if (createError) {

&#x20;         console.error('❌ Errore creazione ordine:', createError);

&#x20;         throw createError;

&#x20;       }



&#x20;       if (!createdOrder || createdOrder.length === 0) {

&#x20;         throw new Error('Errore: nessun record creato nella tabella orders');

&#x20;       }



&#x20;       orderId = createdOrder\[0].id;

&#x20;       order = createdOrder\[0];

&#x20;       console.log('✅ Ordine creato con ID:', orderId);

&#x20;     }



&#x20;     // PASSO 3: Aggiorna l'ordine

&#x20;     if (orderId) {

&#x20;       const { error: updateError } = await supabase

&#x20;         .from('orders')

&#x20;         .update({

&#x20;           current\_department\_id: toDepartment.id,

&#x20;           updated\_at: new Date().toISOString(),

&#x20;         })

&#x20;         .eq('id', orderId);



&#x20;       if (updateError) {

&#x20;         console.error('❌ Errore aggiornamento ordine:', updateError);

&#x20;         throw updateError;

&#x20;       }



&#x20;       // PASSO 4: Registra movimento in order\_history CON NOMI LEGGIBILI

&#x20;       const { error: historyError } = await supabase

&#x20;         .from('order\_history')

&#x20;         .insert({

&#x20;           // ID per relazioni

&#x20;           order\_id: orderId,

&#x20;           from\_department\_id: fromDepartment.id,

&#x20;           to\_department\_id: toDepartment.id,

&#x20;           moved\_by\_user\_id: currentUser.id,



&#x20;           // Numeri identificativi

&#x20;           job\_number: itemType === 'JOB' ? upperCode : null,

&#x20;           order\_number: itemType === 'ODL' ? upperCode : null,

&#x20;           staccato\_number: itemType === 'STACCATO' ? upperCode : null,

&#x20;           

&#x20;           // NOMI LEGGIBILI PER CSV

&#x20;           moved\_by\_name: currentUser?.full\_name || currentUser?.username,

&#x20;           from\_department\_name: fromDepartment.name,

&#x20;           to\_department\_name: toDepartment.name,

&#x20;           

&#x20;           // Altri dati

&#x20;           operation\_type: operation,

&#x20;           scarti: scarti ? parseInt(scarti) : 0,

&#x20;           note: note.trim() || null,

&#x20;           moved\_at: new Date().toISOString(),

&#x20;         });



&#x20;       if (historyError) {

&#x20;         console.error('❌ Errore salvataggio storico:', historyError);

&#x20;         throw historyError;

&#x20;       }



&#x20;       console.log('✅ Movimento registrato con successo');



&#x20;       alertSuccesso(

&#x20;         'Successo!',

&#x20;         `${itemType} ${upperCode}\\n${operation} da ${fromDepartment.name} a ${toDepartment.name}`

&#x20;       );



&#x20;       // Reset form

&#x20;       setItemCode('');

&#x20;       setFromDepartment(null);

&#x20;       setToDepartment(null);

&#x20;       setScarti('');

&#x20;       setNote('');

&#x20;     }



&#x20;   } catch (error) {

&#x20;     console.error('❌ Errore completo:', error);

&#x20;     alertErrore('Errore', error.message || 'Impossibile registrare il movimento');

&#x20;   } finally {

&#x20;     setLoading(false);

&#x20;   }

&#x20; };



&#x20; return (

&#x20;   <SafeAreaView style={styles.container}>

&#x20;     <View style={styles.header}>

&#x20;       <TouchableOpacity onPress={() => navigation.goBack()}>

&#x20;         <Text style={styles.backButton}>← Indietro</Text>

&#x20;       </TouchableOpacity>

&#x20;       <Text style={styles.title}>Traccia Ordine</Text>

&#x20;       <View style={{ width: 60 }} />

&#x20;     </View>



&#x20;     <KeyboardAvoidingView

&#x20;       style={styles.flex}

&#x20;       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

&#x20;     >

&#x20;       <ScrollView contentContainerStyle={styles.scrollContent}>

&#x20;         {/\* Selezione Tipo \*/}

&#x20;         <Text style={styles.label}>Tipo di tracciamento</Text>

&#x20;         <View style={styles.typeSelector}>

&#x20;           {\['JOB', 'ODL', 'STACCATO'].map((type) => (

&#x20;             <TouchableOpacity

&#x20;               key={type}

&#x20;               style={\[styles.typeButton, itemType === type \&\& styles.typeButtonActive]}

&#x20;               onPress={() => {

&#x20;                 setItemType(type);

&#x20;                 setItemCode('');

&#x20;               }}

&#x20;             >

&#x20;               <Text

&#x20;                 style={\[

&#x20;                   styles.typeButtonText,

&#x20;                   itemType === type \&\& styles.typeButtonTextActive,

&#x20;                 ]}

&#x20;               >

&#x20;                 {type}

&#x20;               </Text>

&#x20;             </TouchableOpacity>

&#x20;           ))}

&#x20;         </View>



&#x20;         {/\* Input Codice \*/}

&#x20;         <Text style={styles.label}>Numero {itemType}</Text>

&#x20;         <View style={styles.inputRow}>

&#x20;           <TextInput

&#x20;             style={styles.input}

&#x20;             value={itemCode}

&#x20;             onChangeText={(text) => setItemCode(text.toUpperCase())}

&#x20;             placeholder={`Inserisci numero ${itemType}`}

&#x20;             placeholderTextColor="#999"

&#x20;             autoCapitalize="characters"

&#x20;             maxLength={itemType === 'ODL' ? 11 : 10}

&#x20;           />

&#x20;         </View>



&#x20;         {itemType === 'JOB' \&\& <Text style={styles.hint}>Massimo 10 caratteri maiuscoli</Text>}

&#x20;         {itemType === 'STACCATO' \&\& <Text style={styles.hint}>Massimo 10 caratteri maiuscoli</Text>}

&#x20;         {itemType === 'ODL' \&\& <Text style={styles.hint}>Massimo 11 caratteri maiuscoli</Text>}



&#x20;         {/\* Selezione Operazione \*/}

&#x20;         <Text style={styles.label}>Tipo operazione</Text>

&#x20;         <View style={styles.operationSelector}>

&#x20;           <TouchableOpacity

&#x20;             style={\[

&#x20;               styles.operationButton,

&#x20;               operation === 'AVANZAMENTO' \&\& styles.operationButtonActive,

&#x20;             ]}

&#x20;             onPress={() => setOperation('AVANZAMENTO')}

&#x20;           >

&#x20;             <Text

&#x20;               style={\[

&#x20;                 styles.operationButtonText,

&#x20;                 operation === 'AVANZAMENTO' \&\& styles.operationButtonTextActive,

&#x20;               ]}

&#x20;             >

&#x20;               AVANZAMENTO

&#x20;             </Text>

&#x20;           </TouchableOpacity>

&#x20;           <TouchableOpacity

&#x20;             style={\[

&#x20;               styles.operationButton,

&#x20;               operation === 'RETROCESSIONE' \&\& styles.operationButtonActive,

&#x20;             ]}

&#x20;             onPress={() => setOperation('RETROCESSIONE')}

&#x20;           >

&#x20;             <Text

&#x20;               style={\[

&#x20;                 styles.operationButtonText,

&#x20;                 operation === 'RETROCESSIONE' \&\& styles.operationButtonTextActive,

&#x20;               ]}

&#x20;             >

&#x20;               RETROCESSIONE

&#x20;             </Text>

&#x20;           </TouchableOpacity>

&#x20;         </View>



&#x20;                 {/\* Reparto di Partenza \*/}

&#x20;         <Text style={styles.label}>Reparto di partenza</Text>

&#x20;         <View style={styles.pickerContainer}>

&#x20;           <Picker

&#x20;             selectedValue={fromDepartment?.id || null}

&#x20;             onValueChange={(itemValue) => {

&#x20;               const selected = departments.find(d => d.id === itemValue);

&#x20;               setFromDepartment(selected || null);

&#x20;             }}

&#x20;             style={styles.picker}

&#x20;           >

&#x20;             <Picker.Item label="Seleziona reparto di partenza" value={null} />

&#x20;             {departments.map((dept) => (

&#x20;               <Picker.Item key={dept.id} label={dept.name} value={dept.id} />

&#x20;             ))}

&#x20;           </Picker>

&#x20;         </View>



&#x20;         {/\* Reparto di Destinazione \*/}

&#x20;         <Text style={styles.label}>Reparto di destinazione</Text>

&#x20;         <View style={styles.pickerContainer}>

&#x20;           <Picker

&#x20;             selectedValue={toDepartment?.id || null}

&#x20;             onValueChange={(itemValue) => {

&#x20;               const selected = departments.find(d => d.id === itemValue);

&#x20;               setToDepartment(selected || null);

&#x20;             }}

&#x20;             style={styles.picker}

&#x20;           >

&#x20;             <Picker.Item label="Seleziona reparto di destinazione" value={null} />

&#x20;             {departments.map((dept) => (

&#x20;               <Picker.Item key={dept.id} label={dept.name} value={dept.id} />

&#x20;             ))}

&#x20;           </Picker>

&#x20;         </View>



&#x20;         {/\* Scarti \*/}

&#x20;         <Text style={styles.label}>Scarti (opzionale)</Text>

&#x20;         <TextInput

&#x20;           style={styles.input}

&#x20;           value={scarti}

&#x20;           onChangeText={setScarti}

&#x20;           placeholder="Numero scarti"

&#x20;           placeholderTextColor="#999"

&#x20;           keyboardType="numeric"

&#x20;         />



&#x20;         {/\* Note \*/}

&#x20;         <Text style={styles.label}>Note (opzionale)</Text>

&#x20;         <TextInput

&#x20;           style={\[styles.input, styles.textArea]}

&#x20;           value={note}

&#x20;           onChangeText={setNote}

&#x20;           placeholder="Aggiungi note..."

&#x20;           placeholderTextColor="#999"

&#x20;           multiline

&#x20;           numberOfLines={3}

&#x20;         />



&#x20;         {/\* Pulsante Registra Movimento \*/}

&#x20;         <TouchableOpacity

&#x20;           style={\[styles.submitButton, loading \&\& styles.submitButtonDisabled]}

&#x20;           onPress={handleTrackOrder}

&#x20;           disabled={loading}

&#x20;         >

&#x20;           {loading ? (

&#x20;             <>

&#x20;               <ActivityIndicator color="#fff" size="small" />

&#x20;               <Text style={styles.submitButtonText}>Registrazione...</Text>

&#x20;             </>

&#x20;           ) : (

&#x20;             <Text style={styles.submitButtonText}>Registra Movimento</Text>

&#x20;           )}

&#x20;         </TouchableOpacity>



&#x20;         {/\* Riepilogo \*/}

&#x20;         {itemCode \&\& fromDepartment \&\& toDepartment \&\& (

&#x20;           <View style={styles.summary}>

&#x20;             <Text style={styles.summaryTitle}>Riepilogo</Text>

&#x20;             <Text style={styles.summaryText}>Tipo: {itemType}</Text>

&#x20;             <Text style={styles.summaryText}>Numero: {itemCode}</Text>

&#x20;             <Text style={styles.summaryText}>Operazione: {operation}</Text>

&#x20;             <Text style={styles.summaryText}>Da: {fromDepartment.name}</Text>

&#x20;             <Text style={styles.summaryText}>A: {toDepartment.name}</Text>

&#x20;             {scarti \&\& <Text style={styles.summaryText}>Scarti: {scarti}</Text>}

&#x20;             {note \&\& <Text style={styles.summaryText}>Note: {note}</Text>}

&#x20;           </View>

&#x20;         )}

&#x20;       </ScrollView>

&#x20;     </KeyboardAvoidingView>

&#x20;   </SafeAreaView>

&#x20; );

}



const styles = StyleSheet.create({

&#x20; container: {

&#x20;   flex: 1,

&#x20;   backgroundColor: '#f5f5f5',

&#x20; },

&#x20; header: {

&#x20;   backgroundColor: '#2D6BA8',

&#x20;   padding: 15,

&#x20;   flexDirection: 'row',

&#x20;   justifyContent: 'space-between',

&#x20;   alignItems: 'center',

&#x20; },

&#x20; backButton: {

&#x20;   color: '#fff',

&#x20;   fontSize: 16,

&#x20;   fontWeight: '600',

&#x20;   width: 60,

&#x20; },

&#x20; title: {

&#x20;   fontSize: 20,

&#x20;   fontWeight: 'bold',

&#x20;   color: '#fff',

&#x20;   flex: 1,

&#x20;   textAlign: 'center',

&#x20; },

&#x20; flex: {

&#x20;   flex: 1,

&#x20; },

&#x20; scrollContent: {

&#x20;   padding: 20,

&#x20; },

&#x20; label: {

&#x20;   fontSize: 16,

&#x20;   fontWeight: '600',

&#x20;   color: '#333',

&#x20;   marginTop: 15,

&#x20;   marginBottom: 8,

&#x20; },

&#x20; hint: {

&#x20;   fontSize: 12,

&#x20;   color: '#666',

&#x20;   marginTop: 4,

&#x20;   marginBottom: 8,

&#x20; },

&#x20; typeSelector: {

&#x20;   flexDirection: 'row',

&#x20;   justifyContent: 'space-between',

&#x20;   marginBottom: 10,

&#x20; },

&#x20; typeButton: {

&#x20;   flex: 1,

&#x20;   padding: 12,

&#x20;   marginHorizontal: 4,

&#x20;   borderRadius: 8,

&#x20;   backgroundColor: '#fff',

&#x20;   borderWidth: 2,

&#x20;   borderColor: '#ddd',

&#x20;   alignItems: 'center',

&#x20; },

&#x20; typeButtonActive: {

&#x20;   backgroundColor: '#007AFF',

&#x20;   borderColor: '#007AFF',

&#x20; },

&#x20; typeButtonText: {

&#x20;   fontSize: 14,

&#x20;   fontWeight: '600',

&#x20;   color: '#666',

&#x20; },

&#x20; typeButtonTextActive: {

&#x20;   color: '#fff',

&#x20; },

&#x20; inputRow: {

&#x20;   flexDirection: 'row',

&#x20;   alignItems: 'center',

&#x20; },

&#x20; input: {

&#x20;   flex: 1,

&#x20;   backgroundColor: '#fff',

&#x20;   padding: 12,

&#x20;   borderRadius: 8,

&#x20;   borderWidth: 1,

&#x20;   borderColor: '#ddd',

&#x20;   fontSize: 16,

&#x20;   color: '#333',

&#x20; },

&#x20; textArea: {

&#x20;   height: 80,

&#x20;   textAlignVertical: 'top',

&#x20; },

&#x20; operationSelector: {

&#x20;   flexDirection: 'row',

&#x20;   justifyContent: 'space-between',

&#x20;   marginBottom: 10,

&#x20; },

&#x20; operationButton: {

&#x20;   flex: 1,

&#x20;   padding: 15,

&#x20;   marginHorizontal: 4,

&#x20;   borderRadius: 8,

&#x20;   backgroundColor: '#fff',

&#x20;   borderWidth: 2,

&#x20;   borderColor: '#ddd',

&#x20;   alignItems: 'center',

&#x20; },

&#x20; operationButtonActive: {

&#x20;   backgroundColor: '#FF9500',

&#x20;   borderColor: '#FF9500',

&#x20; },

&#x20; operationButtonText: {

&#x20;   fontSize: 14,

&#x20;   fontWeight: '600',

&#x20;   color: '#666',

&#x20; },

&#x20; operationButtonTextActive: {

&#x20;   color: '#fff',

&#x20; },

&#x20; pickerContainer: {

&#x20;   backgroundColor: '#fff',

&#x20;   borderRadius: 8,

&#x20;   borderWidth: 1,

&#x20;   borderColor: '#ddd',

&#x20;   marginBottom: 10,

&#x20;   overflow: 'hidden',

&#x20; },

&#x20; picker: {

&#x20;   height: 50,

&#x20;   width: '100%',

&#x20; },

&#x20; submitButton: {

&#x20;   backgroundColor: '#007AFF',

&#x20;   padding: 16,

&#x20;   borderRadius: 8,

&#x20;   alignItems: 'center',

&#x20;   marginTop: 20,

&#x20;   flexDirection: 'row',

&#x20;   justifyContent: 'center',

&#x20;   gap: 10,

&#x20; },

&#x20; submitButtonDisabled: {

&#x20;   backgroundColor: '#ccc',

&#x20; },

&#x20; submitButtonText: {

&#x20;   color: '#fff',

&#x20;   fontSize: 18,

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; summary: {

&#x20;   backgroundColor: '#fff',

&#x20;   padding: 15,

&#x20;   borderRadius: 8,

&#x20;   marginTop: 20,

&#x20;   borderWidth: 1,

&#x20;   borderColor: '#ddd',

&#x20; },

&#x20; summaryTitle: {

&#x20;   fontSize: 16,

&#x20;   fontWeight: 'bold',

&#x20;   color: '#333',

&#x20;   marginBottom: 8,

&#x20; },

&#x20; summaryText: {

&#x20;   fontSize: 14,

&#x20;   color: '#666',

&#x20;   marginBottom: 4,

&#x20; },

});





**ProfileScreen.js**

import React, { useState, useEffect } from 'react';

import {

&#x20; View,

&#x20; Text,

&#x20; TextInput,

&#x20; TouchableOpacity,

&#x20; StyleSheet,

&#x20; Alert,

&#x20; ScrollView,

&#x20; Platform,

} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { getCurrentUser, changePassword } from '../services/auth';

import { supabase } from '../services/supabase';



const isWeb = Platform.OS === 'web';



// Helper functions per alert

const alertErrore = (title, message = '') => {

&#x20; if (isWeb) {

&#x20;   alert(`${title}: ${message}`);

&#x20; } else {

&#x20;   Alert.alert(title, message);

&#x20; }

};



const alertSuccesso = (title, message = '') => {

&#x20; if (isWeb) {

&#x20;   alert(`${title}: ${message}`);

&#x20; } else {

&#x20;   Alert.alert(title, message);

&#x20; }

};



export default function ProfileScreen({ navigation }) {

&#x20; const \[user, setUser] = useState(null);

&#x20; const \[oldPassword, setOldPassword] = useState('');

&#x20; const \[newPassword, setNewPassword] = useState('');

&#x20; const \[confirmPassword, setConfirmPassword] = useState('');

&#x20; const \[loading, setLoading] = useState(false);



&#x20; // Stati per mostrare/nascondere password

&#x20; const \[showOldPassword, setShowOldPassword] = useState(false);

&#x20; const \[showNewPassword, setShowNewPassword] = useState(false);

&#x20; const \[showConfirmPassword, setShowConfirmPassword] = useState(false);



&#x20; useEffect(() => {

&#x20;   loadUser();

&#x20; }, \[]);



&#x20; const loadUser = async () => {

&#x20;   try {

&#x20;     const currentUser = await getCurrentUser();

&#x20;     setUser(currentUser);

&#x20;   } catch (error) {

&#x20;     console.error('Errore caricamento utente:', error);

&#x20;     alertErrore('Errore', 'Impossibile caricare il profilo utente');

&#x20;   }

&#x20; };



&#x20; const handleChangePassword = async () => {

&#x20;   // Validazioni

&#x20;   if (!oldPassword || !newPassword || !confirmPassword) {

&#x20;     alertErrore('Errore', 'Compila tutti i campi');

&#x20;     return;

&#x20;   }



&#x20;   if (newPassword !== confirmPassword) {

&#x20;     alertErrore('Errore', 'Le nuove password non corrispondono');

&#x20;     return;

&#x20;   }



&#x20;   if (newPassword.length < 6) {

&#x20;     alertErrore('Errore', 'La password deve essere di almeno 6 caratteri');

&#x20;     return;

&#x20;   }



&#x20;   setLoading(true);



&#x20;   try {

&#x20;     // Verifica la vecchia password

&#x20;     const { data: userData, error: selectError } = await supabase

&#x20;       .from('profiles')

&#x20;       .select('password\_hash')

&#x20;       .eq('id', user.id)

&#x20;       .single();



&#x20;     if (selectError || !userData) {

&#x20;       throw new Error('Errore nel recupero della password');

&#x20;     }



&#x20;     // Confronta la password (normalmente dovrebbe usare bcrypt)

&#x20;     if (userData.password\_hash !== oldPassword) {

&#x20;       alertErrore('Errore', 'La vecchia password non è corretta');

&#x20;       setLoading(false);

&#x20;       return;

&#x20;     }



&#x20;     // Aggiorna la password

&#x20;     const { error: updateError } = await supabase

&#x20;       .from('profiles')

&#x20;       .update({ password\_hash: newPassword })

&#x20;       .eq('id', user.id);



&#x20;     if (updateError) throw updateError;



&#x20;     alertSuccesso('Successo', 'Password aggiornata con successo!');



&#x20;     // Reset form

&#x20;     setOldPassword('');

&#x20;     setNewPassword('');

&#x20;     setConfirmPassword('');



&#x20;     // Aggiorna l'utente nel storage

&#x20;     const updatedUser = { ...user, password\_hash: newPassword };

&#x20;     setUser(updatedUser);

&#x20;   } catch (error) {

&#x20;     console.error('Errore cambio password:', error);

&#x20;     alertErrore('Errore', error.message || 'Impossibile cambiare la password');

&#x20;   } finally {

&#x20;     setLoading(false);

&#x20;   }

&#x20; };



&#x20; // Componente Input Password con Icona Occhio

&#x20; function PasswordInput({ label, value, onChangeText, placeholder, showPassword, toggleShow }) {

&#x20;   if (isWeb) {

&#x20;     // Versione WEB

&#x20;     return (

&#x20;       <View style={styles.inputContainer}>

&#x20;         <Text style={styles.inputLabel}>{label}</Text>

&#x20;         <View style={styles.passwordInputContainer}>

&#x20;           <input

&#x20;             type={showPassword ? 'text' : 'password'}

&#x20;             value={value}

&#x20;             onChange={(e) => onChangeText(e.target.value)}

&#x20;             placeholder={placeholder}

&#x20;             style={styles.webInput}

&#x20;           />

&#x20;           <button

&#x20;             onClick={toggleShow}

&#x20;             type="button"

&#x20;             style={styles.webPasswordToggle}

&#x20;           >

&#x20;             {showPassword ? '👁️' : '👁️‍🗨️'}

&#x20;           </button>

&#x20;         </View>

&#x20;       </View>

&#x20;     );

&#x20;   }



&#x20;   // Versione MOBILE

&#x20;   return (

&#x20;     <View style={styles.inputContainer}>

&#x20;       <Text style={styles.inputLabel}>{label}</Text>

&#x20;       <View style={styles.passwordInputContainer}>

&#x20;         <TextInput

&#x20;           style={\[styles.input, { paddingRight: 50 }]}

&#x20;           value={value}

&#x20;           onChangeText={onChangeText}

&#x20;           placeholder={placeholder}

&#x20;           secureTextEntry={!showPassword}

&#x20;         />

&#x20;         <TouchableOpacity onPress={toggleShow} style={styles.passwordToggle}>

&#x20;           <Text style={styles.passwordToggleText}>{showPassword ? '🙈' : '👁️'}</Text>

&#x20;         </TouchableOpacity>

&#x20;       </View>

&#x20;     </View>

&#x20;   );

&#x20; }



&#x20; if (!user) {

&#x20;   return (

&#x20;     <SafeAreaView style={styles.container}>

&#x20;       <View style={styles.header}>

&#x20;         <TouchableOpacity onPress={() => navigation.goBack()}>

&#x20;           <Text style={styles.backButton}>← Indietro</Text>

&#x20;         </TouchableOpacity>

&#x20;         <Text style={styles.title}>Il Mio Profilo</Text>

&#x20;         <View style={{ width: 60 }} />

&#x20;       </View>

&#x20;       <View style={styles.loadingContainer}>

&#x20;         <Text style={styles.loadingText}>Caricamento...</Text>

&#x20;       </View>

&#x20;     </SafeAreaView>

&#x20;   );

&#x20; }



&#x20; return (

&#x20;   <SafeAreaView style={styles.container}>

&#x20;     <View style={styles.header}>

&#x20;       <TouchableOpacity onPress={() => navigation.goBack()}>

&#x20;         <Text style={styles.backButton}>← Indietro</Text>

&#x20;       </TouchableOpacity>

&#x20;       <Text style={styles.title}>Il Mio Profilo</Text>

&#x20;       <View style={{ width: 60 }} />

&#x20;     </View>



&#x20;     <ScrollView style={styles.content}>

&#x20;       {/\* Informazioni Utente \*/}

&#x20;       <View style={styles.infoCard}>

&#x20;         <Text style={styles.sectionTitle}>Informazioni Utente</Text>



&#x20;         <View style={styles.infoRow}>

&#x20;           <Text style={styles.label}>Nome</Text>

&#x20;           <Text style={styles.value}>{user?.full\_name || 'N/A'}</Text>

&#x20;         </View>



&#x20;         <View style={styles.infoRow}>

&#x20;           <Text style={styles.label}>Username</Text>

&#x20;           <Text style={styles.value}>{user?.username || 'N/A'}</Text>

&#x20;         </View>



&#x20;         <View style={styles.infoRow}>

&#x20;           <Text style={styles.label}>Ruolo</Text>

&#x20;           <Text style={styles.value}>

&#x20;             {user?.role === 'admin' ? 'Amministratore' : 'Operatore'}

&#x20;           </Text>

&#x20;         </View>



&#x20;         <View style={styles.infoRow}>

&#x20;<Text style={styles.label}>Status</Text>

&#x20;           <Text style={styles.value}>

&#x20;             {user?.approved ? '✅ Approvato' : '⏳ In attesa di approvazione'}

&#x20;           </Text>

&#x20;         </View>

&#x20;       </View>



&#x20;       {/\* Cambio Password \*/}

&#x20;       <View style={styles.passwordCard}>

&#x20;         <Text style={styles.sectionTitle}>Cambia Password</Text>



&#x20;         <PasswordInput

&#x20;           label="Vecchia Password"

&#x20;           value={oldPassword}

&#x20;           onChangeText={setOldPassword}

&#x20;           placeholder="Inserisci vecchia password"

&#x20;           showPassword={showOldPassword}

&#x20;           toggleShow={() => setShowOldPassword(!showOldPassword)}

&#x20;         />



&#x20;         <PasswordInput

&#x20;           label="Nuova Password"

&#x20;           value={newPassword}

&#x20;           onChangeText={setNewPassword}

&#x20;           placeholder="Inserisci nuova password"

&#x20;           showPassword={showNewPassword}

&#x20;           toggleShow={() => setShowNewPassword(!showNewPassword)}

&#x20;         />



&#x20;         <PasswordInput

&#x20;           label="Conferma Nuova Password"

&#x20;           value={confirmPassword}

&#x20;           onChangeText={setConfirmPassword}

&#x20;           placeholder="Conferma nuova password"

&#x20;           showPassword={showConfirmPassword}

&#x20;           toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}

&#x20;         />



&#x20;         <TouchableOpacity

&#x20;           style={\[styles.button, loading \&\& styles.buttonDisabled]}

&#x20;           onPress={handleChangePassword}

&#x20;           disabled={loading}

&#x20;         >

&#x20;           <Text style={styles.buttonText}>

&#x20;             {loading ? 'Aggiornamento...' : 'Cambia Password'}

&#x20;           </Text>

&#x20;         </TouchableOpacity>

&#x20;       </View>



&#x20;       {/\* Footer \*/}

&#x20;       <View style={styles.footer}>

&#x20;         <Text style={styles.footerText}>Creato da Ilario Teotino</Text>

&#x20;       </View>

&#x20;     </ScrollView>

&#x20;   </SafeAreaView>

&#x20; );

}



const styles = StyleSheet.create({

&#x20; container: {

&#x20;   flex: 1,

&#x20;   backgroundColor: '#f5f5f5',

&#x20; },

&#x20; header: {

&#x20;   backgroundColor: '#2D6BA8',

&#x20;   padding: 20,

&#x20;   flexDirection: 'row',

&#x20;   justifyContent: 'space-between',

&#x20;   alignItems: 'center',

&#x20; },

&#x20; backButton: {

&#x20;   color: '#fff',

&#x20;   fontSize: 16,

&#x20; },

&#x20; title: {

&#x20;   color: '#fff',

&#x20;   fontSize: 20,

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; content: {

&#x20;   padding: 20,

&#x20; },

&#x20; loadingContainer: {

&#x20;   flex: 1,

&#x20;   justifyContent: 'center',

&#x20;   alignItems: 'center',

&#x20; },

&#x20; loadingText: {

&#x20;   fontSize: 16,

&#x20;   color: '#666',

&#x20; },

&#x20; infoCard: {

&#x20;   backgroundColor: '#fff',

&#x20;   padding: 20,

&#x20;   borderRadius: 10,

&#x20;   marginBottom: 20,

&#x20;   elevation: 3,

&#x20; },

&#x20; passwordCard: {

&#x20;   backgroundColor: '#fff',

&#x20;   padding: 20,

&#x20;   borderRadius: 10,

&#x20;   marginBottom: 20,

&#x20;   elevation: 3,

&#x20; },

&#x20; sectionTitle: {

&#x20;   fontSize: 18,

&#x20;   fontWeight: 'bold',

&#x20;   color: '#333',

&#x20;   marginBottom: 15,

&#x20; },

&#x20; infoRow: {

&#x20;   flexDirection: 'row',

&#x20;   justifyContent: 'space-between',

&#x20;   marginBottom: 12,

&#x20;   paddingBottom: 12,

&#x20;   borderBottomWidth: 1,

&#x20;   borderBottomColor: '#f0f0f0',

&#x20; },

&#x20; label: {

&#x20;   fontSize: 14,

&#x20;   color: '#666',

&#x20;   fontWeight: '600',

&#x20; },

&#x20; value: {

&#x20;   fontSize: 14,

&#x20;   color: '#333',

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; inputContainer: {

&#x20;   marginBottom: 15,

&#x20; },

&#x20; inputLabel: {

&#x20;   fontSize: 14,

&#x20;   fontWeight: 'bold',

&#x20;   color: '#666',

&#x20;   marginBottom: 8,

&#x20; },

&#x20; input: {

&#x20;   backgroundColor: '#f9f9f9',

&#x20;   borderWidth: 1,

&#x20;   borderColor: '#ddd',

&#x20;   borderRadius: 8,

&#x20;   padding: 15,

&#x20;   fontSize: 16,

&#x20;   color: '#333',

&#x20;   marginBottom: 15,

&#x20; },

&#x20; passwordInputContainer: {

&#x20;   position: 'relative',

&#x20;   marginBottom: 15,

&#x20; },

&#x20; webInput: {

&#x20;   width: '100%',

&#x20;   backgroundColor: '#f9f9f9',

&#x20;   border: '1px solid #ddd',

&#x20;   borderRadius: '8px',

&#x20;   padding: '15px',

&#x20;   paddingRight: '50px',

&#x20;   fontSize: '16px',

&#x20;   boxSizing: 'border-box',

&#x20;   fontFamily: 'System',

&#x20; },

&#x20; webPasswordToggle: {

&#x20;   position: 'absolute',

&#x20;   right: '10px',

&#x20;   top: '50%',

&#x20;   transform: 'translateY(-50%)',

&#x20;   background: 'none',

&#x20;   border: 'none',

&#x20;   cursor: 'pointer',

&#x20;   fontSize: '20px',

&#x20; },

&#x20; passwordToggle: {

&#x20;   position: 'absolute',

&#x20;   right: 15,

&#x20;   top: 15,

&#x20;   zIndex: 1,

&#x20; },

&#x20; passwordToggleText: {

&#x20;   fontSize: 20,

&#x20; },

&#x20; button: {

&#x20;   backgroundColor: '#2D6BA8',

&#x20;   borderRadius: 8,

&#x20;   padding: 15,

&#x20;   alignItems: 'center',

&#x20;   marginTop: 10,

&#x20; },

&#x20; buttonDisabled: {

&#x20;   backgroundColor: '#93B5D1',

&#x20; },

&#x20; buttonText: {

&#x20;   color: '#fff',

&#x20;   fontSize: 16,

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; footer: {

&#x20;   padding: 20,

&#x20;   alignItems: 'center',

&#x20;   backgroundColor: 'transparent',

&#x20;   marginTop: 10,

&#x20; },

&#x20; footerText: {

&#x20;   fontSize: 10,

&#x20;   fontStyle: 'italic',

&#x20;   color: '#999',

&#x20; },

});







**OrderListScreen.js**

import React, { useState, useEffect } from 'react';

import {

&#x20; View,

&#x20; Text,

&#x20; StyleSheet,

&#x20; FlatList,

&#x20; TouchableOpacity,

&#x20; RefreshControl,

} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { getRecentHistory } from '../services/orders';



export default function OrderListScreen({ navigation }) {

&#x20; const \[history, setHistory] = useState(\[]);

&#x20; const \[loading, setLoading] = useState(true);



&#x20; useEffect(() => {

&#x20;   loadHistory();

&#x20; }, \[]);



&#x20; async function loadHistory() {

&#x20;   setLoading(true);

&#x20;   try {

&#x20;     const data = await getRecentHistory(50);

&#x20;     setHistory(data || \[]);

&#x20;   } catch (err) {

&#x20;     console.error('Errore caricamento storico:', err);

&#x20;     setHistory(\[]);

&#x20;   } finally {

&#x20;     setLoading(false);

&#x20;   }

&#x20; }



function renderHistory({ item }) {

&#x20;   const isAdvancement = item.operation\_type === 'avanzamento';

&#x20;   const movementColor = isAdvancement ? '#2D6BA8' : '#E53935';

&#x20;   

&#x20;   // Estrai i dati dell'ordine - gestisce sia array che oggetto singolo

&#x20;   const orderData = Array.isArray(item.order) ? item.order\[0] : item.order;

&#x20;   const orderNumber = orderData?.order\_number || item.order\_number || 'N/A';

&#x20;   const jobNumber = orderData?.job\_number || item.job\_number;

&#x20;   const staccatoNumber = orderData?.staccato\_number || item.staccato\_number;



&#x20;   return (

&#x20;     <View style={styles.historyCard}>

&#x20;       <View style={{ flex: 1 }}>

&#x20;         <Text style={styles.historyTitle}>

&#x20;           Ordine {orderNumber}

&#x20;         </Text>

&#x20;         {jobNumber \&\& (

&#x20;           <Text style={styles.historyDetail}>

&#x20;             JOB: {jobNumber}

&#x20;           </Text>

&#x20;         )}

&#x20;         {staccatoNumber \&\& (

&#x20;           <Text style={styles.historyDetail}>

&#x20;             Staccato: {staccatoNumber}

&#x20;           </Text>

&#x20;         )}



&#x20;         <Text style={\[styles.historyMovement, { color: movementColor }]}>

&#x20;           {item.from\_dept?.name || 'N/A'} → {item.to\_dept?.name || 'N/A'}

&#x20;         </Text>



&#x20;         <Text style={styles.historyDetail}>

&#x20;           Operatore: {item.user?.full\_name || item.user?.username || 'Sconosciuto'}

&#x20;         </Text>



&#x20;         {item.note \&\& (

&#x20;           <Text style={styles.historyNote}>Nota: {item.note}</Text>

&#x20;         )}



&#x20;         <Text style={styles.historyDate}>

&#x20;           {new Date(item.moved\_at).toLocaleString('it-IT')}

&#x20;         </Text>

&#x20;       </View>



&#x20;       <View style={\[styles.typeBadge, { backgroundColor: movementColor }]}>

&#x20;         <Text style={styles.typeText}>

&#x20;           {isAdvancement ? 'Avanzamento' : 'Retrocessione'}

&#x20;         </Text>

&#x20;       </View>

&#x20;     </View>

&#x20;   );

&#x20; }



&#x20; return (

&#x20;   <SafeAreaView style={styles.container}>

&#x20;     <View style={styles.header}>

&#x20;       <TouchableOpacity onPress={() => navigation.goBack()}>

&#x20;         <Text style={styles.backButton}>← Indietro</Text>

&#x20;       </TouchableOpacity>

&#x20;       <Text style={styles.title}>Storico Movimentazioni</Text>

&#x20;       <View style={{ width: 60 }} />

&#x20;     </View>



&#x20;     <FlatList

&#x20;       data={history}

&#x20;       keyExtractor={(item, index) => `${item.id}-${index}`}

&#x20;       renderItem={renderHistory}

&#x20;       contentContainerStyle={styles.listContent}

&#x20;       refreshControl={

&#x20;         <RefreshControl refreshing={loading} onRefresh={loadHistory} />

&#x20;       }

&#x20;       ListEmptyComponent={

&#x20;         <View style={styles.emptyContainer}>

&#x20;           <Text style={styles.emptyIcon}>📋</Text>

&#x20;           <Text style={styles.emptyMessage}>

&#x20;             Nessuna operazione registrata

&#x20;           </Text>

&#x20;         </View>

&#x20;       }

&#x20;     />



&#x20;     <View style={styles.footer}>

&#x20;       <Text style={styles.footerText}>

&#x20;         Creato da Ilario Teotino

&#x20;       </Text>

&#x20;     </View>

&#x20;   </SafeAreaView>

&#x20; );

}



const styles = StyleSheet.create({

&#x20; container: {

&#x20;   flex: 1,

&#x20;   backgroundColor: '#f5f5f5',

&#x20; },

&#x20; header: {

&#x20;   backgroundColor: '#2D6BA8',

&#x20;   padding: 20,

&#x20;   flexDirection: 'row',

&#x20;   justifyContent: 'space-between',

&#x20;   alignItems: 'center',

&#x20; },

&#x20; backButton: {

&#x20;   color: '#fff',

&#x20;   fontSize: 16,

&#x20; },

&#x20; title: {

&#x20;   color: '#fff',

&#x20;   fontSize: 20,

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; listContent: {

&#x20;   padding: 15,

&#x20;   flexGrow: 1,

&#x20; },

&#x20; historyCard: {

&#x20;   backgroundColor: '#fff',

&#x20;   padding: 15,

&#x20;   borderRadius: 10,

&#x20;   marginBottom: 15,

&#x20;   elevation: 3,

&#x20;   flexDirection: 'row',

&#x20;   justifyContent: 'space-between',

&#x20;   alignItems: 'flex-start',

&#x20; },

&#x20; historyTitle: {

&#x20;   fontSize: 18,

&#x20;   fontWeight: 'bold',

&#x20;   color: '#333',

&#x20;   marginBottom: 5,

&#x20; },

&#x20; historyMovement: {

&#x20;   fontSize: 16,

&#x20;   fontWeight: 'bold',

&#x20;   marginBottom: 8,

&#x20; },

&#x20; historyDetail: {

&#x20;   fontSize: 13,

&#x20;   color: '#666',

&#x20;   marginBottom: 3,

&#x20; },

&#x20; historyNote: {

&#x20;   fontSize: 13,

&#x20;   color: '#FF9800',

&#x20;   fontStyle: 'italic',

&#x20;   marginTop: 5,

&#x20;   marginBottom: 5,

&#x20; },

&#x20; historyDate: {

&#x20;   fontSize: 12,

&#x20;   color: '#999',

&#x20;   marginTop: 5,

&#x20; },

&#x20; typeBadge: {

&#x20;   alignSelf: 'flex-start',

&#x20;   paddingHorizontal: 10,

&#x20;   paddingVertical: 5,

&#x20;   borderRadius: 5,

&#x20;   marginVertical: 8,

&#x20;   marginLeft: 10,

&#x20; },

&#x20; typeText: {

&#x20;   color: '#fff',

&#x20;   fontSize: 12,

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; emptyContainer: {

&#x20;   alignItems: 'center',

&#x20;   marginTop: 50,

&#x20; },

&#x20; emptyIcon: {

&#x20;   fontSize: 60,

&#x20;   marginBottom: 10,

&#x20; },

&#x20; emptyMessage: {

&#x20;   fontSize: 16,

&#x20;   color: '#999',

&#x20; },

&#x20; footer: {

&#x20;   padding: 10,

&#x20;   alignItems: 'center',

&#x20;   backgroundColor: 'transparent',

&#x20; },

&#x20; footerText: {

&#x20;   fontSize: 10,

&#x20;   fontStyle: 'italic',

&#x20;   color: '#999',

&#x20; },

});





**LoginScreen.js**

import React, { useState } from 'react';

import {

&#x20; View,

&#x20; TextInput,

&#x20; TouchableOpacity,

&#x20; Text,

&#x20; StyleSheet,

&#x20; ActivityIndicator,

&#x20; ScrollView,

&#x20; Platform,

&#x20; Alert

} from 'react-native';

import { login } from '../services/auth';

import { supabase } from '../services/supabase';



const isWeb = Platform.OS === 'web';



// 🔥 SPOSTATO FUORI - componente separato

function PasswordInput({ value, onChangeText, placeholder, showPassword, setShowPassword }) {

&#x20; if (isWeb) {

&#x20;   // Web

&#x20;   return (

&#x20;     <div style={{ position: 'relative', marginBottom: '15px' }}>

&#x20;       <input

&#x20;         type={showPassword ? 'text' : 'password'}

&#x20;         value={value}

&#x20;         onChange={(e) => onChangeText(e.target.value)}

&#x20;         placeholder={placeholder}

&#x20;         style={{

&#x20;           width: '100%',

&#x20;           borderWidth: '1px',

&#x20;           borderStyle: 'solid',

&#x20;           borderColor: '#ddd',

&#x20;           borderRadius: '8px',

&#x20;           padding: '15px',

&#x20;           paddingRight: '50px',

&#x20;           fontSize: '16px',

&#x20;           backgroundColor: '#f9f9f9',

&#x20;           boxSizing: 'border-box'

&#x20;         }}

&#x20;       />

&#x20;       <button

&#x20;         type="button"

&#x20;         tabIndex={-1}

&#x20;         onMouseDown={(e) => e.preventDefault()}

&#x20;         onClick={() => setShowPassword(!showPassword)}

&#x20;         style={{

&#x20;           position: 'absolute',

&#x20;           right: '10px',

&#x20;           top: '50%',

&#x20;           transform: 'translateY(-50%)',

&#x20;           background: 'none',

&#x20;           border: 'none',

&#x20;           cursor: 'pointer',

&#x20;           fontSize: '20px'

&#x20;         }}

&#x20;       >

&#x20;         {showPassword ? '👁️' : '👁️‍🗨️'}

&#x20;       </button>

&#x20;     </div>

&#x20;   );

&#x20; }



&#x20; // Mobile

&#x20; return (

&#x20;   <View style={{ position: 'relative', marginBottom: 15 }}>

&#x20;     <TextInput

&#x20;       style={{

&#x20;         borderWidth: 1,

&#x20;         borderColor: '#ddd',

&#x20;         borderRadius: 8,

&#x20;         padding: 15,

&#x20;         paddingRight: 50,

&#x20;         fontSize: 16,

&#x20;         backgroundColor: '#f9f9f9',

&#x20;         marginBottom: 0

&#x20;       }}

&#x20;       placeholder={placeholder}

&#x20;       value={value}

&#x20;       onChangeText={onChangeText}

&#x20;       secureTextEntry={!showPassword}

&#x20;     />

&#x20;     <TouchableOpacity

&#x20;       onPress={() => setShowPassword(!showPassword)}

&#x20;       style={{ position: 'absolute', right: 15, top: 15 }}

&#x20;     >

&#x20;       <Text style={{ fontSize: 20 }}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>

&#x20;     </TouchableOpacity>

&#x20;   </View>

&#x20; );

}



export default function LoginScreen({ navigation }) {

&#x20; const \[isRegister, setIsRegister] = useState(false);

&#x20; const \[username, setUsername] = useState('');

&#x20; const \[password, setPassword] = useState('');

&#x20; const \[nome, setNome] = useState('');

&#x20; const \[cognome, setCognome] = useState('');

&#x20; const \[loading, setLoading] = useState(false);

&#x20; const \[showPassword, setShowPassword] = useState(false);



&#x20; const handleLogin = async () => {

&#x20;   if (!username || !password) {

&#x20;     if (isWeb) {

&#x20;       alert('Errore: Inserisci username e password');

&#x20;     } else {

&#x20;       Alert.alert('Errore', 'Inserisci username e password');

&#x20;     }

&#x20;     return;

&#x20;   }



&#x20;   setLoading(true);

&#x20;   try {

&#x20;     const user = await login(username, password);



&#x20;     if (!user.approved \&\& user.role !== 'admin') {

&#x20;       if (isWeb) {

&#x20;         alert('In Attesa: Account da approvare');

&#x20;       } else {

&#x20;         Alert.alert('In Attesa', 'Account da approvare');

&#x20;       }

&#x20;       setLoading(false);

&#x20;       return;

&#x20;     }



&#x20;     navigation.replace('Home');

&#x20;   } catch (error) {

&#x20;     if (isWeb) {

&#x20;       alert(`Errore: ${error.message}`);

&#x20;     } else {

&#x20;       Alert.alert('Errore', error.message);

&#x20;     }

&#x20;   } finally {

&#x20;     setLoading(false);

&#x20;   }

&#x20; };



&#x20; const handleRegister = async () => {

&#x20;   if (!nome || !cognome || !password) {

&#x20;     if (isWeb) {

&#x20;       alert('Errore: Compila tutti i campi');

&#x20;     } else {

&#x20;       Alert.alert('Errore', 'Compila tutti i campi');

&#x20;     }

&#x20;     return;

&#x20;   }



&#x20;   setLoading(true);

&#x20;   try {

&#x20;     const cleanNome = nome.toLowerCase().trim().replace(/\\s+/g, '');

&#x20;     const cleanCognome = cognome.toLowerCase().trim().replace(/\\s+/g, '');

&#x20;     const generatedUsername = `${cleanNome}.${cleanCognome}`;

&#x20;     const fullName = `${nome.trim()} ${cognome.trim()}`;



&#x20;     const { data: existing } = await supabase

&#x20;       .from('profiles')

&#x20;       .select('username')

&#x20;       .eq('username', generatedUsername)

&#x20;       .maybeSingle();



&#x20;     if (existing) {

&#x20;       if (isWeb) {

&#x20;         alert('Errore: Username già in uso');

&#x20;       } else {

&#x20;         Alert.alert('Errore', 'Username già in uso');

&#x20;       }

&#x20;       setLoading(false);

&#x20;       return;

&#x20;     }



&#x20;     const { error } = await supabase.from('profiles').insert(\[

&#x20;       {

&#x20;         username: generatedUsername,

&#x20;         password\_hash: password,

&#x20;         full\_name: fullName,

&#x20;         role: 'operator',

&#x20;         approved: false

&#x20;       }

&#x20;     ]);



&#x20;     if (error) {

&#x20;       if (isWeb) {

&#x20;         alert(`Errore: ${error.message}`);

&#x20;       } else {

&#x20;         Alert.alert('Errore', error.message);

&#x20;       }

&#x20;       setLoading(false);

&#x20;       return;

&#x20;     }



&#x20;     if (isWeb) {

&#x20;       alert('Successo: Account creato. Attendi approvazione da un amministratore.');

&#x20;       setIsRegister(false);

&#x20;       setUsername('');

&#x20;       setPassword('');

&#x20;       setNome('');

&#x20;       setCognome('');

&#x20;     } else {

&#x20;       Alert.alert('Successo', 'Account creato. Attendi approvazione.', \[

&#x20;         {

&#x20;           text: 'OK',

&#x20;           onPress: () => {

&#x20;             setIsRegister(false);

&#x20;             setUsername('');

&#x20;             setPassword('');

&#x20;             setNome('');

&#x20;             setCognome('');

&#x20;           }

&#x20;         }

&#x20;       ]);

&#x20;     }

&#x20;   } catch (error) {

&#x20;     if (isWeb) {

&#x20;       alert(`Errore: ${error.toString()}`);

&#x20;     } else {

&#x20;       Alert.alert('Errore', error.toString());

&#x20;     }

&#x20;   } finally {

&#x20;     setLoading(false);

&#x20;   }

&#x20; };



&#x20; return (

&#x20;   <ScrollView contentContainerStyle={styles.container}>

&#x20;     <View style={styles.card}>

&#x20;       <Text style={styles.title}>3DnA OdL Tracking</Text>



&#x20;       <View style={styles.tabsContainer}>

&#x20;         <TouchableOpacity

&#x20;           style={\[styles.tab, !isRegister \&\& styles.tabActive]}

&#x20;           onPress={() => setIsRegister(false)}

&#x20;         >

&#x20;           <Text style={\[styles.tabText, !isRegister \&\& styles.tabTextActive]}>Login</Text>

&#x20;         </TouchableOpacity>



&#x20;         <TouchableOpacity

&#x20;           style={\[styles.tab, isRegister \&\& styles.tabActive]}

&#x20;           onPress={() => setIsRegister(true)}

&#x20;         >

&#x20;           <Text style={\[styles.tabText, isRegister \&\& styles.tabTextActive]}>Registrati</Text>

&#x20;         </TouchableOpacity>

&#x20;       </View>



&#x20;       {isRegister ? (

&#x20;         <>

&#x20;           <TextInput

&#x20;             style={styles.input}

&#x20;             placeholder="Nome"

&#x20;             value={nome}

&#x20;             onChangeText={(t) => {

&#x20;               setNome(t);

&#x20;               if (t \&\& cognome) {

&#x20;                 const cleanNome = t.toLowerCase().trim().replace(/\\s+/g, '');

&#x20;                 const cleanCognome = cognome.toLowerCase().trim().replace(/\\s+/g, '');

&#x20;                 setUsername(`${cleanNome}.${cleanCognome}`);

&#x20;               }

&#x20;             }}

&#x20;           />



&#x20;           <TextInput

&#x20;             style={styles.input}

&#x20;             placeholder="Cognome"

&#x20;             value={cognome}

&#x20;             onChangeText={(t) => {

&#x20;               setCognome(t);

&#x20;               if (nome \&\& t) {

&#x20;                 const cleanNome = nome.toLowerCase().trim().replace(/\\s+/g, '');

&#x20;                 const cleanCognome = t.toLowerCase().trim().replace(/\\s+/g, '');

&#x20;                 setUsername(`${cleanNome}.${cleanCognome}`);

&#x20;               }

&#x20;             }}

&#x20;           />



&#x20;           <TextInput

&#x20;             style={\[styles.input, styles.usernameGenerated]}

&#x20;             placeholder="Username (generato automaticamente)"

&#x20;             value={username}

&#x20;             editable={false}

&#x20;           />



&#x20;           {/\* 🔥 PASSA setShowPassword come prop \*/}

&#x20;           <PasswordInput

&#x20;             value={password}

&#x20;             onChangeText={setPassword}

&#x20;             placeholder="Password"

&#x20;             showPassword={showPassword}

&#x20;             setShowPassword={setShowPassword}

&#x20;           />

&#x20;         </>

&#x20;       ) : (

&#x20;         <>

&#x20;           <TextInput

&#x20;             style={styles.input}

&#x20;             placeholder="Username"

&#x20;             value={username}

&#x20;             onChangeText={setUsername}

&#x20;             autoCapitalize="none"

&#x20;           />



&#x20;           {/\* 🔥 PASSA setShowPassword come prop \*/}

&#x20;           <PasswordInput

&#x20;             value={password}

&#x20;             onChangeText={setPassword}

&#x20;             placeholder="Password"

&#x20;             showPassword={showPassword}

&#x20;             setShowPassword={setShowPassword}

&#x20;           />

&#x20;         </>

&#x20;       )}



&#x20;       <TouchableOpacity

&#x20;         style={\[styles.button, loading \&\& styles.buttonDisabled]}

&#x20;         onPress={isRegister ? handleRegister : handleLogin}

&#x20;         disabled={loading}

&#x20;       >

&#x20;         {loading ? (

&#x20;           <ActivityIndicator color="#fff" />

&#x20;         ) : (

&#x20;           <Text style={styles.buttonText}>{isRegister ? 'Registrati' : 'Login'}</Text>

&#x20;         )}

&#x20;       </TouchableOpacity>

&#x20;     </View>



&#x20;     <View style={styles.footer}>

&#x20;       <Text style={styles.footerText}>Created by Ilario Teotino</Text>

&#x20;     </View>

&#x20;   </ScrollView>

&#x20; );

}



const styles = StyleSheet.create({

&#x20; container: { flexGrow: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', padding: 20 },

&#x20; card: { backgroundColor: '#fff', borderRadius: 10, padding: 30, elevation: 5 },

&#x20; title: { fontSize: 24, fontWeight: 'bold', color: '#2D6BA8', textAlign: 'center', marginBottom: 20 },

&#x20; tabsContainer: { flexDirection: 'row', marginBottom: 20, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#2D6BA8' },

&#x20; tab: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#fff' },

&#x20; tabActive: { backgroundColor: '#2D6BA8' },

&#x20; tabText: { fontSize: 14, fontWeight: 'bold', color: '#2D6BA8' },

&#x20; tabTextActive: { color: '#fff' },

&#x20; input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16, backgroundColor: '#f9f9f9' },

&#x20; usernameGenerated: { backgroundColor: '#E3F2FD', color: '#666' },

&#x20; button: { backgroundColor: '#2D6BA8', borderRadius: 8, padding: 15, alignItems: 'center', marginTop: 10 },

&#x20; buttonDisabled: { backgroundColor: '#93B5D1' },

&#x20; buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

&#x20; footer: { padding: 20, alignItems: 'center', backgroundColor: 'transparent', marginTop: 10 },

&#x20; footerText: { fontSize: 10, fontStyle: 'italic', color: '#999' }

});







**HomeScreen.js**



import React, { useEffect, useState } from 'react';

import {

&#x20; View,

&#x20; Text,

&#x20; TouchableOpacity,

&#x20; StyleSheet,

&#x20; ScrollView,

&#x20; Alert,

&#x20; Platform,

} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { getCurrentUser, logout, isAdmin } from '../services/auth';



const isWeb = Platform.OS === 'web';



// Helper functions per alert

const alertErrore = (title, message = '') => {

&#x20; if (isWeb) {

&#x20;   alert(`${title}: ${message}`);

&#x20; } else {

&#x20;   Alert.alert(title, message);

&#x20; }

};



const alertSuccesso = (title, message = '') => {

&#x20; if (isWeb) {

&#x20;   alert(`${title}: ${message}`);

&#x20; } else {

&#x20;   Alert.alert(title, message);

&#x20; }

};



export default function HomeScreen({ navigation }) {

&#x20; const \[user, setUser] = useState(null);

&#x20; const \[admin, setAdmin] = useState(false);



&#x20; useEffect(() => {

&#x20;   loadUser();

&#x20; }, \[]);



&#x20; const loadUser = async () => {

&#x20;   try {

&#x20;     const currentUser = await getCurrentUser();

&#x20;     setUser(currentUser);



&#x20;     const isAdminUser = await isAdmin();

&#x20;     setAdmin(isAdminUser);

&#x20;   } catch (error) {

&#x20;     console.error('Errore caricamento utente:', error);

&#x20;     alertErrore('Errore', 'Impossibile caricare il profilo');

&#x20;   }

&#x20; };



&#x20; const handleLogout = async () => {

&#x20;   try {

&#x20;     await logout();

&#x20;     navigation.replace('Login');

&#x20;     alertSuccesso('Arrivederci', 'Logout completato');

&#x20;   } catch (error) {

&#x20;     console.error('Errore logout:', error);

&#x20;     alertErrore('Errore', 'Impossibile eseguire il logout');

&#x20;   }

&#x20; };



&#x20; const menuItems = \[

&#x20;   {

&#x20;     title: 'Traccia Ordine',

&#x20;     description: 'Gestisci movimentazioni ODL/JOB/Staccato',

&#x20;     icon: '📦',

&#x20;     color: '#007AFF',

&#x20;     action: () => navigation.navigate('TrackOrder'),

&#x20;   },

&#x20;   {

&#x20;     title: 'Storico Movimenti',

&#x20;     description: 'Visualizza la cronologia degli ordini',

&#x20;     icon: '📋',

&#x20;     color: '#34C759',

&#x20;     action: () => navigation.navigate('OrderHistory'),

&#x20;   },

&#x20;   {

&#x20;     title: 'Il Mio Profilo',

&#x20;     description: 'Gestisci il tuo account e password',

&#x20;     icon: '👤',

&#x20;     color: '#FF9500',

&#x20;     action: () => navigation.navigate('Profile'),

&#x20;   },

&#x20; ];



&#x20; // Menu admin

&#x20; if (admin) {

&#x20;   menuItems.push(

&#x20;     {

&#x20;       title: 'Gestione Reparti',

&#x20;       description: 'Crea e modifica reparti',

&#x20;       icon: '🏭',

&#x20;       color: '#5856D6',

&#x20;       action: () => navigation.navigate('Departments'),

&#x20;     },

&#x20;     {

&#x20;       title: 'Gestione Utenti',

&#x20;       description: 'Approva utenti e gestisci ruoli',

&#x20;       icon: '👥',

&#x20;       color: '#E53935',

&#x20;       action: () => navigation.navigate('AdminPanel'),

&#x20;     }

&#x20;   );

&#x20; }



&#x20; if (!user) {

&#x20;   return (

&#x20;     <SafeAreaView style={styles.container}>

&#x20;       <View style={styles.loadingContainer}>

&#x20;         <Text style={styles.loadingText}>Caricamento...</Text>

&#x20;       </View>

&#x20;     </SafeAreaView>

&#x20;   );

&#x20; }



&#x20; return (

&#x20;   <SafeAreaView style={styles.container}>

&#x20;     <View style={styles.header}>

&#x20;       <Text style={styles.headerTitle}>3DnA Production Tracking</Text>

&#x20;       <Text style={styles.headerSubtitle}>Benvenuto, {user?.full\_name}</Text>

&#x20;     </View>



&#x20;     <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

&#x20;       {/\* User Info Card \*/}

&#x20;       <View style={styles.userInfoCard}>

&#x20;         <Text style={styles.userInfoText}>

&#x20;           Ruolo: {user?.role === 'admin' ? '👑 Amministratore' : '👨‍💼 Operatore'}

&#x20;         </Text>

&#x20;         <Text style={styles.userInfoText}>

&#x20;           Status: {user?.approved ? '✅ Approvato' : '⏳ In attesa'}

&#x20;         </Text>

&#x20;       </View>



&#x20;       {/\* Menu Items \*/}

&#x20;       {menuItems.map((item, index) => (

&#x20;         <TouchableOpacity

&#x20;           key={index}

&#x20;           style={styles.menuCard}

&#x20;           onPress={item.action}

&#x20;         >

&#x20;           <View style={\[styles.iconContainer, { backgroundColor: item.color }]}>

&#x20;             <Text style={styles.icon}>{item.icon}</Text>

&#x20;           </View>

&#x20;           <View style={styles.menuContent}>

&#x20;             <Text style={styles.menuTitle}>{item.title}</Text>

&#x20;             <Text style={styles.menuDescription}>{item.description}</Text>

&#x20;           </View>

&#x20;           <Text style={styles.arrow}>→</Text>

&#x20;         </TouchableOpacity>

&#x20;       ))}



&#x20;       {/\* Logout Button \*/}

&#x20;       <TouchableOpacity

&#x20;         style={styles.logoutButton}

&#x20;         onPress={handleLogout}

&#x20;       >

&#x20;         <Text style={styles.logoutButtonText}>Esci</Text>

&#x20;       </TouchableOpacity>



&#x20;       {/\* Footer \*/}

&#x20;       <View style={styles.footer}>

&#x20;         <Text style={styles.footerText}>v2.0 - Creato da Ilario Teotino</Text>

&#x20;         <Text style={styles.footerText}>3DnA Production Tracking System</Text>

&#x20;       </View>

&#x20;     </ScrollView>

&#x20;   </SafeAreaView>

&#x20; );

}



const styles = StyleSheet.create({

&#x20; container: {

&#x20;   flex: 1,

&#x20;   backgroundColor: '#f5f5f5',

&#x20; },

&#x20; header: {

&#x20;   backgroundColor: '#2D6BA8',

&#x20;   padding: 20,

&#x20;   paddingTop: 30,

&#x20;   paddingBottom: 30,

&#x20; },

&#x20; headerTitle: {

&#x20;   fontSize: 28,

&#x20;   fontWeight: 'bold',

&#x20;   color: '#fff',

&#x20;   marginBottom: 5,

&#x20; },

&#x20; headerSubtitle: {

&#x20;   fontSize: 16,

&#x20;   color: '#E0E7FF',

&#x20; },

&#x20; loadingContainer: {

&#x20;   flex: 1,

&#x20;   justifyContent: 'center',

&#x20;   alignItems: 'center',

&#x20; },

&#x20; loadingText: {

&#x20;   fontSize: 16,

&#x20;   color: '#666',

&#x20; },

&#x20; content: {

&#x20;   padding: 20,

&#x20; },

&#x20; userInfoCard: {

&#x20;   backgroundColor: '#fff',

&#x20;   padding: 15,

&#x20;   borderRadius: 10,

&#x20;   marginBottom: 20,

&#x20;   borderLeftWidth: 4,

&#x20;   borderLeftColor: '#2D6BA8',

&#x20;   elevation: 2,

&#x20; },

&#x20; userInfoText: {

&#x20;   fontSize: 14,

&#x20;   color: '#333',

&#x20;   marginBottom: 8,

&#x20;   fontWeight: '500',

&#x20; },

&#x20; menuCard: {

&#x20;   backgroundColor: '#fff',

&#x20;   padding: 15,

&#x20;   borderRadius: 10,

&#x20;   marginBottom: 15,

&#x20;   flexDirection: 'row',

&#x20;   alignItems: 'center',

&#x20;   elevation: 3,

&#x20;   shadowColor: '#000',

&#x20;   shadowOffset: { width: 0, height: 2 },

&#x20;   shadowOpacity: 0.1,

&#x20;   shadowRadius: 3,

&#x20; },

&#x20; iconContainer: {

&#x20;   width: 60,

&#x20;   height: 60,

&#x20;   borderRadius: 30,

&#x20;   justifyContent: 'center',

&#x20;   alignItems: 'center',

&#x20;   marginRight: 15,

&#x20; },

&#x20; icon: {

&#x20;   fontSize: 28,

&#x20; },

&#x20; menuContent: {

&#x20;   flex: 1,

&#x20; },

&#x20; menuTitle: {

&#x20;   fontSize: 16,

&#x20;   fontWeight: 'bold',

&#x20;   color: '#333',

&#x20;   marginBottom: 5,

&#x20; },

&#x20; menuDescription: {

&#x20;   fontSize: 13,

&#x20;   color: '#666',

&#x20; },

&#x20; arrow: {

&#x20;   fontSize: 20,

&#x20;   color: '#2D6BA8',

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; logoutButton: {

&#x20;   backgroundColor: '#FF3B30',

&#x20;   padding: 16,

&#x20;   borderRadius: 10,

&#x20;   alignItems: 'center',

&#x20;   marginTop: 20,

&#x20;   marginBottom: 20,

&#x20;   elevation: 3,

&#x20; },

&#x20; logoutButtonText: {

&#x20;   color: '#fff',

&#x20;   fontSize: 16,

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; footer: {

&#x20;   padding: 20,

&#x20;   alignItems: 'center',

&#x20;   borderTopWidth: 1,

&#x20;   borderTopColor: '#e0e0e0',

&#x20;   marginTop: 20,

&#x20; },

&#x20; footerText: {

&#x20;   fontSize: 12,

&#x20;   color: '#999',

&#x20;   marginBottom: 5,

&#x20;   fontStyle: 'italic',

&#x20; },

});





**DepartmentsScreen.js**

import React, { useState, useEffect } from 'react';

import {

&#x20; View,

&#x20; Text,

&#x20; TextInput,

&#x20; TouchableOpacity,

&#x20; StyleSheet,

&#x20; ScrollView,

&#x20; Platform,

&#x20; Alert,

} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '../services/supabase';



const isWeb = Platform.OS === 'web';



// Helper functions per alert cross-platform

const alertErrore = (title, message = '') => {

&#x20; if (isWeb) {

&#x20;   alert(`${title}: ${message}`);

&#x20; } else {

&#x20;   Alert.alert(title, message);

&#x20; }

};



const alertSuccesso = (title, message = '') => {

&#x20; if (isWeb) {

&#x20;   alert(`${title}: ${message}`);

&#x20; } else {

&#x20;   Alert.alert(title, message);

&#x20; }

};



export default function DepartmentsScreen({ navigation }) {

&#x20; const \[departments, setDepartments] = useState(\[]);

&#x20; const \[newDeptName, setNewDeptName] = useState('');

&#x20; const \[loading, setLoading] = useState(false);



&#x20; useEffect(() => {

&#x20;   loadDepartments();

&#x20; }, \[]);



&#x20; async function loadDepartments() {

&#x20;   try {

&#x20;     setLoading(true);

&#x20;     const { data, error } = await supabase

&#x20;       .from('departments')

&#x20;       .select('\*')

&#x20;       .order('order\_position', { ascending: true });



&#x20;     if (error) throw error;

&#x20;     setDepartments(data || \[]);

&#x20;   } catch (err) {

&#x20;     alertErrore('Errore', err.message);

&#x20;   } finally {

&#x20;     setLoading(false);

&#x20;   }

&#x20; }



&#x20; async function addDepartment() {

&#x20;   if (!newDeptName.trim()) {

&#x20;     alertErrore('Errore', 'Inserisci un nome reparto');

&#x20;     return;

&#x20;   }



&#x20;   try {

&#x20;     const maxOrder =

&#x20;       departments.length > 0

&#x20;         ? Math.max(...departments.map((d) => d.order\_position || 0))

&#x20;         : 0;



&#x20;     const { error } = await supabase.from('departments').insert(\[

&#x20;       {

&#x20;         name: newDeptName.trim(),

&#x20;         order\_position: maxOrder + 1,

&#x20;       },

&#x20;     ]);



&#x20;     if (error) throw error;



&#x20;     alertSuccesso('Successo', 'Reparto aggiunto con successo!');

&#x20;     setNewDeptName('');

&#x20;     loadDepartments();

&#x20;   } catch (err) {

&#x20;     alertErrore('Errore', err.message);

&#x20;   }

&#x20; }



&#x20; async function deleteDepartment(id, name) {

&#x20;   if (isWeb) {

&#x20;     const confirmed = window.confirm(`Eliminare il reparto "${name}"?`);

&#x20;     if (!confirmed) return;

&#x20;     await performDelete(id, name);

&#x20;   } else {

&#x20;     Alert.alert('Conferma Eliminazione', `Eliminare il reparto "${name}"?`, \[

&#x20;       { text: 'Annulla', style: 'cancel' },

&#x20;       {

&#x20;         text: 'Elimina',

&#x20;         style: 'destructive',

&#x20;         onPress: () => performDelete(id, name),

&#x20;       },

&#x20;     ]);

&#x20;   }

&#x20; }



&#x20; async function performDelete(id, name) {

&#x20;   try {

&#x20;     const { error } = await supabase

&#x20;       .from('departments')

&#x20;       .delete()

&#x20;       .eq('id', id);



&#x20;     if (error) throw error;



&#x20;     alertSuccesso('Successo', `Reparto "${name}" eliminato!`);

&#x20;     loadDepartments();

&#x20;   } catch (err) {

&#x20;     alertErrore('Errore', err.message);

&#x20;   }

&#x20; }



&#x20; return (

&#x20;   <SafeAreaView style={styles.container}>

&#x20;     <View style={styles.header}>

&#x20;       <TouchableOpacity onPress={() => navigation.goBack()}>

&#x20;         <Text style={styles.backButton}>← Indietro</Text>

&#x20;       </TouchableOpacity>

&#x20;       <Text style={styles.title}>Gestione Reparti</Text>

&#x20;       <View style={{ width: 60 }} />

&#x20;     </View>



&#x20;     <ScrollView style={styles.content}>

&#x20;       <View style={styles.addBox}>

&#x20;         <TextInput

&#x20;           style={styles.input}

&#x20;           placeholder="Nome nuovo reparto"

&#x20;           value={newDeptName}

&#x20;           onChangeText={setNewDeptName}

&#x20;         />

&#x20;         <TouchableOpacity style={styles.addButton} onPress={addDepartment}>

&#x20;           <Text style={styles.addButtonText}>Aggiungi</Text>

&#x20;         </TouchableOpacity>

&#x20;       </View>



&#x20;       {departments.map((dept, index) => (

&#x20;         <View key={dept.id} style={styles.deptCard}>

&#x20;           <View style={styles.deptInfo}>

&#x20;             <Text style={styles.deptOrder}>{index + 1}</Text>

&#x20;             <Text style={styles.deptName}>{dept.name}</Text>

&#x20;           </View>

&#x20;           <TouchableOpacity

&#x20;             style={styles.deleteButton}

&#x20;             onPress={() => deleteDepartment(dept.id, dept.name)}

&#x20;           >

&#x20;             <Text style={styles.deleteButtonText}>🗑️</Text>

&#x20;           </TouchableOpacity>

&#x20;         </View>

&#x20;       ))}



&#x20;       {departments.length === 0 \&\& (

&#x20;         <View style={styles.emptyState}>

&#x20;           <Text style={styles.emptyText}>Nessun reparto configurato</Text>

&#x20;         </View>

&#x20;       )}

&#x20;     </ScrollView>

&#x20;   </SafeAreaView>

&#x20; );

}



const styles = StyleSheet.create({

&#x20; container: {

&#x20;   flex: 1,

&#x20;   backgroundColor: '#f5f5f5',

&#x20; },

&#x20; header: {

&#x20;   backgroundColor: '#2D6BA8',

&#x20;   padding: 20,

&#x20;   flexDirection: 'row',

&#x20;   justifyContent: 'space-between',

&#x20;   alignItems: 'center',

&#x20; },

&#x20; backButton: {

&#x20;   color: '#fff',

&#x20;   fontSize: 16,

&#x20; },

&#x20; title: {

&#x20;   color: '#fff',

&#x20;   fontSize: 20,

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; content: {

&#x20;   padding: 20,

&#x20; },

&#x20; addBox: {

&#x20;   flexDirection: 'row',

&#x20;   gap: 10,

&#x20;   marginBottom: 20,

&#x20; },

&#x20; input: {

&#x20;   flex: 1,

&#x20;   backgroundColor: '#fff',

&#x20;   padding: 15,

&#x20;   borderRadius: 10,

&#x20;   fontSize: 16,

&#x20;   borderWidth: 1,

&#x20;   borderColor: '#ddd',

&#x20; },

&#x20; addButton: {

&#x20;   backgroundColor: '#4CAF50',

&#x20;   padding: 15,

&#x20;   borderRadius: 10,

&#x20;   justifyContent: 'center',

&#x20; },

&#x20; addButtonText: {

&#x20;   color: '#fff',

&#x20;   fontSize: 16,

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; deptCard: {

&#x20;   backgroundColor: '#fff',

&#x20;   padding: 15,

&#x20;   borderRadius: 10,

&#x20;   marginBottom: 10,

&#x20;   flexDirection: 'row',

&#x20;   justifyContent: 'space-between',

&#x20;   alignItems: 'center',

&#x20;   elevation: 2,

&#x20; },

&#x20; deptInfo: {

&#x20;   flexDirection: 'row',

&#x20;   alignItems: 'center',

&#x20;   flex: 1,

&#x20; },

&#x20; deptOrder: {

&#x20;   backgroundColor: '#2D6BA8',

&#x20;   color: '#fff',

&#x20;   width: 30,

&#x20;   height: 30,

&#x20;   borderRadius: 15,

&#x20;   textAlign: 'center',

&#x20;   lineHeight: 30,

&#x20;   fontWeight: 'bold',

&#x20;   marginRight: 15,

&#x20; },

&#x20; deptName: {

&#x20;   fontSize: 16,

&#x20;   fontWeight: 'bold',

&#x20;   color: '#333',

&#x20; },

&#x20; deleteButton: {

&#x20;   padding: 10,

&#x20; },

&#x20; deleteButtonText: {

&#x20;   fontSize: 24,

&#x20; },

&#x20; emptyState: {

&#x20;   alignItems: 'center',

&#x20;   marginTop: 50,

&#x20; },

&#x20; emptyText: {

&#x20;   fontSize: 16,

&#x20;   color: '#999',

&#x20; },

});







**AdminPanel.js**



import React, { useState, useEffect } from 'react';

import {

&#x20; View,

&#x20; Text,

&#x20; TouchableOpacity,

&#x20; StyleSheet,

&#x20; FlatList,

&#x20; Platform,

&#x20; Alert,

&#x20; Modal,

} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '../services/supabase';

import { logout } from '../services/auth';



const isWeb = Platform.OS === 'web';



// Helper functions per alert cross-platform

const alertErrore = (title, message = '') => {

&#x20; if (isWeb) {

&#x20;   alert(`${title}: ${message}`);

&#x20; } else {

&#x20;   Alert.alert(title, message);

&#x20; }

};



const alertSuccesso = (title, message = '') => {

&#x20; if (isWeb) {

&#x20;   alert(`${title}: ${message}`);

&#x20; } else {

&#x20;   Alert.alert(title, message);

&#x20; }

};



export default function AdminPanel({ navigation }) {

&#x20; const \[pendingUsers, setPendingUsers] = useState(\[]);

&#x20; const \[approvedUsers, setApprovedUsers] = useState(\[]);

&#x20; const \[activeTab, setActiveTab] = useState('pending');

&#x20; const \[showRoleModal, setShowRoleModal] = useState(false);

&#x20; const \[selectedUserId, setSelectedUserId] = useState(null);

&#x20; const \[loading, setLoading] = useState(false);



&#x20; useEffect(() => {

&#x20;   const unsubscribe = navigation.addListener('focus', () => {

&#x20;     loadData();

&#x20;   });

&#x20;   return unsubscribe;

&#x20; }, \[navigation]);



&#x20; async function loadData() {

&#x20;   try {

&#x20;     setLoading(true);



&#x20;     // Carica utenti in attesa di approvazione

&#x20;     const { data: pendingData, error: pendingError } = await supabase

&#x20;       .from('profiles')

&#x20;       .select('\*')

&#x20;       .eq('approved', false)

&#x20;       .neq('role', 'admin');



&#x20;     if (pendingError) throw pendingError;

&#x20;     setPendingUsers(pendingData || \[]);



&#x20;     // Carica utenti approvati

&#x20;     const { data: approvedData, error: approvedError } = await supabase

&#x20;       .from('profiles')

&#x20;       .select('\*')

&#x20;       .eq('approved', true);



&#x20;     if (approvedError) throw approvedError;

&#x20;     setApprovedUsers(approvedData || \[]);

&#x20;   } catch (err) {

&#x20;     alertErrore('Errore caricamento dati', err.message);

&#x20;   } finally {

&#x20;     setLoading(false);

&#x20;   }

&#x20; }



&#x20; async function approveUser(userId) {

&#x20;   if (isWeb) {

&#x20;     setSelectedUserId(userId);

&#x20;     setShowRoleModal(true);

&#x20;   } else {

&#x20;     Alert.alert('Scegli Ruolo', 'Che ruolo vuoi assegnare a questo utente?', \[

&#x20;       { text: 'Annulla', style: 'cancel' },

&#x20;       {

&#x20;         text: 'Operatore',

&#x20;         onPress: () => approveWithRole(userId, 'operator'),

&#x20;       },

&#x20;       {

&#x20;         text: 'Amministratore',

&#x20;         onPress: () => approveWithRole(userId, 'admin'),

&#x20;       },

&#x20;     ]);

&#x20;   }

&#x20; }



&#x20; async function approveWithRole(userId, role) {

&#x20;   setShowRoleModal(false);



&#x20;   try {

&#x20;     const { error } = await supabase

&#x20;       .from('profiles')

&#x20;       .update({ approved: true, role: role })

&#x20;       .eq('id', userId);



&#x20;     if (error) throw error;



&#x20;     const roleLabel = role === 'admin' ? 'Amministratore' : 'Operatore';

&#x20;     alertSuccesso('Successo', `Utente approvato come ${roleLabel}`);

&#x20;     loadData();

&#x20;   } catch (err) {

&#x20;     alertErrore('Errore', err.message);

&#x20;   }

&#x20; }



&#x20; async function rejectUser(userId) {

&#x20;   if (isWeb) {

&#x20;     const confirmed = window.confirm('Eliminare questa richiesta?');

&#x20;     if (!confirmed) return;

&#x20;     await performReject(userId);

&#x20;   } else {

&#x20;     Alert.alert('Conferma', 'Eliminare questa richiesta?', \[

&#x20;       { text: 'Annulla', style: 'cancel' },

&#x20;       {

&#x20;         text: 'Elimina',

&#x20;         style: 'destructive',

&#x20;         onPress: () => performReject(userId),

&#x20;       },

&#x20;     ]);

&#x20;   }

&#x20; }



&#x20; async function performReject(userId) {

&#x20;   try {

&#x20;     const { error } = await supabase

&#x20;       .from('profiles')

&#x20;       .delete()

&#x20;       .eq('id', userId);



&#x20;     if (error) throw error;



&#x20;     alertSuccesso('Successo', 'Richiesta eliminata');

&#x20;     loadData();

&#x20;   } catch (err) {

&#x20;     alertErrore('Errore', err.message);

&#x20;   }

&#x20; }



&#x20; async function deleteUser(userId) {

&#x20;   if (isWeb) {

&#x20;     const confirmed = window.confirm('Eliminare questo utente?');

&#x20;     if (!confirmed) return;

&#x20;     await performDelete(userId);

&#x20;   } else {

&#x20;     Alert.alert('Conferma', 'Eliminare questo utente?', \[

&#x20;       { text: 'Annulla', style: 'cancel' },

&#x20;       {

&#x20;         text: 'Elimina',

&#x20;         style: 'destructive',

&#x20;         onPress: () => performDelete(userId),

&#x20;       },

&#x20;     ]);

&#x20;   }

&#x20; }



&#x20; async function performDelete(userId) {

&#x20;   try {

&#x20;     const { error } = await supabase

&#x20;       .from('profiles')

&#x20;       .delete()

&#x20;       .eq('id', userId);



&#x20;     if (error) throw error;



&#x20;     alertSuccesso('Successo', 'Utente eliminato');

&#x20;     loadData();

&#x20;   } catch (err) {

&#x20;     alertErrore('Errore', err.message);

&#x20;   }

&#x20; }



&#x20; async function changeUserRole(userId, currentRole) {

&#x20;   const newRole = currentRole === 'admin' ? 'operator' : 'admin';

&#x20;   const roleLabel = newRole === 'admin' ? 'Amministratore' : 'Operatore';



&#x20;   if (isWeb) {

&#x20;     const confirmed = window.confirm(`Cambiare ruolo a ${roleLabel}?`);

&#x20;     if (!confirmed) return;

&#x20;     await performChangeRole(userId, newRole, roleLabel);

&#x20;   } else {

&#x20;     Alert.alert('Conferma', `Cambiare ruolo a ${roleLabel}?`, \[

&#x20;       { text: 'Annulla', style: 'cancel' },

&#x20;       {

&#x20;         text: 'Conferma',

&#x20;         onPress: () => performChangeRole(userId, newRole, roleLabel),

&#x20;       },

&#x20;     ]);

&#x20;   }

&#x20; }



&#x20; async function performChangeRole(userId, newRole, roleLabel) {

&#x20;   try {

&#x20;     const { error } = await supabase

&#x20;       .from('profiles')

&#x20;       .update({ role: newRole })

&#x20;       .eq('id', userId);



&#x20;     if (error) throw error;



&#x20;     alertSuccesso('Successo', `Ruolo cambiato a ${roleLabel}`);

&#x20;     loadData();

&#x20;   } catch (err) {

&#x20;     alertErrore('Errore', err.message);

&#x20;   }

&#x20; }



&#x20; async function handleLogout() {

&#x20;   await logout();

&#x20;   navigation.replace('Login');

&#x20; }



&#x20; function renderPendingUser({ item }) {

&#x20;   return (

&#x20;     <View style={styles.userCard}>

&#x20;       <View style={styles.userInfo}>

&#x20;         <Text style={styles.userName}>{item.username}</Text>

&#x20;         <Text style={styles.userDetail}>{item.full\_name}</Text>

&#x20;         <View style={styles.pendingBadge}>

&#x20;           <Text style={styles.badgeText}>In Attesa</Text>

&#x20;         </View>

&#x20;       </View>

&#x20;       <View style={styles.actions}>

&#x20;         <TouchableOpacity

&#x20;           style={styles.approveButton}

&#x20;           onPress={() => approveUser(item.id)}

&#x20;         >

&#x20;           <Text style={styles.buttonText}>✓</Text>

&#x20;         </TouchableOpacity>

&#x20;         <TouchableOpacity

&#x20;           style={styles.rejectButton}

&#x20;           onPress={() => rejectUser(item.id)}

&#x20;         >

&#x20;           <Text style={styles.buttonText}>✕</Text>

&#x20;         </TouchableOpacity>

&#x20;       </View>

&#x20;     </View>

&#x20;   );

&#x20; }



&#x20; function renderApprovedUser({ item }) {

&#x20;   return (

&#x20;     <View style={styles.userCard}>

&#x20;       <View style={styles.userInfo}>

&#x20;         <Text style={styles.userName}>{item.username}</Text>

&#x20;         <Text style={styles.userDetail}>{item.full\_name}</Text>

&#x20;         <View

&#x20;           style={\[

&#x20;             styles.badge,

&#x20;             item.role === 'admin' ? styles.adminBadge : styles.operatorBadge,

&#x20;           ]}

&#x20;         >

&#x20;           <Text style={styles.badgeText}>

&#x20;             {item.role === 'admin' ? 'Admin' : 'Operatore'}

&#x20;           </Text>

&#x20;         </View>

&#x20;       </View>

&#x20;       <View style={styles.actions}>

&#x20;         <TouchableOpacity

&#x20;           style={styles.changeRoleButton}

&#x20;           onPress={() => changeUserRole(item.id, item.role)}

&#x20;         >

&#x20;           <Text style={styles.buttonText}>🔄</Text>

&#x20;         </TouchableOpacity>

&#x20;         <TouchableOpacity

&#x20;           style={styles.deleteButton}

&#x20;           onPress={() => deleteUser(item.id)}

&#x20;         >

&#x20;           <Text style={styles.buttonText}>🗑️</Text>

&#x20;         </TouchableOpacity>

&#x20;       </View>

&#x20;     </View>

&#x20;   );

&#x20; }



&#x20; return (

&#x20;   <SafeAreaView style={styles.container}>

&#x20;     <View style={styles.header}>

&#x20;       <TouchableOpacity onPress={() => navigation.goBack()}>

&#x20;         <Text style={styles.backButton}>← Indietro</Text>

&#x20;       </TouchableOpacity>

&#x20;       <Text style={styles.title}>Gestione Utenti</Text>

&#x20;       <TouchableOpacity onPress={handleLogout}>

&#x20;         <Text style={styles.logoutText}>Esci</Text>

&#x20;       </TouchableOpacity>

&#x20;     </View>



&#x20;     <View

&#x20;       style={styles.tabsContainer}

&#x20;       key={`tabs-${pendingUsers.length}-${approvedUsers.length}`}

&#x20;     >

&#x20;       <TouchableOpacity

&#x20;         style={\[styles.tab, activeTab === 'pending' \&\& styles.tabActive]}

&#x20;         onPress={() => setActiveTab('pending')}

&#x20;       >

&#x20;         <Text

&#x20;           style={\[

&#x20;             styles.tabText,

&#x20;             activeTab === 'pending' \&\& styles.tabTextActive,

&#x20;           ]}

&#x20;         >

&#x20;           In Attesa {pendingUsers.length}

&#x20;         </Text>

&#x20;       </TouchableOpacity>

&#x20;       <TouchableOpacity

&#x20;         style={\[styles.tab, activeTab === 'users' \&\& styles.tabActive]}

&#x20;         onPress={() => setActiveTab('users')}

&#x20;       >

&#x20;         <Text

&#x20;           style={\[

&#x20;             styles.tabText,

&#x20;             activeTab === 'users' \&\& styles.tabTextActive,

&#x20;           ]}

&#x20;         >

&#x20;           Utenti Registrati {approvedUsers.length}

&#x20;         </Text>

&#x20;       </TouchableOpacity>

&#x20;     </View>



&#x20;     {activeTab === 'pending' \&\& (

&#x20;       <FlatList

&#x20;         data={pendingUsers}

&#x20;         keyExtractor={(item) => item.id}

&#x20;         renderItem={renderPendingUser}

&#x20;         contentContainerStyle={styles.listContent}

&#x20;         ListEmptyComponent={

&#x20;           <View style={styles.emptyContainer}>

&#x20;             <Text style={styles.emptyText}>📋</Text>

&#x20;             <Text style={styles.emptyMessage}>Nessuna richiesta</Text>

&#x20;           </View>

&#x20;         }

&#x20;       />

&#x20;     )}



&#x20;     {activeTab === 'users' \&\& (

&#x20;       <FlatList

&#x20;         data={approvedUsers}

&#x20;         keyExtractor={(item) => item.id}

&#x20;         renderItem={renderApprovedUser}

&#x20;         contentContainerStyle={styles.listContent}

&#x20;         ListEmptyComponent={

&#x20;           <View style={styles.emptyContainer}>

&#x20;             <Text style={styles.emptyText}>👥</Text>

&#x20;             <Text style={styles.emptyMessage}>Nessun utente</Text>

&#x20;           </View>

&#x20;         }

&#x20;       />

&#x20;     )}



&#x20;     {isWeb \&\& (

&#x20;       <Modal

&#x20;         visible={showRoleModal}

&#x20;         transparent={true}

&#x20;         animationType="fade"

&#x20;       >

&#x20;         <TouchableOpacity

&#x20;           style={styles.modalOverlay}

&#x20;           onPress={() => setShowRoleModal(false)}

&#x20;         >

&#x20;           <View style={styles.modalContent}>

&#x20;             <Text style={styles.modalTitle}>Scegli Ruolo Utente</Text>

&#x20;             <TouchableOpacity

&#x20;               style={\[styles.roleModalButton, { backgroundColor: '#66BB6A' }]}

&#x20;               onPress={() => approveWithRole(selectedUserId, 'operator')}

&#x20;             >

&#x20;               <Text style={styles.roleModalButtonText}>Operatore</Text>

&#x20;             </TouchableOpacity>

&#x20;             <TouchableOpacity

&#x20;               style={\[styles.roleModalButton, { backgroundColor: '#E53935' }]}

&#x20;               onPress={() => approveWithRole(selectedUserId, 'admin')}

&#x20;             >

&#x20;               <Text style={styles.roleModalButtonText}>Amministratore</Text>

&#x20;             </TouchableOpacity>

&#x20;             <TouchableOpacity

&#x20;               style={styles.modalCloseButton}

&#x20;               onPress={() => setShowRoleModal(false)}

&#x20;             >

&#x20;               <Text style={styles.modalCloseText}>Annulla</Text>

&#x20;             </TouchableOpacity>

&#x20;           </View>

&#x20;         </TouchableOpacity>

&#x20;       </Modal>

&#x20;     )}

&#x20;   </SafeAreaView>

&#x20; );

}



const styles = StyleSheet.create({

&#x20; container: {

&#x20;   flex: 1,

&#x20;   backgroundColor: '#f5f5f5',

&#x20; },

&#x20; header: {

&#x20;   backgroundColor: '#2D6BA8',

&#x20;   padding: 20,

&#x20;   flexDirection: 'row',

&#x20;   alignItems: 'center',

&#x20;   justifyContent: 'space-between',

&#x20; },

&#x20; backButton: {

&#x20;   color: '#fff',

&#x20;   fontSize: 16,

&#x20; },

&#x20; title: {

&#x20;   color: '#fff',

&#x20;   fontSize: 20,

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; logoutText: {

&#x20;   color: '#fff',

&#x20;   fontSize: 14,

&#x20; },

&#x20; tabsContainer: {

&#x20;   flexDirection: 'row',

&#x20;   backgroundColor: '#fff',

&#x20;   borderBottomWidth: 1,

&#x20;   borderBottomColor: '#ddd',

&#x20; },

&#x20; tab: {

&#x20;   flex: 1,

&#x20;   padding: 15,

&#x20;   alignItems: 'center',

&#x20;   borderBottomWidth: 2,

&#x20;   borderBottomColor: 'transparent',

&#x20; },

&#x20; tabActive: {

&#x20;   borderBottomColor: '#2D6BA8',

&#x20; },

&#x20; tabText: {

&#x20;   fontSize: 12,

&#x20;   color: '#999',

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; tabTextActive: {

&#x20;   color: '#2D6BA8',

&#x20; },

&#x20; listContent: {

&#x20;   padding: 15,

&#x20;   flexGrow: 1,

&#x20; },

&#x20; userCard: {

&#x20;   backgroundColor: '#fff',

&#x20;   padding: 15,

&#x20;   borderRadius: 10,

&#x20;   marginBottom: 15,

&#x20;   flexDirection: 'row',

&#x20;   justifyContent: 'space-between',

&#x20;   alignItems: 'center',

&#x20;   elevation: 3,

&#x20; },

&#x20; userInfo: {

&#x20;   flex: 1,

&#x20; },

&#x20; userName: {

&#x20;   fontSize: 18,

&#x20;   fontWeight: 'bold',

&#x20;   color: '#333',

&#x20;   marginBottom: 5,

&#x20; },

&#x20; userDetail: {

&#x20;   fontSize: 14,

&#x20;   color: '#666',

&#x20;   marginBottom: 5,

&#x20; },

&#x20; badge: {

&#x20;   alignSelf: 'flex-start',

&#x20;   paddingHorizontal: 10,

&#x20;   paddingVertical: 5,

&#x20;   borderRadius: 5,

&#x20;   marginTop: 5,

&#x20; },

&#x20; pendingBadge: {

&#x20;   backgroundColor: '#FFA726',

&#x20;   alignSelf: 'flex-start',

&#x20;   paddingHorizontal: 10,

&#x20;   paddingVertical: 5,

&#x20;   borderRadius: 5,

&#x20;   marginTop: 5,

&#x20; },

&#x20; adminBadge: {

&#x20;   backgroundColor: '#E53935',

&#x20; },

&#x20; operatorBadge: {

&#x20;   backgroundColor: '#66BB6A',

&#x20; },

&#x20; badgeText: {

&#x20;   color: '#fff',

&#x20;   fontSize: 12,

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; actions: {

&#x20;   flexDirection: 'row',

&#x20;   gap: 10,

&#x20; },

&#x20; approveButton: {

&#x20;   backgroundColor: '#4CAF50',

&#x20;   padding: 12,

&#x20;   borderRadius: 8,

&#x20;   width: 50,

&#x20;   alignItems: 'center',

&#x20; },

&#x20; rejectButton: {

&#x20;   backgroundColor: '#E53935',

&#x20;   padding: 12,

&#x20;   borderRadius: 8,

&#x20;   width: 50,

&#x20;   alignItems: 'center',

&#x20; },

&#x20; changeRoleButton: {

&#x20;   backgroundColor: '#2196F3',

&#x20;   padding: 12,

&#x20;   borderRadius: 8,

&#x20;   width: 50,

&#x20;   alignItems: 'center',

&#x20; },

&#x20; deleteButton: {

&#x20;   backgroundColor: '#E53935',

&#x20;   padding: 12,

&#x20;   borderRadius: 8,

&#x20;   width: 50,

&#x20;   alignItems: 'center',

&#x20; },

&#x20; buttonText: {

&#x20;   color: '#fff',

&#x20;   fontSize: 14,

&#x20;   fontWeight: 'bold',

&#x20; },

&#x20; emptyContainer: {

&#x20;   alignItems: 'center',

&#x20;   marginTop: 50,

&#x20; },

&#x20; emptyText: {

&#x20;   fontSize: 60,

&#x20;   marginBottom: 10,

&#x20; },

&#x20; emptyMessage: {

&#x20;   fontSize: 16,

&#x20;   color: '#999',

&#x20; },

&#x20; modalOverlay: {

&#x20;   flex: 1,

&#x20;   backgroundColor: 'rgba(0, 0, 0, 0.5)',

&#x20;   justifyContent: 'center',

&#x20;   alignItems: 'center',

&#x20;   padding: 20,

&#x20; },

&#x20; modalContent: {

&#x20;   backgroundColor: '#fff',

&#x20;   borderRadius: 10,

&#x20;   padding: 20,

&#x20;   width: '100%',

&#x20;   maxWidth: 400,

&#x20; },

&#x20; modalTitle: {

&#x20;   fontSize: 18,

&#x20;   fontWeight: 'bold',

&#x20;   color: '#333',

&#x20;   marginBottom: 20,

&#x20;   textAlign: 'center',

&#x20; },

&#x20; roleModalButton: {

&#x20;   padding: 15,

&#x20;   borderRadius: 8,

&#x20;   marginBottom: 10,

&#x20; },

&#x20; roleModalButtonText: {

&#x20;   color: '#fff',

&#x20;   fontSize: 16,

&#x20;   fontWeight: 'bold',

&#x20;   textAlign: 'center',

&#x20; },

&#x20; modalCloseButton: {

&#x20;   backgroundColor: '#999',

&#x20;   padding: 15,

&#x20;   borderRadius: 8,

&#x20;   marginTop: 15,

&#x20; },

&#x20; modalCloseText: {

&#x20;   color: '#fff',

&#x20;   fontSize: 16,

&#x20;   fontWeight: 'bold',

&#x20;   textAlign: 'center',

&#x20; },

});







