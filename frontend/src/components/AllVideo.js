import React from 'react';
import '../App.css';
import swal from 'sweetalert';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialState = {
    id: "",
    search: "",
    Video: [],
}

class VideoAll extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const url = "http://localhost:3500/Video"
        axios.get(url)
        .then((response) => {
            console.log(response['data'])
            this.setState({Video:response['data']})
        })
    }

    getImage = async(url) =>{
        var image=""
        await axios.get("http://localhost:3500/"+url, {
            responseType: "text",
            responseEncoding: "base64",
          })
          .then(async(res) => {
            image = await Buffer.from(res.data, 'base64')
            console.log(image)
        })
        return image
    }
    
    onDelete(id){
        swal({
            title: "Are you sure?",
            text: "Delete this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                const url = 'http://localhost:3500/Video/';
                axios.delete(url+id)
                .then(res =>{
                    swal("Delete Successful!", {
                        icon: "success",
                    })
                    this.componentDidMount()
                });
            }
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
                    <h2>All Videos</h2>
                    <hr/>
                    <div class="x_scroll">
                        <div class="form-group row">
                            <label class="col-1 col-form-label text-md-left font-weight-bold">Search</label>
                            <div class="col-md-4">
                                <input type="text" class="form-control" name="search" value={this.state.search} onChange={this.handleChange} />
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div class="x_scroll">
                    <table class="table">
                    <thead>
                            <tr>
                                <th class="tableTh">ID</th>
                                <th class="tableTh">Title</th>
                                <th class="tableTh">Description</th>
                                <th class="tableTh">Image</th>
                                <th class="tableTh">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            Video.filter((data)=>{
                                if(this.state.search == null)
                                    return data
                                else if( data.id==this.state.search || data.title.toLowerCase().includes(this.state.search.toLowerCase()) ||data.description.toLowerCase().includes(this.state.search.toLowerCase())){
                                    return data
                                }
                            }).map((res) =>

                            <tr>
                                <td class="tableTh">{ res.id }</td>
                                <td class="tableTh">{ res.title }</td>
                                <td class="tableTh">{ res.description }</td>
                                <td class="tableTh"><video id="videoPlayer" src={"http://localhost:3500/" + res.video} controls width="100"/></td>
                                <td class="tableTh"><button type='button' onClick={() => this.onDelete(res.id)} class="btn btn-outline-danger">Delete</button></td>
                            </tr>
                        )
                        }
                        </tbody>
                      </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default VideoAll;
