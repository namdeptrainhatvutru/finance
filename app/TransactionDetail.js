import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { API_URL } from '@env';
const TransactionDetail = () => {
  const params = useLocalSearchParams();
  const item = JSON.parse(params.item);
  let members = JSON.parse(params.members);
  
  

  const [checkedMembers, setCheckedMembers] = useState([]);
  const [editingAmount, setEditingAmount] = useState({}); // { id: amount }
  
  
  const handleToggleCheck = (id, name) => {
    setCheckedMembers((prev) => {
      const exists = prev.find(m => m.id === id);
      if (exists) {
        const filtered = prev.filter(m => m.id !== id);
        // Xóa editingAmount nếu bỏ chọn
        const newEditing = { ...editingAmount };
        delete newEditing[id];
        setEditingAmount(newEditing);
        return filtered;
      } else {
        return [...prev, { id, name, amount: 0 }];
      }
    });
  };

  // Khi checkedMembers thay đổi, reset editingAmount
  useEffect(() => {
    setEditingAmount({});
  }, [checkedMembers.length]);

  // Tính lại số tiền chia đều cho các thành viên chưa nhập tay
  useEffect(() => {
    if (checkedMembers.length === 0) return;
    const total = item.amount;
    const manualIds = Object.keys(editingAmount).map(id => Number(id));
    const manualSum = Object.values(editingAmount).reduce((a, b) => a + Number(b), 0);
    const autoMembers = checkedMembers.filter(m => !manualIds.includes(m.id));
    const autoAmount = autoMembers.length > 0 ? Math.floor((total - manualSum) / autoMembers.length) : 0;

    setCheckedMembers(prev =>
      prev.map(m => ({
        ...m,
        amount: manualIds.includes(m.id) ? Number(editingAmount[m.id]) : autoAmount
      }))
    );
  }, [editingAmount, checkedMembers.length, item.amount]);

  const handleAmountChange = (id, value) => {
    let num = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setEditingAmount(prev => ({ ...prev, [id]: num }));
  };

  const handleSplit = async () => {
    try {
          const response = await fetch(`${API_URL}/transactions/update/${item.id}`,{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              split: checkedMembers
            }),
          })
          if(response.ok){
            alert('Cập nhật giao dịch thành công');
          }
          
          
    }
    catch (error) {
      console.error('Error splitting transaction:', error);
    
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${item.id}`);
      const result = await response.json();
      if (result.success) {
        let split = result.data.split;
        // Nếu chưa có split thì chia đều cho tất cả thành viên
        if (!split || split.length === 0) {
          const total = result.data.amount;
          const memberCount = members.length;
          const evenAmount = memberCount > 0 ? Math.floor(total / memberCount) : 0;
          split = members.map(m => ({
            id: m.User.id,
            name: m.User.name,
            amount: evenAmount
          }));
        }
        setCheckedMembers(split);
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

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

      <View>
        <Text style={[styles.label, {marginTop: 20, marginBottom: 10}]}>Thành viên trong nhóm:</Text>
        <View style={{borderWidth: 0.5, borderColor: '#eee', borderRadius: 8, padding: 10}}>
          {Array.isArray(members) && members.map((member) => {
            const isChecked = checkedMembers.some(m => m.id === member.User.id);
            const checkedMember = checkedMembers.find(m => m.id === member.User.id);
            return (
              <TouchableOpacity
                key={member.User.id}
                style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 5}}
                onPress={() => handleToggleCheck(member.User.id, member.User.name)}
                activeOpacity={0.7}
              >
                <View style={{marginRight: 10}}>
                  <View style={{
                    width: 20,
                    height: 20,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 4,
                    backgroundColor: isChecked ? '#4caf50' : '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {isChecked && (
                      <Text style={{color: '#fff', fontWeight: 'bold'}}>✓</Text>
                    )}
                  </View>
                </View>
                <Text style={{flex: 1}}>{member.User.name}</Text>
                {isChecked ? (
                  <TextInput
                    style={{
                      marginLeft: 10,
                      color: '#4caf50',
                      fontWeight: 'bold',
                      borderBottomWidth: 1,
                      borderColor: '#4caf50',
                      minWidth: 60,
                      textAlign: 'right'
                    }}
                    keyboardType="numeric"
                    value={checkedMember?.amount?.toString() || ''}
                    onChangeText={val => handleAmountChange(member.User.id, val)}
                  />
                ) : (
                  <Text style={{marginLeft: 10, color: '#888', fontWeight: 'bold'}}>0đ</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        <Button title='save' onPress={()=>{handleSplit()}}/>
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
  },})