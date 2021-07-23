import React, {Fragment} from 'react';
import LoginPage from './LoginPage'
import './LoginClient.scss'

function LoginClient(props){
    return(
        <Fragment>
            <LoginPage pageType="client"></LoginPage>
        </Fragment>
    )
}

export default LoginClient;