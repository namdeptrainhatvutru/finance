import { API_URL } from '@env';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import Transaction from './Transaction';

const ExpensesRoute = ({ id, title, icon, currency, members }) => (
  <View style={styles.tabContent}>
    <Transaction id={id} title={title} icon={icon} currency={currency} members={members} />
  </View>
);

const BalancesRoute = () => (
  <View style={styles.tabContent}>
    <Text style={styles.comingSoon}>Tính năng đang phát triển</Text>
  </View>
);

const PhotosRoute = () => (
  <View style={styles.tabContent}>
    <Text style={styles.comingSoon}>Tính năng đang phát triển</Text>
  </View>
);

const MembersRoute = ({ members, groupId }) => {
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

const Group = () => {
    const params = useLocalSearchParams();
    const { id, title, icon, currency } = params;
    const [members, setMembers] = useState([]);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'expenses', title: 'Chi tiêu' },
      { key: 'balances', title: 'Số dư' },
      { key: 'photos', title: 'Ảnh' },
      { key: 'members', title: 'Thành viên' },
    ]);

    useEffect(() => {
      fetchMembers();
    }, []);

    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_URL}/groups/${id}/members`);
        const result = await response.json();
        if (result.success) {
          setMembers(result.data);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    
    
  const renderMember = ({ item }) => (
    <View style={styles.memberItem}>
      <Text style={styles.memberName}>{item.User.name}</Text>
      <Text style={styles.memberEmail}>{item.User.email}</Text>
    </View>
  );

    const renderScene = ({ route }) => {
      switch (route.key) {
        case 'expenses':
          return <ExpensesRoute id={id} title={title} icon={icon} currency={currency} members={members} />;
        case 'balances':
          return <BalancesRoute />;
        case 'photos':
          return <PhotosRoute />;
        case 'members':
          return <MembersRoute members={members} groupId={id} onMemberRemoved={fetchMembers} />;
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
 
    
    // console.log('Members data:', members); 

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.icon}>{icon}</Text>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.currency}>{currency}</Text>
            </View>
          </View>
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={renderTabBar}
          style={styles.tabView}
        />
      </View>
    )
}

export default Group

const styles = StyleSheet.create({
  addUserBtn: {
    color: '#007bff',
    fontWeight: 'bold',
    marginTop: 4,
  },
  selectedUsersContainer: {
    marginBottom: 15,
  },
  selectedUsersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  selectedUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedUserName: {
    fontSize: 14,
    marginRight: 6,
  },
  addMemberButton: {
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  removeButton: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
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
  dropdownContainer: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 200,
    marginBottom: 10,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
  },
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    tabView: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
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
    },
    tabContent: {
        flex: 1,
        padding: 16,
    },
    comingSoon: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
        fontSize: 14,
    },
    noData: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
        fontSize: 14,
    },
    header: {
        backgroundColor: 'white',
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        alignItems: 'center',
        paddingTop: 64,
    },
    headerContent: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 32,
        marginRight: 12,
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 6,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
        textAlign: 'center',
    },
    currency: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    membersContainer: {
        paddingTop: 8,
      flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    membersList: {
        flex: 1,
    },
    memberItem: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 6,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    memberInfo: {
        flex: 1,
    },
    deleteButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ff4444',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    memberName: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    memberEmail: {
        fontSize: 12,
        color: '#666',
    }
})