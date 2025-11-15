// components/CategoryCard.tsx
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';


type Props = {
title: string;
count: number;
onPress?: () => void;
};


export default function CategoryCard({ title, count, onPress }: Props) {
return (
<TouchableOpacity onPress={onPress} style={styles.card}>
<Text style={styles.title}>{title}</Text>
<Text style={styles.count}>{count} palavras</Text>
</TouchableOpacity>
);
}


const styles = StyleSheet.create({
card: { backgroundColor: '#07102a', padding: 14, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
title: { color: COLORS.text, fontSize: 16 },
count: { color: '#9fb4d9' }
});