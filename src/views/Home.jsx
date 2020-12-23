import React, { Fragment } from 'react';
// import Background from './Background';
import ArrivalHomeContainer from 'components/ArrivalHome/ArrivalHomeContainer';
import './Home.less';

class HomePage extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <Fragment>
                {/*<Background />*/}
                <ArrivalHomeContainer />
            </Fragment>
        )
    }
};

export default HomePage;