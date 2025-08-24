import { API_URL } from '@env';
import { useState } from 'react';
import { Button, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { EMOJIS } from './constants';

const Income = ({ group_id, members, transactions, onTransactionCreated,currency }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [icon, setIcon] = useState('💰');
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleCreateTransaction = async () => {
    if (!selectedMember) {
      alert('Vui lòng chọn người nhận');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/transactions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          icon,
          amount,
          types: 'income',
          group_id: group_id,
          by: selectedMember.id.toString()
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Reset form
        setTitle('');
        setAmount('');
        setIcon('💰');
        setSelectedMember(null);
        alert('Thêm thu nhập thành công!');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder='Tiêu đề' 
        value={title} 
        onChangeText={setTitle}
        style={styles.input}
      />
      
      <View style={styles.iconContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => setShowEmoji(true)}
        >
          <Text style={{fontSize: 24}}>{icon}</Text>
        </TouchableOpacity>
        <TextInput 
          placeholder='Số tiền' 
          value={amount} 
          onChangeText={setAmount}
          keyboardType="numeric"
          style={[styles.input, {flex: 1}]}
        />
      </View>

      <View style={styles.memberDropdown}>
        <Text style={styles.label}>Chọn người nhận:</Text>
        <ScrollView style={styles.memberList}>
          {members?.map((member) => (
            <TouchableOpacity
              key={member.User.id}
              style={[
                styles.memberItem,
                selectedMember?.id === member.User.id && styles.selectedMemberItem
              ]}
              onPress={() => setSelectedMember(member.User)}
            >
              <Text style={styles.memberName}>{member.User.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Button 
        title='Thêm thu nhập' 
        onPress={handleCreateTransaction}
        disabled={!selectedMember} 
      />

      <View style={styles.transactionListContainer}>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text style={styles.transactionIcon}>{item.icon}</Text>
              <View style={styles.transactionCenter}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionBy}>{item.creator?.name}</Text>
              </View>
              <Text style={styles.transactionAmount}>
                {Number(item.amount).toLocaleString()}{currency}
              </Text>
            </View>
          )}
        />
      </View>

      <Modal
        visible={showEmoji}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn Icon</Text>
              <TouchableOpacity onPress={() => setShowEmoji(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.emojiList}>
              <View style={styles.emojiGrid}>
                {EMOJIS.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.emojiButton}
                    onPress={() => {
                      setIcon(emoji);
                      setShowEmoji(false);
                    }}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Income;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  iconButton: {
    width: 50,
    height: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
    color: '#666',
  },
  emojiList: {
    flex: 1,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  emojiButton: {
    width: '12.5%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
  transactionListContainer: {
    flex: 1,
    marginTop: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  transactionCenter: {
    flex: 1,
    marginRight: 15,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionBy: {
    fontSize: 13,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  memberDropdown: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  memberList: {
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  memberItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  selectedMemberItem: {
    backgroundColor: '#f0f0f0',
  },
  memberName: {
    fontSize: 14,
  }
});