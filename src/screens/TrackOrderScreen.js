import React, { useEffect, useRef, useState } from 'react';
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
  SafeAreaView,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabase';
import { getCurrentUser } from '../services/auth';
import { getDepartments } from '../services/orders';

const isWeb = Platform.OS === 'web';

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

function WebScanner({ visible, onClose, onScan }) {
  const scannerRef = useRef(null);
  const containerId = 'qr-reader-track-order';

  useEffect(() => {
    if (!isWeb || !visible) return;

    let mounted = true;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!mounted) return;

        const cameras = await Html5Qrcode.getCameras();
        if (!mounted) return;

        if (!cameras || cameras.length === 0) {
          alertErrore('Errore', 'Nessuna fotocamera trovata.');
          onClose?.();
          return;
        }

        const backCamera =
          cameras.find((camera) => {
            const label = (camera.label || '').toLowerCase();
            return (
              label.includes('back') ||
              label.includes('rear') ||
              label.includes('environment') ||
              label.includes('posteriore')
            );
          }) || cameras[0];

        scannerRef.current = new Html5Qrcode(containerId);

        await scannerRef.current.start(
          backCamera.id,
          {
            fps: 10,
            qrbox: { width: 240, height: 240 },
            aspectRatio: 1,
          },
          async (decodedText) => {
            try {
              if (scannerRef.current) {
                await scannerRef.current.stop();
                await scannerRef.current.clear();
                scannerRef.current = null;
              }
            } catch (err) {
              console.error('Errore chiusura scanner:', err);
            }

            onScan?.(decodedText);
          },
          () => {
            // ignora gli errori di decoding continui
          }
        );
      } catch (error) {
        console.error('Errore avvio scanner:', error);
        alertErrore(
          'Errore fotocamera',
          'Impossibile avviare la fotocamera. Verifica HTTPS e permessi del browser.'
        );
        onClose?.();
      }
    };

    const timeout = setTimeout(() => {
      startScanner();
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(timeout);

      const stopScanner = async () => {
        try {
          if (scannerRef.current) {
            await scannerRef.current.stop();
            await scannerRef.current.clear();
            scannerRef.current = null;
          }
        } catch (error) {
          console.error('Errore cleanup scanner:', error);
        }
      };

      stopScanner();
    };
  }, [visible, onClose, onScan]);

  if (!isWeb || !visible) return null;

  return (
    <View style={styles.scannerWrapper}>
      <div
        id={containerId}
        style={{
          width: '100%',
          maxWidth: '100%',
          minHeight: '360px',
          backgroundColor: '#000',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      />
      <Text style={styles.scannerHint}>
        Inquadra il QR code dentro il riquadro
      </Text>
    </View>
  );
}

export default function TrackOrderScreen({ navigation }) {
  const [itemType, setItemType] = useState('ODL');
  const [itemCode, setItemCode] = useState('');
  const [departments, setDepartments] = useState([]);
  const [fromDepartment, setFromDepartment] = useState(null);
  const [toDepartment, setToDepartment] = useState(null);
  const [operation, setOperation] = useState('AVANZAMENTO');
  const [scarti, setScarti] = useState('');
  const [note, setNote] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

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
      alertErrore('Errore', "Impossibile caricare l'utente");
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data || []);
      console.log('✅ Reparti caricati:', data?.length || 0);
    } catch (error) {
      console.error('Errore caricamento reparti:', error);
      alertErrore('Errore', 'Impossibile caricare i reparti');
    }
  };

  const handleOpenScanner = () => {
    if (!isWeb) {
      alertErrore('Non disponibile', 'Lo scanner QR è attivo solo su web.');
      return;
    }
    setIsScanning(true);
  };

  const handleCloseScanner = () => {
    setIsScanning(false);
  };

  const handleBarcodeScanned = (decodedText) => {
    setIsScanning(false);

    if (decodedText) {
      const cleaned = decodedText.trim().toUpperCase();
      setItemCode(cleaned);
      console.log('✅ Codice scansionato:', cleaned);
      alertSuccesso('QR rilevato', `Codice acquisito: ${cleaned}`);
    }
  };

  const validateItemCode = (type, code) => {
    const upperCode = code.toUpperCase().trim();

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

  const findExistingOrder = async (upperCode) => {
    if (itemType === 'ODL') {
      const { data, error } = await supabase
        .from('orders')
        .select('id, current_department_id')
        .eq('order_number', upperCode)
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    if (itemType === 'JOB') {
      const { data, error } = await supabase
        .from('orders')
        .select('id, current_department_id')
        .eq('job_number', upperCode)
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    if (itemType === 'STACCATO') {
      const { data, error } = await supabase
        .from('orders')
        .select('id, current_department_id')
        .eq('staccato_number', upperCode)
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    return null;
  };

  const handleTrackOrder = async () => {
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
      const upperCode = itemCode.trim().toUpperCase();
      console.log(`🔍 Cercando ${itemType}:`, upperCode);

      let order = await findExistingOrder(upperCode);
      let orderId = order?.id || null;

      if (!orderId) {
        console.log('📦 Ordine non trovato, creazione in corso...');

        const newOrderData = {
          order_number: itemType === 'ODL' ? upperCode : null,
          job_number: itemType === 'JOB' ? upperCode : null,
          staccato_number: itemType === 'STACCATO' ? upperCode : null,
          starting_department_id: fromDepartment.id,
          current_department_id: fromDepartment.id,
          created_by: currentUser.id,
          scarti: 0,
          note: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: createdOrder, error: createError } = await supabase
          .from('orders')
          .insert([newOrderData])
          .select()
          .single();

        if (createError) {
          console.error('❌ Errore creazione ordine:', createError);
          throw createError;
        }

        order = createdOrder;
        orderId = createdOrder.id;
        console.log('✅ Ordine creato:', orderId);
      } else {
        console.log('✅ Ordine trovato:', orderId);
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          current_department_id: toDepartment.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('❌ Errore aggiornamento ordine:', updateError);
        throw updateError;
      }

      const historyPayload = {
        order_id: orderId,
        order_number: itemType === 'ODL' ? upperCode : order?.order_number || null,
        job_number: itemType === 'JOB' ? upperCode : order?.job_number || null,
        staccato_number: itemType === 'STACCATO' ? upperCode : order?.staccato_number || null,
        from_department_id: fromDepartment.id,
        to_department_id: toDepartment.id,
        moved_by_user_id: currentUser.id,
        moved_by_name: currentUser?.full_name || currentUser?.username || 'Sconosciuto',
        from_department_name: fromDepartment.name,
        to_department_name: toDepartment.name,
        operation_type: operation.toLowerCase(),
        scarti: scarti ? parseInt(scarti, 10) || 0 : 0,
        note: note.trim() || null,
        moved_at: new Date().toISOString(),
      };

      const { error: historyError } = await supabase
        .from('order_history')
        .insert(historyPayload);

      if (historyError) {
        console.error('❌ Errore salvataggio storico:', historyError);
        throw historyError;
      }

      console.log('✅ Movimento registrato con successo');

      alertSuccesso(
        'Successo!',
        `${itemType} ${upperCode}\n${operation} da ${fromDepartment.name} a ${toDepartment.name}`
      );

      setItemCode('');
      setFromDepartment(null);
      setToDepartment(null);
      setScarti('');
      setNote('');
    } catch (error) {
      console.error('❌ Errore completo:', error);
      alertErrore('Errore', error?.message || 'Impossibile registrare il movimento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Indietro</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Traccia Ordine</Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
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

          <Text style={styles.label}>Numero {itemType}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputFlex}
              value={itemCode}
              onChangeText={(text) => setItemCode(text.toUpperCase())}
              placeholder={`Inserisci numero ${itemType}`}
              placeholderTextColor="#999"
              autoCapitalize="characters"
              maxLength={itemType === 'ODL' ? 11 : 10}
            />
            {isWeb && (
              <TouchableOpacity style={styles.scanButton} onPress={handleOpenScanner}>
                <Text style={styles.scanButtonText}>QR</Text>
              </TouchableOpacity>
            )}
          </View>

          {itemType === 'JOB' && (
            <Text style={styles.hint}>Massimo 10 caratteri maiuscoli</Text>
          )}
          {itemType === 'STACCATO' && (
            <Text style={styles.hint}>Massimo 10 caratteri maiuscoli</Text>
          )}
          {itemType === 'ODL' && (
            <Text style={styles.hint}>Massimo 11 caratteri maiuscoli</Text>
          )}

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
                operation === 'RETROCESSIONE' && styles.operationButtonRetroActive,
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

          <Text style={styles.label}>Reparto di partenza</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fromDepartment?.id || null}
              onValueChange={(itemValue) => {
                const selected = departments.find((d) => d.id === itemValue);
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

          <Text style={styles.label}>Reparto di destinazione</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={toDepartment?.id || null}
              onValueChange={(itemValue) => {
                const selected = departments.find((d) => d.id === itemValue);
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

          <Text style={styles.label}>Scarti (opzionale)</Text>
          <TextInput
            style={styles.input}
            value={scarti}
            onChangeText={setScarti}
            placeholder="Numero scarti"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />

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

          {itemCode && fromDepartment && toDepartment && (
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Riepilogo</Text>
              <Text style={styles.summaryText}>Tipo: {itemType}</Text>
              <Text style={styles.summaryText}>Numero: {itemCode}</Text>
              <Text style={styles.summaryText}>Operazione: {operation}</Text>
              <Text style={styles.summaryText}>Da: {fromDepartment.name}</Text>
              <Text style={styles.summaryText}>A: {toDepartment.name}</Text>
              {scarti ? <Text style={styles.summaryText}>Scarti: {scarti}</Text> : null}
              {note ? <Text style={styles.summaryText}>Note: {note}</Text> : null}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={isScanning} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.scannerModalSafe}>
          <View style={styles.scannerModalContent}>
            <Text style={styles.scannerTitle}>Scanner QR</Text>

            <WebScanner
              visible={isScanning}
              onClose={handleCloseScanner}
              onScan={handleBarcodeScanned}
            />

            <TouchableOpacity style={styles.closeScannerBtn} onPress={handleCloseScanner}>
              <Text style={styles.closeScannerText}>Chiudi scanner</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2D6BA8',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    width: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
    gap: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  inputFlex: {
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
  scanButton: {
    width: 56,
    height: 50,
    backgroundColor: '#2D6BA8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: '#2D6BA8',
    borderColor: '#2D6BA8',
  },
  operationButtonRetroActive: {
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
  scannerModalSafe: {
    flex: 1,
    backgroundColor: '#111',
  },
  scannerModalContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  scannerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  scannerWrapper: {
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    padding: 12,
  },
  scannerHint: {
    color: '#ddd',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
  closeScannerBtn: {
    backgroundColor: '#E53935',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  closeScannerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});