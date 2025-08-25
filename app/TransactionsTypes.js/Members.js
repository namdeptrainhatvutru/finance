import { useEffect, useState } from 'react';
import { API_URL } from '@env';
import { FlatList, Text, TextInput, View, StyleSheet } from 'react-native';


const MembersRoute = ({ members, groupId, onMemberAdded }) => {
  const [dataUser, setDataUser] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [usersSelected, setUsersSelected] = useState([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/all`);
      const data = await response.json();
      if (response.ok) {
        setDataUser(data.data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleAddMember = async () => {
    setAdding(true);
    try {
      for (const selectedUser of usersSelected) {
        const response = await fetch(`${API_URL}/groups/add-member`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            group_id: groupId,
            user_id: selectedUser.id
          }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      }
      setUsersSelected([]);
      setSearchUser('');
      fetchUser();
      if (onMemberAdded) onMemberAdded(); // gọi hàm cập nhật từ cha
    } catch (error) {
      console.error('Error adding member:', error);
    }
    setAdding(false);
  };

  const filteredUsers = searchUser.length > 0
    ? dataUser.filter(user => user.name.toLowerCase().includes(searchUser.toLowerCase()) && !members.some(m => m.User.id === user.id) && !usersSelected.some(u => u.id === user.id))
    : [];

  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Thành viên</Text>
      <TextInput
        placeholder='Tìm kiếm user theo tên'
        value={searchUser}
        onChangeText={setSearchUser}
        style={styles.input}
      />
      {searchUser.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={filteredUsers}
            renderItem={({ item }) => (
              <View style={styles.dropdownItem}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.addUserBtn} onPress={() => setUsersSelected([...usersSelected, item])}>Thêm</Text>
              </View>
            )}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      )}
      {usersSelected.length > 0 && (
        <View style={styles.selectedUsersContainer}>
          <Text style={styles.sectionTitle}>Thành viên đã chọn:</Text>
          <View style={styles.selectedUsersList}>
            {usersSelected.map((user) => (
              <View key={user.id} style={styles.selectedUserItem}>
                <Text style={styles.selectedUserName}>{user.name}</Text>
                <Text style={styles.removeButton} onPress={() => setUsersSelected(usersSelected.filter(u => u.id !== user.id))}>✕</Text>
              </View>
            ))}
          </View>
          <Text style={styles.addMemberButton} onPress={handleAddMember} disabled={adding}>Thêm thành viên</Text>
        </View>
      )}
      <FlatList
        data={members}
        renderItem={({ item }) => (
          <View style={styles.memberItem}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{item.User.name}</Text>
              <Text style={styles.memberEmail}>{item.User.email}</Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    padding: 18,
    backgroundColor: '#f5f6fa',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 16,
    marginLeft: 4,
    color: '#22223b',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c9c9c9',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#22223b',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    padding: 10,
    shadowColor: '#22223b',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userName: {
    flex: 1,
    fontWeight: '600',
    fontSize: 16,
    color: '#22223b',
  },
  userEmail: {
    flex: 1,
    color: '#6c757d',
    fontSize: 13,
  },
  addUserBtn: {
    color: '#3a86ff',
    fontWeight: 'bold',
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectedUsersContainer: {
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#22223b',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedUsersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  selectedUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bde0fe',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  selectedUserName: {
    fontWeight: '500',
    marginRight: 6,
    color: '#22223b',
    fontSize: 15,
  },
  removeButton: {
    color: '#ef233c',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 2,
    paddingHorizontal: 4,
  },
  addMemberButton: {
    color: '#06d6a0',
    fontWeight: 'bold',
    marginTop: 6,
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#e9f5f2',
    borderRadius: 8,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 6,
    paddingHorizontal: 8,
    shadowColor: '#22223b',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#22223b',
  },
  memberEmail: {
    color: '#6c757d',
    fontSize: 13,
  },
});

export default MembersRoute;