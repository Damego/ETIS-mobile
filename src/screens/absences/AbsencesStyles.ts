import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    centre: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    table: {
        padding: 'auto'
    },
    dropdownView: {
        width: 'auto',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    leftMargin: {
        marginLeft: 'auto'
    },
    rootView: {
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: -20 // so that the icon and text feel more in the centre (mind games)
    }
});

export default styles;