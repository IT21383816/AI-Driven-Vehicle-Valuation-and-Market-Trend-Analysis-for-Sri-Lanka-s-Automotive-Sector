import React from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';
import LocalIP from "./LocalIP";
import { Grid } from '@mui/material';

const initialState = {
    id: "",
    title: "",
    description: "",
    video: "",
    feedback: "",
    feedbackError: "",
    days: "",
    daysError: "",
    note: "",
    noteError: "",
    total: "",
    Video: [],
    s_Videos: [],
}

class VideoDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const url = "http://localhost:3500/Video/" + this.props.match.params.id;
        axios.get(url)
            .then(response => {
                this.setState({ description: response['data'][0]['description'], video: response['data'][0]['video'], title: response['data'][0]['title'], id: response['data'][0]['id'] })
                console.log(response['data'][0])
            })
            
        const url1 = "http://localhost:3500/Video/user_video_cat/"+localStorage.getItem("id")
        axios.get(url1)
        .then((response) => {
            console.log(response['data'])
            this.setState({s_Videos:response['data']})
        })
    }

    handleChange = async (e) => {
        const isCheckbox = e.target.type === "checkbox";
        this.setState({
            [e.target.name]: isCheckbox
                ? e.target.checked
                : e.target.value
        });
        var total = (this.state.price * 1) * (e.target.value * 1)
        await this.setState({
            total: total
        })
    }

    onClear() {
        this.setState(initialState);
    }

    validation = async () => {

        let feedbackError = "";

        if (!this.state.feedback) {
            feedbackError = "Feedback Required!"
        }

        if (feedbackError) {

            await this.setState({ feedbackError });

            return false;

        } else {

            await this.setState({ feedbackError });
            return true;

        }

    }

    SubmitForm = async (e) => {
        e.preventDefault();
        if (await this.validation()) {
            console.log(this.state);
            const url = "http://" + LocalIP + ":2222/feedback";
            const data = JSON.stringify({ text: this.state.feedback });
            console.log(data);
            await axios
                .post(url, data, {
                    headers: { "Content-Type": "application/json" },
                })
                .then(async (res1) => {
                    console.log(res1.data);
                    const url1 = 'http://localhost:3500/feedback/';
                    const data1 = JSON.stringify({result:res1.data.res_text, video_id: this.props.match.params.id, user_id: localStorage.getItem('id') });
                    console.log(data1);
                    await axios.post(url1, data1, {
                        headers: { 'Content-Type': 'application/json' }
                    })
                        .then(res => {
                            console.log(res.data);
                            this.setState(initialState)
                            this.componentDidMount()
                            swal("Prediction & Submit Success!", ""+res1.data.res_text, "success")
                        })
                });
        }
    }

    render() {
        return (
            <div class="container">
                <br /><br />
                <div class="justify-content-center">
                    <h2>Video</h2>
                    <hr />
                    <div class="card">
                        <video id="videoPlayer" src={"http://localhost:3500/" + this.state.video} controls width="1080" />
                        <div class="card-body">
                            <h5 class="card-title">{this.state.title}</h5>
                            <p class="card-text">{'Description : ' + this.state.description}</p>
                            <br />
                        </div>
                    </div>
                    <hr />
                    <h1>Feedbacks</h1>
                    <br />
                    <form autoComplete="off" onSubmit={this.SubmitForm}>
                        <div class="form-group row">
                            <label class="col-md-4 col-form-label text-md-right font-weight-bold">Feedback</label>
                            <div class="col-md-6">
                                <textarea type="text" class="form-control" name="feedback" value={this.state.feedback} onChange={this.handleChange} />
                                <div style={{ color: "red" }}>{this.state.feedbackError}</div>
                            </div>
                        </div>
                        <br />
                        <div class="col-md-4 offset-md-4">
                            <input type="submit" class="btn btn-outline-primary" value="Submit" />
                            <input type="button" class="btn btn-outline-danger" value="Clear" onClick={() => this.onClear()} />
                        </div>
                        <br /><br />
                    </form>
                    <br /><br />
                    <h2>Suggested Video</h2>
                    <hr/>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {
                        this.state.s_Videos.map((res) =>
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

export default VideoDetail;
