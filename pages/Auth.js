import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import Form from '../components/Form';
import Header from '../components/Header';

export default class FormPage extends Component {
    /*
    TODO:
        Header and footer components
    */
    render() {
        return (
            <SafeAreaView>
                <Header/>
                <Form defaultAuth={this.props.defaultAuth}/>
            </SafeAreaView>
        )
    }
}