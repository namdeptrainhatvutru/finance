import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const EMOJIS = [
  // 😀 Cảm xúc vui vẻ
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', 
  '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', 
  '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳',

  // 🌴 Du lịch
  '✈️', '🏖️', '🏝️', '🏔️', '🗺️', '🧳', '🚆', '🚗', '🚌', 
  '🚢', '🏕️', '🏨', '🏙️', '🌄', '🏞️',

  // 💸 Tiền bạc / chi tiêu
  '💰', '💸', '🪙', '💳', '💵', '💴', '💶', '💷', 
  '🏦', '📈', '📉', '💼', '🛍️',

  // 🧾 Khoản chi / thu / hoá đơn
  '🧾', '📄', '🗒️', '📅', '📝', '🧮', '✍️', '📦', '📬'
];


const index = () => {
  const router = useRouter();
  const [title,setTitle] = useState('')
  const [icon,setIcon] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [currency,setCurrency] = useState('')
  const [user_id,setUser_id] = useState('')
  const [data,setData] = useState([])
  const [dataUser,setDataUser] = useState([])
  const [searchUser, setSearchUser] = useState('');
  const [usersSelected, setUsersSelected] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const fetchGroups = async () => {
    try{
          const user_id = await AsyncStorage.getItem('user_id');
          setUser_id(String(user_id));
          const response = await fetch(`${API_URL}/groups/user/${user_id}`);
          const data = await response.json();
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          setData(data.data);
          
    }catch (error) {
      console.error('Error fetching groups:', error);
    }
  }
  const fetchUser = async () => {
    try{
      
      const response = await fetch(`${API_URL}/users/all`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setDataUser(data.data);
      
      
    } catch (error) {
      console.error('Error fetching user:', error);
  }
}
  React.useEffect(() => {
    fetchGroups();
    fetchUser();
  }, []);
  const handleCreateGroup = async () => {
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        console.error('User ID not found in AsyncStorage');
        return;
      }

      const response = await fetch(`${API_URL}/groups/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          icon,
          currency,
          user_id
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Thêm tất cả users đã chọn vào group mới
      if (usersSelected.length > 0) {
        for (const selectedUser of usersSelected) {
          await handleAddMember(result.data.id, selectedUser.id);
        }
      }

      // Reset form
      setTitle('');
      setIcon('');
      setCurrency('');
      setUsersSelected([]);
      fetchGroups();

    } catch (error) {
      console.log('Error creating group:', error);
    }
  };
  const handleAddMember = async (groupId, userId) => {
    try {
          const response = await fetch(`${API_URL}/groups/add-member`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              group_id: groupId,
              user_id: userId
            }),
          })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }   
    }catch (error) {
      console.error('Error adding member:', error);
    }
  };
  const handleDeleteGroup = async (groupId) => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        // Refresh the group list after deletion
        fetchGroups();
      }
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  // Component menu overlay
  const ContextMenu = ({ visible, position, onClose, onArchive, onDelete }) => {
    if (!visible) return null;

    return (
      <View style={StyleSheet.absoluteFill}>
        <TouchableOpacity 
          style={[StyleSheet.absoluteFill, { zIndex: 99 }]}
          onPress={onClose}
          activeOpacity={1}
        >
          <View style={[styles.menuContainer, {
            top: position.y,
            left: position.x,
            zIndex: 99
          }]}>
            <TouchableOpacity style={styles.menuItem} onPress={onArchive}>
              <Text style={styles.menuText}>Lưu trữ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={onDelete}>
              <Text style={[styles.menuText, styles.deleteText]}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedGroup?.id === item.id && menuVisible;
    
    return (
      <TouchableOpacity 
        style={[styles.groupItem, isSelected && styles.selectedGroupItem]}
        onLongPress={(event) => {
          const { pageX, pageY } = event.nativeEvent;
          setSelectedGroup(item);
          setMenuPosition({ x: pageX, y: pageY });
          setMenuVisible(true);
        }}
        onPress={() => router.push({
          pathname: '/Group',
          params: {
            id: item.id,
            title: item.title,
            icon: item.icon,
            currency: item.currency,
            members: JSON.stringify(item.Members)
          }
        })}
      >
        <View style={styles.groupItemContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',gap: 30 }}>
            <View>
              <Text style={{fontSize:50}}>{item.icon}</Text>
            </View>
            <View>
              <Text style={{fontSize:40,fontStyle:'italic'}}>{item.title}</Text>
            </View>
            
            
          </View>
        </View>
      </TouchableOpacity>
    );
  }


  return (
    <View style={styles.container}>
      <TextInput 
        placeholder='title' 
        value={title} 
        onChangeText={setTitle}
        style={styles.input}
      />
      <View style={styles.iconContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => {setShowEmoji(true)
          }}
        >
          <Text style={{fontSize: 24}}>{icon || '😀'}</Text>
        </TouchableOpacity>
        <TextInput 
          placeholder='currency' 
          value={currency} 
          onChangeText={setCurrency}
          style={[styles.input, {flex: 1}]}
        />
      </View>


      <View style={styles.searchContainer}>
        <TextInput 
          placeholder='Tìm kiếm user' 
          value={searchUser} 
          onChangeText={setSearchUser}
          style={styles.input} 
        />
        {searchUser.length > 0 && (
          <View style={styles.dropdownContainer}>
            <ScrollView style={styles.dropdownList}>
              {dataUser
                .filter(user => {
                  // Kiểm tra user có match với search text không
                  const matchesSearch = user.name.toLowerCase().includes(searchUser.toLowerCase());
                  
                  // Kiểm tra user có trong group hiện tại không
                  const isNotInCurrentGroup = !data.find(group => group.id === user_id)?.Members
                    .some(member => member.User.id === user.id);
                  
                  return matchesSearch && isNotInCurrentGroup;
                })
                .map((user) => (
                  <TouchableOpacity 
                    key={user.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      if (!usersSelected.find(u => u.id === user.id)) {
                        setUsersSelected([...usersSelected, user]);
                      }
                      setSearchUser('');
                    }}
                  >
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}
      
      </View>

      {usersSelected.length > 0 && (
        <View style={styles.selectedUsersContainer}>
          <Text style={styles.sectionTitle}>Thành viên đã chọn:</Text>
          <View style={styles.selectedUsersList}>
            {usersSelected.map((user) => (
              <View key={user.id} style={styles.selectedUserItem}>
                <Text style={styles.selectedUserName}>{user.name}</Text>
                <TouchableOpacity 
                  onPress={() => {
                    setUsersSelected(usersSelected.filter(u => u.id !== user.id));
                  }}
                >
                  <Text style={styles.removeButton}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
      
      <Button title='tạo group' onPress={handleCreateGroup} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 20 }}
      />

      <ContextMenu
        visible={menuVisible}
        position={menuPosition}
        onClose={() => setMenuVisible(false)}
        onArchive={() => {
          // Xử lý lưu trữ
          setMenuVisible(false);
        }}
        onDelete={() => {
          if (selectedGroup) {
            handleDeleteGroup(selectedGroup.id);
          }
          setMenuVisible(false);
        }}
      />

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
  )
}

export default index

const styles = StyleSheet.create({
  searchContainer: {
    position: 'relative',
    zIndex: 1,
    marginBottom: 10,
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 200,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownList: {
    width: '100%',
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
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#ffffff',
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
    gap: 10, // Thêm khoảng cách giữa icon và input
  },
  selectedEmoji: {
    fontSize: 24,
    color: '#666',
    marginRight: 10,
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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
    width: '12.5%', // 8 columns
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
  selectedUsersContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedUsersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  removeButton: {
    fontSize: 16,
    color: '#666',
  },
  groupItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
  groupItem: {
    padding: 10,
    
    backgroundColor: '#e8e8e8',
    position: 'relative',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedGroupItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
    zIndex: 99,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
})