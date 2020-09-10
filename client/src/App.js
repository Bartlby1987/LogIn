import React from 'react';
import './App.css';

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    async sendPostIPARequest(personInfo, url) {
        return (await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify(personInfo))
        })).json();
    };


    render() {

        return (<div>
                afew;slfw
            </div>
        )
    }
}


export default App;
