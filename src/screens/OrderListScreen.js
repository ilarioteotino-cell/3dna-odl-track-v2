import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRecentHistory } from '../services/orders';

export default function OrderListScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);
    try {
      const data = await getRecentHistory(50);
      setHistory(data || []);
    } catch (err) {
      console.error('Errore caricamento storico:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

  function renderHistory({ item }) {
    const isAdvancement = item.operationtype === 'AVANZAMENTO' || item.operationtype === 'avanzamento';
    const movementColor = isAdvancement ? '#2D6BA8' : '#E53935';

    const orderData = Array.isArray(item.order) ? item.order[0] : item.order;

    const odl = orderData?.ordernumber || item.ordernumber || null;
    const job = orderData?.jobnumber || item.jobnumber || null;
    const staccato = orderData?.staccatonumber || item.staccatonumber || null;

    let codeLabel = 'Codice';
    let codeValue = 'N/A';

    if (job) {
      codeLabel = 'JOB';
      codeValue = job;
    } else if (odl) {
      codeLabel = 'ODL';
      codeValue = odl;
    } else if (staccato) {
      codeLabel = 'STACCATO';
      codeValue = staccato;
    }

    const fromDept =
      item.fromdepartmentname || item.fromdept?.name || 'N/A';

    const toDept =
      item.todepartmentname || item.todept?.name || 'N/A';

    const operatorName =
      item.movedbyname || item.user?.fullname || item.user?.username || 'Sconosciuto';

    const movedDate = item.movedat
      ? new Date(item.movedat).toLocaleString('it-IT')
      : 'Data non disponibile';

    return (
      <View style={styles.historyCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.codeLabel}>
            {codeLabel}
          </Text>

          <Text style={styles.codeValue}>
            {codeValue}
          </Text>

          <Text style={[styles.historyMovement, { color: movementColor }]}>
            {fromDept} → {toDept}
          </Text>

          <Text style={styles.historyDetail}>
            Operatore: {operatorName}
          </Text>

          {item.note ? (
            <Text style={styles.historyNote}>Nota: {item.note}</Text>
          ) : null}

          <Text style={styles.historyDate}>
            {movedDate}
          </Text>
        </View>

        <View style={[styles.typeBadge, { backgroundColor: movementColor }]}>
          <Text style={styles.typeText}>
            {isAdvancement ? 'Avanzamento' : 'Retrocessione'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Indietro</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Storico Movimentazioni</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={history}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderHistory}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadHistory} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyMessage}>
              Nessuna operazione registrata
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Creato da Ilario Teotino
        </Text>
      </View>
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
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
    flexGrow: 1,
  },
  historyCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  codeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  codeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  historyMovement: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  historyDetail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  historyNote: {
    fontSize: 13,
    color: '#FF9800',
    fontStyle: 'italic',
    marginTop: 5,
    marginBottom: 5,
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginVertical: 8,
    marginLeft: 10,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#999',
  },
  footer: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  footerText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#999',
  },
});