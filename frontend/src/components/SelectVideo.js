import React from 'react';
import '../App.css';
import swal from 'sweetalert';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Grid } from '@mui/material';

class SelectVideo extends React.Component {

    constructor(props) {
        super(props);

        console.log(props.location.state)
        var cat=""
        if(props.location.state){
            cat=props.location.state.category
        }

        this.state = {
            id: "",
            search: "",
            Video: [],
            category: cat
        }
        const url = "http://localhost:3500/Video/video_cat/"+this.state.category
        axios.get(url)
        .then((response) => {
            console.log(response['data'])
            this.setState({Video:response['data']})
        })
    }

    handleChange = e => {
        const isCheckbox = e.target.type === "checkbox";
        this.setState({
            [e.target.name]: isCheckbox
                ? e.target.checked
                : e.target.value
        });
    }
   
    render (){
        const { Video } = this.state;
        return (
            <div class="container">
            <br/><br/>
            <div class="justify-content-center">
                    <h2>Selected Videos</h2>
                    <hr/>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {
                        Video.map((res) =>
                        <Grid item xs={2} sm={4} md={4} >
                            <div class="card">
                            <video id="videoPlayer" src={"http://localhost:3500/" + res.video} controls width="360" height="240"/>
                                <div class="card-body">
                                    <h5 class="card-title">{ res.title }</h5>
                                    <a href={"video_detail/" + res.id } class="btn btn-primary">Select</a>
                                </div>
                            </div>
                        </Grid>)
                    }
                    </Grid>
                </div>
            </div>
        );
    }
}

export default SelectVideo;
