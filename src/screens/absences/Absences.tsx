import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ToastAndroid, TouchableOpacity } from 'react-native';

import Card from '../../components/Card';
import { getOrderHTML } from '../../data/orders';
import { useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';
import { IDisciplineAbsences } from '../../models/absences';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    }
});

const Absences = ({ record }: { record: IDisciplineAbsences}) => {
    const globalStyles = useGlobalStyles();

    return (
        <Card>
            <View style={styles.container}>
                <Text style={globalStyles.textColor}>{record.number}</Text>
                <Text style={globalStyles.textColor}>{record.time}</Text>
                <Text style={globalStyles.textColor}>{record.subject}</Text>
                <Text style={globalStyles.textColor}>{record.type}</Text>
                <Text style={globalStyles.textColor}>{record.teacher}</Text>
            </View>
        </Card>
    );
};

export default Absences;