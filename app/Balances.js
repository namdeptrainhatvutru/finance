import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Balances = ({ id }) => {
    const [balances, setBalances] = useState({});
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);


    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const userid = await AsyncStorage.getItem('user_id');
                setUserId(userid);
                    
                    
                const response = await fetch(`${API_URL}/transactions/group/${id}`);
                const result = await response.json();
           
                
                if (result.success) {
                    const temp = {};
                    result.data.forEach(tx => {
                        if (Array.isArray(tx.split)) {
                            tx.split.forEach(member => {
                                if (!temp[member.id]) temp[member.id] = { name: member.name, amount: 0 };
                                if (tx.types === 'income') {
                                    temp[member.id].amount += member.amount;
                                } else if (tx.types === 'expense') {
                                    temp[member.id].amount -= member.amount;
                                }
                            });
                        } else {
                            // Nếu split là null, hiện thông báo
                            tx.title = tx.title + ' (chưa lưu giao dịch)';
                        }
                    });
                    setBalances(temp);
                    
                    
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Đang tải...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Balances</Text>
            <View style={styles.list}>
                {Object.entries(balances).map(([id, info]) => (
                    <View key={id} style={styles.itemRow}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{info.name.charAt(0).toUpperCase()}</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.name}>{info.name}</Text>
                            <Text style={styles.me}>{userId === id ? 'me' : ''}</Text>
                        </View>
                        <Text style={[
                            styles.amount,
                            info.amount > 0 ? styles.positive : styles.negative
                        ]}>
                            {info.amount > 0 ? '+' : ''}{info.amount.toLocaleString()} đ
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default Balances;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#ffffffff',
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 12,
        marginLeft: 4,
    },
    list: {
        marginTop: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#878788ff',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#262626',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    info: {
        flex: 1,
    },
    name: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        minWidth: 90,
        textAlign: 'right',
    },
    positive: {
        color: '#4ade80', // xanh lá
    },
    negative: {
        color: '#f87171', // đỏ
    },
    me: {
        color: '#d4d4d4',
        fontSize: 12,
    },
});