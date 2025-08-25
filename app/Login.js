import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
            const result = await response.json();
      if (result.status === 'OK') {
        const { name, email, id } = result.data;
        const { access_token, refresh_token } = result;
        await AsyncStorage.multiSet([
          ['name', name],
          ['email', email],
          ['access_token', access_token],
          ['refresh_token', refresh_token],
          ['user_id', String(id)]
        ]);

        router.replace('(tabs)');
      } else {
        Alert.alert('Đăng nhập thất bại!', result.message || 'Sai thông tin');
      }
    } catch (err) {
      Alert.alert('Lỗi kết nối!', err.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>



      <View style={{ backgroundColor: 'lightblue', width: '100%', height: 250 }}>
        <Image source={require('@/assets/images/go.png')} style={{ width: '100%', height: '100%' }} />
      </View>
      <View style={styles.Round}>
        <Text style={styles.title}>Login</Text>
      </View>
      <View style={{
        backgroundColor: 'white', width: '110%', height: 100,

        transform: [{ skewY: '-10deg' }],
        marginTop: -45,
      }}>
      </View>
      <View style={styles.loginform}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>{loading ? 'Đang đăng nhập...' : 'LOGIN'}</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <Text>
            Chưa có tài khoản?{' '}
            <Text style={styles.registerText} onPress={() => router.replace('/Register')}>
              Đăng ký
            </Text>
          </Text>
        </View>
    </View>
    </View>
  );
}


export default Login;

const styles = StyleSheet.create({
  registerText: {
    color: '#2196f3',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,


    backgroundColor: '#fff',
    loginButton: {
      width: '100%',
      maxWidth: 320,
      height: 44,
      backgroundColor: '#2196f3',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 1,
    },
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    width: '100%',
    marginBottom: 0,
  },
  input: {
    width: '100%',
    maxWidth: 320,
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  Round: {
    alignItems: 'center',
    zIndex: 99,
    borderRadius: 100,
    backgroundColor: '#3fb8f9ff',
    width: 120,
    height: 120,
    justifyContent: 'center',
    position: 'absolute',
    top: 150,
    left: '50%',
    transform: [{ translateX: -60 }]
  },
  loginform: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
  width: '100%',
  maxWidth: 320,
  height: 44,
  backgroundColor: '#2196f3',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 8,
  marginBottom: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 2,
},
loginButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  letterSpacing: 1,
},
});