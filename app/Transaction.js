import { API_URL } from '@env';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import Expense from './TransactionsTypes.js/Expense';
import Income from './TransactionsTypes.js/Income';

const Transaction = ({ id, members,currency }) => {
  
  
  
  const [index, setIndex] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [routes] = useState([
    { key: 'expense', title: 'Chi tiêu' },
    { key: 'income', title: 'Thu nhập' },
  ]);

  const fetchTransactions = async () => {
    try {
      
      
      const response = await fetch(`${API_URL}/transactions/group/${id}`);
      const result = await response.json();
      if (result.success) {
        setTransactions(result.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'expense':
        return (
          <Expense
            group_id={id}
            members={members}
            transactions={transactions.filter(t => t.types === 'expense')}
            onTransactionCreated={fetchTransactions}
            currency={currency}
          />
        );
      case 'income':
        return (
          <Income
            group_id={id}
            members={members}
            transactions={transactions.filter(t => t.types === 'income')}
            onTransactionCreated={fetchTransactions}
            currency={currency}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor="#000"
      inactiveColor="#666"
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={renderTabBar}
    />
  );
}

export default Transaction;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabIndicator: {
    backgroundColor: '#000',
    height: 2,
  },
  tabLabel: {
    fontSize: 13,
    textTransform: 'none',
    fontWeight: '500',
  }
});
