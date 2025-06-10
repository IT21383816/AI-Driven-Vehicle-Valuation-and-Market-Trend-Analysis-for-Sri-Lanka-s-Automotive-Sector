import React from 'react';
import '../App.css';
import swal from 'sweetalert';
import axios from 'axios';

const initialState = {
    id: "",
    title: "",
    titleError: "",
    description: "",
    descriptionError: "",
    video: "",
    videoError: "",
    selectedFile: ""
}

class Video extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    handleChange = e => {
        const isCheckbox = e.target.type === "checkbox";
        this.setState({
            [e.target.name]: isCheckbox
                ? e.target.checked
                : e.target.value
        });
    }

    onClear(){
        this.setState(initialState);
    }

    onChangeHandler=event=>{
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        }, () => {
            const data = new FormData() 
            data.append('file', this.state.selectedFile)
            axios.post("http://localhost:3500/Video/upload", data, { 
            }).then(res => { 
                this.setState({video:res.data.filename})
            })
        })
    }

    validation = async() => {

        let titleError = "";
        let descriptionError = "";
        let videoError = "";

        if(!this.state.title){
            titleError="Title Required!"
        }

        if(!this.state.description){
            descriptionError="Description Required!"
        }

        if(!this.state.video){
            videoError="Video Required!"
        }

        if( titleError || descriptionError || videoError ){
            
            await this.setState({ titleError , descriptionError , videoError });
            
            return false;

        }else{

            await this.setState({ titleError , descriptionError , videoError });
            return true;
            
        }

    }

    SubmitForm = async(e) => {
        e.preventDefault();
        if(await this.validation()){
          console.log(this.state);
          const url = 'http://localhost:3500/Video/';
          const data = JSON.stringify({ video: this.state.video , title: this.state.title , description: this.state.description });
          console.log(data);
          await axios.post(url,data,{
              headers: {'Content-Type': 'application/json'}
          })
          .then(res => {
              console.log(res.data)
              if(res.data.err){
                swal("Title Error!", "Unsuccessful!", "error")
              }else{
                this.setState(initialState)
                swal("Success!", "Add Successful!", "success")
              }
          })
        }
    }

    render (){
        return (
            <div class="container">
            <div className="col-lg-12">
            <br/><br/>
            <div class="justify-content-center">
                    <h1>Video</h1>
                    <div class="x_scroll">
                    <hr/>
                        <form autoComplete="off" onSubmit={this.SubmitForm}>
                        <div class="form-group row">
                        <label  class="col-md-4 col-form-label text-md-right">Title</label>
                            <div class="col-md-6">
                                <input formControlName="title" type="text" name="title" class="form-control" value={this.state.title} onChange={this.handleChange} required/>
                                <div style={{color : "red"}}>{this.state.titleError}</div>
                            </div>
                        </div>
                        <br/>
                        <div class="form-group row">
                            <label  class="col-md-4 col-form-label text-md-right">Description</label>
                            <div class="col-md-6">
                                <input formControlName="description" type="text" name="description" class="form-control"  value={this.state.description} onChange={this.handleChange} required/>
                                <div style={{color : "red"}}>{this.state.descriptionError}</div>
                            </div>
                        </div>
                        <br/>
                        <div class="form-group row">
                            <label class="col-md-4 col-form-label text-md-right font-weight-bold">Video</label>
                            <div class="col-md-6">
                                <input type="file" class="form-control" name="file"  onChange={this.onChangeHandler} />
                                {
                                    (this.state.video!=="")?(<video id="videoPlayer" src={"http://localhost:3500/" + this.state.video} controls width="720" height="480"/>):(<div></div>)
                                }
                                <div style={{color : "red"}}>{this.state.videoError}</div>
                            </div>
                        </div>
                        <br/>
                        <div class="form-group row">
                            <div class="col-md-4"></div>
                            <div class="col-md-6">
                                <button type="submit" class="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </div>
                        <br/><br/>   
                    </form>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

export default Video;
