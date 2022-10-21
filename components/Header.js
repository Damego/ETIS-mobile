import React from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';

export default function Header() {
  return (
    <SafeAreaView style={styles.main}>
        <Text style={styles.text}>ЕТИС</Text>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    main: {
        paddingTop: 45,
        height: 90,
        backgroundColor: '#C62E3E'
    },
    text: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
