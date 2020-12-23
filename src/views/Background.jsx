import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Background extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {bgClassVal} = this.props.bgData;
        // console.log(bgClassVal);
        return (
            <div className={`bg-img ${bgClassVal}`}></div>
        )
    }
};

const mapStateToProps = ( state ) => ({
    bgData: state.bgData
});

const mapDispatchToProps = {

};

const BackgroundContainer = connect(mapStateToProps, mapDispatchToProps)(Background);

export default withRouter( BackgroundContainer );