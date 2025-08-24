import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const TransactionDetail = () => {
  const params = useLocalSearchParams()
  const {item} = params
  console.log(item.id);
  
  
  return (
    <View>
      <Text>TransactionDetail</Text>
    </View>
  )
}

export default TransactionDetail

const styles = StyleSheet.create({})