import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    uncoveredAbsenceColor: {
        color: 'red'
    },
    coveredAbsenceColor: {
        color: 'green'
    },
    navigation: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center', 
        width: '100%',
        justifyContent: 'center', 
        columnGap: 20, 
        marginBottom: 20
    },
    touchable: {
        width: 'auto',
        flexDirection: 'row',
        overflow: 'hidden'
    },
    rootView: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: -20 // so that the icon and text feel more in the centre (mind games)
    }
});

export default styles;