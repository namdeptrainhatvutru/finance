
import { API_URL } from '@env';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });
      const result = await response.json();
      if (result.status === 'OK') {
        Alert.alert('Thành công!', 'Đăng ký thành công, vui lòng đăng nhập', [
          { text: 'OK', onPress: () => router.replace('/Login') }
        ]);
      } else {
        Alert.alert('Đăng ký thất bại!', result.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      Alert.alert('Lỗi kết nối!', err.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: 'lightblue', width: '100%', height: 250 }}>
        <Image source={require('@/assets/images/go2.png')} style={{ width: '100%', height: '100%' }} />
      </View>
      <View style={styles.Round}>
        <Text style={styles.title}>Register</Text>
      </View>
      <View style={{
        backgroundColor: 'white',
        width: '110%',
        height: 100,
        transform: [{ skewY: '-10deg' }],
        marginTop: -45,
      }}>
      </View>
      <View style={styles.registerForm}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
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
          style={[styles.registerButton, loading && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.registerButtonText}>
            {loading ? 'Đang đăng ký...' : 'REGISTER'}
          </Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <Text>
            Đã có tài khoản?{' '}
            <Text style={styles.loginText} onPress={() => router.replace('/Login')}>
              Đăng nhập
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginText: {
    color: '#2196f3',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    transform: [{ translateX: -60 }],

  },
  registerForm: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButton: {
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
    elevation: 12,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});