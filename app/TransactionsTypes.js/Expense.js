import { API_URL } from '@env';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { EMOJIS } from './constants';

const Expense = ({ group_id, members, transactions, onTransactionCreated,currency }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [icon, setIcon] = useState('💰');
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const router = useRouter()

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedTransaction, setSelectedTransaction] = useState(null);




  // ...existing code...
  const handleDeleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/delete/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        onTransactionCreated(); // Refresh list
        alert('Xóa giao dịch thành công!');
      } else {
        alert(result.message || 'Xóa thất bại');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };
// ...existing code...


  const handleCreateTransaction = async () => {
    if (!selectedMember) {
      alert('Vui lòng chọn người chi tiêu');
      return;
    }

    try {
      // Đảm bảo date luôn là object Date
      let dateObj = date instanceof Date ? date : new Date(date);
      // Định dạng yyyy/mm/dd
      const formattedDate = `${dateObj.getFullYear()}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}`;
      console.log('date :', formattedDate);
      console.log('api',API_URL);
      
      const response = await fetch(`${API_URL}/transactions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          icon,
          amount,
          types: 'expense',
          group_id: group_id,
          by: selectedMember.id.toString(),
          date: `${formattedDate}`
        }),
      });
      
      
      const result = await response.json();
      
      if (result.success) {
        // Reset form
        setTitle('');
        setAmount('');
        setIcon('💰');
        setSelectedMember(null);
        setDate(new Date());
        // Refresh transaction list
        onTransactionCreated();
        alert('Thêm chi tiêu thành công!');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleDetail = async (item) => {
    // Navigate to detail screen
    router.push({
      pathname:'../TransactionDetail',
      params:{item : JSON.stringify(item), members: JSON.stringify(members)}

    });


  }

  const ContextMenu = ({ visible, position, onClose, onDelete }) => {
    if (!visible) return null;
    return (
      <View style={StyleSheet.absoluteFill}>
        <TouchableOpacity 
          style={[StyleSheet.absoluteFill, { zIndex: 99 }]}
          onPress={onClose}
          activeOpacity={1}
        >
          <View style={[
            styles.menuContainer,
            {
              top: position.y -300,
              left: position.x,
              position: 'absolute',
              zIndex: 100,
            }
          ]}>
            <TouchableOpacity style={styles.menuItem} onPress={onDelete}>
              <Text style={[styles.menuText, styles.deleteText]}>Xóa giao dịch</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
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
        <Text style={styles.label}>Chọn người chi tiêu:</Text>
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

      <TouchableOpacity
        style={[styles.input, { justifyContent: 'center', marginBottom: 10 }]}
        onPress={() => setOpenDatePicker(true)}
      >
        <Text>{date ? date.toLocaleDateString() : 'Chọn ngày'}</Text>
      </TouchableOpacity>

      <DatePicker
        modal
        open={openDatePicker}
        date={date}
        mode="date"
        onConfirm={(d) => {
          setOpenDatePicker(false);
          setDate(d);
        }}
        onCancel={() => setOpenDatePicker(false)}
      />

      <Button 
        title='Thêm chi tiêu' 
        onPress={handleCreateTransaction}
        disabled={!selectedMember} 
      />

      <View style={styles.transactionListContainer}>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => handleDetail(item)}
              onLongPress={(event) => {
                const { pageX, pageY } = event.nativeEvent;
                setSelectedTransaction(item);
                setMenuPosition({ x: pageX, y: pageY });
                setMenuVisible(true);
              }}
            >
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
            </TouchableOpacity>
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

      <ContextMenu
        visible={menuVisible}
        position={menuPosition}
        onClose={() => setMenuVisible(false)}
        onDelete={() => {
          if (selectedTransaction) {
            handleDeleteTransaction(selectedTransaction.id);
          }
          setMenuVisible(false);
        }}
      />
    </View>
  );
};

export default Expense;

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
   
  },
  memberName: {
    fontSize: 14,
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
  menuContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 140,
    zIndex: 100,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
  },
  deleteText: {
    color: '#ff4444',
  },
});