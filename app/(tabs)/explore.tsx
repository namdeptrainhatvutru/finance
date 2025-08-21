import ParallaxScrollView from '@/components/ParallaxScrollView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabTwoScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect( () => {
    const getDataUser = async () => {
      const name = await AsyncStorage.getItem('name');
      const email = await AsyncStorage.getItem('email');
      setName(String(name));
      setEmail(String(email));
    };
    getDataUser();
  }, []);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fdffffff', dark: '#212121ff' }}
      headerImage={
            <>
          <Image
            source={require('@/assets/images/profile.png')}
            style={styles.headerImage}
          />
          <View style={styles.loginButton} >
          {(!name && !email) ? (
            <>
              <TouchableOpacity onPress={() => router.push('../Login')} style={styles.loginButton2}>
                <Text>Đăng nhập</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('../Register')} style={styles.loginButton3}>
                <Text>Đăng ký</Text>
              </TouchableOpacity>
            </>
          ) : null}
          </View>
        </>
      }>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Profile</Text>
          
         
            
            <View style={styles.cardContainer}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'gray',padding:10,justifyContent:'space-between',height:50}}>
              <View style={{justifyContent:'center',alignItems:'flex-start'}}>
              <Text style={{color:'gray',fontSize:12}}>Name</Text>
              <Text style={styles.name}>{name}</Text>
              </View>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <Image source={require('@/assets/images/arrow.png')} style={{width: 10, height: 10, tintColor: 'gray'}} />
              </View>
              </View>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'gray',padding:10,justifyContent:'space-between',height:50}}>
              <View style={{justifyContent:'center',alignItems:'flex-start'}}>
              <Text style={{color:'gray',fontSize:12}}>Email</Text>
              <Text style={styles.name}>{email}</Text>
              </View>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <Image source={require('@/assets/images/arrow.png')} style={{width: 10, height: 10, tintColor: 'gray'}} />
              </View>
              </View>
            </View>
          </View>
    

        {name && email ? (
          <TouchableOpacity style={styles.logoutButton} onPress={async () => {
            await AsyncStorage.clear();
            setName('');
            setEmail('');
            router.replace('/(tabs)');
          }}>
            <Text style={{color: 'white',fontSize:15,fontWeight:'bold'}}>Đăng xuất</Text>
          </TouchableOpacity>
        ) : null}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding:5
  },
  cardContainer:{
    borderRadius: 8,
    padding: 8,
    paddingLeft: 20,
    width:'100%',
    height: 200,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton:{
    position: 'absolute',
    bottom: 10,
    right: 20,
    borderRadius: 5,
    zIndex: 2,
    flexDirection: 'row',
    gap: 15,
  },
  loginButton2:{
      backgroundColor: '#76b8ffff',
      padding: 10,
      width: 90,
      elevation: 6,
      alignItems: 'center',
  },
  loginButton3:{
      backgroundColor: '#FBFBFB', // mờ trong suốt
      padding: 10,
      width: 90,
      borderWidth: 1,
      borderColor: '#C1C1C1',
      shadowOpacity: 0.18,
      shadowRadius: 4,
      elevation: 6,
      alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#f01919ff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },

});
