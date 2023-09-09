import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    hbox: {
        flexDirection: 'row'
    },
    centre: {
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center', 
        width: '100%',
        justifyContent: 'center', 
    },
    flexWrap: {
        flexWrap: 'wrap'
    },
    dropdownView: {
        width: 'auto',
        columnGap: 0,
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