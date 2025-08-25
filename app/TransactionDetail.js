import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const TransactionDetail = () => {
  const params = useLocalSearchParams();
  const item = JSON.parse(params.item);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Số tiền:</Text>
        <Text style={styles.value}>{Number(item.amount).toLocaleString()} đ</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Người chi tiêu:</Text>
        <Text style={styles.value}>{item.creator?.name}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Ngày:</Text>
        <Text style={styles.value}>{item.date}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Loại:</Text>
        <Text style={styles.value}>{item.types}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>ID giao dịch:</Text>
        <Text style={styles.value}>{item.id}</Text>
      </View>
    </View>
  );
};

export default TransactionDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#888',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
});