import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ToastAndroid, TouchableOpacity } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { IDisciplineAbsences } from '../../models/absences';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    centre: {
        alignContent: 'center'
    },
    table: {
        padding: 'auto'
    }
});

const AbsencesRow = ({ record }: { record: IDisciplineAbsences}) => {
    const globalStyles = useGlobalStyles();

    return (
        <DataTable.Row>
            <DataTable.Cell numeric>
                <Text style={globalStyles.textColor}>{record.number}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
                <Text style={globalStyles.textColor}>{record.time}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
                <Text style={globalStyles.textColor}>{record.subject}</Text>
            </DataTable.Cell>
        </DataTable.Row>
    );
};

export default AbsencesRow;