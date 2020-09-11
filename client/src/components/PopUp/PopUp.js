import React from 'react';
import './PopUp.css';
import {Link} from "react-router-dom";

class Popup extends React.Component {
    render() {
        const responseInfo=this.props.text;
        const statusCode=Object.keys(responseInfo)[0];
        const response=responseInfo[statusCode];
        return (
            <div className='popup'>
                <div className='popup\_inner popup_center'>
                    <h1>{`Status code: ${statusCode}`}</h1>
                    <h1>{response}</h1>
                    <Link to='/'>
                        <button type="button" className="btn btn-primary" onClick={this.props.closePopup}>CLOSE
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default Popup;