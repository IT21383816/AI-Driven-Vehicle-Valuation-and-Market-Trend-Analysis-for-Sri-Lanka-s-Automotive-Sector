import React from 'react';
import '../App.css';

class User extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="container">
                <div className="col-lg-12">
                    <br /><br />
                    <div class="justify-content-center">
                        <h1>Student</h1>
                        <div class="x_scroll">
                            <hr />
                            <div class="col-lg-12">
                                <a class="btn btn-outline-primary col-md-4" href="/video_list" >Video List</a>
                            </div>
                            <br />
                            <div class="col-lg-12">
                                <a class="btn btn-outline-primary col-md-4" onClick={() => {
                                    this.props.history.push({
                                        pathname: '/select_videos',
                                        state: { category: "Interested - Advanced" }
                                    });
                                }} >Interested - Advanced</a>
                            </div>
                            <br />
                            <div class="col-lg-12">
                                <a class="btn btn-outline-primary col-md-4" onClick={() => {
                                    this.props.history.push({
                                        pathname: '/select_videos',
                                        state: { category: "Interested - Basics" }
                                    });
                                }} >Interested - Basics</a>
                            </div>
                            <br />
                            <div class="col-lg-12">
                                <a class="btn btn-outline-primary col-md-4" onClick={() => {
                                    this.props.history.push({
                                        pathname: '/select_videos',
                                        state: { category: "Alternative Content - Similar Courses" }
                                    });
                                }} >Alternative Content - Similar Courses</a>
                            </div>
                            <br />
                            <div class="col-lg-12">
                                <a class="btn btn-outline-primary col-md-4" onClick={() => {
                                    this.props.history.push({
                                        pathname: '/select_videos',
                                        state: { category: "Neutral" }
                                    });
                                }} >Neutral</a>
                            </div>
                            <br />
                            <div class="col-lg-12">
                                <a class="btn btn-outline-primary col-md-4" onClick={() => {
                                    this.props.history.push({
                                        pathname: '/select_videos',
                                        state: { category: "Not Interested" }
                                    });
                                }} >Not Interested</a>
                            </div>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default User;
