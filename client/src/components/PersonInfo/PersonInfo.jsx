import React from 'react';
import "./PersonInfo.css"
// import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

class PersonInfo extends React.Component {

    render() {
        let personAuthorizationInfo = this.props.personAuthorizationInfo

        return (
            <div>
                <div className=" button_padding">
                    <Link to='/'>
                        <button onClick={this.props.logOutFromSession} className="btn btn-primary button_padding">Log
                            out
                        </button>
                    </Link>
                </div>
                <div className="container information">
                    <h2>User card</h2>
                    <div className="card img-fluid" style={{width: 500 + 'px'}}>
                        <img
                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRbC_3Hm-zGXegiR41X9VTaG0V0EzePlq2vJQ&usqp=CAU'
                            alt="Card imag" style={{width: 100 + '%'}}/>
                        <div className="card-img-overlay ">
                            <h4 className="card-title"> {`Person name : ${personAuthorizationInfo.name}`}</h4>
                            <p className="card-text">
                                {`Login : ${personAuthorizationInfo.login}`}
                            </p>
                            <p className="card-text">
                                {`Id : ${personAuthorizationInfo.sessionId}`}
                            </p>
                            <p className="card-text">
                                {` Email : ${personAuthorizationInfo.email}`}
                            </p>
                            <button onClick={this.props.getPersonInformation} className="btn btn-primary">See Profile
                            </button>
                            {personAuthorizationInfo.profileInfo ?
                                <div className="margin_text">
                                    <p className="card-text">
                                        {`Person Information : ${personAuthorizationInfo.profileInfo}`}
                                    </p>
                                </div> : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}


export default PersonInfo;
