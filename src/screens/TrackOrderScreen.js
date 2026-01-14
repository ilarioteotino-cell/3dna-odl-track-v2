import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabase';
import { getCurrentUser } from '../services/auth';
import { getDepartments, moveOrder, moveOrderBackward } from '../services/orders';

const isWeb = Platform.OS === 'web';

// Helper functions per alert cross-platform
const alertErrore = (title, message = '') => {
  if (isWeb) {
    alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

const alertSuccesso = (title, message = '') => {
  if (isWeb) {
    alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function TrackOrderScreen({ navigation }) {
  // Selezione tipo tracciamento
  const [itemType, setItemType] = useState('ODL'); // ODL, JOB, STACCATO
  const [itemCode, setItemCode] = useState('');

  // Selezione reparti
  const [departments, setDepartments] = useState([]);
  const [fromDepartment, setFromDepartment] = useState(null);
  const [toDepartment, setToDepartment] = useState(null);

  // Tipo operazione
  const [operation, setOperation] = useState('AVANZAMENTO'); // AVANZAMENTO o RETROCESSIONE

  // Dati aggiuntivi
  const [scarti, setScarti] = useState('');
  const [note, setNote] = useState('');

  // Utente e stato
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ============ INIT ============

  useEffect(() => {
    loadUser();
    loadDepartments();
  }, []);

  const loadUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      console.log('✅ Utente caricato:', user?.username);
    } catch (error) {
      console.error('Errore caricamento utente:', error);
      alertErrore('Errore', 'Impossibile caricare l\'utente');
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data || []);
      console.log('✅ Reparti caricati:', data?.length);
    } catch (error) {
      console.error('Errore caricamento reparti:', error);
      alertErrore('Errore', 'Impossibile caricare i reparti');
    }
  };

  // ============ VALIDAZIONE ============

  const validateItemCode = (type, code) => {
    const upperCode = code.toUpperCase();
    
    switch (type) {
      case 'JOB':
        if (upperCode.length === 0 || upperCode.length > 10) {
          alertErrore('Errore', 'Il numero JOB deve essere massimo 10 caratteri');
          return false;
        }
        break;
      case 'STACCATO':
        if (upperCode.length === 0 || upperCode.length > 10) {
          alertErrore('Errore', 'Il numero STACCATO deve essere massimo 10 caratteri');
          return false;
        }
        break;
      case 'ODL':
        if (upperCode.length === 0 || upperCode.length > 11) {
          alertErrore('Errore', 'Il numero ODL deve essere massimo 11 caratteri');
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  // ============ REGISTRA MOVIMENTO ============

  const handleTrackOrder = async () => {
    // Validazioni
    if (!itemCode.trim()) {
      alertErrore('Errore', `Inserisci un numero ${itemType}`);
      return;
    }

    if (!validateItemCode(itemType, itemCode)) {
      return;
    }

    if (!fromDepartment) {
      alertErrore('Errore', 'Seleziona il reparto di partenza');
      return;
    }

    if (!toDepartment) {
      alertErrore('Errore', 'Seleziona il reparto di destinazione');
      return;
    }

    if (fromDepartment.id === toDepartment.id) {
      alertErrore('Errore', 'I reparti di partenza e destinazione devono essere diversi');
      return;
    }

    if (!currentUser) {
      alertErrore('Errore', 'Utente non autenticato');
      return;
    }

    setLoading(true);

    try {
      const upperCode = itemCode.toUpperCase();
      console.log(`🔍 Cercando ${itemType}: ${upperCode}`);

      // PASSO 1: Cerca se l'ordine esiste per numero
      let orderId = null;
      let order = null;

      if (itemType === 'ODL') {
        // Cerca per order_number
        const { data, error } = await supabase
          .from('orders')
          .select('id, current_department_id')
          .eq('order_number', upperCode)
          .single();

        if (data) {
          orderId = data.id;
          order = data;
          console.log('✅ ODL trovato:', orderId);
        } else {
          console.log('⚠️ ODL non trovato, lo creerò');
        }
      } else if (itemType === 'JOB') {
        // Cerca per job_number
        const { data, error } = await supabase
          .from('orders')
          .select('id, current_department_id')
          .eq('job_number', upperCode)
          .single();

        if (data) {
          orderId = data.id;
          order = data;
          console.log('✅ JOB trovato:', orderId);
        } else {
          console.log('⚠️ JOB non trovato, lo creerò');
        }
      } else if (itemType === 'STACCATO') {
        // Cerca per staccato_number
        const { data, error } = await supabase
          .from('orders')
          .select('id, current_department_id')
          .eq('staccato_number', upperCode)
          .single();

        if (data) {
          orderId = data.id;
          order = data;
          console.log('✅ STACCATO trovato:', orderId);
        } else {
          console.log('⚠️ STACCATO non trovato, lo creerò');
        }
      }

      // PASSO 2: Se l'ordine non esiste, crealo
      if (!orderId) {
        console.log('📦 Creazione nuovo ordine...');
        
        const newOrderData = {
          order_number: itemType === 'ODL' ? upperCode : null,
          job_number: itemType === 'JOB' ? upperCode : null,
          staccato_number: itemType === 'STACCATO' ? upperCode : null,
          starting_department_id: fromDepartment.id,
          current_department_id: fromDepartment.id,
          created_by: currentUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log('📝 Dati da inserire:', newOrderData);

        const { data: createdOrder, error: createError } = await supabase
          .from('orders')
          .insert([newOrderData])
          .select();

        if (createError) {
          console.error('❌ Errore creazione ordine:', createError);
          throw createError;
        }

        if (!createdOrder || createdOrder.length === 0) {
          console.error('❌ Nessun record creato!');
          throw new Error('Errore: nessun record creato nella tabella orders');
        }

        orderId = createdOrder[0].id;
        order = createdOrder[0];
        console.log('✅ Ordine creato con ID:', orderId);
        console.log('✅ Dati inseriti:', createdOrder[0]);
      }

      // PASSO 3: Sposta l'ordine tra reparti
      if (orderId) {
        const currentDeptId = order.current_department_id;

        console.log(`🚀 Spostando ordine ${orderId} da reparto ${currentDeptId} a ${toDepartment.id}`);

        // Prepara i dati dell'ordine da passare a moveOrder
        const orderData = {
          order_number: itemType === 'ODL' ? upperCode : null,
          job_number: itemType === 'JOB' ? upperCode : null,
          staccato_number: itemType === 'STACCATO' ? upperCode : null,
          scarti: scarti ? parseInt(scarti) : 0,
          note: note.trim() || null,
        };

        console.log('📝 Dati ordine da salvare:', orderData);

        if (operation === 'AVANZAMENTO') {
          await moveOrder(
            orderId,
            currentDeptId,
            toDepartment.id,
            currentUser.id,
            orderData
          );
        } else {
          await moveOrderBackward(
            orderId,
            currentDeptId,
            toDepartment.id,
            currentUser.id,
            note,
            orderData
          );
        }

        console.log('✅ Movimento registrato con successo');

        alertSuccesso(
          'Successo!',
          `${itemType} ${upperCode}\n${operation.toLowerCase()} da ${fromDepartment.name} a ${toDepartment.name}`
        );

        // Reset form
        setItemCode('');
        setFromDepartment(null);
        setToDepartment(null);
        setScarti('');
        setNote('');
      }

    } catch (error) {
      console.error('❌ Errore completo:', error);
      alertErrore('Errore', error.message || 'Impossibile registrare il movimento');
    } finally {
      setLoading(false);
    }
  };

  // ============ MAIN FORM ============

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Traccia Ordine</Text>

        {/* Selezione Tipo */}
        <Text style={styles.label}>Tipo di tracciamento</Text>
        <View style={styles.typeSelector}>
          {['JOB', 'ODL', 'STACCATO'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeButton, itemType === type && styles.typeButtonActive]}
              onPress={() => {
                setItemType(type);
                setItemCode('');
              }}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  itemType === type && styles.typeButtonTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Codice */}
        <Text style={styles.label}>Numero {itemType}</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={itemCode}
            onChangeText={(text) => setItemCode(text.toUpperCase())}
            placeholder={`Inserisci numero ${itemType}`}
            placeholderTextColor="#999"
            autoCapitalize="characters"
            maxLength={itemType === 'ODL' ? 11 : 10}
          />
        </View>

        {itemType === 'JOB' && <Text style={styles.hint}>Massimo 10 caratteri maiuscoli</Text>}
        {itemType === 'STACCATO' && <Text style={styles.hint}>Massimo 10 caratteri maiuscoli</Text>}
        {itemType === 'ODL' && <Text style={styles.hint}>Massimo 11 caratteri maiuscoli</Text>}

        {/* Selezione Operazione */}
        <Text style={styles.label}>Tipo operazione</Text>
        <View style={styles.operationSelector}>
          <TouchableOpacity
            style={[
              styles.operationButton,
              operation === 'AVANZAMENTO' && styles.operationButtonActive,
            ]}
            onPress={() => setOperation('AVANZAMENTO')}
          >
            <Text
              style={[
                styles.operationButtonText,
                operation === 'AVANZAMENTO' && styles.operationButtonTextActive,
              ]}
            >
              AVANZAMENTO
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.operationButton,
              operation === 'RETROCESSIONE' && styles.operationButtonActive,
            ]}
            onPress={() => setOperation('RETROCESSIONE')}
          >
            <Text
              style={[
                styles.operationButtonText,
                operation === 'RETROCESSIONE' && styles.operationButtonTextActive,
              ]}
            >
              RETROCESSIONE
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reparto di Partenza - PICKER */}
        <Text style={styles.label}>Reparto di partenza</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={fromDepartment?.id || null}
            onValueChange={(itemValue) => {
              const selected = departments.find(d => d.id === itemValue);
              setFromDepartment(selected || null);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Seleziona reparto di partenza" value={null} />
            {departments.map((dept) => (
              <Picker.Item key={dept.id} label={dept.name} value={dept.id} />
            ))}
          </Picker>
        </View>

        {/* Reparto di Destinazione - PICKER */}
        <Text style={styles.label}>Reparto di destinazione</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={toDepartment?.id || null}
            onValueChange={(itemValue) => {
              const selected = departments.find(d => d.id === itemValue);
              setToDepartment(selected || null);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Seleziona reparto di destinazione" value={null} />
            {departments.map((dept) => (
              <Picker.Item key={dept.id} label={dept.name} value={dept.id} />
            ))}
          </Picker>
        </View>

        {/* Scarti (opzionale) */}
        <Text style={styles.label}>Scarti (opzionale)</Text>
        <TextInput
          style={styles.input}
          value={scarti}
          onChangeText={setScarti}
          placeholder="Numero scarti"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        {/* Note (opzionale) */}
        <Text style={styles.label}>Note (opzionale)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={note}
          onChangeText={setNote}
          placeholder="Aggiungi note..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />

        {/* Pulsante Registra Movimento */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleTrackOrder}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.submitButtonText}>Registrazione...</Text>
            </>
          ) : (
            <Text style={styles.submitButtonText}>Registra Movimento</Text>
          )}
        </TouchableOpacity>

        {/* Riepilogo */}
        {itemCode && fromDepartment && toDepartment && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Riepilogo</Text>
            <Text style={styles.summaryText}>Tipo: {itemType}</Text>
            <Text style={styles.summaryText}>Numero: {itemCode}</Text>
            <Text style={styles.summaryText}>Operazione: {operation}</Text>
            <Text style={styles.summaryText}>Da: {fromDepartment.name}</Text>
            <Text style={styles.summaryText}>A: {toDepartment.name}</Text>
            {scarti && <Text style={styles.summaryText}>Scarti: {scarti}</Text>}
            {note && <Text style={styles.summaryText}>Note: {note}</Text>}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  operationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  operationButton: {
    flex: 1,
    padding: 15,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  operationButtonActive: {
    backgroundColor: '#FF9500',
    borderColor: '#FF9500',
  },
  operationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  operationButtonTextActive: {
    color: '#fff',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summary: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

